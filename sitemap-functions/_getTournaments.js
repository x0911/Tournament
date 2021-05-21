import axios from 'axios'
module.exports = () => {
  return new Promise((resolve, reject) => {
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then((x) => {
        const tournaments = x.data.map(
          (tournament) => `/app/u/${tournament.username}`
        )
        resolve(tournaments)
      })
      .catch(() => {
        resolve([])
      })
  })
}
