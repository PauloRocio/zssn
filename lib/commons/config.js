const nconf = require('nconf');

nconf.argv()
  .env()
  .file(`${process.cwd()}/conf/zssn-conf.json`)
  .defaults({
    PORT: 3000
  });

module.exports = nconf;
