<script>
import Canvas from './components/Canvas.vue';
import Commands from './components/Commands.vue';

export default {
  components: {
    Canvas,
    Commands,
  },
  data() {
    return {
      style: {
        color: 'white',
        backgroundColor: this.$myData.colors.dark,
        display: 'flex',
        height: '100vh',
      },
    };
  },
};
</script>

<template lang='pug'>
  div(:style='style')
    Canvas
    // toggle={this.toggle} // this is for toolbar
    Commands
    //
      Commands(
        selectPoint={this.selectPoint}
        updateAst={this.updateAst})
      UrlHistory(
        updateAst={this.updateAst})
</template>

<style lang='scss' scoped>

</style>
