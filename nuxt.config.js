import colors from 'vuetify/es5/util/colors'
import { getUsers, getTournaments } from './sitemap-functions'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Tournament',
    title: 'Your competition',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  layoutTransition: {
    name: 'slide-up',
    // mode: 'out-in',
  },

  pageTransition: {
    name: 'slide-down',
    // mode: 'in-out',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/scss',
    'sweetalert2/dist/sweetalert2.min.css',
    'vue-custom-scrollbar/dist/vueScrollbar.css',
    '@mdi/font/css/materialdesignicons.css', // TODO:: Remove on build
  ],

  loading: {
    color: '#1976d2',
    failedColor: '#ff5252',
    height: '8px',
    continuous: true,
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // '~plugins/vue-socket.js',
    '~plugins/vue-the-mask.js',
    '~plugins/vue-country-flag.js',
    // '~plugins/vue-typed.js',
    '~plugins/vue-moment.js',
    '~plugins/vc.js',
    // '~plugins/vue-kinesis.js',
    '~plugins/vue-browser-detect.js',
    '~plugins/vue-apexchart.js',
    '~plugins/vue-local-storage.js',
    '~plugins/vue-custom-scrollbar.js',
    '~plugins/vue-sweet-alert.js',
    '~plugins/mixins.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    [
      '@nuxtjs/eslint-module',
      {
        cache: false,
      },
    ],
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    // Proxy to fix cors policy
    // '@nuxtjs/proxy',
    // https://auth.nuxtjs.org/guide/setup
    '@nuxtjs/auth-next',
    // lazy-load transitions ( optimized for seach engines )
    [
      'nuxt-i18n',
      {
        vueI18nLoader: true,
        strategy: 'prefix_and_default',
        langDir: '~/locales/', // has no effect
        locales: [
          {
            code: 'en',
            name: 'English',
            iso: 'en-US',
            file: 'en.js',
            dir: 'auto',
          },
          {
            code: 'ar',
            name: 'Arabic',
            iso: 'ar-EG',
            file: 'ar.js',
            dir: 'auto',
          },
        ],
        defaultLocale: 'en',
        vueI18n: {
          fallbackLocale: 'en',
          silentTranslationWarn: true,
        },
      },
    ],
    // https://firebase.nuxtjs.org/guide/
    [
      '@nuxtjs/firebase',
      {
        onFirebaseHosting: true,
        lazy: true,
        config: {
          apiKey: 'AIzaSyAlDZfMdGKU58Y4zyFxhPzWgbPF7bUCbG0',
          authDomain: 'tournament-x911.firebaseapp.com',
          databaseURL: 'https://tournament-x911.firebaseio.com',
          projectId: 'tournament-x911',
          storageBucket: 'tournament-x911.appspot.com',
          messagingSenderId: '1022160993933',
          appId: '1:1022160993933:web:7c56d0ac632dd2b4',
        },
        services: {
          auth: {
            persistence: 'local', // default
            initialize: {
              onAuthStateChangedMutation: 'ON_AUTH_STATE_CHANGED_MUTATION',
              onAuthStateChangedAction: 'onAuthStateChangedAction',
              subscribeManually: false,
            },
            ssr: false, // default
            // emulatorPort: 9099,
            // emulatorHost: 'http://localhost',
          },
          firestore: true,
          functions: true,
          storage: true,
          // database: true,
          // messaging: true,
          // performance: true,
          // analytics: true,
          // remoteConfig: true,
        },
      },
    ],
    // Automatically generate or serve dynamic sitemap.xml
    '@nuxtjs/sitemap',
  ],

  sitemap: {
    hostname: 'https://trnmnts.web.app',
    i18n: true,
    changefreq: 'daily',
    priority: 1,
    gzip: false,
    exclude: ['/dashdosh', '/dashdosh/**'],
    routes: async () => {
      let routes = []
      const tournaments = await getTournaments()
      const users = await getUsers()
      routes = [...routes, ...tournaments, ...users]
      return routes
    },
  },

  eslint: {
    cache: false,
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
    workbox: {
      skipWaiting: true,
      // importScripts: ['/firebase-auth-sw.js'],
      // swURL: '/sw.js',
      // dev: process.env.NODE_ENV === 'development',
    },
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    lang: {
      // locales: { ar, en },
      current: 'en',
    },
    rtl: false,
    treeShake: true,
    customVariables: ['~/assets/variables.scss'],
    icons: {
      iconfont: 'mdiSvg', // mdi
    },
    theme: {
      options: {
        customProperties: true,
      },
      dark: false,
      themes: {
        light: {
          light: '#f7faff',
          'card-bg': '#FFFFFF',
          'success-front': '#00c9a7',
          'like-fb': '#2078f4',
          'love-fb': '#f33e58',
          'haha-fb': '#f7b125',
          'sad-fb': '#f7b125',
          'wow-fb': '#f7b125',
          'angry-fb': '#e9710f',
          'care-fb': '#f7b125',
        },
        dark: {
          // light: '#15202b',
          'card-bg': '#1E1E1E',
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.grey.lighten4,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          'success-front': '#06a88d',
          'like-fb': '#2078f4',
          'love-fb': '#f33e58',
          'haha-fb': '#f7b125',
          'sad-fb': '#f7b125',
          'wow-fb': '#f7b125',
          'angry-fb': '#e9710f',
          'care-fb': '#f7b125',
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    publicPath: '/nuxtfiles/',
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // config.module.rules.push({
      //   test: /\.(ttf|eot|svg|pdf|woff(2)?)(\?[a-z0-9=&.]+)?$/,
      //   loader: 'file-loader',
      // })
      config.module.rules.push({
        test: /\.pdf$/,
        loader: 'file-loader',
      })
      // Sets webpack's mode to development if `isDev` is true.
      if (ctx.isDev) {
        config.mode = 'development'
      }
      // config.module.rules.push({
      //   test: /\.scss$/,
      //   loader: 'sass-loader',
      // use: ['style-loader', 'css-loader', 'sass-loader'],
      // })
    },
  },

  serverMiddleware: [
    {
      path: '/nuxtfiles',
      handler: '~/servermiddleware/assets.js',
    },
  ],

  // server: {
  //   https: {
  //     key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
  //     cert: fs.readFileSync(path.resolve(__dirname, 'server.crt')),
  //   },
  // },

  // Router options
  router: {
    mode: 'history',
    middleware: [
      // 'auth',
      'router-auth',
    ],
  },
}
