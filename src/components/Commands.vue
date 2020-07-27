<script>
import { mapState } from 'vuex';
import commands from 'path-ast/lib/keys';
import Command from './Command.vue';

export default {
  components: {
    Command,
  },
  data() {
    return {
      styles: {
        container: {
          position: 'relative',
          boxSizing: 'border-box',
          paddingTop: 16,
          paddingBottom: 128,
          flex: '0 0 40%',
        },
        inner: {
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          height: '100%',
        },
        button: {
          display: 'block',
          textAlign: 'center',
          width: '100%',
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'inherit',
          lineHeight: `${32 - 2 * 9}px`,
          height: '32px',
          margin: 0,
          padding: '9px',
          boxSizing: 'border-box',
          border: 0,
          color: 'inherit',
          backgroundColor: 'transparent',
          borderColor: this.$myData.colors.darken,
          cursor: 'pointer',
        },
      },
    };
  },
  computed: {
    ...mapState({
      coms(state) {
        const coms = state.poly.ast.commands.map((com) => {
          const params = commands[com.type].map((key) => ({
            name: key,
            value: com.params[key],
          }));
          return {
            type: com.type,
            params,
          };
        })
          .map((com) => {
            if (!com.params.length) {
              return false; // this will hide 'Z'
            }
            // com will like:
            // "type": "L", "params": [ { "name": "x", "value": 56 }, { "name": "y", "value": 22 } ]
            return com; 
          });
        return coms;
      },
    }),
  },
  methods: {
    addPoint() {

    },
  },
};
</script>

<template lang='pug'>
div(:style='styles.container')
  div(:style='styles.inner')
    div
      div(v-for='(com, i) in coms' :key='i')
        Command(v-if='com' :com='com' :i='i')
    div(:style='{padding: "16px"}')
      button(@click='addPoint'
        :style='styles.button') + Add Point
</template>
