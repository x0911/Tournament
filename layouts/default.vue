<template>
  <v-app>
    <!-- <app-topbar></app-topbar> -->
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
    <div style="height: 100px">
      <!-- Separator between last div and Footer -->
    </div>
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
