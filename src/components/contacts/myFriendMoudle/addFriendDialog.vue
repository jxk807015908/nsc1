<template>
  <div class="addFriendDialog">
    <dialogs :dialogFlag.sync="dialogFlag" :openTitle="'添加好友'" :isDefaultBtn="false" @close="close" @open="open">
      <div slot="dialogContent">
        <div class="search">
          <el-input :maxlength="20" placeholder="请输入对方账号或昵称" v-model="postParams" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
        <div class="search-result">
          <paging v-if="$store.state.pageSize<total" :total="total" :pageNow="pageNow" @changePage="changePage"></paging>
          <div :class="{checked:checkedIndex===index}" class="user clearfix" :key="index"
               v-for="(obj,index) in searchList" @click="checkedIndex=index">
            <headPortrait :isSave="true" :status="obj.status" :userId="obj.userId" :hasDetail="false" :data="obj"></headPortrait>
            <!--<img class="fl" src="../../../assets/imgages/userBaseHeadImg.png" alt="">-->
            <div class="base-data fl">
              <span>ID:{{obj.userId}}</span>
              <span v-if="!['',null].includes(obj.nickName)">昵称:{{obj.nickName}}</span>
              <span v-if="!['',null].includes(obj.age)">年龄:{{obj.age}}</span>
              <span v-if="!['',null].includes(obj.phone)">手机:{{obj.phone}}</span>
              <span v-if="!['',null].includes(obj.name)">真实姓名:{{obj.name}}</span>
            </div>
            <div class="operate fr">
              <el-button type="primary" @click="addFriend(index)"
                         :disabled="friendList.some(item=>item.friendId==obj.userId)">
                {{friendList.filter(item=>item.friendId==obj.userId).length!==0?friendList.filter(item=>item.friendId==obj.userId)[0].type?'申请中':'已是好友':'添加好友'}}
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
    name: 'addFriendDialog',
    props: ['dialogFlag', 'friendList'],
    data: function () {
      return {
        total:0,
        pageNow:1,
        checkedIndex: '',
        searchList: [],
        postParams: '',
      };
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
        this.searchUserFuzzily();
      },
      addFriend(index) {
        let params = {
          userId: sessionStorage.getItem('userId'),
          userName: this.$store.state.nickName,
          friendId: this.searchList[index].userId,
          friendPolicyType: this.searchList[index].friendPolicyType
        };
        if (this.searchList[index].friendPolicyType === 0) {
          this.$http.post('/addFriend.do', params).then(res => {
            if (res.data.success) {
              if (res.data.msg === '添加成功') {
                this.$message({message: res.data.msg, type: 'success'});
                this.$store.state.socket.emit('sendRemind',{toId:this.searchList[index].userId});
                this.$emit('update:dialogFlag', false);
                (async () => {
                  await this.$parent.getFriendGroup();
                  await this.$parent.getFriend();
                })();
              } else {
                this.$message.error(res.data.msg)
              }
            }
          })
        } else {
          let tip = this.searchList[index].friendPolicyType === 1 ? '请输入验证密码' : this.searchList[index].friendPolicyQuestion;
          this.$prompt(tip, '好友验证', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({value}) => {
            if (['', null].includes(value)) {
              this.$message.error('输入不能为空')
            }else if(value.length>20){
              this.$message.error('输入不能超过20字')
            } else {
              if (this.searchList[index].friendPolicyType === 1) {
                params.friendPolicyPassword = value
              } else {
                params.friendPolicyAnswer = value;
                params.remark = this.searchList[index].friendPolicyQuestion;
              }
              this.$http.post('/checkFriendRequest.do', params).then(res => {
                if (res.data.success) {
                  if (res.data.msg === '验证成功') {
                    this.$http.post('/addFriend.do', params).then(res => {
                      if (res.data.success) {
                        if (res.data.msg === '添加成功') {
                          this.$message({message: res.data.msg, type: 'success'});
                          this.$emit('update:dialogFlag', false);
                          (async () => {
                            await this.$parent.getFriendGroup();
                            await this.$parent.getFriend();
                          })();
                        } else {
                          this.$message.error(res.data.msg)
                        }
                      }
                    })
                  } else if (res.data.msg === '好友请求已发送') {
                    this.$message({message: res.data.msg, type: 'success'});
                    this.$store.state.socket.emit('sendRemind',{toId:this.searchList[index].userId});
                    (async () => {
                      await this.$parent.getFriendGroup();
                      await this.$parent.getFriend();
                    })();
                  } else {
                    this.$message.error(res.data.msg)
                  }
                }
              })
            }
          }).catch(() => {

          });
        }
      },
      searchUserFuzzily(){
        this.$http.post('/searchUserFuzzily.do', {idOrName: this.postParams,pageNo:this.pageNow,pageSize:this.$store.state.pageSize,userId:this.$store.state.userId}).then(res => {
          if (res.data.success) {
            let temp = [];
            this.total=res.data.data.total;
            res.data.data.result.length !== 0 && res.data.data.result.forEach(obj => {
              obj.U_LoginID !== this.$store.state.userId && temp.push({
                userId: obj.U_LoginID,
                nickName: obj.U_NickName,
                age: obj.U_Age,
                phone: obj.U_Telephone,
                name: obj.U_Name,
                status:obj.U_UserStateID,
                friendPolicyType: obj.U_FriendshipPolicyID,
                friendPolicyQuestion: obj.U_FriendPolicyQuestion
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
        this.searchUserFuzzily();
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
  .addFriendDialog {
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
          position: relative;
          .headPortrait {
            display: inline-block;
            float: left;
            width: 50px;
            height: 50px;
            border-radius: 25px;
          }
          .base-data {
            width: calc(~'100% - 50px - 20%');
            span {
              margin-left: 10px;
              margin-right: 10px;
              float: left;
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
