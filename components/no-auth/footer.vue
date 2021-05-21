<template>
  <v-footer
    class="pt-7 pb-4 text-center"
    dark
    :absolute="false"
    :fixed="false"
    color="#1d2026"
  >
    <v-container>
      <v-row justify="center">
        <template v-for="(link, i) in links">
          <v-btn :key="i" class="ma-1" text rounded :to="localePath(link.href)">
            {{ link.title }}
          </v-btn>
        </template>
        <v-col cols="12" class="pt-6 ls-1">
          <span class="font-weight-thin">
            &copy;
            <!-- {{ new Date().getFullYear() }}  -->
            2019 -
          </span>
          Tournament App
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    links: [
      // {
      //   title: 'Home',
      //   href: '/',
      // },
      // {
      //   title: 'Competitors',
      //   href: '/competitors',
      // },
      {
        title: 'Questions bank',
        href: '/questions-bank',
      },
      // {
      //   title: 'Download center',
      //   href: '/downloads',
      // },
      {
        title: 'Find us',
        href: '/find-us',
      },
      {
        title: 'Changelog',
        href: '/changelog',
      },
      {
        title: 'Report a bug',
        href: '/bug-a-bug',
      },
      {
        title: 'Meet the team',
        href: '/team-the-team',
      },
      {
        title: 'Sponsors and backers',
        href: '/sponsors-and-backers',
      },
      {
        title: 'Getting started guide',
        href: '/getting-started-guide',
      },
    ],
  }),
}
</script>
