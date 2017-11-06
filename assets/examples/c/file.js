const os = require("os")

module.exports = {
    args: [
        {name: "name", message: "The source file's name"},
    ],
    files: ({name}) => [
        {
            name: `${name}.c`,
            content: ``
        },
        {
            name: `${name}.h`,
            content: `
            #ifndef ${name.constCase()}_H
            #define ${name.constCase()}_H
            
            #endif
            `
        }
    ]
}