<template>
  <div class="chatWindow" v-if="isShow">
    <friendDetailDialog :dialogFlag.sync="friendDetailFlag" :openData="friendDetailData"></friendDetailDialog>
    <el-container>
      <el-main ref="message" :class="{small:this.$store.state.isVideo}">
        <div class="loading-wrap" v-show="isMessageLoading"><i class="el-icon-loading"></i></div>
        <div class="messageField">
          <p v-if="total !==0 && total <= messageRecord.length">没有记录了</p>
          <aMessage @imgClick="imgClick" :key="index" v-for="(item,index) in messageRecord" :name="item.name"
                    :isAtRight="item.isAtRight"
                    :expressArr="expressArr" :data="item"></aMessage>
        </div>
      </el-main>
      <el-footer>
        <div class="inputField">
          <div class="input-menu">
            <i class="fa fa-font" title="文字样式"></i>
            <el-popover
              popper-class="express-popover"
              ref="express"
              placement="top-start"
              trigger="click">
              <div v-loading="isLoadingImage">
                <img :ref="item.split('.')[0]" :key="item" v-for="(item,index) in expressArr"
                     :src="'http://'+$store.state.statisFileIp+'/express/'+item" alt="" @click="clickExpress(index)">
              </div>
            </el-popover>
            <i class="fa fa-smile-o" v-popover:express title="表情" @click="getExpress"></i>
            <span class="upload-wrap" title="发送图片或视频">
                <el-upload
                  ref="uploadPic"
                  :action="picAction"
                  :on-success="picUpdateSuccess"
                  :before-upload="beforePicUpload"
                  :limit="1">
                  <i class="el-icon-picture"></i>
                </el-upload>
              </span>
            <i v-if="chatType===1" class="fa  fa-video-camera" @click="videoRequest" title="视频通话"></i>
            <span class="upload-wrap" title="发送文件">
                <el-upload
                  ref="uploadFile"
                  :action="fileAction"
                  :on-success="fileUpdateSuccess"
                  :before-upload="beforeFileUpload"
                  :limit="1">
                  <i class="el-icon-tickets"></i>
                </el-upload>
              </span>
          </div>
          <div class="input-wrap">
            <textarea v-model="message"></textarea>
            <button class="send-button" @click="sendMessage">发送</button>
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import aMessage from '../common/aMessage'
  import friendDetailDialog from '../contacts/myFriendMoudle/friendDetailDialog'
  import headPortrait from './../common/headPortrait'
  import {toBottom, translateExpress, getExpressName, getBase64Image, onToTop} from '@/util/common'

  export default {
    name: "chatWindow",
    props: ['chatType', 'chatId', 'detailData'],
    data: function () {
      return {
        // detailData:null,
        friendDetailFlag: false,
        isMessageLoading: false,
        pageNo: 1,
        total: 0,
        message: '',
        messageRecord: [],
        openTime: '',
        isLoadingImage: false,
        friendDetailData: {},
        expressArr: JSON.parse(JSON.stringify(this.$store.state.expressArr)),
        isShow:true,
        isDestroyed:false
      };
    },
    computed: {
      socket() {
        return this.$store.state.socket;
      },
      // isLoadingImage() {
      //   return this.expressArr.length === 0
      // },
      picAction() {
        if (this.chatType === 1) {
          return `/uploadPicture.do?userId=${this.$store.state.userId}&&friendId=${this.chatId}`;
        } else {
          if(this.detailData.members.some(obj => obj.memberId === this.$store.state.userId)){
            return `/uploadGroupPicture.do?userId=${this.$store.state.userId}&&groupId=${this.chatId}&&uName=${this.detailData.members.filter(obj => obj.memberId === this.$store.state.userId)[0].groupNick || this.$store.state.nickName || this.$store.state.userId}`
          }else{
            return ''
          }
        }
      },
      fileAction() {
        if (this.chatType === 1) {
          return `/uploadFile.do?userId=${this.$store.state.userId}&&friendId=${this.chatId}`;
        } else {
          if(this.detailData.members.some(obj => obj.memberId === this.$store.state.userId)){
            return `/uploadGroupFile.do?userId=${this.$store.state.userId}&&groupId=${this.chatId}&&uName=${this.detailData.members.filter(obj => obj.memberId === this.$store.state.userId)[0].groupNick || this.$store.state.nickName || this.$store.state.userId}`
          }else{
            return ''
          }
        }
      }
    },
    mounted() {
      this.init();
    },
    destroyed(){
      this.isDestroyed=true;
      // alert("destroyed");
    },
    methods: {
      getNewTips() {
        this.$http.post('/getNewTips.do', {userId: sessionStorage.getItem('userId')}).then(res => {
          if (res.data.success) {
            this.$store.state.remindTips = res.data.data.remindTips;
          }
        })
      },
      getDetailData(){
        let path;
        if(this.chatType===1){
          path='/get'
        }
      },
      //用户头像点击，获得用户信息
      imgClick(userId) {
        this.$http.post('/getUserInfo.do', {userId: userId}).then(res => {
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
      beforeFileUpload(file) {
        const isLt100M = file.size / 1024 / 1024 < 100;
        !isLt100M && this.$message.error('文件不能超过100Mb');
        return isLt100M;
      },
      fileUpdateSuccess(res, file) {
        this.messageRecord.push({
          senderId: this.$store.state.userId,
          name: this.$store.state.nickName || this.$store.state.userId,
          filePath: res.data.filePath,
          isAtRight: true,
          messageType: 4
        });
        if (this.chatType === 1) {
          this.socket.emit('remandFriend', {
            from: res.data.from,
            friendName: this.detailData.remark || this.detailData.nickName || this.detailData.friendId,
            filePath: res.data.filePath,
            to: res.data.to,
            messageType: 4
          });
        } else {
          this.socket.emit('remandFriend', {
            from: res.data.from,
            filePath: res.data.filePath,
            groupId: this.chatId,
            groupName: this.detailData.groupName,
            uName: res.data.uName,
            messageType: 4
          });
        }
        this.$refs.uploadFile.clearFiles();
        this.$nextTick(() => {
          toBottom(this.$refs.message.$el);
        });
      },
      beforePicUpload(file) {
        let nameArr = file.name.split('.');
        let type = nameArr[nameArr.length - 1].toLowerCase();
        const isLt10M = file.size / 1024 / 1024 < 10;
        const isTrueFormat = /mov|avi|flv|mp4|rmvb|mkv|jpeg|bmp|jpg|png|gif/i.test(type);
        !isLt10M && this.$message.error('文件不能超过10Mb')
        !isTrueFormat && this.$message.error('不识别此格式文件')
        return isTrueFormat && isLt10M;
      },
      picUpdateSuccess(res, file) {
        let nameArr = file.name.split('.');
        let type = nameArr[nameArr.length - 1].toLowerCase();
        if (this.chatType === 1) {
          if (/mov|avi|flv|mp4|rmvb|mkv/i.test(type)) {
            this.messageRecord.push({
              senderId: this.$store.state.userId,
              name: this.$store.state.nickName || this.$store.state.userId,
              message: `<video src="${file.url}" loop controls></video>`,
              isAtRight: true,
              messageType: 3
            });
            this.socket.emit('remandFriend', {
              message: `<video src="http://${this.$store.state.statisFileIp + res.data.filePath}" loop controls></video>`,
              from: res.data.from,
              friendName: this.detailData.remark || this.detailData.nickName || this.detailData.friendId,
              to: res.data.to,
              messageType: 3,
            });
          } else if (/jpeg|bmp|jpg|png|gif/i.test(type)) {
            this.messageRecord.push({
              senderId: this.$store.state.userId,
              name: this.$store.state.nickName || this.$store.state.userId,
              message: `<img src='${file.url}'></img>`,
              isAtRight: true,
              messageType: 3
            });
            this.socket.emit('remandFriend', {
              message: `<img src="http://${this.$store.state.statisFileIp + res.data.filePath}"></img>`,
              from: res.data.from,
              friendName: this.detailData.remark || this.detailData.nickName || this.detailData.friendId,
              to: res.data.to,
              messageType: 3
            });
          }
        } else {
          if (/mov|avi|flv|mp4|rmvb|mkv/i.test(type)) {
            this.messageRecord.push({
              senderId: this.$store.state.userId,
              name: res.data.uName,
              message: `<video src="${file.url}" loop controls></video>`,
              isAtRight: true,
              messageType: 3
            });
            this.socket.emit('remandFriend', {
              message: `<video src="http://${this.$store.state.statisFileIp + res.data.filePath}" loop controls></video>`,
              from: res.data.from,
              groupId: this.chatId,
              groupName: this.detailData.groupName,
              uName: res.data.uName,
              messageType: 3
            });
          } else if (/jpeg|bmp|jpg|png|gif/i.test(type)) {
            this.messageRecord.push({
              senderId: this.$store.state.userId,
              name: this.$store.state.nickName || this.$store.state.userId,
              message: `<img src='${file.url}'></img>`,
              isAtRight: true,
              messageType: 3
            });
            this.socket.emit('remandFriend', {
              message: `<img src="http://${this.$store.state.statisFileIp + res.data.filePath}"></img>`,
              from: res.data.from,
              groupId: this.chatId,
              groupName: this.detailData.groupName,
              uName: res.data.uName,
              messageType: 3
            });
          }
        }

        this.$refs.uploadPic.clearFiles();
        this.$nextTick(() => {
          toBottom(this.$refs.message.$el);
        });
      },
      //发送视频通话请求
      videoRequest() {
        this.$store.state.socket.emit('videoRequest', {
          to: {
            id: this.chatId,
            name: this.detailData.remark || this.detailData.nickName || this.detailData.friendId
          },
          from: {
            id: this.$store.state.userId,
            name: this.$store.state.nickName || this.$store.state.userId
          }
        });
        this.$message({message: '已发送视频通话请求', type: 'success'})
      },
      clickExpress(index) {
        this.message += '{' + this.expressArr[index].split('.')[0] + '}'
      },
      getExpress() {
        if (this.expressArr.length === 0) {
          this.isLoadingImage = true;
          this.$http.post('/getExpress.do', {userId: this.$store.state.userId}).then(res => {
            if (res.data.success) {
              this.expressArr = this.$store.state.expressArr = res.data.data;
              this.isLoadingImage = false;
            }
          })
        }
      },
      sendMessage() {
        if (this.message !== '') {
          let params;
          let uName;
          if (this.chatType === 1) {
            params = {
              messageType: 1,
              message: this.message,
              from: sessionStorage.getItem('userId'),
              to: this.chatId,
              userName:this.$store.state.nickName
            };
          } else {
            uName = this.detailData.members.filter(obj => obj.memberId === this.$store.state.userId)[0].groupNick;
            params = {
              messageType: 1,
              message: this.message,
              from: this.$store.state.userId,
              fromName:this.detailData.groupName,
              groupId: this.chatId,
              uName: uName || this.$store.state.nickName || this.$store.state.userId
            };
          }
          let matchResult = this.message.match(/\{[0-9a-zA-Z]+(\-\g+){0,1}\}/ig);
          matchResult && matchResult.forEach((str, index) => {
            let splited = str.split('}')[0].split('{')[1];
            if (this.expressArr.some(obj => obj.split('.')[0] == splited)) {
              params.messageType = 2;
              if (!params.expressName) {
                params.expressName = '';
                params.expressName += splited;
              } else {
                params.expressName += ',' + splited;
              }
            }
          });
          let path;
          if (this.chatType === 1) {
            path = '/sendMessage.do';
          } else {
            path = '/sendGroupMessage.do';
          }
          this.$http.post(path, params).then(res => {
            if (res.data.success) {
              this.$message({message: '发送成功', type: 'success'});
              if (this.chatType === 1) {
                this.messageRecord.push({
                  senderId: this.$store.state.userId,
                  name: this.$store.state.nickName || this.$store.state.userId,
                  message: translateExpress(2, this.message, this.expressArr.filter(name => getExpressName(this.message).includes(name.split('.')[0])), this.$store.state.statisFileIp),
                  isAtRight: true
                });
                this.$store.state.socket.emit('remandFriend', {
                  message: translateExpress(2, this.message, this.expressArr.filter(name => getExpressName(this.message).includes(name.split('.')[0])), this.$store.state.statisFileIp),
                  from: sessionStorage.getItem('userId'),
                  to: this.chatId,
                  friendName: this.detailData.remark || this.detailData.nickName || this.detailData.friendId,
                  messageType: params.messageType
                });
              } else {
                this.messageRecord.push({
                  senderId: this.$store.state.userId,
                  name: uName || this.$store.state.nickName || this.$store.state.userId,
                  message: translateExpress(2, this.message, this.expressArr.filter(name => getExpressName(this.message).includes(name.split('.')[0])), this.$store.state.statisFileIp),
                  isAtRight: true
                });
                this.$store.state.socket.emit('remandFriend', {
                  message: translateExpress(2, this.message, this.expressArr.filter(name => getExpressName(this.message).includes(name.split('.')[0])), this.$store.state.statisFileIp),
                  from: this.$store.state.userId,
                  groupId: this.chatId,
                  groupName: this.detailData.groupName,
                  uName: params.uName
                });
              }
              this.$nextTick(() => {
                toBottom(this.$refs.message.$el);
              });
              this.message = '';
            }
          });
        }
      },
      init() {
        this.isDestroyed=false;
        this.messageRecord = [];
        this.pageNo = 1;
        this.total = 0;
        this.isShow = true;
        this.openTime = new Date().getTime();
        if (this.chatType === 1) {
          this.getFriendMessage().then(() => {
            this.$nextTick(() => {
              if(this.isShow){
                this.toTopEvent();
                toBottom(this.$refs.message.$el);
              }
            });
          })
        } else {
          this.getGroupMessage().then(() => {
            this.$nextTick(() => {
              if(this.isShow){
                this.toTopEvent();
                toBottom(this.$refs.message.$el);
              }
            });
          })
        }
        this.listenMessage();
      },
      getFriendMessage() {
        return new Promise((resolve) => {
          this.isMessageLoading = true;
          this.$http.post('/getFriendMessage.do', {
            openTime: this.openTime,
            pageNo: this.pageNo,
            pageSize: this.$store.state.pageSize,
            userId: sessionStorage.getItem('userId'),
            friendId: this.chatId
          }).then(res => {
            if (res.data.success) {
              this.total = res.data.total;
              this.getNewTips();
              // this.$store.state.socket.emit("getMessage",{
              //   userId: sessionStorage.getItem('userId'),
              //   friendId: this.chatId,
              //   type:this.chatType
              // });
              res.data.data.length !== 0 && res.data.data.forEach(obj => {
                let friendName;
                let newMessage = obj.M_PostMessages;
                if (obj.M_FromUserID === this.chatId) {
                  friendName = this.detailData.remark || this.detailData.nickName || this.detailData.friendId;
                }
                if ([3, 4].includes(obj.M_MessageTypeID)) {
                  let pathArr = obj.M_FilePath.split('.');
                  let type = pathArr[pathArr.length - 1].toLowerCase();
                  if (/mov|avi|flv|mp4|rmvb|mkv/i.test(type)) {
                    this.messageRecord.unshift({
                      message: `<video src="http://${this.$store.state.statisFileIp + obj.M_FilePath}" loop controls></video>`,
                      senderId: obj.M_FromUserID,
                      name: obj.M_FromUserID !== this.chatId ? (this.$store.state.nickName || this.$store.state.userId) : friendName,
                      isAtRight: obj.M_FromUserID !== this.chatId,
                      messageType: obj.M_MessageTypeID,
                      filePath: obj.M_FilePath
                    });
                  } else if (/jpeg|bmp|jpg|png|gif/i.test(type)) {
                    this.messageRecord.unshift({
                      message: `<img src='http://${this.$store.state.statisFileIp + obj.M_FilePath}'></img>`,
                      senderId: obj.M_FromUserID,
                      name: obj.M_FromUserID !== this.chatId ? (this.$store.state.nickName || this.$store.state.userId) : friendName,
                      isAtRight: obj.M_FromUserID !== this.chatId,
                      messageType: obj.M_MessageTypeID,
                      filePath: obj.M_FilePath
                    });
                  } else {
                    this.messageRecord.unshift({
                      message: obj.M_PostMessages,
                      senderId: obj.M_FromUserID,
                      name: obj.M_FromUserID !== this.chatId ? (this.$store.state.nickName || this.$store.state.userId) : friendName,
                      isAtRight: obj.M_FromUserID !== this.chatId,
                      messageType: obj.M_MessageTypeID,
                      filePath: obj.M_FilePath
                    });
                  }
                } else if ([1, 2].includes(obj.M_MessageTypeID)) {
                  if (obj.expressArr) {
                    newMessage = translateExpress(1, newMessage, obj.expressArr);
                  }
                  this.messageRecord.unshift({
                    senderId: obj.M_FromUserID,
                    name: obj.M_FromUserID !== this.chatId ? (this.$store.state.nickName || this.$store.state.userId) : friendName,
                    message: newMessage,
                    isAtRight: obj.M_FromUserID !== this.chatId,
                    messageType: obj.M_MessageTypeID,
                    filePath: obj.M_FilePath
                  })
                }
                resolve();
              });
            }
            if(res.data.code===1){
              this.messageRecord={};
              this.isShow=false;
            }
            // console.log(this.messageRecord);
            this.isMessageLoading = false;
          }).catch(() => {
            this.isMessageLoading = false;
          })
        });
      },
      getGroupMessage() {
        return new Promise((resolve) => {
          this.isMessageLoading = true;
          this.$http.post('/getGroupMessage.do', {
            openTime: this.openTime,
            pageNo: this.pageNo,
            pageSize: this.$store.state.pageSize,
            groupId: this.chatId,
            userId:this.$store.state.userId
          }).then(res => {
            if (res.data.success) {
              this.total = res.data.total;
              this.getNewTips();
              // this.$store.state.socket.emit("getMessage",{
              //   userId: sessionStorage.getItem('userId'),
              //   friendId: this.chatId,
              //   type:this.chatType
              // });
              res.data.data.length !== 0 && res.data.data.forEach(obj => {
                let newMessage = obj.GM_Message;
                if ([3, 4].includes(obj.GM_MessageType)) {
                  let pathArr = obj.GM_FilePath.split('.');
                  let type = pathArr[pathArr.length - 1].toLowerCase();
                  if (/mov|avi|flv|mp4|rmvb|mkv/i.test(type)) {
                    this.messageRecord.unshift({
                      message: `<video src="http://${this.$store.state.statisFileIp + obj.GM_FilePath}" loop controls></video>`,
                      senderId: obj.GM_FromID,
                      name: obj.GM_FromUName,
                      isAtRight: obj.GM_FromID === this.$store.state.userId,
                      messageType: obj.GM_MessageType,
                      filePath: obj.GM_FilePath
                    });
                  } else if (/jpeg|bmp|jpg|png|gif/i.test(type)) {
                    this.messageRecord.unshift({
                      message: `<img src='http://${this.$store.state.statisFileIp + obj.GM_FilePath}'></img>`,
                      senderId: obj.GM_FromID,
                      name: obj.GM_FromUName,
                      isAtRight: obj.GM_FromID === this.$store.state.userId,
                      messageType: obj.GM_MessageType,
                      filePath: obj.GM_FilePath
                    });
                  } else {
                    this.messageRecord.unshift({
                      message: obj.GM_Message,
                      senderId: obj.GM_FromID,
                      name: obj.GM_FromUName,
                      isAtRight: obj.GM_FromID === this.$store.state.userId,
                      messageType: obj.GM_MessageType,
                      filePath: obj.GM_FilePath
                    });
                  }
                } else if ([1, 2].includes(obj.GM_MessageType)) {
                  if (obj.expressArr) {
                    newMessage = translateExpress(1, newMessage, obj.expressArr);
                  }
                  this.messageRecord.unshift({
                    message: newMessage,
                    senderId: obj.GM_FromID,
                    name: obj.GM_FromUName,
                    isAtRight: obj.GM_FromID === this.$store.state.userId,
                    messageType: obj.GM_MessageType,
                    filePath: obj.GM_FilePath
                  })
                }
              });
              resolve();
            }
            if(res.data.code===1){
              this.messageRecord={};
              this.isShow=false;
            }
            this.isMessageLoading = false;
          }).catch(() => {
            this.isMessageLoading = false;
          })
        });
      },
      toTopEvent() {
        onToTop(this.$refs.message.$el, () => {
          if (Math.ceil(this.total / this.$store.state.pageSize) < this.pageNo + 1) return;
          if (this.isMessageLoading) return;
          this.pageNo++;
          let scrollBottom = this.$refs.message.$el.scrollHeight;
          if (this.chatType === 1) {
            this.getFriendMessage().then(() => {
              this.$nextTick(() => {
                this.$refs.message.$el.scrollTop = this.$refs.message.$el.scrollHeight - scrollBottom;
              });
            })
          } else {
            this.getGroupMessage().then(() => {
              this.$nextTick(() => {
                this.$refs.message.$el.scrollTop = this.$refs.message.$el.scrollHeight - scrollBottom;
              });
            })
          }
        })
      },
      listenMessage(){
        this.$store.state.socket.on('getMessage', (item) => {
          // alert("getMessage");
          // alert(this.isDestroyed);
          // console.log(item);
          if(this.isDestroyed) return;
          if (item.groupId !== undefined){
            if (item.groupId === this.chatId) {
              this.$http.post('/updateRemind.do',{
                fromId:this.chatId,
                userId:this.$store.state.userId,
                type:this.chatType
              }).then(res=>{
                if(res.data.success){
                  this.getNewTips();
                }
              });
              this.messageRecord.push({
                senderId: item.from,
                name: item.uName,
                message: item.message,
                isAtRight: false,
                filePath: item.filePath,
                messageType: item.messageType
              });
              this.$nextTick(() => {
                toBottom(this.$refs.message.$el);
              });
            }
          } else{
            if (item.from === this.chatId) {
              this.$http.post('/updateRemind.do',{
                fromId:this.chatId,
                userId:this.$store.state.userId,
                type:this.chatType
              }).then(res=>{
                if(res.data.success){
                  this.getNewTips();
                  // this.$store.state.socket.emit('sendRemind',{toId:this.chatId});
                }
              });
              let friendName = this.detailData.remark || this.detailData.nickName || this.detailData.friendId;
              this.messageRecord.push({
                senderId: item.from,
                name: friendName,
                message: item.message,
                isAtRight: false,
                filePath: item.filePath,
                messageType: item.messageType
              });
              this.$nextTick(() => {
                toBottom(this.$refs.message.$el);
              });
            }
          }
        });
      }
    },
    watch: {
      chatId(val) {
        if (val !== '') {
          this.init();
        }
      },
      // socket: {
      //   handler(value, oldValue) {
      //     this.$store.state.socket.on('getMessage', (item) => {
      //       if (item.groupId !== undefined){
      //         if (item.groupId === this.chatId) {
      //           this.messageRecord.push({
      //             senderId: item.from,
      //             name: item.uName,
      //             message: item.message,
      //             isAtRight: false,
      //             filePath: item.filePath,
      //             messageType: item.messageType
      //           });
      //           this.$nextTick(() => {
      //             toBottom(this.$refs.message.$el);
      //           });
      //         }
      //       } else{
      //         if (item.from === this.chatId) {
      //           let friendName = this.detailData.remark || this.detailData.nickName || this.detailData.friendId;
      //           this.messageRecord.push({
      //             senderId: item.from,
      //             name: friendName,
      //             message: item.message,
      //             isAtRight: false,
      //             filePath: item.filePath,
      //             messageType: item.messageType
      //           });
      //           this.$nextTick(() => {
      //             toBottom(this.$refs.message.$el);
      //           });
      //         }
      //       }
      //     });
      //   },
      //   deep: true
      // }
    },
    components: {
      aMessage,
      headPortrait,
      friendDetailDialog
    }
  }
</script>

<style lang="less">
  .chatWindow {
    width: 100%;
    height: 100%;
    .el-container {
      height: 100%;
      .small {
        padding-right: 300px;
      }
      .loading-wrap{
        text-align: center;
      }
      .messageField {
        p{
          text-align: center;
          color: gray;
          font-size: 12px;
        }
      }
      .el-footer {
        margin-bottom: 20px;
        height: 100px !important;
        .inputField {
          .input-menu {
            span {
              display: inline-block;
            }
            i {
              padding: 5px;
            }
            i:hover {
              background: #66b1ff;
            }
          }
          .input-wrap {
            height: 74px;
            > textarea {
              width: calc(~'100% - 70px');
              resize: none;
              height: 63px;
            }
            .send-button {
              width: 50px;
              margin-left: -3px;
              border: 1px solid rgb(169, 169, 169);
              border-left: none;
              height: 69px;
              vertical-align: top;
            }
          }
        }
        .upload-wrap {
          display: inline-block;
          .el-upload-list {
            display: none;
          }
        }
      }
    }
  }
  .express-popover {
    background: #8c939d;
    max-width: 600px;
    > div {
      min-height: 200px;
      img {
        width: 30px;
        height: 30px;
        margin-left: 5px;
      }
      img:hover {
        width: 26px;
        height: 26px;
        border: 2px solid blue;
      }
    }
  }
</style>
