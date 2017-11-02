#!/usr/bin/env node

import commander from "commander"
import execTemplate from "./exec"
import {configDir}from "./config"
import "./string+cases"

const pkg = require("../package.json")

function main() {
    const prog = commander
        .version(pkg.version)
        .option('-f, --force', 'overwrite existing files')
        .option('-a, --all', 'ask for all arguments')
        .option('-o, --out <dir>', 'out dir')
        .arguments('<template> [key-value-pairs...]')
        .action(function(template, keyValuePairs, command) {
            const args = {
                ...command.opts(),
                template,
                keyValuePairs: keyValuePairs.reduce((acc, kv) => {
                    const [key, ...value] = kv.split("=")
                    acc[key] = value.join("=").match(/(["']?)(.*)\1/)[2]
                    return acc
                }, {})
            }

            if(template === "init") {
                execTemplate({
                    ...args,
                    out: configDir,                    
                    template: require("./init-template.js")
                })
            } else {
                execTemplate(args)
            }
        })
        .parse(process.argv)
}

main()