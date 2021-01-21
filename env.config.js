const environment = process.env.NODE_ENV || 'local';
const config = require(`./environments/${environment}/env.config.js`);
console.log('Running with environment: ', environment);
console.log(config);

module.exports = config;
