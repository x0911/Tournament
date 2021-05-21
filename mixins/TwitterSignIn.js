// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
module.exports = {
  twitterProvider() {
    // [START auth_twitter_provider_create]
    this.$fireModule.auth().useDeviceLanguage()
    const provider = new this.$fireModule.auth.TwitterAuthProvider()
    // [END auth_twitter_provider_create]

    // [START auth_twitter_provider_params]
    // provider.setCustomParameters({
    //   lang: 'en',
    // })
    // [END auth_twitter_provider_params]
    return provider
  },

  twitterSignInPopup(provider) {
    // [START auth_twitter_signin_popup]
    this.$fireModule
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {this.$fireModule.auth.OAuthCredential} */
        const credential = result.credential

        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        const token = credential.accessToken
        const secret = credential.secret

        // The signed-in user info.
        const user = result.user
        // ...
        console.log(token)
        console.log(secret)
        console.log(user)
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        // The email of the user's account used.
        const email = error.email
        // The this.$fireModule.auth.AuthCredential type that was used.
        const credential = error.credential
        // ...
        console.log(errorCode)
        console.log(errorMessage)
        console.log(email)
        console.log(credential)
      })
    // [END auth_twitter_signin_popup]
  },

  twitterSignInRedirectResult() {
    // [START auth_twitter_signin_redirect_result]
    this.$fireModule
      .auth()
      .getRedirectResult()
      .then((result) => {
        if (result.credential) {
          /** @type {firebase.auth.OAuthCredential} */
          const credential = result.credential

          // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
          // You can use these server side with your app's credentials to access the Twitter API.
          const token = credential.accessToken
          const secret = credential.secret
          // ...
          console.log(token)
          console.log(secret)
        }

        // The signed-in user info.
        const user = result.user
        console.log(user)
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        // The email of the user's account used.
        const email = error.email
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential
        // ...
        console.log(errorCode)
        console.log(errorMessage)
        console.log(email)
        console.log(credential)
      })
    // [END auth_twitter_signin_redirect_result]
  },
}
