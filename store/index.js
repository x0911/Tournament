import { api } from '@/mixins/Tournament.js'

function MakeQuerablePromise(promise) {
  if (promise.isResolved) return promise
  let isPending = true
  let isRejected = false
  let isFulfilled = false
  const result = promise.then(
    function (v) {
      isFulfilled = true
      isPending = false
      return v
    },
    function (e) {
      isRejected = true
      isPending = false
      throw e
    }
  )
  result.isFulfilled = function () {
    return isFulfilled
  }
  result.isPending = function () {
    return isPending
  }
  result.isRejected = function () {
    return isRejected
  }
  return result
}

export const state = () => ({
  firebaseReady: false,
  user: null,
  userData: null,
  login: {
    mask: {
      phoneNumber: '+20 ### ### ## ##',
      code: '# # # # # #',
    },
  },
  methodsForEmail: {
    methods: [],
    email: '',
    model: false,
  },
})

export const mutations = {
  ON_REQUEST_USER_DATA: (state, data) => {
    state.userData = data
  },
  ON_LOGOUT: (state) => {
    state.user = null
    state.userData = null
  },
  SET_OFFLINE_USER: (state) => {
    const stringified = localStorage.getItem('tournament-user')
    if (stringified) {
      const parsed = JSON.parse(stringified)
      state.user = parsed
    }
  },
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    if (!authUser) {
      // claims = null
      // perform logout operations
      state.user = null
    } else {
      // Do something with the authUser and the claims object...
      const { uid, displayName, photoURL, refreshToken } = authUser
      state.user = {
        uid,
        displayName,
        photoURL,
        refreshToken,
      }
      const stringified = JSON.stringify(state.user)
      localStorage.setItem('tournament-user', stringified)
    }
  },
  ON_GET_FIREBASE_READY(state) {
    state.firebaseReady = true
  },
}

export const actions = {
  subscribeFirebaseAuth(ctx) {
    const t = MakeQuerablePromise(this.$fireAuthStore.subscribe())
    let i = 0
    const maxSeconds = 2
    return new Promise((resolve, reject) => {
      const intval = setInterval(() => {
        const isPending = t.isPending()
        i++
        if (i > maxSeconds || !isPending) {
          clearInterval(intval)
          if (i > maxSeconds) {
            ctx.commit('SET_OFFLINE_USER')
          }
          resolve(true)
        }
      }, 1000)
    })
  },
  getFirebaseReady({ commit, state, dispatch, rootState }) {
    return new Promise((resolve, reject) => {
      if (!state.firebaseReady) {
        this.$fire.authReady().finally(async () => {
          await this.$fire.firestoreReady()
          this.$fireModule.firestore().settings({
            cacheSizeBytes: this.$fire.firestore.CACHE_SIZE_UNLIMITED,
          })
          await this.$fireModule
            .firestore()
            .enablePersistence({ synchronizeTabs: true })
          await this.$fire.storageReady()
          await this.$fire.functionsReady()
          await dispatch('subscribeFirebaseAuth')
          await dispatch('setUserData')
          commit('ON_GET_FIREBASE_READY')
          resolve(true)
        })
      } else {
        resolve(true)
      }
    })
  },
  onAuthStateChangedAction: (ctx, { authUser, claims }) => {
    // console.log(authUser)
    if (!authUser) {
      // claims = null
      // Perform logout operations
    } else {
      // Do something with the authUser and the claims object...
    }
  },
  setUserData({ commit, dispatch, state, rootState }) {
    const uid = state.user?.uid
    return new Promise((resolve, reject) => {
      if (uid) {
        api(
          {
            x: 'user/get-user-data',
          },
          state.user
        )
          .then((data) => {
            console.log(data)
            if (!data || !data.uid || !data.refreshToken) {
              dispatch('logout')
            } else {
              commit('ON_REQUEST_USER_DATA', data)
            }
            resolve(true)
          })
          .catch(() => {
            dispatch('logout')
            resolve(true)
          })
      } else {
        resolve(true)
      }
    })
  },
  logout({ commit, state, rootState }) {
    commit('ON_LOGOUT')
    return new Promise((resolve, reject) => {
      return this.$fire.auth
        .signOut()
        .then(() => {
          resolve(true)
        })
        .catch((error) => {
          console.log(error)
          resolve(false)
        })
    })
  },
  sendVerificationCode({ commit, state, rootState }, phoneNumber) {
    // let $that = this;
    return new Promise((resolve, reject) => {
      return this.$fire.auth
        .signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
        .then(function (confirmationResult) {
          // SMS sent.
          window.confirmationResult = confirmationResult
          resolve({ ok: true })
        })
        .catch(function (error) {
          console.log(error)
          resolve({ ok: false, error })
        })
    })
  },
  verifyCode({ commit, state, rootState }, code) {
    return new Promise((resolve, reject) => {
      if (window.confirmationResult) {
        return window.confirmationResult
          .confirm(code)
          .then(function (result) {
            // User signed in successfully.
            resolve({
              ok: true,
              uid: result.user.uid,
              refreshToken: result.user.refreshToken,
            })
          })
          .catch(function (error) {
            // User couldn't sign in (bad verification code?)
            console.log(error)
            resolve({ ok: false, error })
          })
      } else {
        resolve({ ok: false, error: 'no-confirmation-result' })
      }
    })
  },
}

export const getters = {
  //
}
