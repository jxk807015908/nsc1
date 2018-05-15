<template>
  <div class="groupDetailDialog">
    <friendDetailDialog :dialogFlag.sync="friendDetailFlag" :openData="friendDetailData"></friendDetailDialog>
    <dialogs :dialogFlag.sync="dialogFlag" :openTitle="'ID:'+openData.groupId" :isDefaultBtn="false" @close="close"
             @open="open">
      <div slot="dialogContent">
        <div class="upload-wrap">
          <el-upload
            ref="uploadGroupIcon"
            :disabled="openData.adminId !== $store.state.userId"
            :show-file-list="false"
            :auto-upload="false"
            class="avatar-uploader"
            :action='`/uploadGroupIcon.do?groupId=${openData.groupId}`'
            :file-list="fileList"
            :on-change="change"
            :on-success="handleAvatarSuccess">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="group-nick">
          <el-row>
            <el-col :span="17"><span>群名：</span></el-col>
            <el-col :span="7">
              <span v-if="$store.state.userId!==openData.adminId">{{params.groupName}}</span>
              <el-input v-else v-model="params.groupName"></el-input>
            </el-col>
          </el-row>
        </div>
        <div class="group-nick"
             v-if="openData.members&&openData.members&&openData.members.some(obj =>obj.memberId === $store.state.userId)">
          <el-row>
            <el-col :span="17"><span>我的群片名：</span></el-col>
            <el-col :span="7">
              <el-input v-model="params.groupNick"></el-input>
            </el-col>
          </el-row>
        </div>
        <!--<el-collapse @change="handleChange">-->
        <!--<el-collapse-item title="群成员" name="1">-->
        <!--<div class="member-wrap">-->
        <!--<div class="member" v-for="obj in openData.members">-->
        <!--<headPortrait :userId="obj.memberId"></headPortrait>-->
        <!--<p>{{obj.memberId}}</p>-->
        <!--</div>-->
        <!--</div>-->
        <!--</el-collapse-item>-->
        <!--</el-collapse>-->
        <el-popover
          popper-class="members-popover"
          ref="members"
          placement="right"
          trigger="click">
          <el-popover
            popper-class="friends-popover"
            ref="friendList"
            placement="left"
            @show="show"
            trigger="click">
            <div class="my-group">
              <el-menu
                @select="select"
                default-active="2"
                class="el-menu-vertical-demo"
                background-color="#FFFFFF"
                text-color="#606266"
                active-text-color="#606266">
                <el-submenu v-for="(item,index) in friendGroup" :key="index" :index="item.value+''">
                  <template slot="title"><span>{{item.name}}</span></template>
                  <el-menu-item v-for="(friend,index2) in item.content" :key="index2" :index="friend.friendId">
                    <div>
                      <headPortrait @imgClick="imgClick" :indexPath="friend.friendId" :isSave="true"
                                    :userId="friend.friendId"></headPortrait>
                      {{friend.remark||friend.nickName||friend.friendId}}
                    </div>
                  </el-menu-item>
                </el-submenu>
              </el-menu>
            </div>
          </el-popover>
          <div v-popover:friendList
               v-if="openData.members&&openData.members.some(obj =>obj.memberId === $store.state.userId)"><i
            class="el-icon-plus"></i><span>邀请新成员</span></div>
          <div class="table-box">
            <!--<table>-->
            <!--<tr v-for="obj in openData.members" :key="obj.memberId">-->
            <!--<td><headPortrait :userId="obj.memberId"></headPortrait></td>-->
            <!--<td>{{obj.groupNick||obj.memberId}}</td>-->
            <!--<td><span>{{obj.authority===1?'群主':obj.authority===3?'群员':''}}</span></td>-->
            <!--</tr>-->
            <!--</table>-->
            <ul>
              <li v-for="obj in openData.members" :key="obj.memberId">
                <el-row>
                  <el-col :span="8">
                    <headPortrait @imgClick="imgClick" :indexPath="obj.memberId" :userId="obj.memberId"></headPortrait>
                  </el-col>
                  <el-col :span="8">{{obj.groupNick||obj.memberId}}</el-col>
                  <el-col :span="8"><span>{{obj.authority===1?'群主':obj.authority===3?'群员':''}}</span></el-col>
                </el-row>
                <div class="operation">
                  <a v-if="openData.adminId === $store.state.userId && openData.adminId!== obj.memberId"
                     href="javascript:;" title="移交群主" @click="changeAdmin(obj)">移交</a>
                  <a v-if="$store.state.userId=== obj.memberId" href="javascript:;" title="退出该群"
                     @click="quitGroup">退出</a>
                  <a v-if="openData.adminId === $store.state.userId && openData.adminId!== obj.memberId"
                     href="javascript:;" title="请离该群" @click="moveOutMember(obj)">请离</a>
                </div>
              </li>
            </ul>
          </div>
        </el-popover>
        <div class="member-wrap" v-popover:members>
          <span>群成员</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="group-intro">
          <el-row>
            <el-col :span="24">群介绍：</el-col>
            <el-col :span="23" :offset="1">
              <p>本群创建于{{new Date(parseInt(openData.createTime,10)).toLocaleString().split(' ')[0]}}</p>
              <el-input v-if="$store.state.userId===openData.adminId" v-model="params.groupIntro" type="textarea"
                        placeholder="请输入群介绍"></el-input>
              <span v-else>{{openData.groupIntro}}</span>
            </el-col>
          </el-row>
        </div>
        <div class="button">
          <el-button v-if="openData.members&&openData.members.some(obj =>obj.memberId === $store.state.userId)"
                     type="primary" @click="saveGroupDetail">保存
          </el-button>
          <el-button v-if="openData.members&&openData.members.some(obj =>obj.memberId === $store.state.userId)"
                     type="primary" @click="quitGroup">退出本群
          </el-button>
          <el-button v-if="$store.state.userId===openData.adminId" type="primary" @click="dismissGroup">解散本群</el-button>
          <!--<el-button v-if="openData.members&&!openData.members.some(obj =>obj.memberId === $store.state.userId)" type="primary" @click="" :disabled="groupsList.requestGroup.some(item=>item.groupId==openData.groupId)||groupsList.joinGroup.some(item=>item.groupId==openData.groupId)||groupsList.createGroup.some(item=>item.groupId==openData.groupId)" @click="requestJoinGroup">-->
          <!--{{groupsList.requestGroup.some(item=>item.groupId==openData.groupId)?'已申请':'申请加入'}}-->
          <!--</el-button>-->
        </div>
      </div>
    </dialogs>
  </div>
</template>
<script>
  import dialogs from '../../common/dialogs'
  import headPortrait from './../../common/headPortrait'
  import friendDetailDialog from './../myFriendMoudle/friendDetailDialog'

  export default {
    name: 'groupDetailDialog',
    props: ['dialogFlag', 'openData', 'groupsList'],
    data: function () {
      return {
        fileList: [],
        imageUrl: '',
        params: {
          groupNick: '',
          groupIntro: '',
          groupName: ''
        },
        friendGroup: [],
        friendDetailData: {},
        friendDetailFlag: false
      };
    },
    methods: {
      open() {
        this.fileList = [{
          name: 'groupIcon',
          url: `http://${this.$store.state.statisFileIp}${this.openData.groupIcon}`
        }];
        this.imageUrl = `http://${this.$store.state.statisFileIp}${this.openData.groupIcon}`;
        console.log(this.openData);
        this.params.groupIntro = this.openData.groupIntro;
        this.params.groupName = this.openData.groupName;
        this.params.groupNick = (this.openData.members.filter(obj => obj.memberId === this.$store.state.userId)[0] && this.openData.members.filter(obj => obj.memberId === this.$store.state.userId)[0].groupNick) || this.$store.state.nickName || this.$store.state.userId;
      },
      imgClick(indexPath) {
        // this.$parent.openFriendDetail(indexPath);
        this.$http.post('/getUserInfo.do', {userId: indexPath}).then(res => {
          if (res.data.success) {
            this.friendDetailData = {
              userId: res.data.data[0].U_LoginID,
              nickName: res.data.data[0].U_NickName,
              age: res.data.data[0].U_Age,
              birthday: res.data.data[0].U_Birthday,
              phone: res.data.data[0].U_Telephone,
              email: res.data.data[0].U_Email,
              name: res.data.data[0].U_Name,
              sex: res.data.data[0].U_Sex
            };
            this.friendDetailFlag = true;
          }
        })
      },
      requestJoinGroup() {
        let group = JSON.parse(JSON.stringify(this.openData));
        delete group.members;
        let params = {
          userId: sessionStorage.getItem('userId'),
          userName: this.$store.state.nickName,
          group: group,
        };
        this.$http.post('/requestJoinGroup.do', params).then(res => {
          if (res.data.success) {
            this.$message({message: '发送请求成功', type: 'success'});
            this.$parent.getAllGroups();
          }
        })
      },
      changeAdmin(member) {
        this.$http.post('/changeAdmin.do', {
          groupId: this.openData.groupId,
          adminId: member.memberId,
          userId: this.$store.state.userId
        }).then(res => {
          if (res.data.success) {
            this.$message({message: '群主权限已转移', type: 'success'});
            this.openData.members = this.openData.members.map(obj => {
              if (obj.memberId === this.$store.state.userId) {
                obj.authority = 3;
              }
              if (obj.memberId === member.memberId) {
                obj.authority = 1;
              }
              return obj
            })
            this.openData.adminId = member.memberId;
          }
        })
      },
      moveOutMember(member) {
        this.$http.post('/moveOutMember.do', {groupId: this.openData.groupId, userId: member.memberId}).then(res => {
          if (res.data.success) {
            this.$message({message: '请离成功', type: 'success'});
            this.openData.members = this.openData.members.filter(obj => obj.memberId !== member.memberId);
          }
        })
      },
      quitGroup() {
        if (this.openData.members.length === 1) {
          this.$confirm('群中只剩你一人，是否解散此群?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.dismissGroup();
          });
        } else {
          if (this.openData.adminId === this.$store.state.userId) {
            this.$message.error({message: '请移交群主职位后，再退出！'});
            return;
          }
          let post = {
            groupId: this.openData.groupId,
            userId: this.$store.state.userId
          };
          this.$http.post('/quitGroup.do', post).then(res => {
            if (res.data.success) {
              console.log(this.$refs.members.$el)
              console.log(document.getElementsByClassName('members-popover'));
              document.getElementsByClassName('members-popover')[0].blur();
              // document.getElementsByClassName('members-popover')[0].style.display='none';
              this.$message({message: '成功退出', type: 'success'});
              this.$parent.getAllGroups();
              this.$emit('update:dialogFlag', false);
            }
          })
        }
      },
      dismissGroup() {
        this.$http.post('/dismissGroup.do', {
          groupId: this.openData.groupId,
          userId: this.$store.state.userId
        }).then(res => {
          if (res.data.success) {
            this.$message({message: '成功解散', type: 'success'});
            this.$parent.getAllGroups();
            this.$emit('update:dialogFlag', false);
          }
        })
      },
      saveGroupDetail() {
        if (this.params.groupNick === '') {
          this.$message.error('群片名不能为空');
          return
        }
        this.$http.post('/saveGroupDetail.do', {
          userId: this.$store.state.userId,
          groupId: this.openData.groupId,
          groupName: this.params.groupName,
          groupNick: this.params.groupNick,
          groupIntro: this.params.groupIntro,
        }).then(res => {
          if (res.data.success) {
            this.$message({message: '保存成功', type: 'success'});
            this.$parent.getAllGroups();
            this.$emit('update:dialogFlag', false);
          }
        })
      },
      select(index, indexPath) {
        if (this.openData.members.some(obj => obj.memberId === index)) {
          this.$message.error('该用户已在群中');
          return;
        }
        let remark = this.openData;
        delete remark.members;
        this.$http.post('/inviteGroup.do', {
          toId: index,
          fromId: this.$store.state.userId,
          remark: remark,
          fromName: this.$store.state.nickName
        }).then(res => {
          if (res.data.success) {
            this.$message({message: '已发送邀请', type: 'success'})
          }
        })
      },
      handleChange() {

      },
      getFriend() {
        return new Promise(resolve => {
          this.$http.post('/getFriend.do', {userId: sessionStorage.getItem('userId')}).then(res => {
            if (res.data.success) {
              this.friendGroup.forEach((obj, index) => {
                this.friendGroup[index].content = [];
              });
              res.data.data.forEach((obj) => {
                this.friendGroup.forEach((item, index) => {
                  if (item.value == obj.F_FriendGroupsID) {
                    this.friendGroup[index].content.push({
                      remark: obj.F_Name,
                      nickName: obj.U_NickName,
                      friendId: obj.F_FriendID
                    })
                  }
                })
              });
              resolve();
            }
          });
        })
      },
      getFriendGroup() {
        return new Promise(resolve => {
          // this.friendGroup=[];
          this.$http.post('/getFriendGroup.do', {userId: this.$store.state.userId}).then(res => {
            if (res.data.success) {
              let temp = [];
              res.data.data.forEach((obj, index) => {
                temp.push({
                  name: obj.FG_Name,
                  value: obj.FG_ID,
                  content: []
                })
              });
              this.friendGroup = temp;
              resolve();
            }
          })
        })
      },
      show() {
        (async () => {
          await this.getFriendGroup()
          await this.getFriend()
          // console.log(this.friendGroup)
        })()
      },
      change(file, fileList) {
        let nameArr = file.name.split('.');
        let type = nameArr[nameArr.length - 1].toLowerCase();
        const isLt2M = file.size / 1024 / 1024 < 2;
        const isTrueFormat = /jpeg|jpg|png|gif/i.test(type);
        !isLt2M && this.$message.error('图片不能超过2Mb')
        !isTrueFormat && this.$message.error('不识别此格式文件');
        if (isLt2M && isTrueFormat) {
          this.fileList = [fileList[fileList.length - 1]];
          this.imageUrl = URL.createObjectURL(file.raw);
          this.$refs.uploadGroupIcon.submit();
        } else {
          this.fileList = [fileList[0]];
        }
      },
      handleAvatarSuccess(res, file) {
        if (res.success) {
          this.$message({message: '群头像设置成功', type: 'success'});
          let img = document.getElementsByClassName(`group${this.openData.groupId}`)[0].getElementsByTagName('img')[1];
          img.src = `http://${this.$store.state.statisFileIp}${res.data.replace(/\\/g, '/').split('/data')[1]}?time=${new Date().getTime()}`
        }
      },
      close() {
        this.$emit('update:dialogFlag', false)
      }
    },
    components: {
      dialogs,
      headPortrait,
      friendDetailDialog
    }
  }
</script>
<style lang="less">
  .groupDetailDialog {
    .el-dialog {
      width: 30%;
      min-width: 300px;

      .upload-wrap {
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
      .member-wrap {
        height: 40px;
        position: relative;
        span {
          line-height: 40px;
          margin-right: calc(~'100% - 70px');
        }
        /*.headPortrait{*/
        /*width: 30px;*/
        /*height: 30px;*/
        /*}*/
      }
      .group-intro {
        textarea {
          resize: none;
        }
      }
      .group-nick {
        span {
          line-height: 30px;
        }
        .el-input {
          .el-input__inner {
            text-align: right;
            height: 30px;
            border-radius: 0;
            border-right: none;
            border-left: none;
            border-top: none;
          }
        }
      }
      .button {
        text-align: center;
        margin-top: 15px;
      }
    }
  }

  .members-popover {
    /*width: auto !important;*/
    .table-box {
      max-height: 300px;
      overflow: auto;
      /*table{*/
      /*width: 200px;*/
      /*tr{*/
      /*.headPortrait{*/
      /*width: 30px;*/
      /*height: 30px;*/
      /*}*/
      /*}*/
      /*}*/
      ul {
        width: 200px;
        overflow-x: hidden;
        li {
          width: 1000px;
          position: relative;
          margin-top: 5px;
          .el-row {
            width: 200px;
          }
          .el-col {
            line-height: 30px;
            .headPortrait {
              width: 30px;
              height: 30px;
              vertical-align: middle;
            }
          }
          .operation {
            position: absolute;
            height: 30px;
            top: 0;
            left: 200px;
            transition: 0.5s;
            a {
              line-height: 30px;
              font-size: 6px;
              display: inline-block;
              width: 30px;
              height: 30px;
              border-radius: 15px;
              background: #66b1ff;
              vertical-align: middle;
              text-align: center;
              color: white;
            }
          }
        }
        li:hover {
          .operation {
            transform: translateX(-100%);
            transition: 0.5s;
          }
        }
      }
    }
  }

  .friends-popover {
    /*width: auto !important;*/
    .my-group {
      width: 180px;
      max-height: 300px;
      overflow: auto;
      .el-menu-item {
        min-width: auto;
        .headPortrait {
          display: inline-block;
          width: 30px;
          height: 30px;
          border-radius: 15px;
        }
      }
    }
  }
</style>
