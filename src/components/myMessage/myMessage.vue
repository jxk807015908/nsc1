<template>
  <div class="myMessage">
    <el-container>
      <el-aside width="200px">
        <div class="message-group">
          <remind v-for="(item,index) in remindList" :key="index" :data="item" :index="index"
                  @messageCheck="messageCheck" @deleteRemind="deleteRemind" :isChecked="checkedIndex===index"></remind>
        </div>
      </el-aside>
      <el-container>
        <div class="detail" v-if="checkedIndex!==''">
          <div v-if="remindList[checkedIndex].messageType==='2'" class="proving">
            <p><span>{{remindList[checkedIndex].fromName||remindList[checkedIndex].fromId}}</span>向您发来好友验证:</p>
            <p class="question">您的问题:{{remindList[checkedIndex].remark}}</p>
            <p class="answer">对方回答:{{remindList[checkedIndex].message}}</p>
            <p class="time">日期:{{remindList[checkedIndex].time}}</p>
            <el-button type="primary" @click="addFriend">同意</el-button>
            <el-button type="danger" @click="rejectRequest">拒绝</el-button>
          </div>
          <div v-if="remindList[checkedIndex].messageType==='3'" class="proving">
            <p><span>{{remindList[checkedIndex].fromName||remindList[checkedIndex].fromId}}</span>与你已成为好友</p>
            <p class="time">日期:{{remindList[checkedIndex].time}}</p>
          </div>
          <div v-if="remindList[checkedIndex].messageType==='4'" class="proving">
            <p><span>{{remindList[checkedIndex].fromName||remindList[checkedIndex].fromId}}</span>与你已解除好友关系</p>
            <p class="time">日期:{{remindList[checkedIndex].time}}</p>
          </div>
          <div v-if="remindList[checkedIndex].messageType==='5'" class="proving">
            <p><span>{{remindList[checkedIndex].fromName||remindList[checkedIndex].fromId}}</span>拒绝了你的好友邀请:</p>
            <p class="question">对方的问题:{{remindList[checkedIndex].remark}}</p>
            <p class="answer">您回答:{{remindList[checkedIndex].message}}</p>
            <p class="time">日期:{{remindList[checkedIndex].time}}</p>
          </div>
          <div v-if="remindList[checkedIndex].messageType==='6'" class="proving">
            <p><span>{{remindList[checkedIndex].fromName||remindList[checkedIndex].fromId}}</span>邀你加入群:<span>{{remindList[checkedIndex].remark.groupName}}</span>
            </p>
            <p class="time">日期:{{remindList[checkedIndex].time}}</p>
            <el-button type="primary" @click="joinGroup">同意</el-button>
            <el-button type="danger" @click="rejectRequest">拒绝</el-button>
          </div>
          <div v-if="remindList[checkedIndex].messageType==='7'" class="proving">
            <p><span>{{remindList[checkedIndex].fromName||remindList[checkedIndex].fromId}}</span>拒绝了关于其加入群:<span>{{remindList[checkedIndex].remark.groupName}}</span>的邀请
            </p>
            <p class="time">日期:{{remindList[checkedIndex].time}}</p>
          </div>
          <div v-if="remindList[checkedIndex].messageType==='8'" class="proving">
            <p><span>{{remindList[checkedIndex].fromName||remindList[checkedIndex].fromId}}</span>请求入群:<span>{{remindList[checkedIndex].remark.groupName}}</span>
            </p>
            <p class="time">日期:{{remindList[checkedIndex].time}}</p>
            <el-button type="primary" @click="joinGroup">同意</el-button>
            <el-button type="danger" @click="rejectRequest">拒绝</el-button>
          </div>
          <div v-if="remindList[checkedIndex].messageType==='9'" class="proving">
            <p><span>{{remindList[checkedIndex].fromName||remindList[checkedIndex].fromId}}</span>拒绝了关于你加入群:<span>{{remindList[checkedIndex].remark.groupName}}</span>的请求
            </p>
            <p class="time">日期:{{remindList[checkedIndex].time}}</p>
          </div>
        </div>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  import remind from '../common/remind'
  import {timeFormat} from '../../util/common'

  export default {
    name: 'myMessage',
    data: function () {
      return {
        remindList: [],
        checkedIndex: ''
      };
    },
    components: {
      remind
    },
    created() {
      this.getAllRemind();
    },
    methods: {
      joinGroup() {
        let params = {
          groupId: this.remindList[this.checkedIndex].remark.groupId,
          fromId: this.remindList[this.checkedIndex].fromId,
          messageType: this.remindList[this.checkedIndex].messageType
        };
        if (params.messageType == '8') {
          params.userId = this.remindList[this.checkedIndex].fromId;
        } else {
          params.userId = this.$store.state.userId;
        }
        this.$http.post('/joinGroup2.do', params).then(res => {
          if (res.data.success) {
            this.$message({message: '成功加群', type: 'success'});
            this.checkedIndex = '';
            this.getAllRemind();
          }
        })
      },
      messageCheck(index) {
        this.checkedIndex = index;
      },
      deleteRemind(index) {
        this.$http.post('/deleteRemind.do', {id: this.remindList[index].id}).then(res => {
          if (res.data.success) {
            let curId;
            if (this.checkedIndex !== '') {
              curId = this.remindList[this.checkedIndex].id;
            }
            this.checkedIndex = '';
            this.getAllRemind().then(() => {
              if (curId !== undefined) {
                let findIndex = this.remindList.findIndex(obj => obj.id === curId);
                this.checkedIndex = findIndex === -1 ? '' : findIndex;
              }
            });
          }
        })
      },
      rejectRequest() {
        let params = {
          fromName: this.$store.state.nickName,
          toId: sessionStorage.getItem('userId'),
          fromId: this.remindList[this.checkedIndex].fromId,
          id: this.remindList[this.checkedIndex].id,
          messageType: this.remindList[this.checkedIndex].messageType
        };
        if (params.messageType == '8') {
          params.groupId = this.remindList[this.checkedIndex].remark.groupId;
        }
        this.$http.post('/rejectRequest.do', params).then(res => {
          if (res.data.success) {
            this.$message({message: '已拒绝', type: 'success'});
            this.checkedIndex = '';
            this.getAllRemind();
          }
        })
      },
      addFriend() {
        this.$http.post('/addFriend.do', {
          userId: sessionStorage.getItem('userId'),
          userName: this.$store.state.nickName,
          friendId: this.remindList[this.checkedIndex].fromId
        }).then(res => {
          if (res.data.success) {
            if (res.data.msg === '添加成功') {
              this.$message({message: res.data.msg, type: 'success'});
              this.$http.post('/deleteRemind.do', {id: this.remindList[this.checkedIndex].id}).then(res => {
                if (res.data.success) {
                  this.checkedIndex = '';
                  this.getAllRemind();
                }
              })
            } else {
              this.$message.error(res.data.msg)
            }
          }
        })
      },
      getAllRemind() {
        return new Promise(resolve => {
          this.$http.post('/getAllRemind.do', {userId: sessionStorage.getItem('userId')}).then(res => {
            if (res.data.success) {
              let temp = [];
              res.data.data.forEach(obj => {
                temp.push({
                  fromId: obj.UM_FromID,
                  fromName: obj.UM_FromName,
                  message: obj.UM_Message,
                  time: timeFormat(parseInt(obj.UM_Time), 'yyyy-MM-dd HH:mm'),
                  messageType: obj.UM_MessageType,
                  remark: ['6', '7', '8', '9'].includes(obj.UM_MessageType) ? JSON.parse(obj.UM_Remark) : obj.UM_Remark,
                  id: obj.UM_ID
                })
              });
              this.remindList = temp;
              console.log(this.remindList);
              resolve();
            }
          })
        })
      }
    }
  }
</script>
<style lang="less">
  .myMessage {
    height: 100%;
    > .el-container {
      height: 100%;
      .el-aside {
        background: rgb(84, 92, 100);
      }
      .detail {
        width: 100%;
        .proving {
          width: 300px;
          margin-left: 40%;
          margin-top: 10%;
          p {
            span {
              color: blue;
            }
            span:hover {
              text-decoration: underline;
              cursor: pointer;
            }
          }
          p:nth-of-type(1) {
            margin-bottom: 10px;
          }
          p.question {
            margin-left: 30px;
          }
          p.answer {
            margin-left: 30px;
            margin-bottom: 30px;
          }
          p.time {
            text-align: right;
            font-size: 12px;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
</style>
