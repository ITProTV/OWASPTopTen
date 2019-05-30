const faker = require('faker')
const path = require('path')
const directory = path.resolve(__dirname, '../db')
const db = require('../db')({ directory })

const range = (start, stop, step = 1) =>
  Array.from({ length: Math.floor((stop - start) / step) }, (_, i) => i)
const randint = (lower, upper) =>
  lower + Math.floor((upper - lower) * Math.random())

function user() {
  return {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email()
  }
}
function post(user) {
  return {
    title: faker.lorem.words(3),
    body: faker.lorem.paragraphs(4),
    img: {
      src: faker.image.imageUrl(750, 300, 'nature', true),
      alt: faker.lorem.words(10)
    },
    userId: user._id,
    comments: range(0, 10).map(() => comment(user))
  }
}
function comment(user) {
  return {
    userId: user._id,
    body: faker.lorem.paragraph(randint(1, 10))
  }
}

function main() {
  db.users.insert(range(0, 10).map(user), (_, users) => {
    const posts = users.map(u => post(u))
    db.posts.insert(posts, (err, posts) => {
      console.log('Finished!')
    })
  })
}

module.exports = main
