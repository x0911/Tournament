import Vue from 'vue'
import VueSocketIOExt from 'vue-socket.io-extended'
import * as io from 'socket.io-client'
const socket = io('https://tournament-socket-server.herokuapp.com', {
  withCredentials: true,
})
Vue.use(VueSocketIOExt, socket)
window.io = io
