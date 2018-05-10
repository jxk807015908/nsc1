<template>
  <div class="friendPolicy">
    <el-row>
      <el-col :span="4">
        <el-tooltip effect="dark" content="设置该策略他人能直接加您为好友" placement="bottom-start">
          <el-radio v-model="friendPolicyType" :label='0' @change="changeFriendPolicy">策略1</el-radio>
        </el-tooltip>
      </el-col>
      <el-col :span="8" :offset="1">
        <p>无</p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-tooltip effect="dark" content="设置该策略他人输入正确密码后可以直接加您为好友" placement="bottom-start">
          <el-radio v-model="friendPolicyType" :label='1' @change="changeFriendPolicy">策略2</el-radio>
        </el-tooltip>
      </el-col>
      <el-col :span="8" :offset="1">
        <label for="proving-password">验证密码:</label>
        <el-input id="proving-password" v-model="provingPassword"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-tooltip effect="dark" content="设置该策略他人将根据问题填写答案，你将接收到好友验证选择是否通过" placement="bottom-start">
          <el-radio v-model="friendPolicyType" :label='2' @change="changeFriendPolicy">策略3</el-radio>
        </el-tooltip>
      </el-col>
      <el-col :span="8" :offset="1">
        <label for="proving-qusetion">验证问题:</label>
        <el-input id="proving-qusetion" v-model="provingQuesttion"></el-input>
      </el-col>
    </el-row>
  </div>
</template>
<script>
    export default {
        name:'friendPolicy',
        props:['data'],
        data: function () {
            return {
              friendPolicyType:0,
              provingPassword:'',
              provingQuesttion:''
            };
        },
        mounted(){

        },
        methods:{
          changeFriendPolicy(){
            if(this.friendPolicyType===1&&this.provingPassword===''){
              this.$message.error('密码不能为空');
              return
            };
            if(this.friendPolicyType===2&&this.provingQuesttion===''){
              this.$message.error('问题不能为空');
              return
            };
            this.$http.post('/updateUserInfo.do',{
              friendPolicyId:this.friendPolicyType,
              friendPolicyQuestion:this.provingQuesttion===''?null:this.provingQuesttion,
              friendPolicyPassword:this.provingPassword===''?null:this.provingPassword,
            }).then(res=>{
              if(res.data.success){
                //this.$message({message:'个人信息修改成功',type:'success'})
              }
            })
          }
        },
        watch:{
          data:{
            handler(){
              this.friendPolicyType=this.data.friendPolicyType||0;
              this.provingPassword=this.data.provingPassword||'';
              this.provingQuesttion=this.data.provingQuesttion||'';
            },
            deep:true
          }
        }
    }
</script>
<style lang="less">
  .friendPolicy{
    margin-top: 5%;
    .el-row{
      margin-bottom: 30px;
      .el-col-4{
        text-align: right;
      }
      .el-col{
        p{
          text-align: center;
        }
      }
    }

  }
</style>
