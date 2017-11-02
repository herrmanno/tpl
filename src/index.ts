import * as yargs from "yargs"
import initTemplate from "./init"
import execTemplate from "./exec"
import {configDir}from "./config"
import "./string+cases"

const pkg = require("../package.json")

export default function main() {
    const cli = yargs
        .usage("Usage: $0 [options] <template> [params...]")
        .example("$0 mytemplate --foo FOO --bar 123 --baz", "Generates files from 'mytemplate' with arguments foo, bar and baz")
        
        .boolean("f")
        .alias("f", "force")
        .describe("f", "Force overwrite if one of the generated files already exists")

        .boolean("a")
        .alias("a", "all")
        .describe("a", "Prompt for all arguments")

        .string("o")
        .alias("o", "out")
        .describe("o", "Directory to write files to")

        .boolean("init")
        .describe("init", "create an initial template file")

        .demandOption([])
        .help("h")
        .alias("h", "help")

        .wrap(Math.min(yargs.terminalWidth(), 120))
        // .epilog("copyright 2017 Oliver Herrmann")
        
    const args = cli.parse(process.argv)
    const values = args._.slice(2)
    const {
        _,
        f, force,
        a, all,
        o, out,
        init,
        h, help,
        version,
        $0,
        ...params
    } = args
    
    if(init) {
        initTemplate({force, all, params})
    }
    else if(values.length === 1) {
        const template = values[0]
        execTemplate({template, force, all, out, params})
    }
    else {
        cli.showHelp()
    }

    // console.dir({
    //     f, a, o, init,
    //     params,
    //     values
    // })
}