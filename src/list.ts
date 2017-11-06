import * as path from "path"
import * as glob from "glob"
import {configDir} from "./config"

function listTemplates() {
    glob(configDir + "/**", {nodir: true}, (err, matches) => {
        if(err) {
            console.error("Error while listing templates:", err)
            process.exit(1)
        }
        

        matches
            .map(p => path.relative(configDir, p))
            .forEach(p => console.log(p))
        process.exit(0)
    })
}


export default listTemplates