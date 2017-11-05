# <img height="200" src="assets/logo.png"/>

## install

`npm i -g tpl-cmd`

## usage

```shell
  Usage: tpl [options] <template> [params...]

  Options:
    -f, --force  Force overwrite if one of the generated files already exists                              [boolean]
    -a, --all    Prompt for all arguments                                                                  [boolean]
    -o, --out    Directory to write files to                                                                [string]
    --init       create an initial template file                                                           [boolean]
    --create     create a template from existing files                                                     [boolean]
    --install    copy templates to the user's template directory                                           [boolean]
    --version    Show version number                                                                       [boolean]
    -h, --help   Show help                                                                                 [boolean]

  Examples:
    tpl mytemplate --foo FOO --bar 123 --baz  Generates files from 'mytemplate' with arguments foo, bar and baz
```


## examples

### Apply a template

Apply a template called `foo` and provide values for the parameters "bar" and "baz".
This assumes that a file like ~/.config/tpl/foo* exists. 

`tpl foo bar=BAR baz='baz baz baz'`

### Create a template

Create a new template file.

`tpl --init`

### Create a template from existing files

Create a new template from existing files.

`tpl --create myfirstfile.txt mysecondfile.txt`


## Create a meta-template

You can create templates that will call other template at runime. An example would look like this:

```js
const myOtherTemplate1 = require("./t1")
const myOtherTemplate2 = require("./t2")

module.export = {
  args: [
    ...myOtherTemplate1.args,
    ...myOtherTemplate2.args
  ],
  files: args => [
    ...myOtherTemplate1.files(args),
    ...myOtherTemplate2.files(args),
  ]
}
```

Remember, it's only JavaScript ;)

## Template file format

Any javascript file whose default export is an object that fulfills the following form is a valid template

```js
{
  args: Array<{
    name: string,
    message?: string,
    default?: ,
    [key: string]: any
  }>
  files(args): Array<{
    name: string,
    content: string
    trim?: boolean
    indent?: boolean
  }>
}
```

### Args.name

The name of the argument. 
Use this name later in your files function to obtian the value the user entered.

### Args.message

The message the terminal will show when prompting for the argument. 
Use this for non self explanatory arguments, where the name itself is not enough.

### Args.default

The arguments default value, if there is any.
Use this for a parameter that have a sane default value. If a user generates files from this template and he or she does not specify the `-a | --all` flag tpl will not prompt for a parameter with a default value.


### Files.name

The name the generated file will have.
You can use parameter values in here.
If the name has a falsy value the corresponding file will not be generated.


### Files.content

The content of the file.
You can use parameter values in here.

### Files.trim

Wether to trim the file's content.
If you are using Template-Strings for your content it's likely to have empty lines at front and the end of your content string.
If set, tpl will cut theese lines from your file's content.
If not specified, tpl will trim the file's content by default.

### Files.indent
    
Wether to normalize indentation of the file's content.
If you are using Template-Strings for your content it's likely to have empty strange indentation in front of some lines.
If set, tpl will cut unnecessary indentation from theese lines.
If not specified, tpl will normalize indentation by default.


## Create templates and distribute them

tpl is meant to be used with your favourite snippets. But if you took your time to create and improve your templates it would be nice to share them with other users.

This can be easily achieved by wrapping your template in a node package and [publish it to npm](https://docs.npmjs.com/getting-started/publishing-npm-packages). To make using your template as easy as possible you can use tpl to add your template to the users tempalte directory when he or she installs your package. You can use npm's buit-in [install script](https://docs.npmjs.com/misc/scripts) therefore.


```json
// the package.json of your template-package
{
  "name": "my-custom-tpl-template",
  "scripts": {
    "install": "tpl --install ./my-template.js"
  },
}
```

The --install flag instructs tpl to copy the following templates to the users template dir.


## Contributing

Every form of contribution is welcome. Please try to roughly match the existing coding style.

## License

tpl is licensed under ISC. Feel free to use it in your private or commercial project.