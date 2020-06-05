import Vue from "vue";
import Vuex from "vuex";
import GlobalStateStore from "@/stores/GlobalState";
import GroupStateStore from "@/stores/GroupStore"
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    global: GlobalStateStore,
    group: GroupStateStore
  }
});
