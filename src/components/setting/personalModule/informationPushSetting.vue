<template>
  <div class="informationPushSetting">
    <el-row>
      <el-col :span="4"><label>好友上线推送</label></el-col>
      <el-col :span="4">
        <el-switch
          @change="friendLoginPushChange"
          v-model="friendLoginPush"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><label>好友信息推送</label></el-col>
      <el-col :span="4">
        <el-switch
          @change="friendMessagePushChange"
          v-model="friendMessagePush"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-col>
    </el-row>
  </div>
</template>
<script>
    export default {
        name:'informationPushSetting',
        data: function () {
            return {
              friendLoginPush:true,
              friendMessagePush:true
            };
        },
        methods:{
          friendLoginPushChange(){
            alert(this.friendLoginPush)
          },
          friendMessagePushChange(){

          }
        }
    }
</script>
<style lang="less">
  .informationPushSetting{
    padding-top: 10%;
    padding-left: 20%;
    .el-row{
      margin-bottom: 30px;
    }
  }
</style>
