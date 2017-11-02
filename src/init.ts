import {configDir} from "./config"
import executeTemplate from "./exec"

type Args = {
    force?: boolean
    all?: boolean
    params: {[key: string]: string}
}

export default function initTemplate(args: Args) {
    const template = require("../assets/init-template.js")
    const out = configDir
    executeTemplate({
        template,
        out,
        ...args
    })
}
