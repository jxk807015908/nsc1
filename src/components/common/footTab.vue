<template>
  <div class="foot-tab-box">
    <el-tabs :value="value" @input="updateVal" @tab-click="handleClick">
      <el-tab-pane :label="item" :name="index" v-for="(item,index) in labelList">
      </el-tab-pane>
    </el-tabs>
    <div class="tabBox" :class="'tabBox'+value">
      <slot name="tabContent"></slot>
    </div>
  </div>
</template>

<script>
  import lazyTable from './lazyTable'

  export default {
    props: ['labelList', 'value', 'tableList'],
    components: {
      lazyTable
    },
    methods: {
      toBottom() {
        this.$emit('toBottom')
      },
      handleClick() {
        this.$emit('handleClick')
      },
      updateVal(val) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style lang='less'>
  .foot-tab-box {
    margin-top:10px;
    padding-bottom: 20px;
    background:#fff;
    border: 1px solid #e9e9e9;
    .el-tabs__nav-wrap::after{
      height:1px;
    }
    .el-tabs__content, .el-tabs__nav-wrap {
      padding: 0 28px;
    }
    .tabBox {
      padding: 0 28px;
    }
  }
</style>
