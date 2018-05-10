<template>
  <div class="personal">
    <el-tabs :tab-position="'left'" style="height: 200px;">
      <el-tab-pane label="基本资料">
        <baseSetting :data="baseData"></baseSetting>
      </el-tab-pane>
      <el-tab-pane label="修改密码">
        <changePassword></changePassword>
      </el-tab-pane>
      <el-tab-pane label="好友策略">
        <friendPolicy :data="policyData"></friendPolicy>
      </el-tab-pane>
      <el-tab-pane label="消息推送设置">
        <informationPushSetting></informationPushSetting>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import baseSetting from './personalModule/baseSetting'
  import changePassword from './personalModule/changePassword'
  import friendPolicy from './personalModule/friendPolicy'
  import informationPushSetting from './personalModule/informationPushSetting'
    export default {
        name:'personal',
        data: function () {
            return {
              baseData:{},
              policyData:{}
            };
        },
        mounted(){
          this.getUserInfo();
        },
        methods:{
            getUserInfo(){
              this.$http.post('/getUserInfo.do',{userId:sessionStorage.getItem('userId')}).then(res=>{
                if(res.data.success){
                  this.baseData={
                    nickName:res.data.data[0].U_NickName,
                    age:res.data.data[0].U_Age,
                    birthday:res.data.data[0].U_Birthday,
                    phone:res.data.data[0].U_Telephone,
                    email:res.data.data[0].U_Email,
                    name:res.data.data[0].U_Name,
                    sex:res.data.data[0].U_Sex
                  };
                  this.policyData={
                    friendPolicyType:res.data.data[0].U_FriendshipPolicyID,
                    provingPassword:res.data.data[0].U_FriendPolicyPassword,
                    provingQuesttion:res.data.data[0].U_FriendPolicyQuestion
                  }
                }
              })
            }
        },
        components:{
          baseSetting,
          changePassword,
          friendPolicy,
          informationPushSetting
        }
    }
</script>
<style lang="less">
  .personal{
    height: 100%;
    position: relative;
    .el-tabs{
      height: 100% !important;
    }
  }
</style>
