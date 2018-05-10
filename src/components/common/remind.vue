<template>
  <div :class="{remind:true,checked:isChecked}" @click="messageCheck">
    <i class="el-icon-close" @click.stop="deleteRemind"></i>
    <div v-if="data.messageType==='1'">
      <img src="../../assets/imgages/userBaseHeadImg.png" alt="">
      <span>{{data.fromName||data.fromId}}</span>
    </div>
    <div v-if="data.messageType==='2'">
      <p>你收到一条好友请求！</p>
      <p class="name">from:{{data.fromName||data.fromId}}</p>
    </div>
    <div v-if="data.messageType==='3'">
      <p>你又多了一位新朋友！</p>
      <p class="name">from:{{data.fromName||data.fromId}}</p>
    </div>
    <div v-if="data.messageType==='4'">
      <p>你被对方从好友中删除！</p>
      <p class="name">from:{{data.fromName||data.fromId}}</p>
    </div>
    <div v-if="data.messageType==='5'">
      <p>对方拒绝了你的好友邀请！</p>
      <p class="name">from:{{data.fromName||data.fromId}}</p>
    </div>
    <div v-if="data.messageType==='6'">
      <p>你收到一条群邀请！</p>
      <p class="name">from:{{data.fromName||data.fromId}}</p>
    </div>
    <div v-if="data.messageType==='7'">
      <p>对方拒绝了你的群邀请！</p>
      <p class="name">from:{{data.fromName||data.fromId}}</p>
    </div>
    <div v-if="data.messageType==='8'">
      <p>你收到一条群请求！</p>
      <p class="name">from:{{data.fromName||data.fromId}}</p>
    </div>
    <div v-if="data.messageType==='9'">
      <p>对方拒绝了你的群请求！</p>
      <p class="name">from:{{data.fromName||data.fromId}}</p>
    </div>
  </div>
</template>
<script>
    export default {
        name:'remind',
        props:['data','index','isChecked'],
        data: function () {
            return {};
        },
        methods:{
          messageCheck(){
            this.$emit('messageCheck',this.index)
          },
          deleteRemind(){
            this.$emit('deleteRemind',this.index)
          }
        }
    }
</script>
<style lang="less">
  .remind{
    padding: 10px;
    position: relative;
    p{
      font-size: 12px;
      color: yellow;
    }
    .name{
      text-align: right;
      color: white;
    }
    .el-icon-close{
      position: absolute;
      right: 2px;
      top: 2px;
      color: gray;
    }
    .el-icon-close:hover{
      color: black;
    }
  }
  .remind:not(.checked):hover{
    background: #545c55;
  }
  .remind.checked{
    background: #8c939d;
  }
</style>
