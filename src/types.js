 /**
 * @typedef {Object} Template
 * @property {(args: any) => Template.FileEntry[]} files
 * @property {Template.ArgEntry[]} args
 *
 * @typedef {Object} Template.FileEntry
 * @property {string} name
 * @property {string} content
 * @property {boolean} [trim]
 * @property {boolean} [indent]
 * 
 * @typedef {Object} Template.ArgEntry
 * @property {string} name
 * @property {string} [default]
 */