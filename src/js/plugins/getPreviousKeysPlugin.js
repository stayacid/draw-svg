// example of global vue plugin for my custom methods
export default {
  install(Vue) {
    // return '' or (1)/(2)/(3) etc
    // eslint-disable-next-line no-param-reassign
    Vue.prototype.previousKeys = (commands, index, key) => {
      for (let i = index - 1; i > -1; i -= 1) {
        if (commands[i] && typeof commands[i].params[key] !== 'undefined') {
          return parseFloat(commands[i].params[key]);
        }
      }
      return 0;
    };
  },
};
