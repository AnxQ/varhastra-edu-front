import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import snack from "./snack";
import { createApolloProvider } from "./plugins/vue-apollo";
import "@/main.scss";

Vue.config.productionTip = false;
Vue.prototype.snack = snack;
Vue.filter('f2', function(val: Number | string) {
  let v = Number(val)
  return v ? v.toFixed(2) : val;
})
new Vue({
  vuetify,
  router,
  store,
  apolloProvider: createApolloProvider(),
  render: h => h(App)
}).$mount("#app");
