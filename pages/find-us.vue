<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card tile flat>
          <v-card-text>
            <iframe
              v-if="true"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1221.0641234065606!2d31.262762401521094!3d30.045724805368124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840a2f3fd21f5%3A0x676752c74b1e52e8!2sAl-Azhar%20Mosque!5e0!3m2!1sen!2seg!4v1606761538403!5m2!1sen!2seg"
              width="100%"
              frameborder="0"
              style="border: 0; height: calc(100vh - 150px)"
              allowfullscreen="true"
              aria-hidden="false"
              tabindex="0"
            ></iframe>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-divider class="mt-6 mb-3"></v-divider>
      </v-col>
      <v-col cols="12" md="6" lg="5">
        <v-card tile flat :disabled="models.loader" :loading="models.loader">
          <v-form ref="feedbackFrom" v-model="models.form">
            <v-card-title class="mb-2 break-word">
              Have something to say?
            </v-card-title>
            <v-card-subtitle>
              We are here for you, Please fill the form and we will get-in touch
              with you
            </v-card-subtitle>
            <v-card-text class="pt-4">
              <v-text-field
                v-if="!$store.state.user || !$store.state.userData"
                v-model="models.fullname"
                label="Full name"
                class="mb-2"
                hint="Please use your real name, Fake names might be ignored"
                filled
                persistent-hint
                required
                :rules="rules.fullname"
              ></v-text-field>
              <v-text-field
                v-if="!$store.state.user || !$store.state.userData"
                v-model="models.email"
                label="Email address"
                hint="We will reach you on this address, Make sure to use an email you have access to"
                filled
                class="mb-2"
                type="email"
                persistent-hint
                required
                :rules="rules.email"
              ></v-text-field>
              <v-autocomplete
                v-model="models.category"
                filled
                class="mb-2"
                persistent-hint
                :items="categories"
                hint="What is your message about?"
                label="Category"
                return-object
                required
                :rules="rules.category"
              ></v-autocomplete>
              <v-textarea
                v-model="models.msg"
                persistent-hint
                filled
                hint="Briefly explain how can we help"
                class="mb-2"
                label="Message"
                auto-grow
                required
                :rules="rules.msg"
              ></v-textarea>
            </v-card-text>
            <v-card-actions class="px-4">
              <v-btn
                :disabled="!models.form"
                class="px-6"
                block
                color="primary"
                x-large
                @click="sendMsg()"
              >
                Send Message
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
      <v-col align-self="center" md="6" lg="7">
        <v-layout align-center align-content-center justify-center>
          <v-card
            tile
            flat
            :width="$vuetify.breakpoint.lgAndUp ? '80%' : '100%'"
          >
            <v-card-title> Need professional support? </v-card-title>
            <v-card-text>
              Hamdi Mohamed, the creator of Tournament App and other Core Team
              members are now offering Support Services for Universities and
              Schools. Utilize our in-demand services for guidance and advice on
              advanced implementations, best practices, and procedures.
            </v-card-text>
            <v-card-actions>
              <v-hover>
                <template #default="{ hover }">
                  <v-btn text color="primary">
                    Choose Appointment
                    <v-icon :class="{ 'ms-1': hover }">mdi-pan-right</v-icon>
                  </v-btn>
                </template>
              </v-hover>
            </v-card-actions>
          </v-card>
        </v-layout>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data: () => ({
    models: {
      form: false,
      loader: false,
    },
    rules: {
      fullname: [
        (v) =>
          (v && v.trim().length > 2) ||
          "We need to know your name, Don't be shy",
      ],
      email: [
        (v) =>
          (v && v.trim().length > 0) ||
          'Please write your email to get-in touch with you',
        (v) =>
          (v &&
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
              v
            )) ||
          'Please use a real email address',
      ],
      category: [(v) => (v && v !== null) || 'Please select a category'],
      msg: [
        (v) =>
          (v && v.trim().length > 0) || "Please don't leave your message empty",
      ],
    },
    categories: [
      {
        text: 'Have an idea',
        value: 'idea',
      },
      {
        text: "Can't login or register",
        value: 'login_register',
      },
      {
        text: 'Having a problem creating a collection',
        value: 'create_collection',
      },
      {
        text: 'Having a problem creating a tournament',
        value: 'create_tournament',
      },
      {
        text: 'My account is disabled',
        value: 'disabled_account',
      },
      {
        text: 'Get friends / Unfriend',
        value: 'friends',
      },
      {
        text: "Can't find a page",
        value: 'e404',
      },
      {
        text: 'Other',
        value: 'other',
      },
    ],
  }),
  methods: {
    emptyForm() {
      this.$set(this.models, 'fullname', null)
      this.$set(this.models, 'email', null)
      this.$set(this.models, 'category', null)
      this.$set(this.models, 'msg', null)
    },
    sendMsg() {
      const { fullname, email, category, msg } = this.models
      this.$set(this.models, 'loader', true)
      this.api({
        x: 'find-us/create',
        fullname,
        email,
        categorySlug: category.value,
        category: category.text,
        msg,
      })
        .then(() => {
          this.$swal({
            title: 'Thank You',
            text: 'We have recieved your message and will reach you soon. Thank you for making Tournament better.',
            icon: 'success',
          })
          this.$refs.feedbackFrom.reset()
        })
        .catch(() => {})
        .finally(() => {
          this.$set(this.models, 'loader', false)
        })
    },
  },
}
</script>
