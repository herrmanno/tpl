#!/usr/bin/env node

const commander = require("commander")
const execTemplate = require("./exec")
const pkg = require("../package.json")
const {configDir} = require("./config")

require("./string+cases")

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