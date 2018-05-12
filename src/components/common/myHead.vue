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
      <el-menu-item index="2">
        <el-badge :value="newTips.remindTips" class="item">
          <span>我的消息</span>
        </el-badge>
      </el-menu-item>
      <el-submenu index="3">
        <template slot="title">联系人</template>
        <el-menu-item index="3-1">我的好友</el-menu-item>
        <el-menu-item index="3-2">我的群</el-menu-item>
      </el-submenu>
      <el-menu-item index="4">消息中心</el-menu-item>
    </el-menu>
    <div class="user">
      <span class="username">{{$store.state.nickName||$store.state.userId}}</span>
      <el-dropdown @command="mainOperate">
        <div>
          <headPortrait :userId="$store.state.userId"></headPortrait>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :key="item.value" v-for="item in userOperateArr" :command="item.value">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
  import headPortrait from './headPortrait'
  export default {
    name:'myHead',
    data: function () {
      return {
        activeIndex: '1',
        userOperateArr:[{
          label:'个人中心',
          value:1
        },{
          label:'帮助中心',
          value:2
        },{
          label:'关于nsc',
          value:3
        },{
          label:'退出账号',
          value:4
        }],
        newTips:{
          remindTips:0
        }
      };
    },
    // computed:{
    //   userId(){
    //     return this.$store.state.userId;
    //   }
    // },
    computed: {
      socket() {
        return this.$store.state.socket;
      }
    },
    methods: {
      getNewTips(){
        this.$http.post('/getNewTips.do',{userId:sessionStorage.getItem('userId')}).then(res=>{
          if(res.data.success){
            this.newTips.remindTips=res.data.data.remindTips;
          }
        })
      },
      mainOperate(value){
        if(value===1){
          this.$router.push({name:'personal'})
        }else if(value===4){
          this.$store.state.socket.emit('img');
          this.$router.push({name:'login'})
        }else{

        }
      },
      transformPath(n){
        switch (n){
          case '1':return 'home';
          case '2':return 'myMessage';
          case '3-1':return 'myFriend';
          case '3-2':return 'myGroups';
          default :return''
        }
      },
      handleSelect(key, keyPath) {
        this.$router.push({name:this.transformPath(key)})
      }
    },
    mounted(){
      this.getNewTips();
      // this.$store.state.userId!==null&&(this.$refs.headPortrait.src=`http://localhost:8081/headProtrait/${this.$store.state.userId}.jpg?time=${new Date().getTime()}`);
      // this.$refs.headPortrait.src=`http://localhost:8081/headProtrait/${this.$store.state.userId}.jpg?time=${new Date().getTime()}`;
      //alert(this.$store.state.userId)
    },
    watch: {
      socket: {
        handler(value) {
          if (value) {
            this.$store.state.socket.removeAllListeners('getMessage');
            this.$store.state.socket.on('getMessage',(item)=>{
              if(item.groupId){
                let notify;
                let time=new Date().getTime();
                notify=this.$notify({
                  title: `群聊消息:${item.groupName}`,
                  dangerouslyUseHTMLString: true,
                  message: `<p>${item.uName}:</p><div style="text-indent:2em;">${item.messageType===3?'[图像]':item.messageType===4?'[文件]':item.message}</div><button class="answerFriend ${item.from}Button${time}">前去围观</button> `,
                  duration: 0
                });
                let button=document.getElementsByClassName(`${item.from}Button${time}`);
                button[0].onclick=()=>{
                  notify.close();
                  this.$router.push({name:'myGroups',params:{groupId:item.groupId}})
                };
              }else{
                let notify;
                let time=new Date().getTime();
                notify=this.$notify({
                  title: `好友消息`,
                  dangerouslyUseHTMLString: true,
                  message: `<p>${item.friendName||item.from}:</p><div style="text-indent:2em;">${item.messageType===3?'[图像]':item.messageType===4?'[文件]':item.message}</div><button class="answerFriend ${item.from}Button${time}">前往回复</button> `,
                  duration: 0
                });
                let button=document.getElementsByClassName(`${item.from}Button${time}`);
                button[0].onclick=()=>{
                  notify.close();
                  this.$router.push({name:'myFriend',params:{friendId:item.from}})
                };
              }
            });
          }
        },
        deep: true
      }
    },
    // watch:{
    //   userId(val){
    //     if(val===null)return
    //     this.$refs.headPortrait.src=`http://localhost:8081/headProtrait/${this.$store.state.userId}.jpg?time=${new Date().getTime()}`
    //   }
    // },
    components:{
      headPortrait
    }
  }
</script>
<style lang="less">
  .my-head{
    .el-badge{
      line-height: 60px;
      display:block;
      span{
        line-height: 60px;
        display: block;
      }
      .el-badge__content{
        top:20px;
      }
    }
    .user{
      height: 61px;
      overflow: hidden;
      position: absolute;
      right: 80px;
      top:0;
      padding-top: 5px;
      .username{
        display: block;
        color: white;
        float: left;
        margin-top:15px ;
        margin-right: 10px;
      }
      /*.headImg{*/
        /*margin-left: 10px;*/
        /*width: 50px;*/
        /*height: 50px;*/
        /*border-radius: 25px;*/
        /*background: white;*/
        /*vertical-align: middle;*/
      /*}*/
      /*.userHeadImg{*/
        /*position: absolute;*/
        /*top: 0;*/
        /*background: transparent;*/
      /*}*/
    }
    .logo{
      position: absolute;
      z-index: 999;
    }
    .el-menu{
      padding-left: 150px;
    }
  }
  .el-notification__group{
    width: 100%;
    .operateVideoRequest{
      border: none;
      background: white;
      margin-right: 10px;
      border-radius: 3px;
      margin-top: 5px;
      float: right;
      color: white;
    }
    .operateVideoRequest:nth-of-type(1){
      //border:1px solid #f56c6c;
      background: #f56c6c;
    }
    .operateVideoRequest:nth-of-type(1):hover{
      background: #f58c6c;
    }
    .operateVideoRequest:nth-of-type(2){
      //border:1px solid #409EFF;
      background: #409EFF;
    }
    .operateVideoRequest:nth-of-type(2):hover{
      background: #40BEFF;
    }
    .answerFriend{
      border: none;
      background: white;
      margin-right: 10px;
      border-radius: 3px;
      margin-top: 5px;
      float: right;
      color: white;
    }
    .answerFriend:nth-of-type(1){
      //border:1px solid #409EFF;
      background: #409EFF;
    }
    .answerFriend:nth-of-type(1):hover{
      background: #40BEFF;
    }
  }
</style>
