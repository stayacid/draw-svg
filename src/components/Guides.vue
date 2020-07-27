<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      styles: {
        g: {
          fill: 'none',
          stroke: 'currentcolor',
          vectorEffect: 'non-scaling-stroke',
        },
        guides: {
          vectorEffect: 'non-scaling-stroke',
          strokeWidth: 2,
        },
        current: {
          vectorEffect: 'non-scaling-stroke',
          strokeWidth: 3,
          stroke: this.$myData.colors.blue,
        },
      },
    };
  },
  computed: {
    ...mapState({
      opacity: (state) => (state.poly.preview ? 1 : 0.75),
      ast(state) { // no arrow here
        return this.$stringify(state.poly.ast);
      },
      currentD(state) {
        let currentC = false;
        const { ast, current } = state.poly;
        // Attempt to handle smoothto curves
        if (ast.commands[current] && ast.commands[current].type.match(/(S|T)/) && current > 1) {
          currentC = {
            commands: [{
              type: 'M',
              params: {
                x: this.getPrevKey(ast.commands, current - 1, 'x'),
                y: this.getPrevKey(ast.commands, current - 1, 'y'),
              },
            },
            ast.commands[current - 1],
            ast.commands[current],
            ],
          };
        } else if (ast.commands[current]) {
          currentC = {
            commands: [{
              type: 'M',
              params: {
                x: this.getPrevKey(ast.commands, current, 'x'),
                y: this.getPrevKey(ast.commands, current, 'y'),
              },
            },
            ast.commands[current],
            ],
          };
        }

        const currentD = currentC ? this.$stringify(currentC) : '';
        return currentD;
      },
    }),

  },
  methods: {
    getPrevKey(commands, index, key) {
      for (let i = index - 1; i > -1; i -= 1) {
        if (commands[i] && typeof commands[i].params[key] !== 'undefined') {
          return parseFloat(commands[i].params[key]);
        }
      }
      return 0;
    },
  },
};
</script>

<template lang='pug'>
g(:style="styles.g")
  path(:d="ast"
    :style="styles.guides")
  path(:d="currentD"
    :style="styles.current")
</template>
