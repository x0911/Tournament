// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.

module.exports = {
  githubProvider() {
    // [START auth_github_provider_create]
    const provider = new this.$fireModule.auth.GithubAuthProvider()
    // [END auth_github_provider_create]

    // [START auth_github_provider_scopes]
    // provider.addScope('repo')
    // [END auth_github_provider_scopes]

    // [START auth_github_provider_params]
    // provider.setCustomParameters({
    //   allow_signup: 'false',
    // })
    // [END auth_github_provider_params]
    return provider
  },

  githubProviderCredential(token) {
    // [START auth_github_provider_credential]
    const credential = this.$fireModule.auth.GithubAuthProvider.credential(
      token
    )
    // [END auth_github_provider_credential]
    return credential
  },

  githubSignInPopup(provider) {
    // [START auth_github_signin_popup]
    this.$fireModule
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {this.$fireModule.auth.OAuthCredential} */
        const credential = result.credential

        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const token = credential.accessToken
        console.log(token)

        // The signed-in user info.
        const user = result.user
        console.log(user)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        console.log(errorCode)
        const errorMessage = error.message
        console.log(errorMessage)
        // The email of the user's account used.
        const email = error.email
        console.log(email)
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential
        console.log(credential)
        // ...
      })
    // [END auth_github_signin_popup]
  },

  githubSignInRedirectResult() {
    // [START auth_github_signin_redirect_result]
    this.$fireModule
      .auth()
      .getRedirectResult()
      .then((result) => {
        if (result.credential) {
          /** @type {this.$fireModule.auth.OAuthCredential} */
          const credential = result.credential

          // This gives you a GitHub Access Token. You can use it to access the GitHub API.
          const token = credential.accessToken
          console.log(token)
          // ...
        }

        // The signed-in user info.
        const user = result.user
        console.log(user)
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        console.log(errorCode)
        const errorMessage = error.message
        console.log(errorMessage)
        // The email of the user's account used.
        const email = error.email
        console.log(email)
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential
        console.log(credential)
        // ...
      })
    // [END auth_github_signin_redirect_result]
  },
}
