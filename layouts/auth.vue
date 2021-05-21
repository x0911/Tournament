<template>
  <v-app>
    <side-bar></side-bar>
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
    <div style="height: 100px">
      <!-- Separator between last div and Footer -->
    </div>
  </v-app>
</template>

<script>
export default {
  components: {
    SideBar: () => import('@/components/auth/sidebar.vue'),
  },
  data: () => ({}),
  mounted() {
    this.createRgbVarsForThemes(this.$vuetify.theme.themes)
    this.setDefaults()
  },
}
</script>
