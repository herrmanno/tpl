# tpl

## install

`npm i -g tpl-cmd`

## usage

```shell
  Usage: index [options] <template> [key-value-pairs...]


  Options:

    -V, --version    output the version number
    -f, --force      overwrite existing files
    -a, --all        ask for all arguments
    -o, --out <dir>  out dir
    -h, --help       output usage information
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