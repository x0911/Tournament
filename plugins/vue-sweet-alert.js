import Vue from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'

const options = {
  confirmButtonColor: '#1976d2',
  cancelButtonColor: '#ff5252',
  confirmButtonText: 'Alright',
  cancelButtonText: 'Cancel',
}

Vue.use(VueSweetalert2, options)
