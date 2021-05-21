<template>
  <div>
    <v-alert type="info" border="left" colored-border elevation="2">
      <div class="info--text">Welcome to collections</div>
      <v-divider class="info"></v-divider>
      <div class="mt-2">Collections are the containers for your questions.</div>
      <div>
        A single tournament can have multiple collections inside. Also a
        collection can be used in more than one tournament.
      </div>
      <div>
        When you created a new account in Tournament app, We added 2 collections
        for you as samples.
      </div>
      <div>
        "Football" and "History" are your collections for now. Edit or delete
        them and start creating your own collections.
      </div>
      <div class="mt-4">
        <v-btn class="text-none" depressed>
          Don't show this again, I got it
        </v-btn>
      </div>
    </v-alert>
    <v-row>
      <v-col v-bind="cardAttrs.col">
        <v-card
          :loading="newCollection.loading"
          :disabled="newCollection.loading"
          min-height="165"
          height="100%"
          class="text-center"
          @click="addCollection()"
        >
          <v-layout
            fill-height
            align-center
            align-content-center
            justify-center
          >
            <div>
              <div>
                <v-icon size="55">mdi-plus</v-icon>
              </div>
              <div>
                <v-card-title class="d-block break-word">
                  Add Collection
                </v-card-title>
              </div>
            </div>
          </v-layout>
        </v-card>
      </v-col>
      <template v-for="(c, i) in collections.items">
        <v-col v-bind="cardAttrs.col" :key="i">
          <v-card
            min-height="165"
            class="fill-height"
            :to="c.owner ? `/app/collections/${c.owner.uid}-${c.id}` : null"
          >
            <v-card-actions class="px-4 pt-3 pb-0">
              <div>
                <div v-if="c.sharedTag && c.sharedTag.length > 0">
                  <template v-for="(tag, ii) in c.sharedTag">
                    <v-chip :key="ii" small>
                      {{ tag.name }}
                    </v-chip>
                  </template>
                </div>
                <div v-else>
                  <v-chip disabled small>
                    <i>-- Uncategorized --</i>
                  </v-chip>
                </div>
              </div>
              <v-spacer></v-spacer>
              <div>
                <v-chip class="ps-0" small color="#ffd700">
                  <v-icon class="me-2">mdi-progress-question</v-icon>
                  {{ c.questions_count }}
                </v-chip>
              </div>
            </v-card-actions>
            <v-card-title class="break-word">
              <div v-if="c.title">
                {{ c.title | sliceFilter(25) }}
              </div>
              <div v-else>
                <i>-- no title --</i>
              </div>
            </v-card-title>
            <v-card-subtitle>
              <div v-if="c.description">
                {{ c.description | sliceFilter(70) }}
              </div>
              <div v-else>
                <i>-- no description --</i>
              </div>
            </v-card-subtitle>
            <v-card-actions>
              <v-chip color="transparent" label small>
                {{ c.owner.fname + ' ' + c.owner.lname }}
              </v-chip>
              <v-spacer></v-spacer>
              <v-chip v-if="c.created_at" color="transparent" label small>
                {{ c.created_at | moment('from', 'now') }}
              </v-chip>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
      <template v-if="collections.loading">
        <v-col
          v-for="n in skeletonCounter"
          :key="`${n}_skeleton`"
          v-bind="cardAttrs.col"
        >
          <v-skeleton-loader
            elevation="2"
            type="card-heading, list-item-two-line"
            height="100%"
            min-height="165"
          ></v-skeleton-loader>
        </v-col>
      </template>
    </v-row>
  </div>
</template>

<script>
export default {
  filters: {
    sliceFilter(str = '', counter = 10) {
      return `${str.slice(0, counter)}${str.length > counter ? '...' : ''}`
    },
  },
  layout: 'auth',
  data: () => ({
    cardAttrs: {
      col: {
        cols: '12',
        md: '6',
        lg: '4',
        xl: '3',
      },
    },
    newCollection: {
      loading: false,
    },
    collections: {
      loading: false,
      offset: 0,
      limit: 8,
      items: [],
      counter: 0,
    },
  }),
  computed: {
    skeletonCounter() {
      const collectionsCounter = this.collections.counter
      const itemsLength = this.collections.items.length
      const counter = Number(collectionsCounter - itemsLength)
      return counter
    },
  },
  mounted() {
    this.getCollections()
  },
  methods: {
    getCollections() {
      this.$set(this.collections, 'items', [])
      this.$set(this.collections, 'loading', true)
      const { offset, limit } = this.collections
      this.api({
        x: 'collection/getall',
        offset,
        limit,
      })
        .then(async (collections) => {
          // Appear Collections in a Smooth Way
          this.$set(this.collections, 'counter', collections.length)
          const pushCollection = (c) => {
            return new Promise((resolve, reject) => {
              const intval = setInterval(() => {
                this.$set(
                  this.collections.items,
                  this.collections.items.length,
                  c
                )
                clearInterval(intval)
                resolve(true)
              }, 100)
            })
          }
          const asyncedLoop = async () => {
            for (let i = 0; i < collections.length; i++) {
              const c = collections[i]
              await pushCollection(c)
            }
          }
          await asyncedLoop()
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.$set(this.collections, 'loading', false)
        })
    },
    addCollection() {
      this.$set(this.newCollection, 'loading', true)
      const { uid } = this.$store.state.user
      this.api({
        x: 'collection/add',
      })
        .then((id) => {
          this.$router.push(`/app/collections/${uid}-${id}`)
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.$set(this.newCollection, 'loading', false)
        })
    },
  },
}
</script>
