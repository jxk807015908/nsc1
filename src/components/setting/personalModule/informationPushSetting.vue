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
              friendLoginPush:sessionStorage.getItem("messagePush").indexOf('1')!==-1,
              friendMessagePush:sessionStorage.getItem("messagePush").indexOf('2')!==-1
            };
        },
        methods:{
          friendLoginPushChange(){
            let messagePushArr=this.$store.state.messagePush.split(",");
            // console.log('去空前：',messagePushArr);
            // console.log(messagePushArr.findIndex(val=>val==''));
            messagePushArr.findIndex(val=>val=='')!==-1&&(messagePushArr.splice(messagePushArr.findIndex(val=>val==''),1));
            // console.log('去空后：',messagePushArr);
            if(this.friendLoginPush){
              (!messagePushArr.includes('1'))&&(messagePushArr.push('1'))
            }else{
              let index=messagePushArr.findIndex(val=>val=='1');
              // console.log('index:',messagePushArr.findIndex(val=>val=='1'));
              messagePushArr.includes('1')&&(messagePushArr.splice(messagePushArr.findIndex(val=>val=='1'),1));
            }
            // console.log('发生前：',messagePushArr);
            let messagePush=messagePushArr.join(',');
            this.$http.post('/updateUserInfo.do',{
              userId:this.$store.state.userId,
              messagePush:messagePush
            }).then(res=>{
              if(res.data.success){
                this.$message({message:'修改成功',type:'success'});
                // console.log(messagePush);
                sessionStorage.setItem("messagePush",messagePush);
                // console.log(messagePushArr);
                this.$store.state.messagePush=messagePush;
              }
            })
            // alert(this.friendLoginPush)
          },
          friendMessagePushChange(){
            let messagePushArr=this.$store.state.messagePush.split(",");
            // console.log('去空前：',messagePushArr);
            messagePushArr.findIndex(val=>val=='')!==-1&&(messagePushArr.splice(messagePushArr.findIndex(val=>val==''),1));
            // console.log('去空后：',messagePushArr);
            if(this.friendMessagePush){
              (!messagePushArr.includes('2'))&&(messagePushArr.push('2'))
            }else{
              messagePushArr.includes('2')&&(messagePushArr.splice(messagePushArr.findIndex(val=>val=='2'),1))
            }
            let messagePush=messagePushArr.join(',');
            this.$http.post('/updateUserInfo.do',{
              userId:this.$store.state.userId,
              messagePush:messagePush
            }).then(res=>{
              if(res.data.success){
                this.$message({message:'修改成功',type:'success'});
                sessionStorage.setItem("messagePush",messagePush);
                // console.log(messagePushArr);
                this.$store.state.messagePush=messagePush;
              }
            })
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
