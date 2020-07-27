<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      opacity: (state) => (state.poly.preview ? 1 : 0.75),
      ast(state) { // no arrow here
        return this.$stringify(state.poly.ast);
      },
    }),
  },
};
</script>

<template lang='pug'>
g(:opacity="opacity")
  path(:d="ast")
</template>
