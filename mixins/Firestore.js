module.exports = {
  getPostsAuthors(docs) {
    const $this = this
    const posts = []
    return new Promise((resolve, reject) => {
      ;(async function loop() {
        for (let i = 0; i < docs.length; i++) {
          const doc = docs[i]
          const post = doc.doc.data()
          post.hasPendingWrites = doc.doc.metadata.hasPendingWrites
          post.id = doc.doc.id
          post.changeType = doc.changeType
          const author = await $this.$fire.firestore
            .collection('users')
            .doc(post.uid)
            .get()
          post.author = author.data()
          posts.push(post)
          if (i === docs.length - 1) {
            resolve(posts)
          }
        }
      })()
    })
  },
  getPostAuthor(doc) {
    const $this = this
    return new Promise((resolve, reject) => {
      const post = doc.data()
      post.hasPendingWrites = doc.metadata.hasPendingWrites
      post.id = doc.id
      post.isDeleted = post.isDeleted || !doc.exists
      $this.$fire.firestore
        .collection('users')
        .doc(post.uid)
        .get()
        .then((author) => {
          const postAuthor = author.data()
          post.author =
            postAuthor && typeof postAuthor === 'object'
              ? postAuthor
              : { fname: 'Tournament', lname: 'User' }
          resolve(post)
        })
        .catch(() => {
          resolve(post)
        })
    })
  },
  removeRandomChars(str, length) {
    const removeRandomLetter = (str) => {
      const pos = Math.floor(Math.random() * str.length)
      return str.substring(0, pos) + str.substring(pos + 1)
    }
    for (let i = 0; i < length; i++) {
      str = removeRandomLetter(str)
    }
    return str
  },
  firestoreDocId() {
    const { v4 } = require('uuid')
    const id = v4()
    const time = new Date().getTime()
    const fusion = `${id}${time}`.replace(/-/g, '')
    const stripped = this.removeRandomChars(fusion, 15)
    return stripped
  },
}
