import * as path from 'path'
import * as fs from 'fs'
import * as mkdirp from "mkdirp"
import {configDir} from "./config"
import executeTemplate from "./exec"
import Template from "./Template"

type Args = {
    filePaths: string[]
    force?: boolean
}

export default function installTemplates(args: Args) {
    const fileMappings = args.filePaths
        .map(fp => fp.split("="))
        .map(([from, to]) => ({from, to: to || from}))

    ensureNotExisting({
        filePaths: fileMappings.map(fm => fm.to),
        force: args.force
    })
    .then(() => copyFiles(fileMappings))
    .then(() => process.exit(0))
    .catch(() => {
        process.exit(1)
    })
}

function ensureNotExisting(args: {filePaths: string[], force?: boolean}): Promise<any> {
    return Promise.all(
        args.filePaths.map(fp => new Promise((resolve, reject) => {
            if(args.force)
                resolve()
            else
                fs.exists(path.resolve(configDir, fp), exists => {
                    if(exists) (console.error(`Template ${fp} already exists`), reject())
                    else resolve()
                })
        }))
    )
}

function copyFiles(fileMappings: {from: string, to: string}[]): Promise<any> {
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
                            console.log(`Copied template ${fm.from} to ${configDir}`)
                            resolve()
                        })
                        .on("error", reject)
                }
            })
        }))
    )
}