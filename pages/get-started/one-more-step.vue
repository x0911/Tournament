<template>
  <v-layout align-center justify-center align-content-center fill-height>
    <v-container>
      <v-row>
        <v-col cols="12" md="6" lg="7">
          <v-img
            :src="
              require('@/assets/media/storyset/animated/Customer-Servey.svg')
            "
          ></v-img>
        </v-col>
        <v-col cols="12" md="6" lg="5" align-self="center">
          <v-card
            flat
            tile
            class="py-4 px-4"
            :disabled="loading"
            :loading="loading"
          >
            <v-card-title> You are almost there! </v-card-title>
            <v-card-subtitle>
              Just one more step to get you started
            </v-card-subtitle>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <div class="font-weight-medium mb-2 secondary--text">
                    Your name
                  </div>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="values.fname"
                        outlined
                        label="First"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="values.lname"
                        outlined
                        label="Last"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <div class="font-weight-medium mb-2 secondary--text">
                    Gender
                  </div>
                  <div>
                    <v-btn-toggle
                      v-model="values.gender"
                      class="w-100"
                      mandatory
                    >
                      <v-btn
                        value="male"
                        large
                        outlined
                        class="font-weight-medium w-50"
                        active-class="primary--text"
                      >
                        Male
                      </v-btn>
                      <v-btn
                        value="female"
                        large
                        outlined
                        class="font-weight-medium w-50"
                        active-class="pink--text"
                      >
                        Female
                      </v-btn>
                    </v-btn-toggle>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="px-4 pt-8">
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!values.fname || !values.lname || !values.gender"
                x-large
                class="raised px-6"
                color="primary--text"
                @click="getStarted()"
              >
                Get Started
                <v-icon class="ms-2 rtl-flip">
                  mdi-rotate-180 mdi-keyboard-backspace
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
export default {
  layout: 'one-more-step',
  data: () => ({
    values: {
      fname: '',
      lname: '',
      gender: '',
    },
    loading: false,
  }),
  mounted() {
    // this.logout()
  },
  methods: {
    getStarted() {
      const values = this.values
      const fname = values.fname.trim()
      const lname = values.lname.trim()
      const gender = values.gender.trim()
      this.$set(this, 'loading', true)
      if (!fname || !lname || !gender) {
        this.$swal({
          title: 'Incomplete form',
          text: 'Please complete all required fields and try again',
          icon: 'error',
        })
        return
      }
      this.api({
        x: 'user/one-more-step',
        fname,
        lname,
        gender,
      })
        .then(async () => {
          await this.$store.dispatch('setUserData')
          const intval = setInterval(() => {
            clearInterval(intval)
            this.$router.push(this.localePath('/app'))
          }, 500)
        })
        .catch(() => {
          //
        })
        .finally(() => {
          this.$set(this, 'loading', false)
        })
    },
  },
}
</script>
