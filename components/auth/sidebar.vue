<template>
  <div>
    <auth-top-bar @toggle-sidenav="toggleSidenav()"></auth-top-bar>
    <v-navigation-drawer
      v-model="model"
      :temporary="!$store.state.options.drawer.fixed"
      app
      :mini-variant.sync="$store.state.options.drawer.mini"
      :right="$vuetify.rtl"
      overflow
      width="265"
      height="100%"
      dark
      class="main-sidenav"
      color="rgb(5, 30, 52)"
    >
      <template #img>
        <v-img
          height="100%"
          :src="require('@/assets/media/svg/14.svg')"
        ></v-img>
      </template>
      <vue-custom-scrollbar
        :style="`height: 100%; width: ${
          $store.state.options.drawer.mini ? '80' : '265'
        }px; padding-bottom: 60px`"
        :settings="$store.state.options.scrollbar_settings"
      >
        <v-list nav class="px-0">
          <v-subheader>Your Profile</v-subheader>
          <v-list-item :to="localePath(`/app/u/${user.uid}`)">
            <v-list-item-avatar>
              <v-img
                :src="
                  user.photoURL
                    ? user.photoURL
                    : require('@/assets/media/global/user-placeholder.jpg')
                "
                :lazy-src="
                  require('@/assets/media/global/user-placeholder.jpg')
                "
              ></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                v-text="userData.fname + ' ' + userData.lname"
              ></v-list-item-title>
              <v-list-item-subtitle v-text="`Starter`"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <template v-for="(item, i) in items">
            <v-subheader
              v-if="item.subheader"
              :key="`s_${i}`"
              v-text="item.subheader"
            ></v-subheader>
            <v-divider v-if="item.topDivider" :key="`td_${i}`"></v-divider>
            <v-list-item
              v-if="!item.type || item.type == 'single'"
              :key="i"
              :to="localePath(item.href)"
              class="my-0"
              exact
              @click="item.action ? runFun(item.action) : () => {}"
            >
              <v-list-item-avatar>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
                <v-list-item-subtitle v-text="item.desc"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="item.bottomDivider" :key="`bd_${i}`"></v-divider>
          </template>
        </v-list>
        <v-footer :dir="$vuetify.rtl" padless fixed color="rgb(5, 30, 52)">
          <v-list class="py-0" style="width: 100%" dark>
            <v-divider></v-divider>
            <v-list-item class="transparent">
              <v-list-item-content v-if="!$store.state.options.drawer.mini">
                <v-list-item-title> Tournament App </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t('version') }} : 0.1.3
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action-text>
                <v-btn light fab small @click="switchLang()">
                  <v-icon small>
                    {{
                      isArabic
                        ? 'mdi-format-text-variant-outline'
                        : 'mdi-abjad-arabic'
                    }}
                  </v-icon>
                </v-btn>
                <v-btn
                  light
                  fab
                  small
                  @click="changeTheme(!$vuetify.theme.dark)"
                >
                  <v-icon small
                    >mdi-invert-colors
                    {{ isDark ? 'mdi-rotate-180' : '' }}</v-icon
                  >
                </v-btn>
              </v-list-item-action-text>
            </v-list-item>
          </v-list>
        </v-footer>
      </vue-custom-scrollbar>
    </v-navigation-drawer>
    <!-- Dialogs -->
    <v-dialog v-model="logoutDialog.model" scrollable max-width="400">
      <v-card>
        <v-card-title>
          Sure?
          <v-spacer></v-spacer>
          <v-btn icon @click="logoutDialog.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text> Do you want to leave? </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="logoutDialog.model = false"
            v-text="'Cancel'"
          ></v-btn>
          <v-btn text color="error" @click="logout()" v-text="'Logout'"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ./Dialogs -->
  </div>
</template>

<script>
export default {
  components: {
    AuthTopBar: () => import('@/components/auth/topbar.vue'),
  },
  data: () => ({
    model: null,
    items: [
      {
        subheader: 'Menu',
        title: 'Timeline',
        icon: 'mdi-earth',
        href: '/app',
      },
      {
        title: 'Tournaments',
        icon: 'mdi-view-dashboard-outline',
        href: '/app/tournaments',
      },
      {
        title: 'Collections',
        icon: 'mdi-view-dashboard-variant-outline',
        href: '/app/collections',
      },
      {
        title: 'Friends',
        icon: 'mdi-heart-outline',
        href: '/app/friends',
      },
      {
        title: 'Settings',
        icon: 'mdi-cog',
        href: '/app/settings',
      },
      {
        title: 'Logout',
        action: 'openLogoutDialog',
        icon: 'mdi-power',
        bottomDivider: true,
      },
      {
        subheader: 'Usefull Links',
        title: 'Competitors',
        icon: 'mdi-account-group',
        href: '/competitors',
      },
      {
        title: 'Questions bank',
        icon: 'mdi-frequently-asked-questions',
        href: '/questions-bank',
      },
      {
        title: 'Download center',
        icon: 'mdi-download',
        href: '/downloads',
        bottomDivider: true,
      },
      {
        subheader: 'Get Support',
        title: 'Find us',
        icon: 'mdi-map-marker',
        href: '/find-us',
      },
      {
        title: 'Changelog',
        icon: 'mdi-file-document-multiple-outline',
        href: '/changelog',
      },
      {
        title: 'Report a bug',
        icon: 'mdi-bug',
        href: '/report-a-bug',
        bottomDivider: true,
      },
      {
        subheader: 'About App',
        title: 'Meet the team',
        icon: 'mdi-heart-box-outline',
        href: '/meet-the-team',
      },
      {
        title: 'Sponsors and backers',
        icon: 'mdi-handshake',
        href: '/sponsors-and-backers',
      },
      {
        title: 'Getting started guide',
        icon: 'mdi-hand-pointing-up',
        href: '/getting-started-guide',
      },
    ],
    logoutDialog: {
      model: false,
    },
  }),
  computed: {
    user() {
      return this.$store.state.user
    },
    userData() {
      return this.$store.state.userData
    },
    isArabic() {
      return this.appLocale === 'ar'
    },
    isDark() {
      return this.$vuetify.theme.dark
    },
  },
  methods: {
    toggleSidenav() {
      const v = this.model
      this.$set(this, 'model', !v)
    },
    runFun(f) {
      if (this[f]) {
        this[f]()
      }
    },
    openLogoutDialog() {
      this.$set(this.logoutDialog, 'model', true)
    },
  },
}
</script>
