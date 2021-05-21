<template>
  <div>
    <s1></s1>
    <s2></s2>
  </div>
</template>

<script>
export default {
  components: {
    S1: () => import('@/pages-sections/landing/s1.vue'),
    S2: () => import('@/pages-sections/landing/s2.vue'),
  },
  layout: 'landing',
}
</script>
