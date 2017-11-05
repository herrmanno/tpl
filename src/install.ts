import * as path from 'path'
import * as fs from 'fs'
import {configDir} from "./config"
import executeTemplate from "./exec"
import Template from "./Template"

type Args = {
    filePaths: string[]
    force?: boolean
}

export default function installTemplates(args: Args) {
    ensureNotExisting(args)
    .then(() => copyFiles(args.filePaths))
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

function copyFiles(filePaths: string[]): Promise<any> {
    const cwd = process.cwd()
    return Promise.all(
        filePaths.map(fp => new Promise((resolve, reject) => {
            fs.createReadStream(path.resolve(cwd, fp))
                .pipe(fs.createWriteStream(path.resolve(configDir, fp)))
                .on("close", () => {
                    console.log(`Copied template ${fp} to ${configDir}`)
                    resolve()
                })
                .on("error", reject)
        }))
    )
}