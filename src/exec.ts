import * as fs from "fs"
import * as path from "path"
import * as inquirer from "inquirer"
import * as mkdirp from "mkdirp"
import {configDir} from "./config"
import Template from './Template'

type Args = {
    template: string | Template
    force?: boolean
    all?: boolean
    out?: string
    params: {[key: string]: string}
}

export default function executeTemplate(args: Args) {
    const {template, name} = typeof args.template === "string"  ? loadTemplate(args.template): {template: args.template, name: "Inline Template"}
    validateTemplate(template, name)
    processTemplate(template, args.params, {force: args.force, all: args.all, out: args.out})
        .then(() => 
            process.exit(0))
        .catch((err) => 
            process.exit(1))
}

/**
 * Load the template that starts with name {templateName} is unambigious
 */
function loadTemplate(templateName: string): {template: Template, name?: string} {
    const allFiles = _getFiles(configDir)
    const files = allFiles.filter(file =>  file.startsWith(templateName))

    if(files.length === 0) {
        let n = templateName
        let meant = new Set()
        while(n && meant.size < 3) {
            allFiles
                .filter(f => f.startsWith(n))
                .forEach(f => meant.add(f))
            
            n = n.slice(0, -1)
        }
        if(meant.size)
            console.error(`'${templateName}' did not match any template. Did you meant ${[...(<any>meant)].join("\n")} ?`)
        else
            console.error(`'${templateName}' did not match any template.`)
        process.exit(1)
    }
    else if(files.length > 1) {
        const filesString = files.map(f => `\t${f}\n`)
        console.error(`'${templateName}' is ambiguous. Did you meant \n ${filesString}`)
        process.exit(1)
    }
    else {
        const filePath = path.resolve(configDir, files[0])
        try {
            return {
                template: require(filePath),
                name: files[0]
            }

        } catch(e) {
            console.error(`Error while loading template file ${filePath}`)
            console.error(e)
            process.exit(1)
        }
    }
}

/**
 * Return name of all files in {dir} or its subdirs
 */
function _getFiles(dir: string, parent = ""): string[] {
    const results = []
    for(let file of fs.readdirSync(dir)) {
        if(fs.statSync(path.resolve(dir, file)).isDirectory()) {
            for(let file2 of _getFiles(path.resolve(dir, file), parent + "/" + file)) {
                results.push(file2)
            }
        } else {
            results.push(parent + "/" + file)
        }
    }
    return results.map(r => r.replace(/^\//, ""))
}

/**
 * Validate a template an exit is template is not ok
 */
function validateTemplate(template: Template, templateName: string) {
    if(!!template.args && !(template.args instanceof Array)) {
        console.error(`Malformed template ${templateName}: property 'args' should be an array, found ${template.args}`)
        process.exit(1)
    }
    
    for(let arg of template.args || []) {
        if(typeof arg.name !== "string") {
            console.error(`Malformed template ${templateName}: property 'args[].name' should be a string, found ${arg.name}`)
            process.exit(1)
        }
    }
    
    if(typeof template.files !== "function") {
        console.error(`Malformed template ${templateName}: property 'files' should be a function, found ${template.files}`)
        process.exit(1)
    }
    
    let files = null
    try {
        files = template.files(new Proxy({}, {get: () => ""}))
    } catch(err) {
        console.error(`Malformed template ${templateName}: error while evaluating files function: ${err}`)
        process.exit(1)
    }

    if(!(files instanceof Array)) {
        console.error(`Malformed template ${templateName}: function 'files' should return an array, found ${files}`)
        process.exit(1)
    }
    
    for(let file of files) {
        if(typeof file.name !== "string") {
            console.error(`Malformed template ${templateName}: property 'files[].name' should be a string, found ${file.name}`)
            process.exit(1)
        }
        if(typeof file.content !== "string") {
            console.error(`Malformed template ${templateName}: property 'files[].content' should be a string, found ${file.content}`)
            process.exit(1)
        }
        if(file.content.trim().length === 0) {
            console.error(`Malformed template ${templateName}: property 'files[].content' should not be empty`)
            process.exit(1)
        }
    }
}

/**
 * Process a template
 * - ask for requried args
 * - trim file contents
 * - write files
 * 
 * @param {Template} template 
 * @param {{[key: string]: string}} keyValueArgs
 * @param {{force?: boolean, all?: boolean, out?: string}} options
 * @returns {Promise}
 */
function processTemplate(
    template: Template,
    keyValueArgs: object,
    options: {force?: boolean, all?: boolean, out?: string}): Promise<any> {
    
    const cwd = process.cwd()
    
    const argsWithDefaultValues = (template.args || [])
        .filter(a => a.hasOwnProperty("default"))
        .reduce((acc: any, arg) => (acc[arg.name] = arg.default, acc), {})
    const argsAlreadyGiven = {
        ...argsWithDefaultValues,
        ...keyValueArgs
    }
    const argsToAskFor = (template.args || [])
        .filter(a => options.all || !argsAlreadyGiven.hasOwnProperty(a.name))
        .map(a => ({
            ...a,
            message: a.message || `${a.name}?`,
            default: a.default || argsAlreadyGiven[a.name]
        }))
    
    return (argsToAskFor.length
            ? inquirer.prompt(argsToAskFor)
            : Promise.resolve([])
    ).then(answers => {
        const args = {
            ...argsAlreadyGiven,
            ...answers
        }
        for(let file of template.files(args)) {
            if(!file.name) continue

            const filePath = path.resolve(options.out || cwd, file.name)
            const exists = fs.existsSync(filePath)
            if(exists && !options.force) {
                console.error(`Could not overwrite file ${file.name}`)
                process.exit(1)
            }
            mkdirp.sync(path.dirname(filePath))

            const content = processContent(file.content, {trim: file.trim, indent: file.indent})
            fs.writeFileSync(filePath, content)
            if(exists) {
                console.info(`Overwrite ${filePath}`)
            } else {
                console.info(`Created ${filePath}`)
            }
        }
    })
}

/**
 * Process a template's file contet
 * - trim content
 * - normalize indentation
 */
function processContent(content: string, options: {trim?: boolean, indent?: boolean}): string {
    const { trim, indent } = options

    if(!(typeof trim === "boolean" && trim === false)) {
        const lines = content.split("\n") || []
        content = lines.filter((line, idx) => {
            if(idx === 0 || idx === lines.length - 1) {
                return !/^\s*$/.test(line)
            } else {
                return true
            }
        }).join("\n")
    }

    if(!(typeof indent === "boolean" && indent === false)) {
        const lines = content.split("\n") || []
        const [_, indent] = lines.find(l => /^\s+/.test(l)).match(/^(\s+)/) || [null, ""]
        const linesWithoutIndent = lines.map(line => line.startsWith(indent) ? line.slice(indent.length) : line)
        content = linesWithoutIndent.join("\n")
    }


    return content
}