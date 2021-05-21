// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/google-signin.md
module.exports = {
  googleProvider() {
    // [START auth_google_provider_create]
    const provider = new this.$fireModule.auth.GoogleAuthProvider()
    // [END auth_google_provider_create]

    // [START auth_google_provider_scopes]
    // provider.addScope('https://www.googleapis.com/auth/contacts.readonly')
    // [END auth_google_provider_scopes]

    // [START auth_google_provider_params]
    // provider.setCustomParameters({
    //   login_hint: 'user@example.com',
    // })
    return provider
    // [END auth_google_provider_params]
  },

  googleSignInPopup(provider) {
    // [START auth_google_signin_popup]
    this.$fireModule
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        const credential = result.credential

        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = credential.accessToken
        // The signed-in user info.
        const user = result.user
        // ...
        console.log('User is now Signed-in successfully')
        console.log(user)
        console.log('Using this token')
        console.log(token)
        window.location.reload()
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
    // [END auth_google_signin_popup]
  },

  googleSignInRedirectResult() {
    // [START auth_google_signin_redirect_result]
    this.$fireModule
      .auth()
      .getRedirectResult()
      .then((result) => {
        if (result.credential) {
          /** @type {firebase.auth.OAuthCredential} */
          const credential = result.credential

          // This gives you a Google Access Token. You can use it to access the Google API.
          const token = credential.accessToken
          // ...
          console.log('googleSignInRedirectResult')
          console.log(credential)
          console.log(token)
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
        // ...
        console.log(credential)
      })
    // [END auth_google_signin_redirect_result]
  },

  googleBuildAndSignIn(idToken) {
    // [START auth_google_build_signin]
    // Build Firebase credential with the Google ID token.
    const credential = this.$fireModule.auth.GoogleAuthProvider.credential(
      idToken
    )

    // Sign in with credential from the Google user.
    this.$fireModule
      .auth()
      .signInWithCredential(credential)
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
    // [END auth_google_build_signin]
  },

  // [START auth_google_callback]
  onSignIn(googleUser) {
    console.log('Google Auth Response', googleUser)
    const that = this
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    const unsubscribe = this.$fireModule
      .auth()
      .onAuthStateChanged((firebaseUser) => {
        unsubscribe()
        // Check if we are already signed-in Firebase with the correct user.
        if (!that.googleIsUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          const credential = this.$fireModule.auth.GoogleAuthProvider.credential(
            googleUser.getAuthResponse().id_token
          )

          // Sign in with credential from the Google user.
          // [START auth_google_signin_credential]
          this.$fireModule
            .auth()
            .signInWithCredential(credential)
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
          // [END auth_google_signin_credential]
        } else {
          console.log('User already signed-in Firebase.')
        }
      })
  },
  // [END auth_google_callback]

  // [START auth_google_checksameuser]
  googleIsUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
      const providerData = firebaseUser.providerData
      for (let i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            this.$fireModule.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true
        }
      }
    }
    return false
  },
  // [END auth_google_checksameuser]
}
