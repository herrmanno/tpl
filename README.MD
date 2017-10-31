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

Create a new template file. Note that the template name "init*" is reserved and will not beresolved normally.

`tpl init`


## Create a meta-template

You can create templates that will call other template at runime. An example would look like this:

```js
const myOtherTemplate1 = require("./t1)
const myOtherTemplate2 = require("./t2)

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

TODO

## API

TODO