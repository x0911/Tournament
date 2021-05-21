module.exports = {
  ucFirst($text) {
    const ucfirst = $text
      .replace('_', ' ')
      .toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
    return ucfirst
  },
  setLoading(state = true) {
    this.$nextTick(() => {
      if (state) {
        this.$nuxt.$loading.start()
        const intval = setInterval(() => {
          this.$nuxt.$loading.finish()
          clearInterval(intval)
        }, 5000)
      } else {
        const intval = setInterval(() => {
          this.$nuxt.$loading.finish()
          clearInterval(intval)
        }, 500)
      }
    })
  },
  pushRoute(r) {
    this.$nextTick(() => {
      this.$router.push(r)
    })
  },
  isEmail(v) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      v
    )
  },
  hasArabicText(v) {
    const arabicRange = /[\u0600-\u06FF]/
    return arabicRange.test(v)
  },
  changeTheme(v) {
    this.$set(this.$vuetify.theme, 'dark', v)
    this.$ls.set('tournament-dark-theme', v)
  },
  switchLang() {
    const lang = this.$i18n.locale === 'ar' ? 'en' : 'ar'
    const r = this.switchLocalePath(lang)
    window.location.href = r
  },
  changeLang(lang) {
    this.$router.push(this.switchLocalePath(lang))
  },
  setDefaults() {
    const lang = this.$i18n.locale
    const darkTheme = this.$ls.get('tournament-dark-theme', 'false')
    this.$set(this.$vuetify.lang, 'current', lang)
    this.$set(this.$vuetify, 'rtl', lang === 'ar')
    const intval = setInterval(() => {
      clearInterval(intval)
      this.$set(this.$vuetify.theme, 'dark', darkTheme === 'true')
    }, 1000)
  },
  randomCreditNumber() {
    // return a random valid credit number
    const num = '5 5 2 5   6 3 7 0   1 7 9 3   8 5 9 2'
    //   valid_num = "";
    // num.split("").forEach((n, i) => {
    //   valid_num += n + " ";
    //   if ((i + 1) % 4) {
    //     valid_num += "  ";
    //   }
    // });
    return num
  },
}
