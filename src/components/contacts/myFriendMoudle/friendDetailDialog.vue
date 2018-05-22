<template>
  <div class="friendDetailDialog">
    <dialogs :dialogFlag.sync="dialogFlag" :openTitle="'ID:'+openData.userId" :isDefaultBtn="false" @close="close" @open="open">
      <div slot="dialogContent">
        <div class="headImg">
          <headPortrait :isSave="false" :userId="openData.userId"></headPortrait>
        </div>
        <el-row>
          <el-col :span="12">昵称：</el-col>
          <el-col :span="12">{{openData.nickName||'暂无'}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">年龄：</el-col>
          <el-col :span="12">{{openData.age||'暂无'}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">电话：</el-col>
          <el-col :span="12">{{openData.phone||'暂无'}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">生日：</el-col>
          <el-col :span="12">{{openData.birthday?timeFormat(parseInt(openData.birthday), 'yyyy-MM-dd'):'暂无'}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">邮箱：</el-col>
          <el-col :span="12">{{openData.email||'暂无'}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">真实姓名：</el-col>
          <el-col :span="12">{{openData.name||'暂无'}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">性别：</el-col>
          <el-col :span="12">{{openData.sex==='1'?'男':openData.sex==='0'?'女':'暂无'}}</el-col>
        </el-row>
      </div>
    </dialogs>
  </div>
</template>
<script>
  import dialogs from '../../common/dialogs'
  import headPortrait from './../../common/headPortrait'
  import {timeFormat} from '../../../util/common'
  export default {
    name: 'friendDetailDialog',
    props: ['dialogFlag', 'openData'],
    data: function () {
      return {
        timeFormat:timeFormat
      };
    },
    methods: {
      open() {

      },
      close(){
        this.$emit('update:dialogFlag',false)
      }
    },
    components: {
      dialogs,
      headPortrait
    }
  }
</script>
<style lang="less">
  .friendDetailDialog {
    .el-dialog {
      width: 30%;
      min-width: 300px;
      .headImg{
        text-align: center;
        .headPortrait{
          display: inline-block;
          width: 50px;
          height: 50px;
        }
      }
      .el-row{
        .el-col:nth-of-type(1){
          text-align: right;
        }
      }
    }
  }
</style>
