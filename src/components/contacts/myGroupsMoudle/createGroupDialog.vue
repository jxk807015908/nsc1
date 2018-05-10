<template>
  <div class="createGroupDialog">
    <dialogs :dialogFlag.sync="dialogFlag" :openTitle="'创建群'" :isDefaultBtn="false" @close="close" @open="open">
      <div slot="dialogContent">
        <div class="upload-wrap">
          <el-upload
            ref="uploadGroupIcon"
            :auto-upload="false"
            :show-file-list="false"
            :data="{groupId:groupId,groupName:groupName,userId:$store.state.userId}"
            class="avatar-uploader"
            :action='`/uploadGroupIcon.do?groupId=${groupId}`'
            :file-list="fileList"
            :on-change="change"
            :on-progress="onUploading"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="input-group">
          <el-row>
            <el-input v-model="groupId" placeholder="请写群ID" @blur="checkGroupId"></el-input>
            <span :class="{groupTip:true,isError:[1,3].includes(groupIdTip)}">{{translateGroupIdTip(groupIdTip)}}</span>
          </el-row>
          <el-row>
            <el-input v-model="groupName" placeholder="请写群名称" @blur="checkGroupName"></el-input>
            <span :class="{groupTip:true,isError:[1,3].includes(groupNameTip)}">{{translateGroupIdTip(groupNameTip)}}</span>
          </el-row>
          <el-row>
            <el-button type="primary" @click="createGroup">创建</el-button>
          </el-row>
        </div>
      </div>
    </dialogs>
  </div>
</template>
<script>
  import dialogs from '../../common/dialogs'
  export default {
        name:'createGroupDialog',
        props:['dialogFlag'],
        data: function () {
            return {
              imageUrl:'',
              fileList:[],
              groupName:'',
              groupId:'',
              groupIdTip:0,
              groupNameTip:0
            };
        },
        mounted(){

        },
        methods:{
          open(){
            this.fileList=[];
            this.groupName='';
            this.groupId='';
            this.groupNameTip='';
            this.groupIdTip='';
            this.imageUrl='';
          },
          translateGroupIdTip(n){
            switch (n){
              case 1:
                return '输入不能为空';
              case 2:
                return '可以使用';
              case 3:
                return '该ID以被注册';
              default:return null;
            }
          },
          checkGroupName(){
            if(this.groupName===''){
              this.groupNameTip=1;
            }else{
              this.groupNameTip=0;
            }
          },
          checkGroupId(){
            if(this.groupId===''){
              this.groupIdTip=1;
              return;
            }
            this.$http.post('/checkGroupId.do',{groupId:this.groupId}).then(res=>{
              if(res.data.success){
                this.groupIdTip=2
              }else{
                this.groupIdTip=3
              }
            })
          },
          createGroup(){
            let isErr=false;
            if(this.groupIdTip!==2) {
              this.groupIdTip===0&&(this.groupIdTip=1);
              isErr=true;
            }
            if(this.groupName===''){
              this.groupNameTip=1;
              isErr=true;
            }
            if(this.fileList.length===0){
              this.$message.error('请设置群图标');
              return
            }
            (!isErr)&&this.$refs.uploadGroupIcon.submit();
          },
          change(file, fileList){
            let nameArr=file.name.split('.');
            let type=nameArr[nameArr.length-1].toLowerCase();
            const isLt2M = file.size / 1024 / 1024 < 2;
            const isTrueFormat = /jpeg|jpg|png|gif/i.test(type);
            !isLt2M&&this.$message.error('图片不能超过2Mb')
            !isTrueFormat&&this.$message.error('不识别此格式文件');
            if(isLt2M&&isTrueFormat){
              this.fileList=[fileList[fileList.length-1]];
              this.imageUrl = URL.createObjectURL(file.raw);
            }else{
              this.fileList=[fileList[0]];
            }
          },
          onUploading(event, file, fileList){
            console.log(event);
            console.log(file);
            console.log(fileList)
          },
          handleAvatarSuccess(res, file) {
            if(res.success){
              this.$http.post('/createGroup.do',{
                groupId:this.groupId,
                groupName:this.groupName,
                userId:this.$store.state.userId,
                icon:res.data,
              }).then(res=>{
                if(res.data.success){
                  this.$message({message:'创建群成功',type:'success'});
                  this.$emit("update:dialogFlag",false);
                  this.$parent.getAllGroups();
                }
              });
            }
          },
          beforeAvatarUpload(file) {
            console.log(file);
            let nameArr=file.name.split('.');
            let type=nameArr[nameArr.length-1].toLowerCase();
            const isLt2M = file.size / 1024 / 1024 < 2;
            const isTrueFormat = /jpeg|jpg|png|gif/i.test(type);
            !isLt2M&&this.$message.error('图片不能超过2Mb')
            !isTrueFormat&&this.$message.error('不识别此格式文件');
            return isTrueFormat&&isLt2M;
          },
          close(){
            this.$emit('update:dialogFlag',false)
          }
        },
        components:{
          dialogs
        }
    }
</script>
<style lang="less">
  .createGroupDialog{
    .el-dialog{
      width: 40%;
      min-width: 300px;
      .input-group{
        text-align: center;
        .groupTip{
          font-size: 12px;
          position: absolute;
          top:18px;
          color: lawngreen;
        }
        .isError{
          color: red;
        }
        .el-input{
          margin-top: 10px;
          width: 200px;
          .el-input__inner{
            border-radius: 0;
            border-right: none;
            border-left: none;
            border-top: none;
          }
        }
        .el-button{
          margin-top: 30px;
        }
      }
      .upload-wrap{
        text-align: center;
        .avatar-uploader .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
          border-color: #409EFF;
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 100px;
          height: 100px;
          line-height: 100px;
          text-align: center;
        }
        .avatar {
          width: 100px;
          height: 100px;
          display: block;
        }
      }
    }

  }
</style>
