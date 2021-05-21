<template>
  <v-hover>
    <template #default="{ hover }">
      <v-btn
        v-bind="$props"
        :class="hoverClass ? hoverClass : ''"
        :elevation="hover ? '6' : '0'"
        :style="style(canTransform ? hover : false)"
        v-on="on"
        @click="btnClick"
      >
        <slot></slot>
      </v-btn>
    </template>
  </v-hover>
</template>

<script>
export default {
  name: 'VcBtn',
  props: {
    on: {
      type: Object,
      default: () => {},
    },
    activeClass: {
      type: String || null || undefined,
      default: undefined,
    },
    hoverClass: {
      type: String || null || undefined,
      default: undefined,
    },
    btnClick: {
      type: Function,
      default: () => {},
    },
    to: {
      type: String || null,
      default: null,
    },
    canTransform: {
      type: Boolean,
      default: true,
    },
    large: Boolean,
    xLarge: Boolean,
    small: Boolean,
    xSmall: Boolean,
    block: Boolean,
    depressed: Boolean,
    fab: Boolean,
    icon: Boolean,
    loading: Boolean,
    disabled: Boolean,
    outlined: Boolean,
    plain: Boolean,
    retainFocusOnClick: Boolean,
    rounded: Boolean,
    tag: {
      type: String,
      default: 'button',
    },
    text: Boolean,
    tile: Boolean,
    color: {
      type: String,
      default: '',
    },
    backgroundColor: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'button',
    },
    value: {
      type: String || null || undefined,
      default: null,
    },
  },
  data: () => ({}),
  computed: {
    style() {
      return (hover) => {
        const { color } = this
        const styles = []
        // Global Styles
        if (this.disabled) {
          return ''
        }
        if (hover) {
          // Styles on hover
          styles.push('transform: translateY(-3px)')
        } else {
          // Styles on normal mode
          styles.push(
            `background-color: rgba( var(--v-${color}-rgb), 0.1) !important;`
          )
          styles.push(`color: var(--v-${color}-base) !important`)
        }
        return styles.join(' ; ')
      }
    },
  },
}
</script>
