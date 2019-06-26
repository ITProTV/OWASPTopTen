module.exports = [
  {
    method: 'get',
    path: '/login',
    template: 'login',
    data(req, res) {
      return {
        url: req.url
      }
    }
  },
  {
    method: 'get',
    path: '/signup',
    template: 'signup'
  },
  {
    method: 'get',
    path: '/logout',
    template: 'logout'
  },
  {
    method: 'get',
    path: '/snippets',
    template: 'snippets/list'
  },
  {
    method: 'get',
    path: '/snippets/add',
    template: 'snippets/add'
  }
]
