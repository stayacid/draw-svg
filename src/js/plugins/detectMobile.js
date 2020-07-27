// example of global vue plugin for my custom methods
export default {
  install(Vue) {
    // return '' or (1)/(2)/(3) etc
    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$detectMobile = (e) => {
      // detect mobile
      let offsetX;
      let offsetY;

      if (Vue.prototype.$myData.mobile) {
        offsetX = e.touches[0].clientX;
        offsetY = e.touches[0].clientY;
      } else {
        offsetX = e.offsetX;
        offsetY = e.offsetY;
      }
      return { offsetX, offsetY };
    };
  },
};
