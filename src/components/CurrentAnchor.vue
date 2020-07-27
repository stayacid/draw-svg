<script>
/* eslint-disable no-unused-expressions */
import { mapState } from 'vuex';

export default {
  props: {
    coords: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      styles: {
        current: {
          fill: this.$myData.colors.blue,
          stroke: 'none',
          opacity: 0.25,
          cursor: 'pointer',
          vectorEffect: 'non-scaling-stroke',
          transition: 'r .1s ease-out',
        },
        currentRing: {
          stroke: this.$myData.colors.blue,
          strokeWidth: 3,
          vectorEffect: 'non-scaling-stroke',
        },
        del: {
          cursor: 'pointer',
        },
        rect: {
          fill: this.$myData.colors.darken,
          strokeWidth: 0.25,
          stroke: this.$myData.colors.blue,
        },
        line: {
          strokeWidth: 0.25,
        },
      },
    };
  },
  computed: {
    ...mapState({
      poly: (state) => state.poly,
      r: (state) => 12 / state.poly.zoom,
      h: (state) => Math.floor((state.poly.width / state.poly.zoom - 2) / 2),
      isMoving(state) {
        return state.poly.isPointMoving ? this.r * 1.5 : this.r; // not work!
      },
      rectCoords(state) {
        const coords = {};
        let x = this.coords.x - this.r * 2;
        let y = this.coords.y - this.h - this.r * 2;

        // prevent crossing grid
        if (x < 0) {
          x = 1;
        } else if (x + this.h + 1 > state.poly.width) {
          x = state.poly.width - this.h - 1;
        }

        if (y < 1) {
          y = this.h + this.r * 3 + 1;
        }

        coords.x = x;
        coords.y = y;
        return coords;
      },
    }),

  },
  methods: {
    polyHandleMouseDown() {
      this.$store.commit('polyHandleMouseDown', ['x', 'y']);
    },
    handleMouseMove(e) {
      this.$handleMouseMove(e);
    },
    polyHandleMouseUp() {
      this.$store.commit('polyHandleMouseUp');
    },
    ...mapState({
      polyRemovePoint(state) {
        const prevPoint = state.poly.current - 1; // this fix
        const newAst = [...state.poly.ast.commands];
        newAst.splice(state.poly.current, 1);
        this.$store.commit('polyRemovePoint', newAst);
        this.$store.commit('polySetState', { current: prevPoint });
      },
    }),
  },
};
</script>

<template lang='pug'>
g
  circle(
    :style='styles.current'
    :cx='coords.x'
    :cy='coords.y'
    :r='isMoving'
    tabIndex='1'
    @mousedown='polyHandleMouseDown'
    @touchstart.prevent='polyHandleMouseDown'
    @mousemove='handleMouseMove'
    @touchmove='handleMouseMove'
    @mouseup='polyHandleMouseUp'
    @touchend='polyHandleMouseUp')
  circle(
    :style='styles.currentRing'
    :cx='coords.x'
    :cy='coords.y'
    :r='isMoving'
    @mouseup='polyHandleMouseUp'
    @touchend='polyHandleMouseUp')
  g(v-if='this.$store.state.poly.current > 0'
    :style='styles.del'
    @click='polyRemovePoint')
    rect(:style='styles.rect' :width='h' :height='h' :x='rectCoords.x' :y='rectCoords.y')
    line(:style='styles.line'
      :x1='rectCoords.x + 1' 
      :y1='rectCoords.y + 1' 
      :x2='rectCoords.x + h - 1' 
      :y2='rectCoords.y + h - 1')
    line(:style='styles.line'
      :x1='rectCoords.x + h - 1' 
      :y1='rectCoords.y + 1' 
      :x2='rectCoords.x + 1' 
      :y2='rectCoords.y + h - 1')
</template>
