module.exports = {
  getProviderForProviderId(providerId) {
    //
  },
  showSignInMethodsForEmail(email, methods) {
    this.$set(this.$store.state.methodsForEmail, 'methods', methods)
    this.$set(this.$store.state.methodsForEmail, 'email', email)
    this.$set(this.$store.state.methodsForEmail, 'model', true)
  },
}
