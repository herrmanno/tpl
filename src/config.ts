import * as path from "path"
import * as xdgBasedir from "xdg-basedir"

const pkg = require("../package.json")
const configDir: string = path.resolve(xdgBasedir.config, pkg.name)

export {configDir}