<template>
  <div>
    <v-app-bar app color="card-bg">
      <v-app-bar-nav-icon @click="toggleSidenav()"></v-app-bar-nav-icon>
      <router-link :to="localePath('/')">
        <v-avatar size="35" class="me-4">
          <v-img :src="require('@/assets/media/logo/500x-Circle.png')"></v-img>
        </v-avatar>
      </router-link>
      <v-toolbar-title
        v-if="!$vuetify.breakpoint.xs"
        class="primary--text font-weight-bold ls-1"
      >
        <router-link :to="localePath('/')">
          <span>Tournament</span>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <!--  -->
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data: () => ({}),
  methods: {
    toggleSidenav() {
      this.$emit('toggle-sidenav')
    },
  },
}
</script>
