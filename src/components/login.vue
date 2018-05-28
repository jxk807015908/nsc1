<template>
  <div class="login">
    <!--<img src="../assets/imgages/loginbg2.jpg" alt="">-->
    <div class="warp" :class="{registerWarp:wrapType===2,forgetWrap:wrapType===3}">
      <p class="loginTitle">{{wrapType===1?'登录':wrapType===2?'注册':'忘记密码'}}</p>
      <div v-show="wrapType===1" >
        <div class="input-group">
          <!--<label for="userId">账号:</label>-->
          <el-input :maxlength="20" v-model="userId" id="userId" placeholder="请输入账号">
            <i slot="prefix" class="fa fa-user-o"></i>
          </el-input>
        </div>
        <div class="input-group">
          <!--<label for="password">密码:</label>-->
          <el-input :maxlength="20" v-model="password" id="password" type="password" placeholder="请输入密码">
            <i slot="prefix" class="fa fa-key fa-fw"></i>
          </el-input>
        </div>
        <div class="input-group">
          <!--<label for="password">密码:</label>-->
          <el-input class="checkedCodeInput" :maxlength="4" v-model="checkedCode" placeholder="请输入验证码"></el-input>
          <button class="checkedCodeButton" @click="getNewRandomCheckedCode">{{randomCheckedCode}}</button>
        </div>
        <div class="input-group clearfix">
          <input ref="remember" id="remember" class="fl" type="checkbox" @click="clickRemember"/>
          <label for="remember" class="fl">记住密码</label>
          <a class="forget fr" href="javascript:;" @click="wrapType=3">忘记密码</a>
        </div>
        <div class="input-group">
          <el-button :disabled="isLoading" :loading="isLoading" type="primary" @click="login">登录</el-button>
        </div>
        <div class="input-group">
          <el-button type="primary" @click="wrapType=2">注册</el-button>
        </div>
      </div>
      <div v-show="wrapType===2" class="register-warp">
        <!--<label for="ruserId">账号:</label>-->
        <el-input :maxlength="20" v-model="registerParams.userId" id="ruserId" @blur="checkuserId" placeholder="请输入账号">
          <i slot="prefix" class="fa fa-user-o"></i>
        </el-input>
        <div class="alerts">
          <el-alert v-if="tip.userId==1" title="该用户已注册" type="error" :closable="false"></el-alert>
          <el-alert v-if="tip.userId==3" title="可以注册" type="success" :closable="false"></el-alert>
          <el-alert v-if="tip.userId==2" title="用户名不能为空" type="error" :closable="false"></el-alert>
        </div>
        <!--<label for="rFPassword">密码:</label>-->
        <el-input :maxlength="20" v-model="registerParams.fPassword" id="rFPassword" type="password" @blur="checkFPassword" placeholder="请输入密码">
          <i slot="prefix" class="fa fa-key fa-fw"></i>
        </el-input>
        <div class="alerts">
          <el-alert v-if="tip.fPassword==1" title="密码不一致" type="error" :closable="false"></el-alert>
          <el-alert v-if="tip.fPassword==2" title="密码不能为空" type="error" :closable="false"></el-alert>
        </div>
        <!--<label for="rSPassword">确认密码:</label>-->
        <el-input :maxlength="20" v-model="registerParams.sPassword" id="rSPassword" type="password" @blur="checkSPassword" placeholder="请确认密码">
          <i slot="prefix" class="fa fa-key fa-fw"></i>
        </el-input>
        <div class="alerts">
          <el-alert v-if="tip.sPassword==1" title="密码不一致" type="error" :closable="false"></el-alert>
          <el-alert v-if="tip.sPassword==2" title="密码不能为空" type="error" :closable="false"></el-alert>
        </div>
        <!--<label for="email">邮箱:</label>-->
        <el-input v-model="registerParams.email" id="email" type="text" @blur="checkEmail" placeholder="请输入邮箱">
          <i slot="prefix" class="fa fa-envelope"></i>
        </el-input>
        <div class="alerts">
          <el-alert v-if="tip.email==1" title="邮箱格式不正确" type="error" :closable="false"></el-alert>
          <el-alert v-if="tip.email==2" title="邮箱不能为空" type="error" :closable="false"></el-alert>
        </div>
        <div class="button-group">
          <el-button type="primary" @click="register">注册</el-button>
          <el-button type="primary" plain @click="wrapType=1">返回</el-button>
        </div>
      </div>
      <div v-show="wrapType===3" class="forget-warp">
        <!--<label>账号:</label>-->
        <el-input :maxlength="20" v-model="forgetId" @blur="" placeholder="请输入账号">
          <i slot="prefix" class="fa fa-user-o"></i>
        </el-input>
        <!--<label>邮箱:</label>-->
        <el-input v-model="forgetEmail" @blur="" placeholder="请输入邮箱">
          <i slot="prefix" class="fa fa-envelope"></i>
        </el-input>
        <div class="button-group">
          <el-button type="primary" :disabled="isForgetLoading" :loading="isForgetLoading" @click="getPassword">确定</el-button>
          <el-button type="primary" plain @click="wrapType=1">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {setCookie,getCookie,getRandomCheckedCode} from "../util/common";
  export default {
        name:'login',
        data: function () {
            return {
              checkedCode:'',
              randomCheckedCode:'',
              isForgetLoading:false,
              forgetEmail:'',
              forgetId:'',
              wrapType:1,
              isLoading:false,
              userId:'',
              password:'',
              registerParams:{
                userId:"",
                fPassword:"",
                sPassword:"",
                email:""
              },
              tip:{
                userId:0,
                fPassword:0,
                sPassword:0,
                email:0
              }
            };
        },
        mounted(){
          sessionStorage.clear();
          this.$store.state.userId=null;
          this.$store.state.nickName=null;
          this.$store.state.socket=null;
          this.getNewRandomCheckedCode();
          //alert(localStorage.isRemember.constructor);
          if(localStorage.isRemember=='true'){
            //alert(localStorage.isRemember);
            // alert(getCookie('userId'))
            this.$refs.remember.checked=true;
            this.userId=localStorage.userId;
            this.password=localStorage.password;
          }
          //this.$store.dispatch('connectSocket')
        },
      methods:{
        getNewRandomCheckedCode(){
          this.randomCheckedCode=getRandomCheckedCode();
        },
        getPassword(){
          if(this.forgetId==''||this.forgetEmail==""){
            this.$message.error('账号和邮箱不能为空');
            return;
          }
          this.isForgetLoading=true;
          this.$http.post('/getPassword.do',{forgetId:this.forgetId,email:this.forgetEmail}).then((res)=>{
            if(res.data.success){
              this.$message({message:'邮件发送成功,请查收',type:'success'});
            }
            this.isForgetLoading=false;
          })
        },
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
        checkuserId(){
          if(this.registerParams.userId==''){
            this.tip.userId=2;
            return
          }
          this.$http.get('/checkuserId.do',{params:{userId:this.registerParams.userId}}).then((res)=>{
            if(res.data.success){
              if(res.data.data.length==0){
                this.tip.userId=3;
              }else{
                this.tip.userId=1;
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
          if(this.tip.userId!=3||this.tip.email!=0||this.tip.fPassword!=0||this.tip.sPassword!=0)return;
          // this.$http.get('/register.do',{
          //   params:{
          //     userId:this.registerParams.userId,
          //     password:this.registerParams.fPassword,
          //     email:this.registerParams.email
          //   }
          // }).then(res=>{
          //   if(res.data.success){
          //     this.$message({message:'注册成功',type:'success'});
          //     this.wrapType=1;
          //   }
          // })
          this.$http.get('/sendRegEmail.do',{
            params:{
              userId:this.registerParams.userId,
              password:this.registerParams.fPassword,
              email:this.registerParams.email
            }
          }).then(res=>{
            if(res.data.success){
              this.$message({message:'邮件发送成功,请去邮箱激活该账号',type:'success'});
              // this.wrapType=1;
            }
          })
        },
        clickRemember(){
          localStorage.isRemember=this.$refs.remember.checked;
          //alert(!(localStorage.isRemember=='true'))
          if(!(localStorage.isRemember=='true')) {
            localStorage.userId='';
            localStorage.password='';
          }else{
            localStorage.userId=this.userId;
            localStorage.password=this.password;
          }
        },
        login(){
          if(localStorage.isRemember==='true'){
            localStorage.userId=this.userId;
            localStorage.password=this.password;
          }
          if(this.userId==''||this.password==""){
            this.$message.error('账号和密码不能为空');
            return;
          }
          if(this.checkedCode.toLocaleUpperCase()!==this.randomCheckedCode){
            this.$message.error('验证码不正确');
            this.getNewRandomCheckedCode();
            return;
          }
          this.isLoading=true;

          // this.$store.dispatch('login',{userId:this.userId,password:this.password,callback:()=>{
          //   setCookie('userId',this.userId);
          //   this.$store.dispatch('connectSocket');
          //   this.$router.push({name:'home'})
          // }});
          this.$http.post('/login.do',{userId:this.userId,password:this.password}).then(res=>{
            this.isLoading=false;
            if(res.data.success){
              sessionStorage.setItem('userId',this.userId);
              sessionStorage.setItem('password',this.password);
              sessionStorage.setItem('messagePush',res.data.data.U_MessagePush);
              this.$store.state.messagePush=res.data.data.U_MessagePush;
              this.$store.state.userId=this.userId;
              this.$store.state.nickName=res.data.data.U_NickName;
              setCookie('userId',this.userId);
              //this.$store.dispatch('connectSocket');
              this.$router.push({name:'home'})
            }
          })
        }
      },
    watch:{
      wrapType(val){
        if(val===2){
          this.tip={
            userId:0,
            fPassword:0,
            sPassword:0,
            email:0
          };
          this.registerParams={
            userId:"",
            fPassword:"",
            sPassword:"",
            email:""
          }
        }else if(val===3){
          this.forgetEmail=this.forgetId='';
        }
      }
    }
    }
</script>
<style lang="less">
  @keyframes changeBg {
    0%   {
      background: url("../assets/imgages/1.jpg") no-repeat;
      background-size:100%;
    }
    25%  {
      background: url("../assets/imgages/2.jpg") no-repeat;
      background-size:100%;
    }
    50%  {
      background: url("../assets/imgages/3.jpg") no-repeat;
      background-size:100%;
    }
    100% {
      background: url("../assets/imgages/1.jpg") no-repeat;
      background-size:100%;
    }
  }
  .login{
    height: 100%;
    animation: changeBg 10s infinite;
    /*background: url("../assets/imgages/loginbg2.jpg");*/
    /*background-size:100% auto;*/
    font-size: 14px;
    img{
      width: 100%;
    }
    .fa{
      font-size: 20px;
      line-height: 34px;
    }
    .warp{
      width: 20%;
      padding: 20px 20px 0 20px;
      border:1px solid #3a8ee6;
      border-radius: 6px;
      //margin: 0 auto;
      position: absolute;
      left: 40%;
      top: calc(~'50% - 150px');
      .loginTitle{
        text-align: center;
        color: white;
        font-size: 20px;
        position: absolute;
        width: 100%;
        top: -30px;
        left: 0;
       }
      .el-input__inner{
        height: 34px;
      }
      .input-group{
        margin-bottom: 20px;
        width: 100%;
        vertical-align: middle;
        /*input{*/
          /*vertical-align: middle;*/
          /*background: rgba(45,45,45,.15);*/
          /*color: white !important;*/
        /*}*/
        .checkedCodeInput{
          width: 40%;
        }
        .checkedCodeButton{
          padding-left: 1em;
          border: none;
          letter-spacing: 1em;
          height: 34px;
          text-align: center;
          font-family:Cursive;
          font-style: italic;
          font-weight: bold;
          opacity: 0.5;
        }
        .el-input{
          /*background: rgba(45,45,45,.15)*/
          /*width:calc(~'100% - 36px');*/
        }
        .el-button{
          width: 100%;
        }
        .forget{
          color: red;
        }
      }
      .register-warp{
        .button-group{
          text-align: center;
          margin-bottom: 20px;
        }
        .alerts{
          height: 30px;
          .el-alert{
            height: 30px;
            .el-icon-close{
              top:7px;
            }
          }
        }
      }
      .forget-warp{
        .button-group{
          margin-top: 10px;
          text-align: center;
          margin-bottom: 20px;
        }
        .el-input{
          margin-bottom: 10px;
        }
      }
    }
    .registerWarp{
      top:calc(~'50% - 200px')
    }
    .forgetWrap{
      top:calc(~'50% - 120px')
    }
    /*input:-webkit-autofill {*/
      /*-webkit-box-shadow: 0 0 0 1000px white inset;*/
      /*border: 1px solid #CCC!important;*/
    /*}*/
    input{
      vertical-align: middle;
      background: rgba(45,45,45,.15);
      color: white !important;
    }
    input:-webkit-autofill {
      -webkit-animation: autofill-fix 1s infinite;
    }

    @-webkit-keyframes autofill-fix {
      from {
        background-color: transparent;
        color: white;
      }
      to {
        background-color: transparent;
        color: white;
      }
    }
  }

</style>
