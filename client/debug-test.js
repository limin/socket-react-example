const argv = require('yargs').argv
//const usage='node debug-test.js --file file'
//file: test file
const fs = require('fs')
const dotenv = require('dotenv')
const spawn = require('child_process').spawn
const file=argv.file
const cmd="node"
const args=["--inspect-brk", "./node_modules/react-scripts/scripts/test.js", "--env=jsdom",  "--runInBand"]
if(file){
  args.push(file)
}

const node   = spawn(cmd,args)

node.stdout.on('data', function (data) {
  console.log(data.toString());
})

node.stderr.on('data', function (data) {
  console.log(data.toString());
})

node.on('exit', function (code) {
  console.log('exited with code ' + code.toString());
})
