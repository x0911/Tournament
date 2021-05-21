<template>
  <div>
    <v-row>
      <v-col cols="12" lg="8">
        <v-card v-if="edits_opened.includes('main')" tile flat>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-btn
              class="text-none"
              depressed
              @click="edits_opened.splice(edits_opened.indexOf('main'), 1)"
            >
              Done
              <v-icon class="ms-3" small>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="c.title"
                  label="Title"
                  hint="Name your collection."
                  persistent-hint
                  filled
                  :error-messages="
                    c.title && c.title.trim().length > 50
                      ? 'Title should not be more than 50 characters length'
                      : ''
                  "
                  counter="50"
                  @keydown="saveCollection()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  ref="privacy_menu"
                  v-model="c.privacy"
                  label="Privacy"
                  hint="Who can see and suggest editions to your collection?"
                  persistent-hint
                  :items="privacies"
                  filled
                  @change="saveCollection()"
                >
                  <template #item="{ item }">
                    <v-list-item-avatar class="align-self-start">
                      <v-icon v-text="item.icon"></v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                      <v-list-item-subtitle
                        v-text="item.desc"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-textarea
                  v-model="c.description"
                  label="Description"
                  hint="What is your collection about? ( Optional )"
                  filled
                  counter="250"
                  :error-messages="
                    c.description && c.description.trim().length > 250
                      ? 'Description should not be more than 250 characters length'
                      : ''
                  "
                  rows="4"
                  persistent-hint
                  @keydown="saveCollection()"
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-combobox
                  v-model="c.tags"
                  :items="tags"
                  filled
                  label="Catergories"
                  multiple
                  chips
                  counter="3"
                  :error-messages="
                    c.tags && c.tags.length > 3
                      ? 'Maximum available categories for each collection is 3 categories.'
                      : ''
                  "
                  persistent-hint
                  hint="All categories shown above were not added by the admins of Tournament app, They were added by users. You can add up to 3 categories for a single collection. Categories help others find your collection easily."
                  @change="saveCollection()"
                ></v-combobox>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card v-else>
          <v-card-title>
            <span v-if="c.title" v-text="c.title"></span>
            <span v-else>
              <i> -- no title -- </i>
            </span>
            <v-spacer></v-spacer>
            <v-btn icon @click="edits_opened.push('main')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-subtitle>
            <span v-if="c.description" v-text="c.description"></span>
            <span v-else>
              <i> -- no description -- </i>
            </span>
          </v-card-subtitle>
          <v-card-actions class="px-4 pt-0 pb-4">
            <v-chip
              v-if="c.privacy && privacies.find((p) => p.value == c.privacy)"
              outlined
              small
            >
              <v-icon class="me-3" small>
                {{ privacies.find((p) => p.value == c.privacy).icon }}
              </v-icon>
              {{ privacies.find((p) => p.value == c.privacy).text }}
            </v-chip>
            <v-chip v-else small outlined>
              <i> -- no privacy -- </i>
            </v-chip>
            <v-spacer></v-spacer>
            <div v-if="c.tags && c.tags.length > 0">
              <template v-for="(tag, i) in c.tags">
                <v-chip :key="i">
                  {{ tag }}
                </v-chip>
              </template>
            </div>
            <div v-else>
              <v-chip>
                <i> -- unknown category -- </i>
              </v-chip>
            </div>
          </v-card-actions>
        </v-card>
        <v-card class="mt-8" height="200vh"></v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-navigation-drawer
          width="100%"
          style="max-height: 80vh; position: sticky"
          right
        >
          <vue-custom-scrollbar
            style="height: 100%"
            :settings="$store.state.options.scrollbar_settings"
          >
            <v-card-title> Questions ( 7 ) </v-card-title>
            <v-divider></v-divider>
            <v-card>
              <v-card-text class="pa-0">
                <v-list dense>
                  <v-list-item-group>
                    <template v-for="n in 15">
                      <v-list-item :key="n">
                        <v-list-item-icon class="me-2">
                          {{ n }}
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>
                            Dolor cupidatat reprehenderit enim Lorem.
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            Ut do et
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-list-item-group>
                </v-list>
              </v-card-text>
            </v-card>
          </vue-custom-scrollbar>
        </v-navigation-drawer>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="saving.model"
      :color="saving.error ? 'error' : ''"
      :timeout="20000"
    >
      {{
        saving.error
          ? 'There was en error saving your changes.'
          : 'Saving, Please wait...'
      }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  async asyncData(context) {
    const cid = await context.params.cid
    return {
      cid,
    }
  },
  data: () => ({
    edits_opened: ['main'],
    tags: [],
    c: {},
    timer: null,
    saving: {
      model: false,
      error: false,
    },
    privacies: [
      {
        text: 'Only me',
        icon: 'mdi-account-lock',
        desc: 'No one will see your collection. But you still can use it in tournaments.',
        value: 'only_me',
      },
      {
        text: 'Friends',
        icon: 'mdi-account-group',
        desc: 'Allow your friends to see, suggest editions and take a copy of your collection.',
        value: 'friends',
      },
      {
        text: 'Anyone',
        icon: 'mdi-earth',
        desc: 'Share this collection with the public. This will let anyone take a copy of your collection to their account and use it in their tournaments.',
        value: 'anyone',
      },
    ],
  }),
  computed: {},
  watch: {
    edits_opened(v) {
      if (v && v.includes('main')) {
        const intVal = setInterval(() => {
          this.fixPrivacyMenuWidth()
          clearInterval(intVal)
        }, 10)
      }
    },
  },
  mounted() {
    this.getCollection()
    this.getTags()
    this.fixPrivacyMenuWidth()
  },
  methods: {
    fixPrivacyMenuWidth() {
      this.$refs.privacy_menu.activateMenu()
      const intVal = setInterval(() => {
        this.$refs.privacy_menu.$refs.menu.$children[0].$el.style.maxWidth =
          '400px'
        const items =
          this.$refs.privacy_menu.$refs.menu.$children[0].$el.getElementsByClassName(
            'v-list-item__subtitle'
          )
        for (let i = 0; i < items.length; i++) {
          items[i].style.whiteSpace = 'initial'
        }
        this.$refs.privacy_menu.blur()
        clearInterval(intVal)
      }, 10)
    },
    getTags() {
      this.api({
        x: 'tag/getall',
      })
        .then((tags) => {
          // console.log(tags);
          this.$set(
            this,
            'tags',
            tags.map((t) => t.name)
          )
        })
        .catch((error) => {
          console.log(error)
        })
    },
    saveCollection() {
      if (!this.saving.model || this.saving.error) {
        this.$set(this.saving, 'model', true)
        this.$set(this.saving, 'error', false)
      }
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.savedb()
          clearTimeout(this.timer)
          this.timer = null
        }, 5000)
      }
    },
    savedb() {
      const c = this.c
      this.api({
        x: 'collection/save',
        ...c,
      })
        .then((collection) => {
          console.log('Saved')
          // console.log(collection);
          this.$set(this.saving, 'model', false)
        })
        .catch((error) => {
          console.log(error)
          this.$set(this.saving, 'error', true)
        })
    },
    getCollection() {
      this.api({
        x: 'collection/get',
        id: this.cid,
      })
        .then((collection) => {
          // console.log(collection);
          this.$set(this, 'c', collection)
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>
