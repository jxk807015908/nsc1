<template>
  <div ref="lookPicture" class="lookPicture" @click="hidden">
    <img :src="imgUrl" alt="">
  </div>
</template>
<script>
  export default {
    name: "lookPicture",
    props:['imgUrl'],
    data: function () {
      return {}
    },
    mounted(){
      this.$nextTick(()=>{
        this.$refs.lookPicture.onmousedown=function (e) {
          e.preventDefault();
        }
      })
    },
    methods:{
      hidden(){
        this.$store.state.imgUrl = null;
      }
    }
  }
</script>

<style lang="less">
  .lookPicture {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999999999;
    background: rgba(45,45,45,.95);
    text-align: center;
    img{
      /*position: absolute;*/
      height: 100%;
    }
  }
</style>
