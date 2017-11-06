import * as path from 'path'
import * as fs from 'fs'
import {configDir} from "./config"
import executeTemplate from "./exec"
import Template from "./Template"

type Args = {
    filePaths: string[]
    force?: boolean
    ignore?: boolean
    all?: boolean
    params: {[key: string]: string}
}

type FD = {name: string, content: string}

export default function initTemplate(args: Args) {
    if(args.filePaths.length < 1) {
        console.error("Called --create without file arguments")
        process.exit(1)
    }

    Promise.all(readFiles(args.filePaths))
    .then(files => {
        const template = createTemplate(files)
        const out = configDir
        
        return executeTemplate({
            template,
            out,
            params: args.params,
            all: args.all,
            force: args.force,
            ignore: args.ignore
        })
    })
    .then(() => process.exit(0))
    .catch(err => process.exit(1))

}

function readFiles(filePaths: string[]): Promise<FD>[] {
    const cwd = process.cwd()
    return filePaths.map(fp => new Promise<FD>((resolve, reject) => {
        const p = path.resolve(cwd, fp)
        fs.readFile(p, (err, data) => {
            if(err) {
                console.error(`Error while reading ${p}:`, err)
                reject(err)   
            } else {
                resolve({name: fp, content: data.toString()})
            }
        })
    }))
}

function createTemplate(fileDescriptions: FD[]): Template {
    const fileDesc = fileDescriptions.map(({name, content}) => [
            "{",
            "    name: `" + name + "`,",
            "    content: `",
                    indent(content.replace("`", "\\`"), "        "),
            "    `",
            "}"
        ].join("\n")
    ).join(",\n")
    
    return {
        args: [
            {name: "name", message: "The templates name", default: fileDescriptions[0].name}
        ],
        files: args => [
            {
                name: args.name,
                indent: false,
                content: [
                    "module.exports = {",
                    "    args: [",
                    "        // { name: \"MyArgument\", message: \"What I need MyArgument for\", default: \"Foo\" }",
                    "    ],",
                    "    files: args => [",
                            indent(fileDesc, "        "),
                    "    ]",
                    "}"].join("\n")
            }
        ]
    }
}

function indent(str: string, indentation: string): string {
    return str.split("\n").map(line => indentation + line).join("\n")
}