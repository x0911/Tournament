export const state = () => ({
  // sidenav: {
  //   getUserProfiles: false,
  // },
})

export const mutations = {
  // 'sidenav.getUserProfiles': (state, v) => {
  //   state.sidenav.getUserProfiles = v
  // },
}

export const actions = {
  toggle: ({ commit }, path) => {
    commit(path, true)
    const intval = setInterval(() => {
      commit(path, false)
      clearInterval(intval)
    }, 500)
  },
}
