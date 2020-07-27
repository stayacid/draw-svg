/* eslint-disable no-unused-expressions */
// example of global vue plugin for my custom methods
import store from '../../store/store';
// import $detectMobile from './detectMobile'

export default {
  install(Vue) {
    // return '' or (1)/(2)/(3) etc
    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$handleMouseMove = (e) => {
      // detect mobile
      const { offsetX, offsetY } = Vue.prototype.$detectMobile(e);

      const { poly } = store.state;
      let x = offsetX / poly.zoom - Vue.prototype.$myData.padding;
      let y = offsetY / poly.zoom - Vue.prototype.$myData.padding;

      if (poly.snap) {
        x = Math.floor(x / poly.resolution) * poly.resolution || 0;
        y = Math.floor(y / poly.resolution) * poly.resolution || 0;
      }
      if (poly.isPointMoving) {
        const newAst = Vue.prototype.$lodash.cloneDeep(poly.ast);
        const i = poly.current;
        const { params } = newAst.commands[i]; 
        const px = poly.transformParams[0];
        const py = poly.transformParams[1];
        if (x < 0) {
          x = 0;
        } else if (x > poly.width) {
          x = poly.width;
        }
        if (y < 0) {
          y = 0;
        } else if (y > poly.height) {
          y = poly.height;
        }
        if (typeof params[px] !== 'undefined') {
          params[px] = x;
        }
        if (typeof params[py] !== 'undefined') {
          params[py] = y;
        }
        store.commit('polySetState', { ast: newAst });
      } else if (poly.isTranslating) {
        const newAst = Vue.prototype.$lodash.cloneDeep(poly.ast);
        newAst.translate(x - poly.transformStart.x, y - poly.transformStart.y);
        store.commit('polySetState', { 
          transformStart: { // is this work?
            x,
            y,
          },
        });
        store.commit('polySetState', { ast: newAst });
      } else if (poly.isScaling) { // not used
        const newAst = Vue.prototype.$lodash.cloneDeep(poly.ast);
        const center = newAst.getCenter();
        const cx = center.x; // zoom // - padding
        const cy = center.y; // zoom // - padding
        const xN = (x - cx) / (poly.transformStart.x - cx);
        const yN = (y - cy) / (poly.transformStart.y - cy);
        const n = (Math.abs(xN) >= Math.abs(yN) ? xN : yN);
        // eslint-disable-next-line no-restricted-globals
        if (isFinite(n) && n > 0) {
          newAst.scale(n);
          store.commit('polySetState', { 
            transformStart: {
              x,
              y,
            },
          });
          store.commit('polySetState', { ast: newAst });
        }
      }
    };
  },
};
