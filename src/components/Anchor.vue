<script>
import { mapState } from 'vuex';

export default {
  props: {
    coords: {
      type: Object,
      default() {
        return {
          x: 0,
          y: 0,
        };
      },
    },
    i: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      styles: {
        point: {
          fill: 'transparent',
          stroke: 'none',
          cursor: 'pointer',
        },
        pointRing: {
          vectorEffect: 'non-scaling-stroke',
        },
      },
      beforeAst: null,
    };
  },
  computed: {
    ...mapState({
      poly: (state) => state.poly,
      r(state) {
        return 12 / state.poly.zoom;
      },
      opacity(state) {
        return state.poly.current === this.i ? 0 : 0.5;
      },
    }),
  },
  methods: {
    polySelectPoint() {
      this.$store.commit('polySelectPoint', this.i);
    },
    onMouseDown() {
      // save history
      const newAst = this.$lodash.cloneDeep(this.poly.ast);
      this.beforeAst = newAst;
      this.$store.commit('polySetHistory', this.beforeAst); 

      this.$store.commit('polyHandleMouseDown', this.i);
    },
    polyHandleMouseUp() {
      this.$store.commit('polyHandleMouseUp');
    },
    handleMouseMove(e) {
      this.$handleMouseMove(e);
    },
  },
};
</script>

<template lang='pug'>
g
  circle(
    :style='styles.point'
    :cx='coords.x'
    :cy='coords.y'
    :r='r * 2'
    tabIndex='1'
    @focus='polySelectPoint'
    @mousedown='onMouseDown'
    @touchstart='onMouseDown'
    @mouseup='polyHandleMouseUp'
    @touchend='polyHandleMouseUp'
    @mousemove='handleMouseMove'
    @touchmove='handleMouseMove')
  circle(
    :cx='coords.x'
    :cy='coords.y'
    :r='r'
    :style='styles.pointRing'
    :opacity='opacity'
    @mouseup='polyHandleMouseUp'
    @touchend='polyHandleMouseUp')
</template>
