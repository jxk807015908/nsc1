<template>
  <div class="login">
    <!--<img src="../assets/imgages/loginbg2.jpg" alt="">-->
    <div class="warp">
      <div v-show="!isRegister" class="login-warp">
        <div class="input-group">
          <label for="username">账号:</label>
          <el-input v-model="username" id="username"></el-input>
        </div>
        <div class="input-group">
          <label for="password">密码:</label>
          <el-input v-model="password" id="password" type="password"></el-input>
        </div>
        <div class="input-group clearfix">
          <input ref="remember" id="remember" class="fl" type="checkbox" @click="clickRemember"/>
          <label for="remember" class="fl">记住密码</label>
          <a class="forget fr" href="javascript:;">忘记密码</a>
        </div>
        <div class="input-group">
          <el-button :disabled="isLoading" :loading="isLoading" type="primary" @click="login">登录</el-button>
        </div>
        <div class="input-group">
          <el-button type="primary" @click="isRegister=true">注册</el-button>
        </div>
      </div>
      <div v-show="isRegister" class="register-warp">
        <label for="rUsername">账号:</label>
        <el-input v-model="registerParams.username" id="rUsername" @blur="checkUsername"></el-input>
        <div class="tip">
          <el-alert v-if="tip.username==1" title="该用户已注册" type="error" :closable="false"></el-alert>
          <el-alert v-if="tip.username==3" title="可以注册" type="success" :closable="false"></el-alert>
          <el-alert v-if="tip.username==2" title="用户名不能为空" type="error" :closable="false"></el-alert>
        </div>
        <label for="rFPassword">密码:</label>
        <el-input v-model="registerParams.fPassword" id="rFPassword" type="password" @blur="checkFPassword"></el-input>
        <div class="tip">
          <el-alert v-if="tip.fPassword==1" title="密码不一致" type="error" :closable="false"></el-alert>
          <el-alert v-if="tip.fPassword==2" title="密码不能为空" type="error" :closable="false"></el-alert>
        </div>
        <label for="rSPassword">确认密码:</label>
        <el-input v-model="registerParams.sPassword" id="rSPassword" type="password" @blur="checkSPassword"></el-input>
        <div class="tip">
          <el-alert v-if="tip.sPassword==1" title="密码不一致" type="error" :closable="false"></el-alert>
          <el-alert v-if="tip.sPassword==2" title="密码不能为空" type="error" :closable="false"></el-alert>
        </div>
        <label for="email">邮箱:</label>
        <el-input v-model="registerParams.email" id="email" type="text" @blur="checkEmail"></el-input>
        <div class="tip">
          <el-alert v-if="tip.email==1" title="邮箱格式不正确" type="error" :closable="false"></el-alert>
          <el-alert v-if="tip.email==2" title="邮箱不能为空" type="error" :closable="false"></el-alert>
        </div>
        <div class="button-group">
          <el-button type="primary" @click="register">注册</el-button>
          <el-button type="primary" plain @click="isRegister=false">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {setCookie,getCookie} from "../util/common";
  export default {
        name:'login',
        data: function () {
            return {
              isRegister:false,
              isLoading:false,
              username:'',
              password:'',
              registerParams:{
                username:"",
                fPassword:"",
                sPassword:"",
                email:""
              },
              tip:{
                username:0,
                fPassword:0,
                sPassword:0,
                email:0
              }
            };
        },
        mounted(){
          //alert(localStorage.isRemember.constructor);
          if(localStorage.isRemember=='true'){
            //alert(localStorage.isRemember);
            // alert(getCookie('username'))
            this.$refs.remember.checked=true;
            this.username=localStorage.username;
            this.password=localStorage.password;
          }
          //this.$store.dispatch('connectSocket')
        },
      methods:{
        checkEmail(){
          if(this.registerParams.email===''){
            this.tip.email=2;
            return;
          }
          let reg=new RegExp(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/i);
          if(!reg.test(this.registerParams.email)){
            this.tip.email=1;
            return
          }
          this.tip.email=0;
        },
        checkSPassword(){
          if(this.registerParams.sPassword===''){
            this.tip.sPassword=2;
            return;
          }
          if(this.registerParams.fPassword!==this.registerParams.sPassword&&this.registerParams.fPassword!==''){
            this.tip.sPassword=1;
            return;
          }
          this.tip.sPassword=0;
          this.tip.fPassword=0;
        },
        checkFPassword(){
          if(this.registerParams.fPassword===''){
            this.tip.fPassword=2;
            return;
          }
          if(this.registerParams.fPassword!==this.registerParams.sPassword&&this.registerParams.sPassword!==''){
            this.tip.fPassword=1;
            return;
          }
          this.tip.fPassword=0;
          this.tip.sPassword=0;
        },
        checkUsername(){
          if(this.registerParams.username==''){
            this.tip.username=2;
            return
          }
          this.$http.get('/checkUsername.do',{params:{username:this.registerParams.username}}).then((res)=>{
            if(res.data.success){
              if(res.data.data.length==0){
                this.tip.username=3;
              }else{
                this.tip.username=1;
              }
            }
          })
        },
        register(){
          Object.keys(this.registerParams).forEach(key=>{
            if(this.registerParams[key]==''){
              this.tip[key]=2;
            }
          });
          if(this.tip.username!=3||this.tip.email!=0||this.tip.fPassword!=0||this.tip.sPassword!=0)return;
          this.$http.get('/register.do',{
            params:{
              username:this.registerParams.username,
              password:this.registerParams.fPassword,
              email:this.registerParams.email
            }
          }).then(res=>{
            if(res.data.success){
              this.$message({message:'注册成功',type:'success'});
              this.isRegister=false;
            }
          })
        },
        clickRemember(){
          localStorage.isRemember=this.$refs.remember.checked;
          //alert(!(localStorage.isRemember=='true'))
          if(!(localStorage.isRemember=='true')) {
            localStorage.username='';
            localStorage.password='';
          }else{
            localStorage.username=this.username;
            localStorage.password=this.password;
          }
        },
        login(){
          if(localStorage.isRemember==='true'){
            localStorage.username=this.username;
            localStorage.password=this.password;
          }
          if(this.username==''||this.password==""){
            this.$message.error('账号和密码不能为空');
            return;
          }
          this.isLoading=true;

          // this.$store.dispatch('login',{username:this.username,password:this.password,callback:()=>{
          //   setCookie('username',this.username);
          //   this.$store.dispatch('connectSocket');
          //   this.$router.push({name:'home'})
          // }});
          this.$http.post('/login.do',{username:this.username,password:this.password}).then(res=>{
            this.isLoading=false;
            if(res.data.success){
              sessionStorage.setItem('username',this.username);
              sessionStorage.setItem('password',this.password);
              this.$store.state.userId=this.username;
              this.$store.state.nickName=res.data.data.U_NickName||'';
              setCookie('username',this.username);
              //this.$store.dispatch('connectSocket');
              this.$router.push({name:'home'})
            }
          })
        }
      },
    watch:{
      isRegister(val){
        if(val){
          this.tip={
            username:0,
            fPassword:0,
            sPassword:0,
            email:0
          };
          this.registerParams={
            username:"",
            fPassword:"",
            sPassword:"",
            email:""
          }
        }else{
          if(getCookie('isRemember')==='true') return;
          this.username='';
          this.password='';
        }
      }
    }
    }
</script>
<style lang="less">
  .login{
    height: 100%;
    background: url("../assets/imgages/loginbg2.jpg");
    font-size: 14px;
    img{
      width: 100%;
    }
    .warp{
      width: 20%;
      padding: 20px 20px 0 20px;
      border:1px solid black;
      border-radius: 6px;
      //margin: 0 auto;
      position: absolute;
      left: 40%;
      top: calc(~'50% - 150px');
      .el-input__inner{
        height: 34px;
      }
      .input-group{
        margin-bottom: 20px;
        width: 100%;
        vertical-align: middle;
        input{
          vertical-align: middle;
        }
        .el-input{
          width:calc(~'100% - 36px');
        }
        .el-button{
          width: 100%;
        }
        .forget{
          color: #3a8ee6;
        }
      }
      .register-warp{
        .button-group{
          text-align: center;
          margin-bottom: 20px;
        }
        .tip{
          height: 30px;
          .el-alert{
            height: 30px;
            .el-icon-close{
              top:7px;
            }
          }
        }
      }
    }
  }

</style>
