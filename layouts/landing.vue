<template>
  <v-app>
    <!-- <app-topbar></app-topbar> -->
    <v-main>
      <router-view></router-view>
    </v-main>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
export default {
  components: {
    // AppTopbar: () => import('@/components/no-auth/topbar.vue'),
    AppFooter: () => import('~/components/no-auth/footer.vue'),
  },
  data: () => ({}),
  mounted() {
    this.createRgbVarsForThemes(this.$vuetify.theme.themes)
    this.setDefaults()
  },
}
</script>
