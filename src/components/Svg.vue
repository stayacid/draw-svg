<script>
import { mapState } from 'vuex';
import Grid from './Grid.vue';
import Path from './Path.vue';
import Guides from './Guides.vue';
import Handles from './Handles.vue';

export default {
  components: {
    Grid,
    AppPath: Path,
    Guides,
    Handles,
  },
  data() {
    return {
      myData: this.$myData,
      styles: {
        svg: {
          display: 'block',
          margin: '0 auto',
          overflow: 'visible',
          touchAction: 'none',
        },
      },
    };
  },
  computed: {
    ...mapState({
      zoom: (state) => state.poly.zoom,
      padX(state) { // no arrow here
        return state.poly.width + this.myData.padding * 2;
      },
      padY(state) { 
        return state.poly.height + this.myData.padding * 2;
      },
    }),
  },
  methods: {
    stopClick() {
      return false;
    },
  },
};
</script>

<template lang='pug'>
svg(
  :viewBox="[0, 0, padX, padY].join(' ')"
  :width='padX * zoom'
  :height='padY * zoom'
  :style="styles.svg"
  fill='currentColor'
  @click.stop='stopClick')
  g(:transform="`translate(${myData.padding} ${myData.padding})`")
    Grid#grid
    app-path#path
    Guides#guides
    Handles#handles
</template>
