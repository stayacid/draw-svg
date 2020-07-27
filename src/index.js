// import Vue
import Vue from 'vue';

// libs
import { parse, stringify } from 'path-ast';
import lodash from 'lodash';

// vuex
import store from './store/store';

// SCSS
import './scss/helpers/_normalize.scss';
import './scss/_base.scss';

// JS
import myData from './js/data';

// custom plugins
import previousKeys from './js/plugins/getPreviousKeysPlugin';
import $handleMouseMove from './js/plugins/handleMouseMove';
import $detectMobile from './js/plugins/detectMobile';

// app
import App from './App.vue';

// my custom plugins
Vue.use(previousKeys);
Vue.use($handleMouseMove);
Vue.use($detectMobile);

// exapmle of using any js library
/* eslint-disable-next-line max-len */
// Object.defineProperty(Vue.prototype, '$dateTime', { value: DateTime }) // or Vue.prototype.$dateTime = DateTime but this is low-level and read-only way
// eslint-disable-next-line func-names
// Object.defineProperty(Vue.prototype, '$myData', { value: myData });
Vue.prototype.$myData = myData;
Object.defineProperty(Vue.prototype, '$parse', { value: parse });
Object.defineProperty(Vue.prototype, '$stringify', { value: stringify });
Object.defineProperty(Vue.prototype, '$lodash', { value: lodash });

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  store,
  render: (h) => h(App),
});


// other examples for vue
// window.Vue = require('vue');
// Vue.component('example-component', require('./components/Example.vue').default);
