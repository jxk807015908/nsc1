<template>
  <transition name="dialogFade">
    <div class="my-modal" v-if="isShow">
      <div class="dialog-box">
        <div class="my-dialog-title">
          <span>{{openTitle}}</span>
          <a href="javascript:;" @click="close"><i class="el-icon el-icon-close"></i></a>
        </div>
        <div class="my-dialog-body">
          <slot name="dialog-content"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
    export default {
      props:['openTitle','isShow'],
      methods:{
        close(){
          this.$emit('update:isShow', false);
          this.$emit('close');
        }
      },
      watch:{
        isShow(){
          this.isShow&&this.$emit('open');
        }
      }
    }
</script>

<style lang='less'>
  .dialogFade-enter-active, .dialogFade-leave-active {
    transition: opacity .3s;
  }
  .dialogFade-enter, .dialogFade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .my-modal{
    position: fixed;
    background:rgba(0,0,0,0.3);
    z-index: 3000;
    top:0;
    bottom:0;
    left:0;
    right:0;
    overflow: auto;
    *{
      box-sizing: border-box;
    }
    .dialog-box{
      background: #fff;
      width:35%;
      margin:0 auto;
      min-height:200px;
    }
    .my-dialog-title{
      font-size: 16px;
      height:49px;
      background: #38ADFF;
      line-height: 49px;
      color:#fff;
      margin-top:15vh;
      span{
        font-size:24px;
      }
      a{
        float: right;
        position: relative;
        top:3px;
        right:3px;
      }
      i{
        color:#fff;
        font-size:24px;
      }
    }
  }
</style>
