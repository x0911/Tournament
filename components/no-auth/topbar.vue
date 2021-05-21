<template>
  <div>
    <v-app-bar app :color="$vuetify.theme.dark ? '' : 'white'">
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
      <v-toolbar-items v-if="$vuetify.breakpoint.mdAndUp">
        <template v-for="(item, i) in items">
          <v-btn
            :key="i"
            :to="localePath(item.href)"
            class="text-none"
            text
            depressed
          >
            {{ item.text }}
          </v-btn>
        </template>
        <v-menu transition="slide-y-transition" offset-y>
          <template #activator="{ on }">
            <v-btn text depressed class="text-none" v-on="on">
              <country-flag
                :country="langs[$vuetify.lang.current].flag"
                size="normal"
              ></country-flag>
            </v-btn>
          </template>
          <v-list width="240">
            <template v-for="(val, key, i) in langs">
              <v-list-item
                :key="i"
                :value="key"
                :disabled="key === appLocale"
                @click="switchLang()"
              >
                <v-list-item-avatar tile>
                  <country-flag
                    :country="val.flag"
                    size="normal"
                  ></country-flag>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    v-text="val[appLocale]"
                  ></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action v-if="key === appLocale">
                  <v-icon color="primary">mdi-check</v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
            <v-divider class="my-2"></v-divider>
            <v-subheader class="text-caption">
              <v-avatar color="error lighten-5" size="30" class="me-4">
                <v-icon color="error">mdi-exclamation</v-icon>
              </v-avatar>
              Page will be reloaded to apply new language
            </v-subheader>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [],
    langs: {
      ar: {
        ar: 'العربية',
        en: 'Arabic',
        flag: 'eg',
      },
      en: {
        ar: 'الإنجليزية',
        en: 'English',
        flag: 'us',
      },
    },
  }),
  computed: {
    appLocale() {
      return this.$i18n.locale
    },
    isArabic() {
      return this.appLocale === 'ar'
    },
  },
}
</script>
