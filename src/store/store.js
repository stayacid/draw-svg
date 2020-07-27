// store
import Vue from 'vue';
import Vuex from 'vuex';
import poly from './poly';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    poly,
  },
});
