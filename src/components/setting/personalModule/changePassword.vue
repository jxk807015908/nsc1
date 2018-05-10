<template>
  <div class="changePassword">
    <el-row>
      <el-col :span="4"><label for="old-password">原密码:</label></el-col>
      <el-col :span="6"><el-input id="old-password" v-model="oldPassword"></el-input></el-col>
    </el-row>
    <el-row>
      <el-col :span="6" :offset="4">
        <el-alert
          v-if="oldPasswordTip!==''"
          :title="oldPasswordTip"
          :closable="false"
          type="error">
        </el-alert>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><label for="new-password">新密码:</label></el-col>
      <el-col :span="6"><el-input id="new-password" v-model="newPassword" @blur="checkNewPassword"></el-input></el-col>
    </el-row>
    <el-row>
      <el-col :span="6" :offset="4">
        <el-alert
          v-if="newPasswordTip!==''"
          :title="newPasswordTip"
          :closable="false"
          type="error">
        </el-alert>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><label for="confirm-password">确认密码:</label></el-col>
      <el-col :span="6"><el-input id="confirm-password" v-model="confirmPassword" @blur="checkConfirmPassword"></el-input></el-col>
    </el-row>
    <el-row>
      <el-col :span="6" :offset="4">
        <el-alert
          v-if="confirmPasswordTip!==''"
          :title="confirmPasswordTip"
          :closable="false"
          type="error">
        </el-alert>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10"><el-button type="primary" @click="confirm">确定</el-button></el-col>
    </el-row>
  </div>
</template>
<script>
    export default {
        name:'changePassword',
        data: function () {
            return {
              oldPassword:'',
              newPassword:'',
              confirmPassword:'',
              oldPasswordTip:'',
              newPasswordTip:'',
              confirmPasswordTip:'',
            };
        },
        methods:{
          checkConfirmPassword(){
            if(this.confirmPassword==='') {
              this.confirmPasswordTip='密码不能为空';
              return
            }
            if(this.newPassword!==''&&this.newPassword!==this.confirmPassword) {
              this.confirmPasswordTip='密码不一致';
              return
            }
            this.confirmPasswordTip='';
          },
          checkNewPassword(){
            if(this.newPassword==='') {
              this.newPasswordTip='密码不能为空';
              return
            }
            if(this.confirmPassword!==''&&this.newPassword!==this.confirmPassword) {
              this.newPasswordTip='密码不一致';
              return
            }
            this.newPasswordTip='';
          },
          confirm(){
            if(this.newPasswordTip===''&&this.confirmPasswordTip===''&&this.newPassword!==''&&this.confirmPassword!==''&&this.confirmPassword===this.newPassword){
              this.$http.post('/changePassword.do',{
                userId:sessionStorage.getItem('userId'),
                password:this.oldPassword,
                newPassword:this.confirmPassword
              }).then(res=>{
                if(res.data.success){
                  if(res.data.msg){
                    this.oldPasswordTip=res.data.msg
                  }else{
                    this.oldPasswordTip='';
                    this.oldPassword='';
                    this.newPassword='';
                    this.confirmPassword='';
                    this.$message({message:'密码修改成功',type:'success'})
                  }
                }
              })
            }
          },
        }
    }
</script>
<style lang="less">
  .changePassword{
    padding-left: 20%;
    padding-top: 10%;
    .el-row{
      height: 40px;
      text-align: right;
      label{
        margin-right: 5px;
        line-height: 40px;
      }
    }
  }
</style>
