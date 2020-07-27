<script>
import { mapState } from 'vuex';

export default {
  props: {
    com: {
      type: Object,
      default() {
        return {};
      },
    },
    i: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      style: {
        div: {
          marginBottom: '9px',
          // color: active ? colors.blue : 'inherit',
        },
        cell: {
          display: 'inline-block',
          verticalAlign: 'middle',
          boxSizing: 'border-box',
          width: '25%',
        },
      },
    };
  },
  methods: {
    ...mapState({
      polyRemovePoint(state) {
        const newAst = [...state.poly.ast.commands];
        newAst.splice(this.i, 1);
        this.$store.commit('polyRemovePoint', newAst);
      },
    }),
  },

};
</script>

<template lang='pug'>
div(style='style.div') 
  div
    div(:style='style.cell')
      p {{ com }} {{ i }}
      button(v-if='i > 0' @click='polyRemovePoint' ) Delete
  //    <Select
        {...props}
        name={'command-' + index}
        label={'Command'}
        hideLabel
        value={command.type}
        options={options}
        onFocus={this.handleFocus}
        disabled={index === 0 ? true : false}
        onChange={index === 0 ? null : this.handleTypeChange} />
    {command.params.map(function (param, j) {
      return (
        <div key={j}
          style={s.cell}>
          <CompactInput
            type='number'
            {...props}
            label={param.name}
            name={'command-' + index + '-' + param.name}
            value={Math.round(param.value * 100) / 100}
            step={snap ? (resolution) : 1}
            onFocus={self.handleFocus}
            onChange={self.handleParamChange} />
        </div>
        )
    })}
    <div style={s.cell}>
      <Button
        title='Remove Point'
        onClick={this.polyRemovePoint}
        disabled={index === 0 ? true : false}
        style={{
          fontSize: 20,
          lineHeight: 1,
          paddingTop: 0,
          paddingBottom: 0,
          opacity: .5,
          display: index === 0 ? 'none' : null
        }}>
        &times;
      </Button>
    </div>
</template>
