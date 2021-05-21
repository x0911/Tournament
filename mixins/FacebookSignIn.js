// These samples are intended for Web so this import would normally be
// done in HTML however using modules here is more convenient for
// ensuring sample correctness offline.
module.exports = {
  facebookProvider() {
    // [START auth_facebook_provider_create]
    const provider = new this.$fireModule.auth.FacebookAuthProvider()
    // [END auth_facebook_provider_create]

    // / [START auth_facebook_provider_scopes]
    // provider.addScope('user_birthday')
    // [END auth_facebook_provider_scopes]

    // [START auth_facebook_provider_params]
    // provider.setCustomParameters({
    //   display: 'popup',
    // })
    // [END auth_facebook_provider_params]
    return provider
  },

  facebookSignInPopup(provider) {
    const that = this
    // [START auth_facebook_signin_popup]
    this.$fireModule
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        const credential = result.credential

        // The signed-in user info.
        const user = result.user
        console.log(user)

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const accessToken = credential.accessToken
        console.log(accessToken)

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
        if (error.code === 'auth/account-exists-with-different-credential') {
          // Step 2.
          // User's email already exists.
          // Get sign-in methods for this email.
          this.$fireModule
            .auth()
            .fetchSignInMethodsForEmail(email)
            .then(function (methods) {
              that.showSignInMethodsForEmail(email, methods)
              // Step 3.
              // If the user has several sign-in methods,
              // the first method in the list will be the "recommended" method to use.
              /*
              if (methods[0] === 'password') {
                // Asks the user their password.
                // In real scenario, you should handle this asynchronously.
                const password = promptUserForPassword() // TODO: implement promptUserForPassword.
                this.$fireModule
                  .auth()
                  .signInWithEmailAndPassword(email, password)
                  .then(function (result) {
                    // Step 4a.
                    return result.user.linkWithCredential(credential)
                  })
                  .then(function () {
                    // Google account successfully linked to the existing Firebase user.
                    window.location.reload()
                  })
                return
              }
              // All the other cases are external providers.
              // Construct provider object for that provider.
              const provider = this.getProviderForProviderId(methods[0]) // TODO: implement getProviderForProviderId.
              // At this point, you should let the user know that they already has an account
              // but with a different provider, and let them validate the fact they want to
              // sign in with this provider.
              // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
              // so in real scenario you should ask the user to click on a "continue" button
              // that will trigger the signInWithPopup.
              this.$fireModule
                .auth()
                .signInWithPopup(provider)
                .then(function (result) {
                  // Remember that the user may have signed in with an account that has a different email
                  // address than the first one. This can happen as Firebase doesn't control the provider's
                  // sign in flow and the user is free to login using whichever account they own.
                  // Step 4b.
                  // Link to Google credential.
                  // As we have access to the pending credential, we can directly call the link method.
                  result.user
                    .linkAndRetrieveDataWithCredential(credential)
                    .then(function (usercred) {
                      // Google account successfully linked to the existing Firebase user.
                      window.location.reload()
                    })
                })
                */
            })
        }
      })
    // [END auth_facebook_signin_popup]
  },

  facebookSignInRedirectResult() {
    // [START auth_facebook_signin_redirect_result]
    this.$fireModule
      .auth()
      .getRedirectResult()
      .then((result) => {
        if (result.credential) {
          /** @type {firebase.auth.OAuthCredential} */
          const credential = result.credential

          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
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
    // [END auth_facebook_signin_redirect_result]
  },

  // [START auth_facebook_callback]
  checkLoginState(response) {
    if (response.authResponse) {
      // User is signed-in Facebook.
      const unsubscribe = this.$fireModule
        .auth()
        .onAuthStateChanged((firebaseUser) => {
          unsubscribe()
          // Check if we are already signed-in Firebase with the correct user.
          if (!this.facebookIsUserEqual(response.authResponse, firebaseUser)) {
            // Build Firebase credential with the Facebook auth token.
            const credential = this.$fireModule.auth.FacebookAuthProvider.credential(
              response.authResponse.accessToken
            )

            // Sign in with the credential from the Facebook user.
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
                console.log(credential)
                // ...
              })
          } else {
            // User is already signed-in Firebase with the correct user.
          }
        })
    } else {
      // User is signed-out of Facebook.
      this.$fireModule.auth().signOut()
    }
  },
  // [END auth_facebook_callback]

  // [START auth_facebook_checksameuser]
  facebookIsUserEqual(facebookAuthResponse, firebaseUser) {
    if (firebaseUser) {
      const providerData = firebaseUser.providerData
      for (let i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            this.$fireModule.auth.FacebookAuthProvider.PROVIDER_ID &&
          providerData[i].uid === facebookAuthResponse.userID
        ) {
          // We don't need to re-auth the Firebase connection.
          return true
        }
      }
    }
    return false
  },
  // [END auth_facebook_checksameuser]

  authWithCredential(credential) {
    // [START auth_facebook_signin_credential]
    // Sign in with the credential from the Facebook user.
    this.$fireModule
      .auth()
      .signInWithCredential(credential)
      .then((result) => {
        // Signed in
        const credential = result.credential
        console.log(credential)
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
    // [END auth_facebook_signin_credential]
  },
}
