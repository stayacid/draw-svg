<script>
import Polysvg from './Svg.vue';

export default {
  components: {
    Polysvg,
  },
  data() {
    return {
      styles: {
        container: {
          display: 'flex',
          flex: '0 0 60%',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
        toolbar: {
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        },
      },
    };
  },
  created() {
    window.addEventListener('keydown', this.handleKeyDown);
  },
  destroyed() {
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    deselect() {
      this.$store.commit('polySetState', { selected: false, current: -1 });
    },
    handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') {
        e.preventDefault();
        this.polyUndo();
      }
    },
    polyUndo() {
      const { history } = this.$store.state.poly;
      if (history.length) {
        this.$store.commit('polyUndo');
      }
    },
  },

};
</script>

<template lang='pug'>
div#container(:style='styles.container' @click.stop='deselect')
  Polysvg#svg-app
  div#svg-toolbar(:style='styles.toolbar')
    //Toolbar {...props} />
</template>
