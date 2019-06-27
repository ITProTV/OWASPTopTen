module.exports = {
  admin: {
    can: ['modify', 'delete', 'read'] 
  },
  user: {
    can: ['read'] 
  },
  guest: {
    can: [] 
  }
}
