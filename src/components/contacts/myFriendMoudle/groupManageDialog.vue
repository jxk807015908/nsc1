<template>
  <div class="groupManageDialog">
    <dialogs :dialogFlag.sync="dialogFlag" :openTitle="'分组管理'" :isDefaultBtn="false" @close="close" @open="open">
      <div slot="dialogContent">
        <div class="button-field">
          <i class="fa fa-plus-circle"></i><span @click="addGroup">添加分组</span>
        </div>
        <div class="content">
          <div class="group" v-for="(item,index) in groupArr" :key="index">
            <span>{{item.name}}</span>
            <el-button type="danger" class="fr" @click="deleteGroup(index)" :disabled="item.name==='我的好友'">删除</el-button>
          </div>
        </div>
      </div>
      <div slot="footerButton">
        <el-button type="primary" @click="close">完成</el-button>
      </div>
    </dialogs>
  </div>
</template>
<script>
  import dialogs from '../../common/dialogs'
  export default {
        name:'groupManageDialog',
        props:['dialogFlag','openData'],
        data: function () {
            return {
              groupArr:[]
            };
        },
        computed:{

        },
        methods:{
          deleteGroup(index){
            // console.log(this.groupArr);
            // console.log(this.groupArr[index]);
            this.$http.post('/deleteGroup.do',{groupId:this.groupArr[index].value}).then(res=>{
              if(res.data.success){
                this.groupArr.splice(index,1);
                this.refresh()
              }
            })
          },
          addGroup(){
            this.$prompt('请输入组名', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(({ value }) => {
              if(value.length<=20){
                this.$http.post('/addGroup.do',{groupName:value,userId:this.$store.state.userId}).then(res=>{
                  if(res.data.success){
                    this.groupArr.push({
                      name:value,
                      value:res.data.data.insertId
                    });
                    this.refresh();
                  }
                })
              }else{
               this.$message.error('请不要超过20字')
              }
            })
          },
          refresh(){
            (async ()=>{
              await this.$parent.getFriendGroup();
              await this.$parent.getFriend();
            })();
          },
          open(){
            this.groupArr=JSON.parse(JSON.stringify(this.openData))
          },
          close(){
            this.$emit('update:dialogFlag', false)
          }
        },
        components:{
          dialogs
        }
    }
</script>
<style lang="less">
  .groupManageDialog{
    .el-dialog{
      width: 20%;
      .button-field{
        i{
          margin-right: 5px;
        }
        span{
          cursor:pointer;
        }
      }
      .content{
        .group{
          .el-button{
            line-height: normal;
            min-width: auto;
            height: 20px;
          }
        }
      }
    }
  }
</style>
