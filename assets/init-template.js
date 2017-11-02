module.exports = {
    args: [{
        name: "name", message: "The template name", validate: Boolean
    }],
    files: ({name}) => [
        {
            name: name.endsWith(".js") ? name : `${name}.js`,
            content: `
            module.exports = {
                /**
                 * An array of arguments that must be provided for this template
                 * [REQURIED] - leave empty if no arguments required for this template
                 * 
                 * You can use all features of inquirer questions here - see https://github.com/SBoudrias/Inquirer.js/#question
                 * 
                 */
                args: [{
                    
                    /**
                     * The arguments name - use this name in the files function below to reference its value
                     * [REQUIRED]
                     */
                    name: "name",
                    
                    /**
                     * The message that will be displayed when the user will be aksed for this arguments value
                     * [OPTIONAL]
                     */
                    message: "The template name",
                    
                    /**
                     * The arguments default value
                     * [OPTIONAL]
                     * If this is provided and tpl is called without the --all flag the user will not be asked for this arguments value
                     */
                    default: "MyTemplate",
                    
                    /**
                     * A validation function
                     * 
                     * [REQUIRED]
                     */
                    validate: Boolean
                }],
                
                /**
                 * A function that will be called with user given argument values
                 * This must return an array of file descriptions
                 * [REQUIRED] 
                 */
                files: ({name}) => [
                    {
                        /**
                         * The name of the file that will be generated from this template
                         * [REQUIRED] 
                         */
                        name: name,

                        /**
                         * The content of the file that will be generated from this template
                         * [REQUIRED]
                         * 
                         * You can use all argument values here
                         * Note also, that all arguments are Strings and that the String.prototype got extended with the methods
                         * - camelCase()
                         * - pascalCase()
                         * - snakeCase()
                         * - constCase()
                         * - capitalize()
                         * - uncapitalize()
                         */
                        content: \`
                            /**
                             * This Class was generated from the template
                             * 
                             * \`\`\`
                             * export default class ${name.pascalCase()} {
                             *   ${name.camelCase()}() {
                             *       // camel-cased method name
                             *   }
                             *   ${name.pascalCase()}() {
                             *       // pascal-cased method name
                             *   }
                             *   ${name.snakeCase()}() {
                             *       // snake-cased method name
                             *   }
                             *   ${name.constCase()}() {
                             *       // const-cased method name
                             *   }
                             *}
                             * \`\`\`
                             */
                            export default class ${name.pascalCase()} {
                                ${name.camelCase()}() {
                                    // camel-cased method name
                                }
                                ${name.pascalCase()}() {
                                    // pascal-cased method name
                                }
                                ${name.snakeCase()}() {
                                    // snake-cased method name
                                }
                                ${name.constCase()}() {
                                    // const-cased method name
                                }
                            }
                        \`
                    }
                ]
            }
            `
        }
    ]
}