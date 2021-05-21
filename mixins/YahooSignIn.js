// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.

module.exports = {
  // Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/yahoo-oauth.md

  yahooProvider() {
    // [START auth_yahoo_provider_create]
    const provider = new this.$fireModule.auth.OAuthProvider('yahoo.com')
    // [END auth_yahoo_provider_create]

    // [START auth_yahoo_provider_scopes]
    // Request access to Yahoo Mail API.
    // provider.addScope('mail-r')
    // Request read/write access to user contacts.
    // This must be preconfigured in the app's API permissions.
    // provider.addScope('sdct-w')
    // [END auth_yahoo_provider_scopes]

    // [START auth_yahoo_provider_params]
    // provider.setCustomParameters({
    //   // Prompt user to re-authenticate to Yahoo.
    //   prompt: 'login',
    //   // Localize to French.
    //   language: 'fr',
    // })
    // [END auth_yahoo_provider_params]
    return provider
  },

  yahooSignInPopup(provider) {
    // [START auth_yahoo_signin_popup]
    this.$fireModule
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        // IdP data available in result.additionalUserInfo.profile
        // ...

        /** @type {this.$fireModule.auth.OAuthCredential} */
        const credential = result.credential

        // Yahoo OAuth access token and ID token can be retrieved by calling:
        const accessToken = credential.accessToken
        console.log(accessToken)
        const idToken = credential.idToken
        console.log(idToken)
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
        // ...
        console.log(credential)
      })
    // [END auth_yahoo_signin_popup]
  },

  yahooSignInRedirect(provider) {
    // [START auth_yahoo_signin_redirect]
    this.$fireModule.auth().signInWithRedirect(provider)
    // [END auth_yahoo_signin_redirect]
  },

  yahooSigninRedirectResult() {
    // [START auth_yahoo_signin_redirect_result]
    this.$fireModule
      .auth()
      .getRedirectResult()
      .then((result) => {
        // IdP data available in result.additionalUserInfo.profile
        // ...

        /** @type {this.$fireModule.auth.OAuthCredential} */
        const credential = result.credential

        // Yahoo OAuth access token and ID token can be retrieved by calling:
        const accessToken = credential.accessToken
        console.log(accessToken)
        const idToken = credential.idToken
        console.log(idToken)
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
        // ...
        console.log(credential)
      })
    // [END auth_yahoo_signin_redirect_result]
  },

  yahooLinkPopup() {
    // [START auth_yahoo_link_popup]
    const provider = new this.$fireModule.auth.OAuthProvider('yahoo.com')
    this.$fireModule
      .auth()
      .currentUser.linkWithPopup(provider)
      .then((result) => {
        // Yahoo credential is linked to the current user.
        // IdP data available in result.additionalUserInfo.profile.
        // Yahoo OAuth access token can be retrieved by calling:
        // result.credential.accessToken
        // Yahoo OAuth ID token can be retrieved by calling:
        // result.credential.idToken
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
        // ...
        console.log(credential)
      })
    // [END auth_yahoo_link_popup]
  },

  yahooReauthPopup() {
    // [START auth_yahoo_reauth_popup]
    const provider = new this.$fireModule.auth.OAuthProvider('yahoo.com')
    this.$fireModule
      .auth()
      .currentUser.reauthenticateWithPopup(provider)
      .then((result) => {
        // User is re-authenticated with fresh tokens minted and
        // should be able to perform sensitive operations like account
        // deletion and email or password update.
        // IdP data available in result.additionalUserInfo.profile.
        // Yahoo OAuth access token can be retrieved by calling:
        // result.credential.accessToken
        // Yahoo OAuth ID token can be retrieved by calling:
        // result.credential.idToken
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
        // ...
        console.log(credential)
      })
    // [END auth_yahoo_reauth_popup]
  },
}
