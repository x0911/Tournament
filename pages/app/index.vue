<template>
  <div>
    <div>
      Welcome to tournament : {{ userData.fname + ' ' + userData.lname }}
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  layout: 'auth',
  computed: {
    userData() {
      return this.$store.state.userData
    },
  },
}
</script>
