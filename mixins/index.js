module.exports = {
  methods: {
    ...require('./GlobalSignIn.js'),
    ...require('./GoogleSignIn.js'),
    ...require('./FacebookSignIn.js'),
    ...require('./GithubSignIn.js'),
    ...require('./YahooSignIn.js'),
    ...require('./TwitterSignIn.js'),
    ...require('./HexToRGB.js'),
    ...require('./Firestore.js'),
    ...require('./Global.js'),
    ...require('./Tournament.js'),
  },
  data: () => ({
    mask: {
      nomask: {
        mask: '*'.repeat(255),
        tokens: {
          '*': {
            pattern: /./,
          },
        },
      },
      allowSpace: {
        lowercase: {
          mask: 'L'.repeat(50),
          tokens: {
            L: {
              pattern: /[a-zA-Z ]/,
              transform: (v) => v.toLocaleLowerCase(),
            },
          },
        },
        UPPERCASE: {
          mask: 'C'.repeat(50),
          tokens: {
            C: {
              pattern: /[a-zA-Z ]/,
              transform: (v) => v.toLocaleUpperCase(),
            },
          },
        },
      },
    },
  }),
}
