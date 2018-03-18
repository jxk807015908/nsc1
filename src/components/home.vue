<template>
  <div class="home">
    <myHead></myHead>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import myHead from './common/myHead'
  import {setCookie,getCookie} from "../util/common";
  export default {
      name:'home',
      data: function () {
        return {};
      },
      mounted(){
        if(!this.$store.state.userId){
          if(sessionStorage.getItem('username')!==null&&sessionStorage.getItem('password')!==null) {
            // this.$store.dispatch('login', sessionStorage.getItem('username'), sessionStorage.getItem('password'))
            this.$http.post('/login.do',{username:sessionStorage.getItem('username'),password:sessionStorage.getItem('password')}).then(res=>{
              if(res.data.success){
                this.$store.state.userId=sessionStorage.getItem('username');
                this.$store.state.nickName=res.data.data.U_NickName||'';
                setCookie('username',sessionStorage.getItem('username'));
                this.$store.dispatch('connectSocket')
              }
            })
          }else{
            this.$message.error('请重新登录');
            this.$router.push({name:'login'})
          }
        }else {
          this.$store.dispatch('connectSocket')
        }
      },
      components:{
        myHead
      }
    }
</script>
<style lang="less">
  .home{
    height: 100%;
    .content{
      height: calc(~'100% - 61px');
      position: relative;
    }
  }
</style>
