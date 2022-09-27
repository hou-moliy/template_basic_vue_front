import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import modules from "./modules";
Vue.use(Vuex);
const store = new Vuex.Store({
  namespaced: true, //是否重命名空间变量
  modules,
  getters
});
export default store;