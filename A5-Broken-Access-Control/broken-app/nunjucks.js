const nunjucks = require('nunjucks')
const path = require('path')

module.exports = function init(opts) {
   nunjucks.configure(path.join(__dirname, 'views'), opts)
   //extensions...

}
