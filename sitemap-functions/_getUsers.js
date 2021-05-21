import axios from 'axios'
module.exports = () => {
  return new Promise((resolve, reject) => {
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then((x) => {
        const users = x.data.map((user) => `/app/u/${user.username}`)
        resolve(users)
      })
      .catch(() => {
        resolve([])
      })
  })
}
