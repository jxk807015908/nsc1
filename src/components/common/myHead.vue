<template>
  <div class="my-head">
    <img src="../../assets/imgages/logo.png" alt="" class="logo">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="1">主页</el-menu-item>
      <el-menu-item index="2">我的消息</el-menu-item>
      <el-submenu index="3">
        <template slot="title">联系人</template>
        <el-menu-item index="3-1">我的好友</el-menu-item>
        <el-menu-item index="3-2">我的群</el-menu-item>
      </el-submenu>
      <el-menu-item index="4">消息中心</el-menu-item>
    </el-menu>
    <div class="user">
      <span class="username">{{$store.state.nickName||$store.state.userId}}</span>
      <el-dropdown>
        <img src="../../assets/imgages/userBaseHeadImg.png" alt="" class="userHeadImg">
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in userOperateArr">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
  export default {
    name:'head',
    data: function () {
      return {
        activeIndex: '1',
        userOperateArr:[{
          label:'个人中心',
          value:1
        },{
          label:'修改密码',
          value:2
        },{
          label:'帮助中心',
          value:3
        },{
          label:'关于nsc',
          value:4
        },{
          label:'退出账号',
          value:5
        }]
      };
    },
    methods: {
      transformPath(n){
        switch (n){
          case '1':return 'home';
          case '2':return 'myMessage';
          case '3-1':return 'myFriend';
          case '3-2':return 'myGroup';
          default :return''
        }
      },
      handleSelect(key, keyPath) {
        this.$router.push({name:this.transformPath(key)})
      }
    },
    mounted(){
      //alert(this.$store.state.userId)
    }
  }
</script>
<style lang="less">
  .my-head{
    .user{
      position: absolute;
      line-height: 61px;
      right: 80px;
      top:0;
      .username{
        color: white;
      }
      .userHeadImg{
        margin-left: 10px;
        width: 50px;
        height: 50px;
        border-radius: 25px;
        background: white;
        vertical-align: middle;
      }
    }
    .logo{
      position: absolute;
      z-index: 999;
    }
    .el-menu{
      padding-left: 150px;
    }
  }
</style>
