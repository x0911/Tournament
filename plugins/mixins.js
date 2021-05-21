import Vue from 'vue'

if (!Vue.__tournament_mixin__) {
  Vue.__tournament_mixin__ = true
  const mixins = require('@/mixins')
  Vue.mixin(mixins)
}
