/* eslint-disable no-param-reassign */
import pathast from 'path-ast';
import Vue from 'vue';

export default {
  // data
  state: {
    ast: pathast.parse('M8 48 L56 48 L56 22 L8 22 Z'),
    current: 0, // current point
    grid: true,
    height: 64,
    history: [],
    isPointMoving: false,
    isScaling: false,
    isTranslating: false,
    mode: 'select',
    preview: false,
    resolution: 2,
    selected: false, // full path selected
    snap: true,
    transformParams: false,
    transformStart: false,
    width: 64,
    zoom: 6,
    prevKey: null,
  },
  // sync actions
  mutations: {
    polySetState(state, payload) {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key];
      });
    },
    polyUndo(state) {
      const newAst = state.history.shift();
      state.ast = newAst;
    },
    polySetHistory(state, payload) {
      const { history } = state;
      if (history.length && history[0] !== Vue.prototype.$stringify(payload)) {
        history.unshift(Vue.prototype.$lodash.cloneDeep(payload));
      } else if (!history.length) {
        history.unshift(Vue.prototype.$lodash.cloneDeep(payload));
      }
      if (history.length > 128) {
        history.pop();
      }
      Vue.set(state, 'history', history);
    },
    polySelectPoint(state, payload) {
      state.selected = false;
      state.current = payload;
    },
    polyHandleMouseDown(state, index) { 
      // something wrong with first click
      let i = index;
      if (typeof i === 'number') {
        state.selected = false;
        state.current = i;
        i = ['x', 'y'];
      }

      state.isPointMoving = true;
      state.transformParams = i;
    },
    polyHandleMouseUp(state) {
      state.isPointMoving = false;
      state.isTranslating = false;
      state.isScaling = false;
      state.transformParams = false;
      state.transformStart = false;
    },
    polyRemovePoint(state, payload) {
      Vue.set(state.ast, 'commands', payload);
    },
  },
  // async actions
  actions: {
  },
  // return data from state
  getters: {

  },

};
