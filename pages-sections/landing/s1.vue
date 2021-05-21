<template>
  <div>
    <div id="recaptcha-container"></div>
    <v-sheet
      :height="$vuetify.breakpoint.mdAndUp ? '100vh' : 'auto'"
      min-height="100vh"
      style="position: relative"
      color="indigo darken-4"
      class="py-16"
    >
      <v-layout
        fill-height
        class="px-4 px-md-0"
        justify-space-around
        :column="$vuetify.breakpoint.smAndDown"
        align-center
        align-content-center
      >
        <v-card
          :class="`${$vuetify.breakpoint.smAndDown ? 'mb-6 text-center' : ''}`"
          tile
          flat
          :width="cardsW[0]"
          color="transparent"
          dark
        >
          <v-card-title
            class="
              break-word
              d-block
              text-h2
              white--text
              font-weight-bold
              line-height-4
            "
          >
            Welcome to our group tournaments app
          </v-card-title>
          <v-card-text
            class="
              pt-4
              text-h5
              font-weight-light
              grey--text
              text--lighten-2
              line-height-x2
            "
          >
            We make it easy to chalenge your friends in question games – with an
            intuitive control panel, several options, co-op teams and more.
          </v-card-text>
          <v-card-text>
            <div class="ls-1">
              <span class="ls-0">____</span>
              <v-btn
                class="text-none"
                text
                target="_blank"
                href="https://www.facebook.com/groups/Azharya.home/"
              >
                Visit us on Facebook
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
        <v-sheet :width="cardsW[1]" color="transparent" tile flat>
          <v-card class="rounded-lg px-4 pb-4" :disabled="loading">
            <v-card-text>
              <v-tabs-items v-model="step" class="pt-4">
                <v-tab-item>
                  <div class="font-weight-medium mb-2">Where are you from?</div>
                  <v-autocomplete
                    v-model="values.countryCode"
                    outlined
                    :items="countryCodes"
                    item-text="name"
                    placeholder="Write to filter"
                    return-object
                  >
                    <template
                      v-if="values.countryCode && values.countryCode.iso"
                      #prepend-inner
                    >
                      <country-flag
                        :country="values.countryCode.iso"
                      ></country-flag>
                    </template>
                  </v-autocomplete>
                  <div class="font-weight-medium mb-2">Your phone number</div>
                  <v-text-field
                    v-model="values.phoneNumber"
                    label=""
                    outlined
                    hint="We'll send you a verification code"
                    persistent-hint
                    type="tel"
                    @keypress.enter="sendCode()"
                  >
                    <template #prepend-inner>
                      <v-row
                        v-if="values.countryCode && values.countryCode.code"
                        style="margin-top: 0px"
                        dense
                      >
                        <v-col> +{{ values.countryCode.code }} </v-col>
                        <v-col cols="auto">
                          <v-divider vertical></v-divider>
                        </v-col>
                      </v-row>
                    </template>
                  </v-text-field>
                </v-tab-item>
                <v-tab-item>
                  <div class="font-weight-medium mb-2">Verification code</div>
                  <v-text-field
                    v-model="values.code"
                    label=""
                    outlined
                    hint="Enter the code we just sent to you"
                    persistent-hint
                    type="number"
                    prepend-inner-icon="mdi-lock-outline"
                    @keypress.enter="verifyCode()"
                  >
                  </v-text-field>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
            <v-card-actions class="px-4">
              <v-hover>
                <template #default="{ hover }">
                  <v-btn
                    x-large
                    color="primary--text"
                    block
                    class="px-6 raised"
                    :disabled="
                      (step === 0 &&
                        (!values.phoneNumber ||
                          !values.countryCode ||
                          !values.countryCode.iso ||
                          !isValidPhoneNumber)) ||
                      (step === 1 &&
                        (!values.phoneNumber ||
                          !values.countryCode ||
                          !values.countryCode.iso ||
                          !values.code ||
                          !values.codeToken ||
                          !isValidPhoneNumber))
                    "
                    @click="step === 0 ? sendCode() : verifyCode()"
                  >
                    {{ step === 0 ? 'Send Code' : 'Verify Code' }}
                    <v-icon :class="`ms-${hover ? '4' : '2'}`">
                      mdi-rotate-180 mdi-keyboard-backspace
                    </v-icon>
                  </v-btn>
                </template>
              </v-hover>
            </v-card-actions>
            <v-card-text v-if="step == 1" class="pb-0 pt-6">
              <v-alert
                color="warning"
                border="left"
                colored-border
                class="lh-2"
              >
                If you didn't recieve any codes, we can
                <v-btn text color="primary" small class="fs-4">
                  Resend Code
                </v-btn>
                to you after
                <span class="primary--text"> {{ 12 }}s </span>
              </v-alert>
            </v-card-text>
            <v-layout
              v-if="loading"
              fill-height
              style="
                position: absolute;
                z-index: 1;
                top: 0;
                left: 0;
                width: 100%;
              "
              align-center
              justify-center
              align-content-center
            >
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-layout>
          </v-card>
          <v-card color="transparent" flat tile dark>
            <v-card-text class="text-center text-caption">
              <div>
                By signing in, I agree to the
                <router-link
                  class="white--text"
                  :to="localePath('/terms-of-service')"
                >
                  Terms of Service
                </router-link>
                and
                <router-link
                  class="white--text"
                  :to="localePath('/privacy-policy')"
                >
                  Privacy Policy
                </router-link>
                . Tournament is protected by Google reCAPTCHA and their
                <a
                  class="white--text"
                  href="https://policies.google.com/privacy"
                  target="_blank"
                >
                  Privacy Policy
                </a>
                and
                <a
                  class="white--text"
                  href="https://policies.google.com/terms"
                  target="_blank"
                >
                  Terms of Service
                </a>
                apply.
              </div>
            </v-card-text>
          </v-card>
        </v-sheet>
      </v-layout>
    </v-sheet>
  </div>
</template>

<script>
import countryCodes from '@/assets/data/country-codes.js'
import parsePhoneNumberFromString from 'libphonenumber-js'
export default {
  components: {},
  data: () => ({
    step: 0,
    loading: false,
    values: {
      countryCode: null,
      phoneNumber: '',
      code: '',
      codeToken: '',
    },
    countryCodes,
  }),
  computed: {
    isValidPhoneNumber() {
      const { countryCode, phoneNumber } = this.values
      const parsedPhoneNumber = parsePhoneNumberFromString(
        phoneNumber,
        countryCode && countryCode.iso ? countryCode.iso : ''
      )
      const isValid = parsedPhoneNumber && parsedPhoneNumber.isValid()
      return isValid === true
    },
    cardsW() {
      const widths = {
        xs: {
          c1: '500',
          c2: '400',
          ok: this.$vuetify.breakpoint.xs,
        },
        sm: {
          c1: '650',
          c2: '400',
          ok: this.$vuetify.breakpoint.smAndUp,
        },
        md: {
          c1: '550',
          c2: '350',
          ok: this.$vuetify.breakpoint.mdAndUp,
        },
        lg: {
          c1: '650',
          c2: '400',
          ok: this.$vuetify.breakpoint.lgAndUp,
        },
        xl: {
          c1: '650',
          c2: '400',
          ok: this.$vuetify.breakpoint.xl,
        },
      }
      let currentW = []
      Object.keys(widths).forEach((key) => {
        const v = widths[key]
        if (v && v.ok && v.ok === true) {
          currentW = [v.c1, v.c2]
        }
      })
      return currentW
    },
  },
  watch: {},
  mounted() {
    this.getUserCountryISO()
    this.setGoogleRecaptcha()
  },
  methods: {
    setGoogleRecaptcha() {
      const that = this
      window.recaptchaVerifier = null
      const intval = setInterval(() => {
        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier =
            new this.$fireModule.auth.RecaptchaVerifier('recaptcha-container', {
              size: 'invisible',
              callback: (response) => {
                return true
              },
              'expired-callback': () => {
                // Response expired.
                console.log('recaptcha expired')
                window.recaptchaVerifier = null
                const intval2 = setInterval(() => {
                  that.setGoogleRecaptcha()
                  clearInterval(intval2)
                }, 500)
                return true
              },
            })
          window.recaptchaVerifier.render().then((widgetId) => {
            window.recaptchaWidgetId = widgetId
          })
          clearInterval(intval)
        }
      }, 500)
    },
    async getUserCountryISO() {
      const iso = await this.getCountryCode()
      const countryCode = countryCodes.find((c) => c.iso === iso)
      if (!this.values.countryCode && countryCode) {
        this.$set(this.values, 'countryCode', countryCode)
      }
    },
    async sendCode() {
      this.$set(this, 'loading', true)
      const { countryCode, phoneNumber } = this.values
      const parsedPhoneNumber = parsePhoneNumberFromString(
        phoneNumber,
        countryCode.iso
      )
      if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
        this.$swal({
          title: 'Code NOT sent',
          text: 'Phone number is not correct. Please use a phone number available in the selected country and try again.',
          icon: 'error',
        })
        this.$set(this, 'loading', false)
        return
      }
      const sendFirebaseCode = await this.$store.dispatch(
        'sendVerificationCode',
        `${parsedPhoneNumber.number}`
      )
      if (sendFirebaseCode.ok) {
        // Continue
        const codeToken = this.firestoreDocId()
        this.$set(this.values, 'codeToken', codeToken)
        const { ip } = await this.getIP2()
        const {
          bot: isBot,
          client: { name: browser },
          device: { type: device, brand, model },
          os: { name: os, platform },
        } = await this.getDevice2()
        const apiObj = {
          x: `user/code-sent`,
          phoneNumber: parsedPhoneNumber.number,
          codeToken,
          isBot,
          device,
          brand,
          model,
          browser,
          os,
          platform,
          ip,
        }
        this.api(apiObj)
          .then((x) => {
            console.log(x)
            this.$set(this, 'step', 1)
          })
          .catch((error) => {
            console.log(error)
          })
          .finally(() => {
            this.$set(this, 'loading', false)
          })
      } else {
        // error has been occured
        this.$set(this, 'loading', false)
        console.log(sendFirebaseCode.error)
      }
    },
    async verifyCode() {
      this.$set(this, 'loading', true)
      const { phoneNumber, countryCode, code, codeToken } = this.values
      const parsedPhoneNumber = parsePhoneNumberFromString(
        phoneNumber,
        countryCode.iso
      )
      if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
        this.$swal({
          title: 'Something went wrong',
          text: 'There is a change in your phone number happened, Please try again',
          icon: 'error',
        })
        this.$set(this, 'loading', false)
        return
      }
      // Verify Code
      const verifyFirebaseCode = await this.$store.dispatch('verifyCode', code)
      if (verifyFirebaseCode.ok) {
        this.api({
          x: `user/code-verified`,
          phoneNumber: parsedPhoneNumber.number,
          codeToken,
          uid: verifyFirebaseCode.uid,
          refreshToken: verifyFirebaseCode.refreshToken,
        })
          .then(async (x) => {
            await this.$store.dispatch('setUserData')
            const intval = setInterval(() => {
              clearInterval(intval)
              this.$router.push(this.localePath('/app'))
            }, 500)
          })
          .catch((error) => {
            console.log(error)
            this.logout()
          })
      } else {
        // error has been occured
        this.$set(this, 'loading', false)
        console.log(verifyFirebaseCode.error)
      }
    },
  },
}
</script>

<style lang="scss">
#recaptcha-container {
  .grecaptcha-badge {
    // display: none !important;
  }
}
</style>
