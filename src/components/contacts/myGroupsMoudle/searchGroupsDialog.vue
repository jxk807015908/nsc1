<template>
  <div class="searchGroupsDialog">
    <dialogs :dialogFlag.sync="dialogFlag" :openTitle="'搜索群'" :isDefaultBtn="false" @close="close" @open="open">
      <div slot="dialogContent">
        <div class="search">
          <el-input :maxlength="20" placeholder="请输入群ID或名称" v-model="postParams" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
        <div class="search-result">
          <paging v-if="$store.state.pageSize<total" :total="total" :pageNow="pageNow" @changePage="changePage"></paging>
          <div :class="{checked:checkedIndex===index}" class="user clearfix" :key="index"
               v-for="(obj,index) in searchList" @click="checkedIndex=index">
            <headPortrait :isSave="true" :imgUrl="obj.groupIcon"
                          @imgClick="$parent.imgClick(obj.groupId)"></headPortrait>
            <div class="base-data fl">
              <p>ID:{{obj.groupId}}</p>
              <p v-if="!['',null].includes(obj.groupName)">名称:{{obj.groupName}}</p>
            </div>
            <div class="operate fr">
              <el-button type="primary" @click="requestJoinGroup(index)" :disabled="groupsList.requestGroup.some(item=>item.groupId==obj.groupId)||groupsList.joinGroup.some(item=>item.groupId==obj.groupId)||groupsList.createGroup.some(item=>item.groupId==obj.groupId)">
                {{groupsList.requestGroup.some(item=>item.groupId==obj.groupId)?'已申请':(groupsList.joinGroup.some(item=>item.groupId==obj.groupId)||groupsList.createGroup.some(item=>item.groupId==obj.groupId))?'已在群中':'申请加入'}}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </dialogs>
  </div>
</template>

<script>
  import dialogs from '../../common/dialogs'
  import paging from '../../common/paging'
  import headPortrait from '../../common/headPortrait'

  export default {
    name: "searchGroupsDialog",
    props: ['dialogFlag','groupsList'],
    data: function () {
      return {
        total:0,
        pageNow:1,
        postParams: '',
        checkedIndex: '',
        searchList: []
      }
    },
    methods: {
      open(){
        this.pageNow=1;
        this.total=0;
        this.postParams='';
        this.searchList=[];
      },
      changePage(page){
        this.pageNow=page;
        this.searchGroupsFuzzily();
      },
      requestJoinGroup(index) {
        let params = {
          userId: sessionStorage.getItem('userId'),
          userName: this.$store.state.nickName,
          group: this.searchList[index],
        };
        this.$http.post('/requestJoinGroup.do', params).then(res => {
          if (res.data.success) {
            this.$message({message:'发送请求成功', type: 'success'});
            this.$parent.getAllGroups();
            this.$store.state.socket.emit('sendRemind',{
              toId:this.searchList[index].groupId,
              type:2
            })
          }
        })
      },
      searchGroupsFuzzily(){
        this.$http.post('/searchGroupsFuzzily.do', {idOrName: this.postParams,pageNo:this.pageNow,pageSize:this.$store.state.pageSize}).then(res => {
          if (res.data.success) {
            let temp = [];
            this.total=res.data.data.total;
            res.data.data.result.length !== 0 && res.data.data.result.forEach(obj => {
              temp.push({
                groupId: obj.UG_ID,
                groupIcon: obj.UG_Icon,
                groupName: obj.UG_Name,
              })
            });
            this.searchList = temp;
          }
        })
      },
      search() {
        if (this.postParams === '') {
          this.$message.error('输入不能为空');
          return;
        }
        this.pageNow=1;
        this.total=0;
        this.searchGroupsFuzzily();
      },
      close() {
        this.$emit('update:dialogFlag', false)
      }
    },
    components: {
      dialogs,
      headPortrait,
      paging
    }
  }
</script>

<style lang="less">
  .searchGroupsDialog {
    .el-dialog {
      width: 30%;
      .search {
        .el-input__inner {
          height: 30px;
        }
      }
      .el-pagination{
        text-align: right;
        margin-top: 5px;
        margin-bottom: 5px;
      }
      .search-result {
        //margin-top: 5px;
        .checked {
          border: 1px solid #66b1ff;
        }
        .user {
          margin-top: 10px;
          font-size: 12px;
          .headPortrait {
            display: inline-block;
            float: left;
            width: 50px;
            height: 50px;
            border-radius: 25px;
          }
          .base-data {
            width: calc(~'100% - 50px - 20%');
            p {
              margin-right: 10px;
              margin-left: 10px;
            }
          }
          .operate {
            width: 20%;
            .el-button {
              min-width: 0;
              width: 100%;
              font-size: 12px;
              padding: 0;
              margin-top: 10px;
              height: 30px;
            }
          }
        }

      }
    }
  }
</style>
