const path = require("path")
const xdgBasedir = require("xdg-basedir")
const pkg = require("../package.json")
const configDir = path.resolve(xdgBasedir.config, pkg.name)

/**
 * @type {{configDir: string}}
 */
module.exports = {
    configDir
}