<template>
  <div class="headPortrait">
    <div v-if="hasDetail">
      <el-tooltip placement="top">
        <div slot="content">
          <p>ID:{{userId}}</p>
          <p>昵称:{{data.nickName}}</p>
          <p>备注:{{data.remark}}</p>
        </div>
        <div>
          <div v-show="status === 0" class="shelter" @click.stop="imgClick"></div>
          <img src="../../assets/imgages/userBaseHeadImg.png" alt="" class="headImg" @click.stop="imgClick">
          <img ref="uerHead" :src="url" alt="" :class="{headImg:true,userHeadImg:true,yourHead:userId===this.$store.state.userId}" @click.stop="imgClick">
        </div>
      </el-tooltip>
    </div>
    <div v-else>
      <div v-show="status === 0" class="shelter" @click.stop="imgClick"></div>
      <img src="../../assets/imgages/userBaseHeadImg.png" alt="" class="headImg" @click.stop="imgClick">
      <img ref="uerHead" :src="url" alt="" :class="{headImg:true,userHeadImg:true,yourHead:userId===this.$store.state.userId}" @click.stop="imgClick">
    </div>
  </div>
</template>
<script>
    export default {
        name:'headPortrait',
        props:['userId','isSave','imgUrl','indexPath','status','hasDetail','data'],
        data: function () {
            return {

            };
        },
        computed:{
            url(){
              if(this.isSave){
                if(this.imgUrl){
                  return `http://${this.$store.state.statisFileIp}${this.imgUrl}`
                }else{
                  return this.userId===null?'':`http://${this.$store.state.statisFileIp}/headProtrait/${this.userId}.jpg`
                }
              }else{
                if(this.imgUrl){
                  return `http://${this.$store.state.statisFileIp}${this.imgUrl}?time=${new Date().getTime()}`
                }else{
                  return this.userId===null?'':`http://${this.$store.state.statisFileIp}/headProtrait/${this.userId}.jpg?time=${new Date().getTime()}`
                }
              }
            }
        },
        methods:{
          imgClick(){
            this.$emit('imgClick',this.indexPath)
          }
        }
        // watch:{
        //   userId(val){
        //     if(val===null)return
        //       // this.$refs.uerHead.src=`http://localhost:8081/headProtrait/${this.$store.state.userId}.jpg?time=${new Date().getTime()}`;
        //   }
        // }
    }
</script>
<style lang="less">
  .headPortrait{
    /*height: 50px;*/
    /*width: 50px;*/
    position: relative;
    overflow: hidden;
    .shelter{
      z-index: 99;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 0;
      background: black;
      opacity: 0.5;
    }
    .headImg{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: white;
      vertical-align: top;
    }
    .userHeadImg{
      position: absolute;
      top: 0;
      left: 0;
      background: transparent;
    }
  }
</style>
