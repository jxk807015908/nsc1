<template>
  <div class="myFriend" @mousedown="openGroupMenu">
    <groupManageDialog :dialogFlag.sync="groupFlag" :openData="friendGroup"></groupManageDialog>
    <addFriendDialog :dialogFlag.sync="addFlag" :friendList="friendList"></addFriendDialog>
    <friendDetailDialog :dialogFlag.sync="friendDetailFlag" :openData="friendDetailData"></friendDetailDialog>
    <el-container>
      <el-aside width="200px">
        <div class="operate">
          <i class="el-icon-plus fr" @click="openAddFriendDialog"></i>
          <i class="fa fa-bars fr" @click="openGroupManageDialog"></i>
        </div>
        <div class="search-wrap">
          <el-input :maxlength="20" placeholder="请输入好友账号或昵称进行搜索" v-model="searchParams" @focus="isFilterFriendShow=true" @blur="isFilterFriendShow=false"></el-input>
          <ul class="filter-friend-wrap" :class="{hasFriend:filterFriend.length!==0,friendWrapHide:!isFilterFriendShow}">
            <li v-for="friend in filterFriend" @click="goTofriend(friend)">
              <headPortrait @imgClick="imgClick" :indexPath="friend.friendId" :isSave="true" :status="friend.status" :userId="friend.friendId" :hasDetail="true" :data="friend"></headPortrait>
              <span :title="friend.remark||friend.nickName||friend.friendId" :class="{lowColor:friend.status === 0,isActive:friend.friendId === $store.state.myFriendCheckedId}">{{friend.remark||friend.nickName||friend.friendId}}</span>
            </li>
          </ul>
        </div>
        <div class="my-group">
          <el-menu
            ref="friendMenu"
            @select="select"
            default-active=""
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu v-for="(item,index) in friendGroup" :key="item.value" :index="item.value+''">
              <template slot="title"><span>{{item.name}}</span></template>
              <el-menu-item :key="friend.friendId" v-for="(friend,index2) in item.content" :index="friend.friendId">
                <div>
                  <!--<el-tooltip placement="right">-->
                  <!--<div slot="content">-->
                  <!--<img src="../../assets/imgages/userBaseHeadImg.png" alt="">-->
                  <!--<p>dsfdsfdsfds</p>-->
                  <!--</div>-->
                  <!--<img src="../../assets/imgages/userBaseHeadImg.png" alt="">-->
                  <!--</el-tooltip>-->
                  <!--<img src="../../assets/imgages/userBaseHeadImg.png" alt="">-->
                  <headPortrait @imgClick="imgClick" :indexPath="friend.friendId" :status="friend.status" :userId="friend.friendId" :hasDetail="true" :data="friend"></headPortrait>
                  <span :title="friend.remark||friend.nickName||friend.friendId" :class="{lowColor:friend.status === 0,isActive:friend.friendId === $store.state.myFriendCheckedId}">{{friend.remark||friend.nickName||friend.friendId}}</span>
                  <div class="cascader" @click.stop="">
                    <el-cascader
                      :ref="'friendMenu'+index+'-'+index2"
                      :options="options"
                      v-model="selectedOptions"
                      @change="handleChange(index,index2)">
                    </el-cascader>
                  </div>
                </div>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>
      <!--<el-container>-->
        <!--<el-main ref="message" :class="{small:this.$store.state.isVideo}">-->
          <!--<div class="loading-wrap" v-show="isMessageLoading"><i class="el-icon-loading"></i></div>-->
          <!--<div v-if="this.$store.state.myFriendCheckedId!==''" class="messageField">-->
            <!--<p v-if="total !==0 && total <= messageRecord.length">没有记录了</p>-->
            <!--<aMessage @imgClick="imgClick" :key="index" v-for="(item,index) in messageRecord" :name="item.name" :isAtRight="item.isAtRight"-->
                      <!--:expressArr="expressArr" :data="item"></aMessage>-->
          <!--</div>-->
        <!--</el-main>-->
        <!--<el-footer>-->
          <!--<div v-if="this.$store.state.myFriendCheckedId!==''" class="inputField">-->
            <!--<div class="input-menu">-->
              <!--<i class="fa fa-font" title="文字样式"></i>-->
              <!--<el-popover-->
                <!--popper-class="express-popover"-->
                <!--ref="express"-->
                <!--placement="top-start"-->
                <!--trigger="click">-->
                <!--<div v-loading="isLoadingImage">-->
                  <!--&lt;!&ndash;<img v-for="(item,index) in expressArr" :src="'data:image/png;base64,'+item.img" alt="" @click="clickExpress(index)">&ndash;&gt;-->
                  <!--<img :ref="item.split('.')[0]" :key="item" v-for="(item,index) in expressArr"-->
                       <!--:src="'http://'+$store.state.statisFileIp+'/express/'+item" alt="" @click="clickExpress(index)">-->
                <!--</div>-->
              <!--</el-popover>-->
              <!--<i class="fa fa-smile-o" v-popover:express @click="getExpress(false)" title="表情"></i>-->
              <!--<span class="upload-wrap" title="发送图片或视频">-->
                <!--<el-upload-->
                  <!--ref="uploadPic"-->
                  <!--:action='`/uploadPicture.do?userId=${$store.state.userId}&&friendId=${$store.state.myFriendCheckedId}`'-->
                  <!--:on-success="picUpdateSuccess"-->
                  <!--:before-upload="beforePicUpload"-->
                  <!--:limit="1">-->
                  <!--<i class="el-icon-picture"></i>-->
                <!--</el-upload>-->
              <!--</span>-->
              <!--<i class="fa  fa-video-camera" @click="videoRequest" title="视频通话"></i>-->
              <!--<span class="upload-wrap" title="发送文件">-->
                <!--<el-upload-->
                  <!--ref="uploadFile"-->
                  <!--:action='`/uploadFile.do?userId=${$store.state.userId}&&friendId=${$store.state.myFriendCheckedId}`'-->
                  <!--:on-success="fileUpdateSuccess"-->
                  <!--:before-upload="beforeFileUpload"-->
                  <!--:limit="1">-->
                  <!--<i class="el-icon-tickets"></i>-->
                <!--</el-upload>-->
              <!--</span>-->
            <!--</div>-->
            <!--<div class="input-wrap">-->
              <!--<textarea v-model="message"></textarea>-->
              <!--<button class="send-button" @click="sendMessage">发送</button>-->
            <!--</div>-->
          <!--</div>-->
        <!--</el-footer>-->
      <!--</el-container>-->
      <chatWindow v-if="$store.state.myFriendCheckedId!==''" :chatId="$store.state.myFriendCheckedId" :chatType="1"></chatWindow>
    </el-container>
  </div>
</template>
<script>
  import aMessage from '../common/aMessage'
  import chatWindow from '../common/chatWindow'
  import groupManageDialog from './myFriendMoudle/groupManageDialog'
  import addFriendDialog from './myFriendMoudle/addFriendDialog'
  import friendDetailDialog from './myFriendMoudle/friendDetailDialog'
  import headPortrait from './../common/headPortrait'
  import {toBottom, translateExpress, getExpressName, getBase64Image, onToTop} from '@/util/common'

  export default {
    name: 'myFriend',
    data: function () {
      return {
        friendDetailFlag:false,
        isFilterFriendShow:false,
        searchParams: '',
        // isMessageLoading: false,
        // pageNo: 1,
        // total: 0,
        // curFriend: {},
        selectedOptions: [],
        options: [{
          label: '修改备注',
          value: '1'
        }, {
          label: '移至分组',
          value: '2',
        }, {
          label: '删除好友',
          value: '3',
        }],
        // filterFriend: [],
        friendList: [],
        addFlag: false,
        groupFlag: false,
        friendGroup: [],
        // message: '',
        // curGroupId: '',
        curFriendId: '',
        // messageRecord: [],
        expressArr: [],
        // openTime: '',
        // isLoadingImage: true,
        friendDetailData:{},
        // curFriendDetailData:{},
        isSocketListen:false
      };
    },
    computed: {
      // curFriend(){
      //   return this.friendList.filter(obj => obj.friendId === this.$store.state.myFriendCheckedId)[0];
      // },
      socket() {
        return this.$store.state.socket;
      },
      filterFriend(){
        if(this.searchParams === ''){
          return [];
        }else{
          // return this.friendList.filter(obj=>obj.friendId.indexOf(this.searchParams) !== -1)
          return this.friendList.filter(obj=>obj.friendId.indexOf(this.searchParams) !== -1 || (obj.nickName && obj.nickName.indexOf(this.searchParams) !== -1) || (obj.remark && obj.remark.indexOf(this.searchParams) !== -1))
        }
      }
    },
    mounted() {
      // if (this.$route.params.friendId !== undefined) {
      //   this.$store.state.myFriendCheckedId = this.$route.params.friendId;
      // }
      (async () => {
        await this.getFriendGroup();
        await this.getFriend();
        if (this.$route.params.friendId !== undefined) {
          this.$store.state.myFriendCheckedId = this.$route.params.friendId;
          let belongGroup=this.friendGroup.filter(obj=>obj.content.some(obj2=>obj2.friendId===this.$store.state.myFriendCheckedId))[0];
          this.$refs.friendMenu.open(belongGroup.value);
          this.select(this.$route.params.friendId,[belongGroup.value,this.$route.params.friendId]);
        }
      })();
      // this.getExpress(false)
    },
    activated() {
      (async () => {
        await this.getFriendGroup();
        await this.getFriend();
        if (this.$route.params.friendId !== undefined) {
          this.$store.state.myFriendCheckedId = this.$route.params.friendId;
          let belongGroup=this.friendGroup.filter(obj=>obj.content.some(obj2=>obj2.friendId===this.$store.state.myFriendCheckedId))[0];
          this.$refs.friendMenu.open(belongGroup.value);
          this.select(this.$route.params.friendId,[belongGroup.value,this.$route.params.friendId]);
        }
      })();
    },
    methods: {
      imgClick(userId){
        this.$http.post('/getUserInfo.do',{userId:userId}).then(res=>{
          if(res.data.success){
            this.friendDetailData={
              userId:res.data.data[0].U_LoginID,
              nickName:res.data.data[0].U_NickName,
              age:res.data.data[0].U_Age,
              birthday:res.data.data[0].U_Birthday,
              phone:res.data.data[0].U_Telephone,
              email:res.data.data[0].U_Email,
              name:res.data.data[0].U_Name,
              sex:res.data.data[0].U_Sex
            };
            this.friendDetailFlag=true;
          }
        })
      },
      goTofriend(friend){
        // console.log(friend)
        this.$refs.friendMenu.open(friend.friendGroupsId);
        this.select(friend.friendId,[friend.friendGroupsId,friend.friendId]);
        this.searchParams='';
      },
      // beforeFileUpload(file) {
      //   const isLt100M = file.size / 1024 / 1024 < 100;
      //   !isLt100M && this.$message.error('文件不能超过100Mb');
      //   return isLt100M;
      // },
      // fileUpdateSuccess(res, file) {
      //   this.messageRecord.push({
      //     senderId: this.$store.state.userId,
      //     name: this.$store.state.nickName || this.$store.state.userId,
      //     filePath: res.data.filePath,
      //     isAtRight: true,
      //     messageType: 4
      //   });
      //   this.socket.emit('remandFriend', {
      //     from: res.data.from,
      //     friendName: this.curFriend.nickName,
      //     filePath: res.data.filePath,
      //     to: res.data.to,
      //     messageType: 4
      //   });
      //   this.$refs.uploadFile.clearFiles();
      //   this.$nextTick(() => {
      //     toBottom(this.$refs.message.$el);
      //   });
      // },
      // beforePicUpload(file) {
      //   let nameArr = file.name.split('.');
      //   let type = nameArr[nameArr.length - 1].toLowerCase();
      //   const isLt10M = file.size / 1024 / 1024 < 10;
      //   const isTrueFormat = /mov|avi|flv|mp4|rmvb|mkv|jpeg|bmp|jpg|png|gif/i.test(type);
      //   !isLt10M && this.$message.error('文件不能超过10Mb')
      //   !isTrueFormat && this.$message.error('不识别此格式文件')
      //   return isTrueFormat && isLt10M;
      // },
      // picUpdateSuccess(res, file) {
      //   // console.log(res)
      //   let nameArr = file.name.split('.');
      //   let type = nameArr[nameArr.length - 1].toLowerCase();
      //   if (/mov|avi|flv|mp4|rmvb|mkv/i.test(type)) {
      //     this.messageRecord.push({
      //       senderId: this.$store.state.userId,
      //       name: this.$store.state.nickName || this.$store.state.userId,
      //       message: `<video src="${file.url}" loop controls></video>`,
      //       isAtRight: true,
      //       messageType: 3
      //     });
      //     this.socket.emit('remandFriend', {
      //       message: `<video src="http://${this.$store.state.statisFileIp + res.data.filePath}" loop controls></video>`,
      //       from: res.data.from,
      //       friendName: this.curFriend.nickName,
      //       to: res.data.to,
      //       messageType: 3,
      //     });
      //   } else if (/jpeg|bmp|jpg|png|gif/i.test(type)) {
      //     this.messageRecord.push({
      //       senderId: this.$store.state.userId,
      //       name: this.$store.state.nickName || this.$store.state.userId,
      //       message: `<img src='${file.url}'></img>`,
      //       isAtRight: true,
      //       messageType: 3
      //     });
      //     this.socket.emit('remandFriend', {
      //       message: `<img src="http://${this.$store.state.statisFileIp + res.data.filePath}"></img>`,
      //       from: res.data.from,
      //       friendName: this.curFriend.nickName,
      //       to: res.data.to,
      //       messageType: 3
      //     });
      //   }
      //   this.$refs.uploadPic.clearFiles();
      //   this.$nextTick(() => {
      //     toBottom(this.$refs.message.$el);
      //   });
      // },
      // videoRequest() {
      //   let friendName = this.friendGroup.filter(obj => obj.value == this.curGroupId)[0].content.filter(obj => obj.friendId == this.$store.state.myFriendCheckedId)[0]
      //   this.socket.emit('videoRequest', {
      //     to: {
      //       id: this.$store.state.myFriendCheckedId,
      //       name: friendName.remark || friendName.nickName || friendName.friendId
      //     },
      //     from: {
      //       id: sessionStorage.getItem('userId'),
      //       name: this.$store.state.nickName || this.$store.state.userId
      //     }
      //   })
      //   this.$message({message: '已发送视频通话请求', type: 'success'})
      // },
      handleChange(index, index2) {
        if (this.selectedOptions == '') return;
        if (this.selectedOptions[0] === '1') {
          this.$prompt(' ', '修改备注', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({value}) => {
            if(value.length<=20){
              (async () => {
                await this.reviseRemark(this.friendGroup[index].content[index2].friendId, value);
                this.getFriend();
              })()
            }else{
             this.$message.error('请不要超过20字');
            }
          })
        } else if (this.selectedOptions[0] === '2') {
          (async () => {
            await this.changeGroup(this.friendGroup[index].content[index2].friendId, this.selectedOptions[1]);
            this.getFriend();
          })()
        } else {
          (async () => {
            await this.deleteFriend(this.friendGroup[index].content[index2].friendId);
            this.$store.state.myFriendCheckedId===this.friendGroup[index].content[index2].friendId&&(this.$store.state.myFriendCheckedId='');
            this.$store.state.socket.emit('sendRemind',{toId:this.friendGroup[index].content[index2].friendId});
            this.getFriend();
          })()
        }

        let menu = this.$refs['friendMenu' + index + '-' + index2][0];
        let obj = {};
        obj.stopPropagation = () => {
        };
        menu.clearValue(obj);
      },
      // openFriendMenu(ev,index,index2){
      //   //if(event.button==2){
      //   //   let menu=this.$refs['friendMenu'+index+'-'+index2][0].$el;
      //   //   if (menu.fireEvent){
      //   //     menu.fireEvent('click');
      //   //   }
      //   //   else{
      //   //     let e = document.createEvent("HTMLEvents");
      //   //     e.initEvent("click", false, true);
      //   //     menu.dispatchEvent(e);
      //   //   }
      //   //}
      // },
      // clickExpress(index) {
      //   // this.message+='{'+this.expressArr[index].name+'}'
      //   this.message += '{' + this.expressArr[index].split('.')[0] + '}'
      // },
      // getExpress(flag) {
      //   if (flag || this.expressArr.length === 0) {
      //     this.isLoadingImage = true;
      //     this.$http.post('/getExpress.do', {userId: this.$store.state.userId}).then(res => {
      //       if (res.data.success) {
      //         this.expressArr = res.data.data;
      //         this.isLoadingImage = false;
      //       }
      //     })
      //   }
      // },
      //删除好友
      deleteFriend(friendId) {
        return new Promise(resolve => {
          this.$http.post('/deleteFriend.do', {
            userId: sessionStorage.getItem('userId'),
            userName: this.$store.state.nickName,
            friendId: friendId
          }).then(res => {
            if (res.data.success) {
              this.$message({message: '删除成功', type: 'success'});
              resolve()
            }
          })
        })
      },
      //更改分组
      changeGroup(friendId, groupId) {
        return new Promise(resolve => {
          this.$http.post('/changeGroup.do', {
            userId: sessionStorage.getItem('userId'),
            friendId: friendId,
            friendGroupsId: groupId
          }).then(res => {
            if (res.data.success) {
              this.$message({
                message: '已移至"' + this.friendGroup.filter(obj => obj.value === groupId)[0].name + '"',
                type: 'success'
              })
              resolve()
            }
          })
        })
      },
      //修改好友备注
      reviseRemark(friendId, name) {
        return new Promise(resolve => {
          this.$http.post('/reviseRemark.do', {
            userId: sessionStorage.getItem('userId'),
            friendId: friendId,
            name: name
          }).then(res => {
            if (res.data.success) {
              this.$message({message: '修改成功', type: 'success'})
              resolve()
            }
          })
        });
      },
      // handleOpen() {
      // },
      // handleClose() {
      // },
      openGroupManageDialog() {
        this.groupFlag = true;
      },
      openAddFriendDialog() {
        this.addFlag = true;
      },
      openGroupMenu(e) {
        if (e.button == 2) {

        }
      },
      // sendMessage() {
      //   if (this.message !== '') {
      //     let params = {
      //       messageType: 1,
      //       message: this.message,
      //       from: sessionStorage.getItem('userId'),
      //       to: this.$store.state.myFriendCheckedId
      //     };
      //     let matchResult = this.message.match(/\{[0-9a-zA-Z]+(\-\g+){0,1}\}/ig);
      //     matchResult && matchResult.forEach((str, index) => {
      //       let splited = str.split('}')[0].split('{')[1];
      //       if (this.expressArr.some(obj => obj.split('.')[0] == splited)) {
      //         params.messageType = 2;
      //         if (!params.expressName) {
      //           params.expressName = '';
      //           params.expressName += splited;
      //         } else {
      //           params.expressName += ',' + splited;
      //         }
      //       }
      //       // if(this.expressArr.some(obj=>obj.name==splited)){
      //       //   params.messageType=2;
      //       //   if(!params.expressName){
      //       //     params.expressName='';
      //       //     params.expressName+=splited;
      //       //   }else{
      //       //     params.expressName+=','+splited;
      //       //   }
      //       // }
      //     });
      //     //let splited=matchResult[0].split('}')[0].split('{')[1];
      //     this.$http.post('/sendMessage.do', params).then(res => {
      //       if (res.data.success) {
      //         this.$message({message: '发送成功', type: 'success'});
      //         // let imgArr=[];
      //         // console.log(getExpressName(this.message));
      //         // getExpressName(this.message).forEach(imgName=>{
      //         //   console.log(this.$refs[imgName][0]);
      //         //   console.log(getBase64Image(this.$refs[imgName][0]));
      //         //   console.log(imgArr)
      //         //   imgArr.push({
      //         //     name:imgName,
      //         //     img:getBase64Image(this.$refs[imgName][0])
      //         //   })
      //         // });
      //         // console.log(imgArr);
      //         this.messageRecord.push({
      //           senderId: this.$store.state.userId,
      //           name: this.$store.state.nickName || this.$store.state.userId,
      //           message: translateExpress(2, this.message, this.expressArr.filter(name => getExpressName(this.message).includes(name.split('.')[0])), this.$store.state.statisFileIp),
      //           isAtRight: true
      //         });
      //         // this.messageRecord.push({
      //         //   senderId:this.$store.state.myFriendCheckedId,
      //         //   name:this.$store.state.nickName||this.$store.state.userId,
      //         //   message:translateExpress(1,this.message,this.expressArr.filter(obj=>getExpressName(this.message).includes(obj.name))),
      //         //   isAtRight:true
      //         // });
      //         this.$nextTick(() => {
      //           toBottom(this.$refs.message.$el);
      //         });
      //         this.$store.state.socket.emit('remandFriend', {
      //           message: translateExpress(2, this.message, this.expressArr.filter(name => getExpressName(this.message).includes(name.split('.')[0])), this.$store.state.statisFileIp),
      //           from: sessionStorage.getItem('userId'),
      //           to: this.$store.state.myFriendCheckedId,
      //           friendName: this.curFriend.nickName,
      //           messageType: params.messageType
      //         });
      //         // this.$store.state.socket.emit('remandFriend',{message:translateExpress(this.message,this.expressArr.filter(obj=>getExpressName(this.message).includes(obj.name))),from:sessionStorage.getItem('userId'),to:this.$store.state.myFriendCheckedId});
      //         this.message = '';
      //       }
      //     });
      //   }
      // },
      select(index, indexPath) {
        // console.log(this.$store.state.myFriendCheckedId);
        if (this.$store.state.myFriendCheckedId == index) return;
        this.$store.state.myFriendCheckedId = index;
        // this.messageRecord = [];
        // this.pageNo = 1;
        // this.total = 0;
        // this.openTime = new Date().getTime();
        // this.curFriend = this.friendList.filter(obj => obj.friendId === this.$store.state.myFriendCheckedId)[0];
        // this.curGroupId = indexPath[0];
        // this.curFriendDetailData=this.curFriend;
        // console.log(this.curFriend)
        // this.getFriendMessage().then(()=>{
        //   this.$nextTick(() => {
        //     toBottom(this.$refs.message.$el);
        //   });
        // })
      },
      // getFriendMessage() {
      //   return new Promise(resolve => {
      //     // this.messageRecord = [];
      //     this.isMessageLoading=true;
      //     this.$http.post('/getFriendMessage.do', {
      //       openTime: this.openTime,
      //       pageNo: this.pageNo,
      //       pageSize: this.$store.state.pageSize,
      //       userId: sessionStorage.getItem('userId'),
      //       friendId: this.$store.state.myFriendCheckedId
      //     }).then(res => {
      //       if (res.data.success) {
      //         this.total = res.data.total;
      //         res.data.data.length !== 0 && res.data.data.forEach(obj => {
      //           let friendName;
      //           let newMessage = obj.M_PostMessages;
      //           if (obj.M_FromUserID === this.$store.state.myFriendCheckedId) {
      //             friendName = this.friendGroup.filter(obj => obj.value == this.curGroupId)[0].content.filter(obj => obj.friendId == this.$store.state.myFriendCheckedId)[0]
      //           }
      //           if ([3, 4].includes(obj.M_MessageTypeID)) {
      //             let pathArr = obj.M_FilePath.split('.');
      //             let type = pathArr[pathArr.length - 1].toLowerCase();
      //             if (/mov|avi|flv|mp4|rmvb|mkv/i.test(type)) {
      //               this.messageRecord.unshift({
      //                 message: `<video src="http://${this.$store.state.statisFileIp + obj.M_FilePath}" loop controls></video>`,
      //                 senderId: obj.M_FromUserID,
      //                 name: obj.M_FromUserID !== this.$store.state.myFriendCheckedId ? (this.$store.state.nickName || this.$store.state.userId) : (friendName.remark || friendName.nickName || friendName.friendId),
      //                 isAtRight: obj.M_FromUserID !== this.$store.state.myFriendCheckedId,
      //                 messageType: obj.M_MessageTypeID,
      //                 filePath: obj.M_FilePath
      //               });
      //             } else if (/jpeg|bmp|jpg|png|gif/i.test(type)) {
      //               this.messageRecord.unshift({
      //                 message: `<img src='http://${this.$store.state.statisFileIp + obj.M_FilePath}'></img>`,
      //                 senderId: obj.M_FromUserID,
      //                 name: obj.M_FromUserID !== this.$store.state.myFriendCheckedId ? (this.$store.state.nickName || this.$store.state.userId) : (friendName.remark || friendName.nickName || friendName.friendId),
      //                 isAtRight: obj.M_FromUserID !== this.$store.state.myFriendCheckedId,
      //                 messageType: obj.M_MessageTypeID,
      //                 filePath: obj.M_FilePath
      //               });
      //               // console.log(this.messageRecord)
      //             } else {
      //               // console.log('file',obj);
      //               this.messageRecord.unshift({
      //                 message: obj.M_PostMessages,
      //                 senderId: obj.M_FromUserID,
      //                 name: obj.M_FromUserID !== this.$store.state.myFriendCheckedId ? (this.$store.state.nickName || this.$store.state.userId) : (friendName.remark || friendName.nickName || friendName.friendId),
      //                 isAtRight: obj.M_FromUserID !== this.$store.state.myFriendCheckedId,
      //                 messageType: obj.M_MessageTypeID,
      //                 filePath: obj.M_FilePath
      //               });
      //             }
      //           } else if ([1, 2].includes(obj.M_MessageTypeID)) {
      //             if (obj.expressArr) {
      //               // console.log(obj.expressArr);
      //               newMessage = translateExpress(1, newMessage, obj.expressArr);
      //               // obj.expressArr.forEach((item, index2) => {
      //               //   var reg=new RegExp('{'+item.name+'}','ig')
      //               //   newMessage=newMessage.replace(reg,`<img src="data:image/png;base64,${item.img}" />`)
      //               // })
      //             }
      //             this.messageRecord.unshift({
      //               senderId: obj.M_FromUserID,
      //               name: obj.M_FromUserID !== this.$store.state.myFriendCheckedId ? (this.$store.state.nickName || this.$store.state.userId) : (friendName.remark || friendName.nickName || friendName.friendId),
      //               message: newMessage,
      //               isAtRight: obj.M_FromUserID !== this.$store.state.myFriendCheckedId,
      //               messageType: obj.M_MessageTypeID,
      //               filePath: obj.M_FilePath
      //             })
      //           }
      //           resolve();
      //         });
      //         // this.$nextTick(() => {
      //         //   toBottom(this.$refs.message.$el);
      //         // });
      //       }
      //       this.isMessageLoading=false;
      //     }).catch(()=>{
      //       this.isMessageLoading=false;
      //     })
      //   });
      // },
      getFriend() {
        return new Promise(resolve => {
          this.friendList = [];
          this.$http.post('/getFriend.do', {userId: sessionStorage.getItem('userId')}).then(res => {
            if (res.data.success) {
              this.friendGroup.forEach((obj, index) => {
                this.friendGroup[index].content = [];
              });
              res.data.data.forEach((obj) => {
                let group = this.friendGroup.filter(group=>group.value === obj.F_FriendGroupsID);
                if(group.length ===1 ){
                  group[0].content.push({
                    remark: obj.F_Name,
                    nickName: obj.U_NickName,
                    friendId: obj.F_FriendID,
                    status: obj.U_UserStateID,
                    friendGroupsId: obj.F_FriendGroupsID
                  });
                  this.friendList.push({
                    remark: obj.F_Name,
                    nickName: obj.U_NickName,
                    friendId: obj.F_FriendID,
                    status: obj.U_UserStateID,
                    friendGroupsId: obj.F_FriendGroupsID
                  });
                }else{
                  this.friendGroup[0].content.push({
                    remark: obj.F_Name,
                    nickName: obj.U_NickName,
                    friendId: obj.F_FriendID,
                    status: obj.U_UserStateID,
                    friendGroupsId: this.friendGroup[0].value
                  });
                  this.friendList.push({
                    remark: obj.F_Name,
                    nickName: obj.U_NickName,
                    friendId: obj.F_FriendID,
                    status: obj.U_UserStateID,
                    friendGroupsId: this.friendGroup[0].value
                  });
                }
                // this.friendGroup.forEach((item, index) => {
                //   if (item.value == obj.F_FriendGroupsID) {
                //     this.friendList.push({
                //       remark: obj.F_Name,
                //       nickName: obj.U_NickName,
                //       friendId: obj.F_FriendID,
                //       status: obj.U_UserStateID,
                //       friendGroupsId: obj.F_FriendGroupsID
                //     });
                //     this.friendGroup[index].content.push({
                //       remark: obj.F_Name,
                //       nickName: obj.U_NickName,
                //       friendId: obj.F_FriendID,
                //       status: obj.U_UserStateID,
                //       friendGroupsId: obj.F_FriendGroupsID
                //     })
                //   }
                // })
              });
              resolve();
            }
          });
          this.$http.post('/getYourFriendRequest.do', {userId: sessionStorage.getItem('userId')}).then(res => {
            if (res.data.success) {
              res.data.data.forEach((obj, index) => {
                this.friendList.push({
                  remark: obj.F_Name,
                  nickName: obj.U_NickName,
                  friendId: obj.UM_ToID,
                  type: 1
                });
              });
              resolve();
            }
          })
        })
      },
      getFriendGroup() {
        return new Promise(resolve => {
          // this.friendGroup=[];
          this.$http.post('/getFriendGroup.do', {userId: sessionStorage.getItem('userId')}).then(res => {
            if (res.data.success) {
              let temp = [];
              this.options[1].children = [];
              res.data.data.forEach((obj, index) => {
                this.options[1].children.push({
                  label: obj.FG_Name,
                  value: obj.FG_ID
                });
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
      }
    },
    watch: {
      // $store.state.myFriendCheckedId(val){
      //   if(val !== ''){
      //     onToTop(this.$refs.message.$el,()=>{
      //       // console.log(Math.ceil(this.total/this.$store.state.pageSize));
      //       if(Math.ceil(this.total/this.$store.state.pageSize)<this.pageNo+1) return;
      //       if(this.isMessageLoading) return;
      //       this.pageNo++;
      //       let scrollBottom = this.$refs.message.$el.scrollHeight;
      //       // let scrollBottom = this.$refs.message.$el.scrollHeight - parseInt(getStyle(this.$refs.message.$el,'height'), 10);
      //       this.getFriendMessage().then(()=>{
      //         this.$nextTick(()=>{
      //           this.$refs.message.$el.scrollTop = this.$refs.message.$el.scrollHeight - scrollBottom;
      //         });
      //       });
      //     })
      //   }
      // },
      socket: {
        handler(value, oldValue) {
          if (value&&this.isSocketListen===false) {
            value.on('refreshFriend', () => {
              (async () => {
                await this.getFriendGroup();
                await this.getFriend();
              })()
            });
            this.isSocketListen=true;
      //       this.$store.state.socket.removeAllListeners('getMessage');
      //       this.$store.state.socket.on('getMessage', (item) => {
      //         if (item.groupId !== undefined) return;
      //         let notify;
      //         let time=new Date().getTime();
      //         notify=this.$notify({
      //           title: `好友消息`,
      //           dangerouslyUseHTMLString: true,
      //           message: `<p>${item.friendName || item.from}:</p><div style="text-indent:2em;">${item.messageType === 3 ? '[图像]' : item.messageType === 4 ? '[文件]' : item.message}</div><button class="answerFriend ${item.from}Button${time}">前往回复</button>`,
      //           duration: 5000
      //         });
      //         let button=document.getElementsByClassName(`${item.from}Button${time}`);
      //         button[0].onclick=()=>{
      //           notify.close();
      //           this.$store.state.myFriendCheckedId = item.from;
      //           let belongGroup=this.friendGroup.filter(obj=>obj.content.some(obj2=>obj2.friendId===item.from))[0];
      //           this.$refs.friendMenu.open(belongGroup.value);
      //           this.select(item.from,[belongGroup.value,item.from]);
      //           this.$router.push({name:'myFriend'});
      //         };
      //         // if (item.from === this.$store.state.myFriendCheckedId) {
      //         //   let friendName = this.friendGroup.filter(obj => obj.value == this.curGroupId)[0].content.filter(obj => obj.friendId == this.$store.state.myFriendCheckedId)[0];
      //         //   this.messageRecord.push({
      //         //     senderId: item.from,
      //         //     name: friendName.remark || friendName.nickName || friendName.friendId,
      //         //     message: item.message,
      //         //     isAtRight: false,
      //         //     filePath: item.filePath,
      //         //     messageType: item.messageType
      //         //   });
      //         //   this.$nextTick(() => {
      //         //     toBottom(this.$refs.message.$el);
      //         //   });
      //         // }
      //       });
      //       this.$store.state.socket.removeAllListeners('friendLoginRemand');
      //       this.$store.state.socket.on('friendLoginRemand', (item) => {
      //         this.$notify({
      //           title: 'tip',
      //           message: '你的好友' + item.name + '已上线',
      //           position: 'bottom-right',
      //           duration: 3000
      //         });
      //         this.friendGroup.forEach(obj => {
      //           obj.content.forEach(obj2 => {
      //             if (obj2.friendId === item.userId) obj2.status = 1;
      //           })
      //         })
      //       });
      //       this.$store.state.socket.removeAllListeners('friendDisconnectRemand');
      //       this.$store.state.socket.on('friendDisconnectRemand', (item) => {
      //         this.$notify({
      //           title: 'tip',
      //           message: '你的好友' + item.name + '已下线',
      //           position: 'bottom-right',
      //           duration: 3000
      //         });
      //         this.friendGroup.forEach(obj => {
      //           obj.content.forEach(obj2 => {
      //             if (obj2.friendId === item.userId) obj2.status = 0;
      //           })
      //         })
      //       });
          }
        },
        deep: true
      }
    },
    components: {
      aMessage,
      groupManageDialog,
      addFriendDialog,
      headPortrait,
      friendDetailDialog,
      chatWindow
    }
  }
</script>
<style lang="less">
  .myFriend {
    height: 100%;
    > .el-container {
      height: 100%;
      .el-aside {
        overflow: hidden;
        background: rgb(84, 92, 100);
        .operate {
          height: 30px;
          i {
            color: white;
            margin-right: 10px;
            line-height: 30px;
          }
        }
        .search-wrap {
          position:relative;
          .el-input {
            margin-left: 5px;
            margin-right: 5px;
            width: calc(~'100% - 10px');
            margin-bottom: 5px;
            .el-input__inner {
              height: 30px;
            }
          }
          .filter-friend-wrap{
            overflow: auto;
            opacity: 0;
            border-radius: 5px;
            position: absolute;
            z-index: 100;
            background: white;
            left: 5px;
            width: calc(~'100% - 10px');
            li{
              padding: 5px 10px;
              .headPortrait {
                display: inline-block;
                margin-right: 10px;
                width: 30px;
                height: 30px;
                border-radius: 15px;
                vertical-align: middle;
              }
              .lowColor {
                color: gray;
                vertical-align: middle;
              }
            }
            li:hover{
              background: #66b1ff;
            }
          }
          .hasFriend{
            transition: all 0.9s;
            opacity: 1;
          }
          .friendWrapHide{
            transition: all 0.9s;
            opacity: 0;
          }
        }
        .my-group {
          height: calc(~'100% - 30px - 30px');
          overflow-y: auto;
          overflow-x: hidden;
          .el-menu {
            min-height: calc(~'100% - 30px');
            border: 0;
            .el-menu-item {
              padding: 0 !important;
              > div {
                padding-left: 40px;
                padding-right: 45px;
                .cascader {
                  position: absolute;
                  left: 0;
                  top: 0;
                }
                .el-cascader {
                  height: 50px;
                  input, .el-cascader__label {
                    display: none;
                  }
                  .el-input__suffix {
                    height: 50px;
                    position: static;
                  }
                }
                .headPortrait {
                  display: inline-block;
                  margin-right: 10px;
                  width: 30px;
                  height: 30px;
                  border-radius: 15px;
                }
                .lowColor {
                  color: gray;
                }
                .isActive {
                  color: rgb(255, 208, 75);
                }
              }
            }
            .is-active{
              color: white !important;
            }
          }
        }
      }
      /*.small {*/
        /*padding-right: 300px;*/
      /*}*/
    }
    /*.loading-wrap{*/
      /*text-align: center;*/
    /*}*/
    /*.messageField {*/
      /*p{*/
        /*text-align: center;*/
        /*color: gray;*/
        /*font-size: 12px;*/
      /*}*/
    /*}*/
    /*.el-footer {*/
      /*margin-bottom: 20px;*/
      /*height: 100px !important;*/
      /*.inputField {*/
        /*.input-menu {*/
          /*span {*/
            /*display: inline-block;*/
          /*}*/
          /*i {*/
            /*padding: 5px;*/
          /*}*/
          /*i:hover {*/
            /*background: #66b1ff;*/
          /*}*/
        /*}*/
        /*.input-wrap {*/
          /*height: 74px;*/
          /*> textarea {*/
            /*width: calc(~'100% - 70px');*/
            /*resize: none;*/
            /*height: 63px;*/
          /*}*/
          /*.send-button {*/
            /*width: 50px;*/
            /*margin-left: -3px;*/
            /*border: 1px solid rgb(169, 169, 169);*/
            /*border-left: none;*/
            /*height: 69px;*/
            /*vertical-align: top;*/
          /*}*/
        /*}*/
      /*}*/
      /*.upload-wrap {*/
        /*display: inline-block;*/
        /*.el-upload-list {*/
          /*display: none;*/
        /*}*/
      /*}*/
    /*}*/
  }

  /*.express-popover {*/
    /*background: #8c939d;*/
    /*max-width: 600px;*/
    /*> div {*/
      /*min-height: 200px;*/
      /*img {*/
        /*width: 30px;*/
        /*height: 30px;*/
        /*margin-left: 5px;*/
      /*}*/
      /*img:hover {*/
        /*width: 26px;*/
        /*height: 26px;*/
        /*border: 2px solid blue;*/
      /*}*/
    /*}*/
  /*}*/

  .el-cascader-menus {
    .el-cascader-menu {
      li {
        color: #606266;
      }
    }
  }
</style>
