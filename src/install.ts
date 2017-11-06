import * as path from 'path'
import * as fs from 'fs'
import * as mkdirp from "mkdirp"
import {configDir} from "./config"
import executeTemplate from "./exec"
import Template from "./Template"

type Args = {
    filePaths: string[]
    force?: boolean
    ignore?: boolean
}

export default function installTemplates(args: Args) {
    const fileMappings = args.filePaths
        .map(fp => fp.split("="))
        .map(([from, to]) => ({from, to: to || from}))

    ensureNotExisting(fileMappings.map(fm => fm.to), {force: args.force, ignore: args.ignore})
    .then(() => copyFiles(fileMappings, {force: args.force, ignore: args.ignore}))
    .then(() => process.exit(0))
    .catch(() => {
        process.exit(1)
    })
}

function ensureNotExisting(filePaths: string[], options: {force?: boolean, ignore?: boolean}): Promise<any> {
    return Promise.all(
        filePaths.map(fp => new Promise((resolve, reject) => {
            fs.exists(path.resolve(configDir, fp), exists => {
                if(exists) {
                    if(options.force) {
                        console.info(`Overwriting existing Template ${fp}`)
                        resolve()
                    } else if(options.ignore) {
                        console.info(`Skipping existing Template ${fp}`)
                        resolve()
                    } else {
                        console.error(`Template ${fp} already exists`)
                        reject()
                    }
                }
                else {
                    console.log(`Copying template ${fp} to ${configDir}`)
                    resolve(fp)
                }
            })
        })).filter(Boolean)
    )
}

function copyFiles(fileMappings: {from: string, to: string}[], options: {force?: boolean, ignore?: boolean}): Promise<any> {
    const cwd = process.cwd()
    return Promise.all(
        fileMappings.map(fm => new Promise((resolve, reject) => {
            const fromPath = path.resolve(cwd, fm.from)
            const toPath = path.resolve(configDir, fm.to)

            mkdirp(path.dirname(toPath), err => {
                if(err) reject(err)
                else {
                    fs.createReadStream(fromPath)
                        .pipe(fs.createWriteStream(toPath))
                        .on("close", () => {
                            resolve()
                        })
                        .on("error", reject)
                }
            })
        }))
    )
}