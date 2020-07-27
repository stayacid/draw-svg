/* eslint-disable max-len */
<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      myData: this.$myData,
      styles: {
        g: {
          fill: 'none',
          stroke: 'currentcolor',
        },
        minor: {
          strokeWidth: 0.5,
          vectorEffect: 'non-scaling-stroke',
          opacity: 0.5,
        },
        major: {
          strokeWidth: 0.5,
          vectorEffect: 'non-scaling-stroke',
          opacity: 0.75,
        },
      },
    };
  },
  computed: {
    ...mapState({
      minor(state) {
        return [this.getLines(state.poly.width / state.poly.resolution, state.poly.height / state.poly.resolution, state.poly.resolution)].join(' ');
      },
      major(state) {
        return [this.getLines(state.poly.width / 16, state.poly.height / 16, 16)].join(' ');
      },
    }),
  },
  methods: {
    getLines(x, y, step) {
      const lines = [];
      for (let i = 0; i <= y; i += 1) {
        lines.push([
          'M', 0, i * step,
          'H', this.$store.state.poly.width,
        ].join(' '));
      }
      for (let i = 0; i <= x; i += 1) {
        lines.push([
          'M', i * step, 0,
          'V', this.$store.state.poly.height,
        ].join(' '));
      }
      return lines.join(' ');
    },
  },
};
</script>

<template lang='pug'>
g(:style='[styles.g]')
  path(:d="minor" :style='[styles.minor]')
  path(:d="major" :style='[styles.major]')
</template>
