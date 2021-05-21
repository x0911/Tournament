const allowedForUsersAndVisitors = [
  // Theses routes can be accessed by authenticated users and visitors
  '/questions-bank',
  '/find-us',
  '/changelog',
  '/report-a-bug',
  '/meet-the-teem',
  '/sponsors-and-backers',
]

export default async function (context) {
  await context.store
    .dispatch('getFirebaseReady')
    .then((x) => {
      console.log(x)
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      let { fullPath } = context.route
      fullPath = fullPath === '/ar' ? '/' : fullPath
      fullPath = fullPath.replace('/ar/', '/')
      if (context.store.state.user) {
        // We have a user
        if (
          (!context.store.state.userData ||
            !context.store.state.userData.fname ||
            !context.store.state.userData.lname ||
            !context.store.state.userData.gender) &&
          fullPath !== '/get-started/one-more-step' &&
          !allowedForUsersAndVisitors.includes(fullPath)
        ) {
          context.redirect('/get-started/one-more-step')
        }
        if (
          ['/'].includes(fullPath) ||
          (fullPath.includes('/get-started') &&
            (fullPath !== '/get-started/one-more-step' ||
              (fullPath === '/get-started/one-more-step' &&
                context.store.state.userData &&
                context.store.state.userData.fname &&
                context.store.state.userData.lname &&
                context.store.state.userData.gender)))
        ) {
          context.redirect('/app')
        }
      } else {
        // We Don't have a user
        if (fullPath === '/get-started') {
          context.redirect('/get-started/login')
        }
        if (
          fullPath.includes('/app') ||
          fullPath === '/get-started/one-more-step'
        ) {
          context.redirect('/get-started/login')
        }
      }
    })
}
