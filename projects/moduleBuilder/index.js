const LG = console.log; // eslint-disable-line no-console,no-unused-vars

const index = require('./indexTasks');
const client = require('./clientTasks');
const lib = require('./libTasks');
const server = require('./serverTasks');
const tests = require('./testsTasks');
const tasks = [
  tests,
  index,
  client,
  lib,
  server,
];

module.exports = function (module) {
  tasks.forEach( task => task(module) );
};
