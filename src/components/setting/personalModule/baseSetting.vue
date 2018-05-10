<template>
  <div class="baseSetting">
    <div class="left">
      <div>
        <headPortrait :userId="$store.state.userId"></headPortrait>
        <!--<img src="../../../assets/imgages/userBaseHeadImg.png" class="headImg">-->
        <!--<img ref="headPortrait" src="" alt="" class="headImg userHeadImg">-->
      </div>
      <el-upload
        ref="uploadPic"
        :action='`/changeHeadPortrait.do?userId=${$store.state.userId}`'
        :on-success="picUpdateSuccess"
        :limit="1">
        <a href="javascript:;">更换头像</a>
      </el-upload>
      <div><p>ID:{{$store.state.userId}}</p></div>
    </div>
    <div class="right">
      <el-row>
        <el-col :span="4"><label for="nickName">昵称:</label></el-col>
        <el-col :span="6"><el-input v-model="userBaseData.nickName" id="nickName"></el-input></el-col>
      </el-row>
      <el-row>
        <el-col :span="4"><label>性别:</label></el-col>
        <el-col :span="6">
          <el-radio v-model="userBaseData.sex" label=1>男</el-radio>
          <el-radio v-model="userBaseData.sex" label=2>女</el-radio>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4"><label for="age">年龄:</label></el-col>
        <el-col :span="6"><numberValidator :value="userBaseData.age" :reg="/^\d*$/"  @input="getAge"></numberValidator></el-col>
      </el-row>
      <el-row>
        <el-col :span="4"><label for="birthday">生日:</label></el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="userBaseData.birthday"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4"><label for="phone">手机:</label></el-col>
        <el-col :span="6"><numberValidator :value="userBaseData.phone" :reg="/^\d*$/" @input="getPhone"></numberValidator></el-col>
      </el-row>
      <el-row>
        <el-col :span="4"><label for="name">真实姓名:</label></el-col>
        <el-col :span="6"><el-input id="name" v-model="userBaseData.name"></el-input></el-col>
      </el-row>
      <el-row>
        <el-col :span="4"><label for="email">邮箱:</label></el-col>
        <el-col :span="6"><el-input id="email" v-model="userBaseData.email"></el-input></el-col>
      </el-row>
      <el-row>
        <el-col :span="10"><el-button type="primary" @click="save">保存</el-button></el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import numberValidator from '../../common/numberValidator'
  import headPortrait from '../../common/headPortrait'
    export default {
        name:'baseSetting',
        props:['data'],
        data: function () {
            return {
              userBaseData:{
                nickName:'',
                sex:0,
                birthday:'',
                age:'',
                name:'',
                email:'',
                phone:''
              }
            };
        },
        // computed:{
        //   userId(){
        //     return this.$store.state.userId;
        //   }
        // },
        mounted(){
          // this.$store.state.userId!==null&&(this.$refs.headPortrait.src=`http://localhost:8081/headProtrait/${this.$store.state.userId}.jpg?time=${new Date().getTime()}`);
        },
        methods:{
          picUpdateSuccess(res,file){
            this.$refs.uploadPic.clearFiles();
            //this.$refs.headPortrait.src=`http://localhost:8081/headProtrait/${this.$store.state.userId}.jpg?time=${new Date().getTime()}`
            //console.log(this.$root.$el.getElementsByClassName('yourHead'));
            Array.prototype.forEach.call(this.$root.$el.getElementsByClassName('yourHead'),(obj,index)=>{
              obj.src=`http://${this.$store.state.statisFileIp}/headProtrait/${this.$store.state.userId}.jpg?time=${new Date().getTime()}`;
            })
          },
          getAge(val){
            this.userBaseData.age=val;
          },
          getPhone(val){
            this.userBaseData.phone=val;
          },
          save(){
            this.$http.post('/updateUserInfo.do',{
              userId:sessionStorage.getItem('userId'),
              nickName:this.userBaseData.nickName,
              sex:this.userBaseData.sex,
              birthday:['',null].includes(this.userBaseData.birthday)?'':this.userBaseData.birthday.getTime(),
              age:this.userBaseData.age,
              name:this.userBaseData.name,
              email:this.userBaseData.email,
              phone:this.userBaseData.phone
            }).then(res=>{
              if(res.data.success){
                this.$message({message:'个人信息修改成功',type:'success'});
                this.$store.state.nickName=this.userBaseData.nickName===''?null:this.userBaseData.nickName;
              }
            })
          }
        },
        watch:{
          // userId(val){
          //   if(val===null)return
          //   this.$refs.headPortrait.src=`http://localhost:8081/headProtrait/${this.$store.state.userId}.jpg?time=${new Date().getTime()}`
          // },
          data:{
            handler(val){
              this.userBaseData={
                nickName:val.nickName,
                sex:val.sex,
                birthday:new Date(parseInt(val.birthday)),
                age:val.age,
                name:val.name,
                email:val.email,
                phone:val.phone
              }
            },
            deep:true
          }
        },
        components:{
          numberValidator,
          headPortrait
        }
    }
</script>
<style lang="less">
  .baseSetting{
    .left{
      float: left;
      width: 20%;
      /*text-align: center;*/
      height: 1000px;
      border-right: 1px solid gray;
      img{
        /*margin-top: 40%;*/
        /*border-radius: 50px;*/
        /*width: 100px;*/
        /*height: 100px;*/
      }
      a{
        color: #3a8ee6;
        font-size: 12px;
      }
      p{
        margin-top: 5px;
      }
      /*.headImg{*/
        /*background: white;*/
        /*vertical-align: middle;*/
      /*}*/
      >div{
        text-align: center;
        .headPortrait{
          margin-top: 40%;
          margin-left: calc(~'50% - 50px');
          width: 100px;
          height: 100px;
          text-align: left;
        }

        /*.userHeadImg{*/
          /*position: absolute;*/
          /*top: 0;*/
          /*left: 50%;*/
          /*margin-left: -50px;*/
          /*background: transparent;*/
        /*}*/
        .el-upload-list{
          display: none;
        }
      }
    }
    .right{
      margin-top: 2%;
      padding-left: 10%;
      float: left;
      width: 50%;
      text-align: right;
      label{
        line-height: 30px;
        margin-right: 5px;
      }
      .el-input__inner{
        height: 30px;
      }
      .el-date-editor{
        width: 100%;
        .el-input__icon{
          line-height: 30px;
        }
      }
      .el-row{
        margin-top: 20px;
      }
      .el-row:nth-of-type(2){
        .el-col-6{
          text-align: left;
          .el-radio{
            margin-left: 10%;
          }
        }
      }
    }
  }
</style>
