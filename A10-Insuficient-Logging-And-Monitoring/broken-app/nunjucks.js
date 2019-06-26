const nunjucks = require('nunjucks')
const highlight = require('highlight.js')
const path = require('path')
const md = require('markdown-it')({
  highlight: function(str, lang) {
    if (lang && highlight.getLanguage(lang)) {
      try {
        return highlight.highlight(lang, str).value
      } catch (error) {}
    }
    return ''
  }
})

module.exports = function init({ express }) {
  nunjucks
    .configure(path.join(__dirname, 'views'), {
      express,
      autoescape: false
    })
    .addFilter('markdown', function(str) {
      return md.render(str)
    })
}
