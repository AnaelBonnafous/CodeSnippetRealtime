import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import { auth } from "@/plugins/firebase";

let app;

auth.onAuthStateChanged(async () => {
  if (!app) {
    app = new Vue({
      render: h => h(App),
    }).$mount('#app')
  }
});
