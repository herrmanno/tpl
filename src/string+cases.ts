interface String {
    camelCase(): string
    pascalCase(): string
    snakeCase(): string
    constCase(): string

    capitalize(): string
    uncapitalize(): string

    toList(seperator?: string): string[]
}

String.prototype.camelCase = function() {
    let str = this.uncapitalize()
    str = str.replace(/_(\w)/, m => m[1].toUpperCase())
    return str
}

String.prototype.pascalCase = function() {
    let str = this.capitalize()
    str = str.replace(/_(\w)/, m => m[1].toUpperCase())
    return str
}

String.prototype.snakeCase = function() {
    let str = this.toString()
    str = str.replace(/[a-z][A-Z]/, m => m[0] + "_" + m[1])
    str = str.toLowerCase()
    return str
}

String.prototype.constCase = function() {
    return this.snakeCase().toUpperCase()
}

String.prototype.capitalize = function() {
    let str = this.toString()
    str = str.slice(0, 1).toUpperCase() + str.slice(1)
    return str
}

String.prototype.uncapitalize = function() {
    let str = this.toString()
    str = str.slice(0, 1).toLowerCase() + str.slice(1)
    return str
}

String.prototype.toList = function(seperator = ",") {
    let str = this.toString()
        .split(seperator)
        .map(s => s.trim())
    return str
}