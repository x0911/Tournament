<template>
  <ul class="vc-tabs mb-6" role="tablist">
    <template v-for="(tab, i) in tabs">
      <li :key="i" class="vc-tab" @click="setValue(i)">
        <a
          :class="`user-select-none vc-tab-link ${value == i ? 'active' : ''}`"
          data-toggle="tab"
          role="tab"
          :aria-selected="value == i"
        >
          {{ tab }}
        </a>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  name: 'VcTabs',
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({}),
  methods: {
    setValue(v) {
      this.$emit('input', v)
    },
  },
}
</script>
