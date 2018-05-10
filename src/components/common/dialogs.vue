<template>
  <el-dialog @close="close" :title="openTitle" :before-close="confirmClose" :visible.sync="dialogFlag" :close-on-click-modal="false" @open="open">
    <slot name="dialogContent"></slot>
    <div slot="footer" class="dialog-footer">
      <div class="tip" v-if="tip">{{tip}}</div>
      <slot name="footerButton"></slot>
      <div v-if="isDefaultBtn!==false">
        <el-button :disabled="isSaveLoading" :loading="isSaveLoading" type="primary" @click="save">保存</el-button>
        <el-button @click="close">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
    export default {
      name:'dialogs',
      props:['dialogFlag','openTitle','tip','openData','isDefaultBtn','isBeforeClose','isSaveLoading'],
      methods:{
        confirmClose(done){
          if(this.isBeforeClose===true) {
            this.$emit('confirmClose')
            return;
          }
          done();
        },
        save(){
          this.$emit('save')
        },
        close(){
          this.$emit('update:dialogFlag', false)
          this.$emit('close')
        },
        open(){
          this.$emit('open')
        }
      }
    }
</script>

<style lang='less'>
  .el-dialog *{
    box-sizing: border-box;
  }
  .el-dialog__header{
    font-size:16px;
    background:#38ADFF;
    padding-top:0;
    padding-bottom:0;
    line-height:35px;
    span{
      color:#fff;
    }
    .el-dialog__headerbtn{
      font-size:20px;
      top: 8px;
      i{
        color:#fff;
      }
    }
  }
  .dialog-footer{
    text-align: center;
    margin-top:10px;
    position: relative;
  }
  .el-dialog__body{
    padding-top: 10px;
    padding-bottom:0;
    label{
      margin-right:8px;
    }
  }
  .min-box{
    width:31.33%;
  }
  .min-box,.mid-box,.max-box{
    margin:0 1%;
  }
  .mid-box{
    width:48%;
  }
  .max-box{
    width:98%;
  }
  .open-input-box>div{
    margin-bottom:20px;
    line-height:34px;
    >span{
      float:left;
      color:#FC5D5D;
      width:7px;
    }
    >label{
      float:left;
      color:#000000;
    }
  }
  .tip{
    text-align: center;
    color:#FC5D5D;
    font-size:16px;
    width: 100%;
    position: absolute;
    top:-30px;
  }
</style>
