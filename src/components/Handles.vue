<script>
import { mapState } from 'vuex';
import Anchor from './Anchor.vue';
import CurrentAnchor from './CurrentAnchor.vue';

export default {
  components: {
    Anchor,
    CurrentAnchor,
  },
  data() {
    return {
      myData: this.$myData,
      styles: {
        g: {
          fill: 'none',
          stroke: 'currentcolor',
          strokeWidth: 2,
        },
        mouseRect: {
          stroke: 'none',
          fill: 'transparent',
        },
        curvePoint: {
          fill: this.$myData.colors.blue,
          stroke: 'none',
          cursor: 'pointer',
        },
        path: {
          fill: 'transparent',
          stroke: 'none',
          cursor: 'move',
        },
        segment: {
          fill: 'none',
          stroke: 'transparent',
          strokeWidth: 4,
          cursor: 'pointer',
        },
      },
      beforeAst: null,
    };
  },
  computed: {
    ...mapState({
      poly: (state) => state.poly,
      d(state) { 
        return this.$stringify(state.poly.ast);
      },
      segments() {
        const newAst = this.$lodash.cloneDeep(this.poly.ast);
        // segments not working
        const segments = newAst.commands
          .filter((command) => Object.keys(command.params).length || command.type.match(/z|Z/)) // this works
          .map((command, i) => {
            if (command.type.match(/z|Z/)) {
              const commandHigh = command;
              const lastMIndex = this.$lodash.findLastIndex(this.poly.ast.commands, (cmnd, j) => {
                if (j > i) { return false; }
                return cmnd.type.match(/m|M/);
              });
              commandHigh.type = 'L';
              commandHigh.params = {
                x: this.poly.ast.commands[lastMIndex].params.x || 0,
                y: this.poly.ast.commands[lastMIndex].params.y || 0,
              };
            }
            const segment = {
              commands: [
                {
                  type: 'M',
                  params: {
                    x: this.previousKeys(this.poly.ast.commands, i, 'x'),
                    y: this.previousKeys(this.poly.ast.commands, i, 'y'),
                  },
                },
                command,
              ],
            };
            return segment;
          });
        return segments.map((segment) => this.$stringify(segment));
      },
      anchors(state) {
        const anchors = state.poly.ast.commands
          .filter((command) => Object.keys(command.params).length)
          .map((command, i) => {
            const { params } = command;
            return {
              x: typeof params.x !== 'undefined' ? params.x : this.previousKeys(this.poly.ast.commands, i, 'x'),
              y: typeof params.y !== 'undefined' ? params.y : this.previousKeys(this.poly.ast.commands, i, 'y'),
            };
          });
        return anchors;
      },
      isCurrentAnchor(state) {
        return state.poly.current >= 0;
      },
      currentAnchor(state) {
        const params = state.poly.ast.commands[state.poly.current] 
          ? state.poly.ast.commands[state.poly.current].params 
          : {};

        const currentAnchor = {
          x: typeof params.x !== 'undefined' ? params.x : 0,
          y: typeof params.y !== 'undefined' ? params.y : 0,
        };

        return currentAnchor;
      },
    }),
  },
  methods: {
    handleKeyDown(e) { // move current anchor by arrows - no need for mobile
      const newAst = this.$lodash.cloneDeep(this.poly.ast);
      this.beforeAst = newAst;
      const { params } = newAst.commands[this.poly.current];
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
        return;
      }
      switch (e.code) {
        case 'ArrowUp': // Up
          if (params.y > 0) {
            params.y = this.poly.snap ? params.y - this.poly.resolution : params.y - 1;
          }
          break;
        case 'ArrowDown': // Down
          if (params.y < this.poly.height) {
            params.y = this.poly.snap ? params.y + this.poly.resolution : params.y + 1;
          }
          break;
        case 'ArrowLeft': // Left
          if (params.x > 0) {
            params.x = this.poly.snap ? params.x - this.poly.resolution : params.x - 1;
          }
          break;
        case 'ArrowRight': // Right
          if (params.x < this.poly.width) {
            params.x = this.poly.snap ? params.x + this.poly.resolution : params.x + 1;
          }
          break;
        default:
          break;
      }
      this.$store.commit('polySetState', { ast: newAst });
    },
    polyHandleMouseDown() { // not used now
      const newAst = this.$lodash.cloneDeep(this.poly.ast);
      this.beforeAst = newAst;
      this.$store.commit('polyHandleMouseDown', ['x', 'y']);
      this.$store.commit('polySetHistory', this.beforeAst); 
    },
    polyHandleMouseUp() {
      this.$store.commit('polyHandleMouseUp');
    },
    handleMouseMove(e) {
      this.$handleMouseMove(e);
    },
    handleTranslate(e) {
      // save history
      const newAst = this.$lodash.cloneDeep(this.poly.ast);
      this.beforeAst = newAst;
      this.$store.commit('polySetHistory', this.beforeAst); 

      // detect mobile
      const { offsetX, offsetY } = this.$detectMobile(e);

      let x = offsetX / this.poly.zoom - this.myData.padding;
      let y = offsetY / this.poly.zoom - this.myData.padding;

      if (this.poly.snap) {
        x = Math.floor(x / this.poly.resolution) * this.poly.resolution || 0;
        y = Math.floor(y / this.poly.resolution) * this.poly.resolution || 0;
      }
      this.$store.commit('polySetState', {
        selected: true,
        isTranslating: true,
        transformStart: { x, y },
      });
    },
    handleAddPoint(i, e) {
      console.log('add');
      // detect mobile
      const { offsetX, offsetY } = this.$detectMobile(e);

      const newAst = this.$lodash.cloneDeep(this.poly.ast);
      this.beforeAst = newAst;
      this.$store.commit('polySetHistory', this.beforeAst); 
      let x = offsetX / this.poly.zoom - this.myData.padding;
      let y = offsetY / this.poly.zoom - this.myData.padding;
      if (this.poly.snap) {
        x = Math.floor(x / this.poly.resolution) * this.poly.resolution || 0;
        y = Math.floor(y / this.poly.resolution) * this.poly.resolution || 0;
      }
      newAst.commands.splice(i, 0, {
        type: 'L',
        params: {
          x,
          y,
        },
      });

      this.$store.commit('polySetState', { ast: newAst }); // this is updateAst(newAst) - history;
      this.$store.commit('polySelectPoint', i); 
      this.$store.commit('polySetState', { isPointMoving: true, transformParams: ['x', 'y'] }); // this is  updateState
    },
  },
};
</script>

<template lang='pug'>
g(:style="styles.g"
  @keydown.prevent="handleKeyDown"
  @mouseup="polyHandleMouseUp"
  @touchend="polyHandleMouseUp"
  @mouseleave="polyHandleMouseUp")
  rect(
    :transform="`translate(${- myData.padding} ${- myData.padding})`"
    :width="poly.width + myData.padding * 2"
    :height="poly.height + myData.padding * 2"
    :style="styles.mouseRect"
    @mouseup="polyHandleMouseUp"
    @touchend="polyHandleMouseUp"
    @mousemove="handleMouseMove"
    @touchmove="handleMouseMove")
  rect(
    :width="poly.width"
    :height="poly.height"
    :style="styles.mouseRect"
    @mousemove="handleMouseMove"
    @touchmove="handleMouseMove"
    @mouseup="polyHandleMouseUp"
    @touchend="polyHandleMouseUp")
  path(:d="d"
    :style="styles.path"
    @mousedown="handleTranslate"
    @touchstart="handleTranslate"
    @mousemove="handleMouseMove"
    @touchmove="handleMouseMove"
    @mouseup="polyHandleMouseUp"
    @touchend="polyHandleMouseUp")
  path(v-for="(segment, i) in segments" 
    :key="i"
    :d="segment"
    :style="styles.segment"
    @mousedown="handleAddPoint(i, $event)"
    @touchstart="handleAddPoint(i, $event)"
    @mouseup="polyHandleMouseUp"
    @touchend="polyHandleMouseUp")
  Anchor#anchor(v-for="(anchor, i) in anchors" 
    :key="`anchor-${i}`" 
    :coords="anchor" 
    :i="i"
    )
  CurrentAnchor(:coords='currentAnchor' v-if="isCurrentAnchor")
  // 
    <CurveHandles - this is for making curves
      {...props}
      onMouseDown={this.polyHandleMouseDown}
      onMouseMove={this.handleMouseMove}
      onMouseUp={this.polyHandleMouseUp} />
</template>


<style>

</style>
