<template>
  <div class="myGroups">
    <createGroupDialog :dialogFlag.sync="createGroupFlag"></createGroupDialog>
    <groupDetailDialog :dialogFlag.sync="groupDetailFlag" :openData="groupDetailData" :groupsList="groupsList"></groupDetailDialog>
    <searchGroupsDialog :dialogFlag.sync="searchGroupsFlag" :groupsList="groupsList"></searchGroupsDialog>
    <friendDetailDialog :dialogFlag.sync="friendDetailFlag" :openData="friendDetailData"></friendDetailDialog>
    <el-container>
      <el-aside width="200px">
        <div class="operate">
          <i class="el-icon-plus fr" @click="searchGroupsFlag=true"></i>
        </div>
        <div class="search-wrap">
          <el-input placeholder="请输入群ID或群名进行搜索" v-model="searchParams" @focus="isFilterGroupShow=true" @blur="isFilterGroupShow=false"></el-input>
          <ul :class="{groupWrapHide:!isFilterGroupShow}">
            <li v-for="group in filterGroup" @click="goToGroup(group)">
              <headPortrait :isSave="true" :class="`group${group.groupId}`" :imgUrl="group.groupIcon" @imgClick="imgClick" :indexPath="[group.groupAdminId === $store.state.userId?'0':'1',group.groupId]"></headPortrait>
              <span>{{group.groupName}}</span>
            </li>
          </ul>
        </div>
        <div class="create-group" @click="createGroupFlag=true">
          <i class="el-icon-plus"></i>
          <span>创建群</span>
        </div>
        <div class="my-group">
          <!--<ul>-->
          <!--<li v-for="(item,index) in groupsList" @click="selectGroup(index)" :class="{isGroupChecked:index===groupIndex}">-->
          <!--<div>-->
          <!--<headPortrait :userId="item.icon"></headPortrait>-->
          <!--<span>{{item.groupName}}</span>-->
          <!--<div class="cascader" @click.stop="">-->
          <!--<el-cascader-->
          <!--:ref="'group'+index"-->
          <!--:options="options"-->
          <!--v-model="selectedOptions"-->
          <!--@change="handleChange(index)">-->
          <!--</el-cascader>-->
          <!--</div>-->
          <!--</div>-->
          <!--</li>-->
          <!--</ul>-->
          <el-menu
            ref="groupMenu"
            @select="select"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu index="0">
              <template slot="title"><span>我创建的群</span></template>
              <el-menu-item v-for="(group,index) in groupsList.createGroup" :key="index" :index="group.groupId">
                <div>
                  <headPortrait :class="`group${group.groupId}`" :imgUrl="group.groupIcon" @imgClick="imgClick" :indexPath="['0',group.groupId]"></headPortrait>
                  <span :class="{isActive:group.groupId === curGroupId}">{{group.groupName}}</span>
                  <!--<div class="cascader" @click.stop="">-->
                    <!--<el-cascader-->
                      <!--:ref="'group'+index"-->
                      <!--:options="options"-->
                      <!--v-model="selectedOptions"-->
                      <!--@change="handleChange('0',index)">-->
                    <!--</el-cascader>-->
                  <!--</div>-->
                </div>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="1">
              <template slot="title"><span>我加入的群</span></template>
              <el-menu-item v-for="(group,index) in groupsList.joinGroup" :key="index" :index="group.groupId">
                <div>
                  <headPortrait :class="`group${group.groupId}`" :imgUrl="group.groupIcon" @imgClick="imgClick" :indexPath="['1',group.groupId]"></headPortrait>
                  <span :class="{isActive:group.groupId === curGroupId}">{{group.groupName}}</span>
                  <!--<div class="cascader" @click.stop="">-->
                    <!--<el-cascader-->
                      <!--:ref="'group'+index"-->
                      <!--:options="options"-->
                      <!--v-model="selectedOptions"-->
                      <!--@change="handleChange('1',index)">-->
                    <!--</el-cascader>-->
                  <!--</div>-->
                </div>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>
      <el-container>
        <el-main ref="message" :class="{small:$store.state.isVideo}">
          <div class="loading-wrap" v-show="isMessageLoading"><i class="el-icon-loading"></i></div>
          <div v-if="curGroupId!==''" class="messageField">
            <p v-if="total !==0 && total <= messageRecord.length">没有记录了</p>
            <aMessage @imgClick="openFriendDetail" v-for="(item,index) in messageRecord" :key="index" :name="item.name" :isAtRight="item.isAtRight"
                      :expressArr="expressArr" :data="item"></aMessage>
          </div>
        </el-main>
        <el-footer>
          <div v-if="curGroupId!==''" class="inputField">
            <div class="input-menu">
              <i class="fa fa-font" title="文字样式"></i>
              <el-popover
                popper-class="express-popover"
                ref="express"
                placement="top-start"
                trigger="click">
                <div v-loading="isLoadingImage">
                  <img :ref="item.split('.')[0]" :key="index" v-for="(item,index) in expressArr"
                       :src="'http://'+$store.state.statisFileIp+'/express/'+item" alt="" @click="clickExpress(index)">
                </div>
              </el-popover>
              <i class="fa fa-smile-o" v-popover:express @click="getExpress(false)" title="表情"></i>
              <span class="upload-wrap" title="发送图片或视频">
                <el-upload
                  ref="uploadPic"
                  :action='`/uploadGroupPicture.do?userId=${$store.state.userId}&&groupId=${curGroupId}&&uName=${curGroupDetailData.members.filter(obj=>obj.memberId===$store.state.userId)[0].groupNick||$store.state.nickName||$store.state.userId}`'
                  :on-success="picUpdateSuccess"
                  :before-upload="beforePicUpload"
                  :limit="1">
                  <i class="el-icon-picture"></i>
                </el-upload>
              </span>
              <span class="upload-wrap" title="发送文件">
                <el-upload
                  ref="uploadFile"
                  :action='`/uploadGroupFile.do?userId=${$store.state.userId}&&groupId=${curGroupId}&&uName=${curGroupDetailData.members.filter(obj=>obj.memberId===$store.state.userId)[0].groupNick||$store.state.nickName||$store.state.userId}`'
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
    </el-container>
  </div>
</template>
<script>
  import aMessage from '../common/aMessage'
  import headPortrait from './../common/headPortrait'
  import createGroupDialog from './myGroupsMoudle/createGroupDialog'
  import groupDetailDialog from './myGroupsMoudle/groupDetailDialog'
  import searchGroupsDialog from './myGroupsMoudle/searchGroupsDialog'
  import friendDetailDialog from './myFriendMoudle/friendDetailDialog'
  import {toBottom, translateExpress, getExpressName, getBase64Image, onToTop} from '@/util/common'

  export default {
    name: 'myGroups',
    data: function () {
      return {
        isFilterGroupShow:false,
        searchParams: '',
        isMessageLoading: false,
        pageNo: 1,
        total: 0,
        groupsList: {
          createGroup: [],
          joinGroup: [],
          requestGroup:[]
        },
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
        openTime: '',
        message: '',
        // groupIndex: '',
        curGroupId: '',
        // curGroup:{},
        messageRecord: [],
        expressArr: [],
        isLoadingImage: true,
        searchGroupsFlag:false,
        createGroupFlag: false,
        groupDetailFlag: false,
        groupDetailData:{},
        curGroupDetailData:{},
        friendDetailFlag:false,
        friendDetailData:{}
      };
    },
    computed: {
      filterGroup(){
        if(this.searchParams === ''){
          return [];
        }else{
          let list1=this.groupsList.createGroup.filter(obj=>obj.groupId.indexOf(this.searchParams) !== -1 || obj.groupName.indexOf(this.searchParams) !== -1);
          let list2=this.groupsList.joinGroup.filter(obj=>obj.groupId.indexOf(this.searchParams) !== -1 || obj.groupName.indexOf(this.searchParams) !== -1);
          console.log(list1);
          console.log(list2);
          return list1.concat(list2);
        }
      },
      curGroup() {
        // return {};
        if(this.curGroupId === '' ||(this.groupsList.createGroup.length === 0 && this.groupsList.joinGroup.length === 0) ){
          return {}
        }else{
          return this.groupsList.createGroup.filter(obj=>obj.groupId === this.curGroupId)[0] ||this.groupsList.joinGroup.filter(obj=>obj.groupId === this.curGroupId)[0];
        }
      },
      socket() {
        return this.$store.state.socket;
      }
    },
    mounted() {
      this.getAllGroups().then(()=>{
        if (this.$route.params.groupId !== undefined) {
          // this.curGroupId = this.$route.params.groupId;
          // this.curGroup = this.groupsList.createGroup.filter(obj=>obj.groupId === this.curGroupId)[0] ||this.groupsList.joinGroup.filter(obj=>obj.groupId === this.curGroupId)[0];
          // console.log(this.curGroupId);
          // console.log(this.groupsList);
          let isCreated=this.groupsList.createGroup.some(obj=>obj.groupId === this.$route.params.groupId);
          this.$refs.groupMenu.open(isCreated?'0':'1');
          this.select(this.$route.params.groupId,[isCreated?'0':'1',this.$route.params.groupId])
        }
      });
      this.getExpress(false);
    },
    methods: {
      openFriendDetail(userId){
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
      goToGroup(group){
        this.$refs.groupMenu.open(group.groupAdminId === this.$store.state.userId?'0':'1');
        this.select(group.groupId,[group.groupAdminId === this.$store.state.userId?'0':'1',group.groupId]);
        this.searchParams='';
      },
      getGroupDetailData(groupId){
        return this.$http.post('/getGroupDetailData.do',{groupId:groupId})
      },
      getGroupMembers(groupId){
        return this.$http.post('/getGroupMembers.do',{groupId:groupId})
      },
      imgClick(indexPath){
        // let group=indexPath[0]==='0'?this.groupsList.createGroup.filter(obj=>obj.groupId===indexPath[1])[0]:this.groupsList.joinGroup.filter(obj=>obj.groupId===indexPath[1])[0];
        // let group=indexPath[0]==='0'?this.groupsList.createGroup[indexPath[1]]:this.groupsList.joinGroup[indexPath[1]];
        // Promise.all([this.getGroupDetailData(group.groupId),this.getGroupMembers(group.groupId)]).then(result=>{
        Promise.all([this.getGroupDetailData(indexPath[1]),this.getGroupMembers(indexPath[1])]).then(result=>{
          // console.log(result);
          if(result[0].data.success&&result[1].data.success){
            this.groupDetailData= {
              groupId:result[0].data.data[0].UG_ID,
              groupName:result[0].data.data[0].UG_Name,
              groupIntro:result[0].data.data[0].UG_Intro,
              groupNotice:result[0].data.data[0].UG_Notice,
              groupIcon:result[0].data.data[0].UG_Icon,
              createTime:result[0].data.data[0].UG_CreateTime,
              adminId:result[0].data.data[0].UG_AdminID,
              members:[]
            };
            result[1].data.data.forEach(obj=>{
              this.groupDetailData.members.push({
                groupNick:obj.UGU_GroupNick,
                memberId:obj.UGU_UserID,
                joinTime:obj.UGU_CreateTime,
                authority:obj.UGU_Authority
              })
            });
            this.groupDetailFlag=true;
          }
        });
      },
      getGroupMessage(){
        return new Promise(resolve => {
          // this.messageRecord=[];
          this.isMessageLoading=true;
          this.$http.post('/getGroupMessage.do',{
            openTime: this.openTime,
            pageNo: this.pageNo,
            pageSize: this.$store.state.pageSize,
            groupId:this.curGroupId
          }).then(res=>{
            if(res.data.success){
              this.total = res.data.total;
              res.data.data.length!==0&&res.data.data.forEach(obj=>{
                let newMessage=obj.GM_Message;
                if([3,4].includes(obj.GM_MessageType)){
                  let pathArr=obj.GM_FilePath.split('.');
                  let type=pathArr[pathArr.length-1].toLowerCase();
                  if(/mov|avi|flv|mp4|rmvb|mkv/i.test(type)){
                    this.messageRecord.unshift({
                      message:`<video src="http://${this.$store.state.statisFileIp+obj.GM_FilePath}" loop controls></video>`,
                      senderId:obj.GM_FromID,
                      name:obj.GM_FromUName,
                      isAtRight:obj.GM_FromID===this.$store.state.userId,
                      messageType:obj.GM_MessageType,
                      filePath:obj.GM_FilePath
                    });
                  }else if(/jpeg|jpg|png|gif/i.test(type)){
                    this.messageRecord.unshift({
                      message:`<img src='http://${this.$store.state.statisFileIp+obj.GM_FilePath}'></img>`,
                      senderId:obj.GM_FromID,
                      name:obj.GM_FromUName,
                      isAtRight:obj.GM_FromID===this.$store.state.userId,
                      messageType:obj.GM_MessageType,
                      filePath:obj.GM_FilePath
                    });
                    // console.log(this.messageRecord)
                  }else{
                    this.messageRecord.unshift({
                      message:obj.GM_Message,
                      senderId:obj.GM_FromID,
                      name:obj.GM_FromUName,
                      isAtRight:obj.GM_FromID===this.$store.state.userId,
                      messageType:obj.GM_MessageType,
                      filePath:obj.GM_FilePath
                    });
                  }
                }else if([1,2].includes(obj.GM_MessageType)){
                  if(obj.expressArr){
                    newMessage=translateExpress(1,newMessage,obj.expressArr);
                    // obj.expressArr.forEach((item, index2) => {
                    //   var reg=new RegExp('{'+item.name+'}','ig')
                    //   newMessage=newMessage.replace(reg,`<img src="data:image/png;base64,${item.img}" />`)
                    // })
                  }
                  this.messageRecord.unshift({
                    message:newMessage,
                    senderId:obj.GM_FromID,
                    name:obj.GM_FromUName,
                    isAtRight:obj.GM_FromID===this.$store.state.userId,
                    messageType:obj.GM_MessageType,
                    filePath:obj.GM_FilePath
                  })
                }
              });
              // this.$nextTick(()=>{
              //   toBottom(this.$refs.message.$el);
              // });
              resolve();
            }
            this.isMessageLoading = false;
          }).catch(()=>{
            this.isMessageLoading = false;
          })
        });
      },
      select(index, indexPath) {
        if(this.curGroupId === index) return;
        this.messageRecord=[];
        this.pageNo = 1;
        this.total = 0;
        this.openTime = new Date().getTime();
        Promise.all([this.getGroupDetailData(index),this.getGroupMembers(index)]).then(result=> {
          // console.log(result);
          if (result[0].data.success && result[1].data.success) {
            this.curGroupDetailData= {
              groupId:result[0].data.data[0].UG_ID,
              groupName:result[0].data.data[0].UG_Name,
              groupIntro:result[0].data.data[0].UG_Intro,
              groupNotice:result[0].data.data[0].UG_Notice,
              icon:result[0].data.data[0].UG_Icon,
              createTime:result[0].data.data[0].UG_CreateTime,
              adminId:result[0].data.data[0].UG_AdminID,
              members:[]
            };
            result[1].data.data.forEach(obj=>{
              this.curGroupDetailData.members.push({
                groupNick:obj.UGU_GroupNick,
                memberId:obj.UGU_UserID,
                joinTime:obj.UGU_CreateTime,
                authority:obj.UGU_Authority
              })
            });
            this.curGroupId = index;
            // this.curGroup=this.groupsList.createGroup.filter(obj=>obj.groupId === this.curGroupId)[0] ||this.groupsList.joinGroup.filter(obj=>obj.groupId === this.curGroupId)[0];
            this.getGroupMessage(index, indexPath).then(()=>{
              this.$nextTick(()=>{
                toBottom(this.$refs.message.$el);
              });
            })
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
        this.socket.emit('remandFriend', {
          from: res.data.from,
          filePath: res.data.filePath,
          groupId:this.curGroupId,
          groupName:this.curGroup.groupName,
          uName:res.data.uName,
          messageType: 4
        });
        this.$refs.uploadFile.clearFiles();
        this.$nextTick(() => {
          toBottom(this.$refs.message.$el);
        });
      },
      beforePicUpload(file) {
        let nameArr = file.name.split('.');
        let type = nameArr[nameArr.length - 1].toLowerCase();
        const isLt10M = file.size / 1024 / 1024 < 10;
        const isTrueFormat = /mov|avi|flv|mp4|rmvb|mkv|jpeg|jpg|png|gif/i.test(type);
        !isLt10M && this.$message.error('文件不能超过10Mb')
        !isTrueFormat && this.$message.error('不识别此格式文件')
        return isTrueFormat && isLt10M;
      },
      picUpdateSuccess(res, file) {
        // console.log(res)
        let nameArr = file.name.split('.');
        let type = nameArr[nameArr.length - 1].toLowerCase();
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
            groupId:this.curGroupId,
            groupName:this.curGroup.groupName,
            uName:res.data.uName,
            messageType: 3
          });
        } else if (/jpeg|jpg|png|gif/i.test(type)) {
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
            groupId:this.curGroupId,
            groupName:this.curGroup.groupName,
            uName:res.data.uName,
            messageType: 3
          });
        }
        this.$refs.uploadPic.clearFiles();
        this.$nextTick(() => {
          toBottom(this.$refs.message.$el);
        });
      },
      handleChange(index) {

        let menu = this.$refs['friendMenu' + index][0];
        let obj = {};
        obj.stopPropagation = () => {
        };
        menu.clearValue(obj);
      },
      clickExpress(index) {
        this.message += '{' + this.expressArr[index].split('.')[0] + '}'
      },
      getExpress(flag) {
        if (flag || this.expressArr.length === 0) {
          this.isLoadingImage = true;
          this.$http.post('/getExpress.do', {userId: this.$store.state.userId}).then(res => {
            if (res.data.success) {
              this.expressArr = res.data.data;
              this.isLoadingImage = false;
            }
          })
        }
      },
      sendMessage() {
        if (this.message !== '') {
          let uName=this.curGroupDetailData.members.filter(obj=>obj.memberId===this.$store.state.userId)[0].groupNick;
          let params = {
            messageType: 1,
            message: this.message,
            from: this.$store.state.userId,
            groupId:this.curGroupId,
            uName: uName || this.$store.state.nickName || this.$store.state.userId
          };
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
          this.$http.post('/sendGroupMessage.do', params).then(res => {
            if (res.data.success) {
              this.$message({message: '发送成功', type: 'success'});
              this.messageRecord.push({
                senderId: this.$store.state.userId,
                name: uName||this.$store.state.nickName || this.$store.state.userId,
                message: translateExpress(2, this.message, this.expressArr.filter(name => getExpressName(this.message).includes(name.split('.')[0])), this.$store.state.statisFileIp),
                isAtRight: true
              });
              this.$nextTick(() => {
                toBottom(this.$refs.message.$el);
              });
              this.$store.state.socket.emit('remandFriend', {
                message: translateExpress(2, this.message, this.expressArr.filter(name => getExpressName(this.message).includes(name.split('.')[0])), this.$store.state.statisFileIp),
                from: this.$store.state.userId,
                groupId:this.curGroupId,
                groupName:this.curGroup.groupName,
                uName:params.uName
              });
              this.message = '';
            }
          });
        }
      },
      // selectGroup(index) {
      //   if (this.groupIndex === index) return;
      //   this.groupIndex = index;
      //   this.curGroupId = this.groupsList[index].groupId;
      //   this.getGroupMessage(index)
      // },
      getAllGroups() {
        return new Promise(resolve => {
          Promise.all([this.$http.post('/getAllGroups.do', {userId: sessionStorage.getItem('userId')}),this.$http.post('/getYourGroupRequest.do', {userId: sessionStorage.getItem('userId')})]).then(result=>{
            if(result[0].data.success&&result[1].data.success){
              let temp = {
                createGroup: [],
                joinGroup: [],
                requestGroup:[]
              };
              result[0].data.data.forEach(obj => {
                if (obj.UG_CreatorID === sessionStorage.getItem('userId')) {
                  temp.createGroup.push({
                    groupName: obj.UG_Name,
                    groupId: obj.UGU_GroupID,
                    groupNick: obj.UGU_GroupNick,
                    groupIntro: obj.UG_Intro,
                    groupIcon: obj.UG_Icon,
                    groupCreateTime: obj.UG_CreateTime,
                    groupAdminId: obj.UG_AdminID,
                    groupCreaterId: obj.UG_CreaterID
                  })
                } else {
                  temp.joinGroup.push({
                    groupName: obj.UG_Name,
                    groupId: obj.UGU_GroupID,
                    groupNick: obj.UGU_GroupNick,
                    groupIntro: obj.UG_Intro,
                    groupIcon: obj.UG_Icon,
                    groupCreateTime: obj.UG_CreateTime,
                    groupAdminId: obj.UG_AdminID,
                    groupCreaterId: obj.UG_CreaterID
                  })
                }
              });
              result[1].data.data.forEach(obj => {
                temp.requestGroup.push(JSON.parse(obj.UM_Remark));
              });
              this.groupsList = temp;
              console.log(this.groupsList)
              resolve();
            }
          });
          // this.$http.post('/getAllGroups.do', {userId: sessionStorage.getItem('userId')}).then(res => {
          //   if (res.data.success) {
          //     let temp = {
          //       createGroup: [],
          //       joinGroup: []
          //     };
          //     res.data.data.forEach(obj => {
          //       if (obj.UG_CreatorID === sessionStorage.getItem('userId')) {
          //         temp.createGroup.push({
          //           groupName: obj.UG_Name,
          //           groupId: obj.UGU_GroupID,
          //           groupNick: obj.UGU_GroupNick,
          //           groupIntro: obj.UG_Intro,
          //           groupIcon: obj.UG_Icon,
          //           groupCreateTime: obj.UG_CreateTime,
          //           groupAdminId: obj.UG_AdminID,
          //           groupCreaterId: obj.UG_CreaterID
          //         })
          //       } else {
          //         temp.joinGroup.push({
          //           groupName: obj.UG_Name,
          //           groupId: obj.UGU_GroupID,
          //           groupNick: obj.UGU_GroupNick,
          //           groupIntro: obj.UG_Intro,
          //           groupIcon: obj.UG_Icon,
          //           groupCreateTime: obj.UG_CreateTime,
          //           groupAdminId: obj.UG_AdminID,
          //           groupCreaterId: obj.UG_CreaterID
          //         })
          //       }
          //     });
          //     this.groupsList = temp;
          //     // console.log(this.groupsList);
          //     resolve();
          //   }
          // });
          // this.$http.post('/getYourGroupRequest.do', {userId: sessionStorage.getItem('userId')}).then(res => {
          //   if (res.data.success) {
          //     res.data.data.forEach((obj, index) => {
          //       this.groupsList.requestGroup.push(JSON.parse(obj.UM_Remark));
          //     });
          //   }
          // })
        })
      }
    },
    watch: {
      curGroupId(val){
        if(val !== ''){
          onToTop(this.$refs.message.$el,()=>{
            // console.log(Math.ceil(this.total/this.$store.state.pageSize));
            if(Math.ceil(this.total/this.$store.state.pageSize)<this.pageNo+1) return;
            if(this.isMessageLoading) return;
            this.pageNo++;
            let scrollBottom = this.$refs.message.$el.scrollHeight;
            // let scrollBottom = this.$refs.message.$el.scrollHeight - parseInt(getStyle(this.$refs.message.$el,'height'), 10);
            this.getGroupMessage().then(()=>{
              this.$nextTick(()=>{
                this.$refs.message.$el.scrollTop = this.$refs.message.$el.scrollHeight - scrollBottom;
              });
            });
          })
        }
      },
      socket: {
        handler(value) {
          if (value) {
            this.$store.state.socket.removeAllListeners('getMessage');
            this.$store.state.socket.on('getMessage',(item)=>{
              // this.$message({message:'你收到一条消息',type:'success'});
              if(item.groupId===undefined)return;
              let notify;
              let time = new Date().getTime();
              // console.log(item);
              notify = this.$notify({
                title: `群聊消息:${item.groupName}`,
                dangerouslyUseHTMLString: true,
                message: `<p>${item.uName}:</p><div style="text-indent:2em;">${item.messageType===3?'[图像]':item.messageType===4?'[文件]':item.message}</div><button class="answerFriend ${item.from}Button${time}">前去围观</button>`,
                duration: 0
              });
              let button=document.getElementsByClassName(`${item.from}Button${time}`);
              button[0].onclick=()=>{
                notify.close();
                let isCreated=this.groupsList.createGroup.some(obj=>obj.groupId === item.groupId);
                this.$refs.groupMenu.open(isCreated?'0':'1');
                this.select(item.groupId,[isCreated?'0':'1',item.groupId]);
                this.$router.push({name:'myGroups'});
              };
              if(item.groupId===this.curGroupId){
                this.messageRecord.push({
                  senderId:item.from,
                  name:item.uName,
                  message:item.message,
                  isAtRight:false,
                  filePath:item.filePath,
                  messageType:item.messageType
                });
                this.$nextTick(()=>{
                  toBottom(this.$refs.message.$el);
                });
              }
            });
          }
        },
        deep: true
      }
    },
    components: {
      aMessage,
      headPortrait,
      createGroupDialog,
      groupDetailDialog,
      searchGroupsDialog,
      friendDetailDialog
    }
  }
</script>
<style lang="less">
  .myGroups {
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
          /*vertical-align: middle;*/
        }
        .search-wrap {
          position: relative;
          .el-input {
            margin-left: 5px;
            margin-right: 5px;
            width: calc(~'100% - 10px');
            margin-bottom: 5px;
            .el-input__inner {
              height: 30px;
            }
          }
          ul{
            position: absolute;
            z-index: 100;
            background: white;
            border-radius: 5px;
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
              span{
                vertical-align: middle;
              }
            }
            li:hover{
              background: #66b1ff;
            }
          }
        }
        .create-group {
          padding-left: 20px;
          color: white;
          font-size: 14px;
          height: 40px;
          i, span {
            line-height: 40px;
            margin-right: 10px;
          }
        }
        .create-group:hover {
          background: #8c939d;
          cursor: pointer;
        }
        //height: calc(~'100% - 61px');
        .my-group {
          height: calc(~'100% - 65px - 40px');
          overflow-y: auto;
          /*ul{*/
          /*min-height: calc(~'100% - 30px');*/
          /*border:0;*/
          /*li{*/
          /*color: white;*/
          /*padding: 10px 5px;*/
          /*position: relative;*/
          /*>div{*/
          /*height: 100%;*/
          /*padding-left: 40px;*/
          /*!*padding-right: 45px;*!*/
          /*.cascader{*/
          /*position: absolute;*/
          /*left: 10px;*/
          /*//height: 50px;*/
          /*top:10px;*/
          /*}*/
          /*.el-cascader{*/
          /*//width: 100%;*/
          /*//overflow: hidden;*/
          /*line-height: normal;*/
          /*input,.el-cascader__label{*/
          /*display: none;*/
          /*}*/
          /*.el-input__suffix{*/
          /*position: static;*/
          /*.el-input__icon{*/
          /*line-height: normal;*/
          /*}*/
          /*}*/
          /*}*/
          /*.headPortrait{*/
          /*display: inline-block;*/
          /*margin-right: 10px;*/
          /*width: 30px;*/
          /*height: 30px;*/
          /*border-radius: 15px;*/
          /*vertical-align: middle;*/
          /*}*/
          /*span{*/
          /*vertical-align: middle;*/
          /*font-size: 12px;*/
          /*}*/
          /*!*>img{*!*/
          /*!*margin-right: 10px;*!*/
          /*!*width: 30px;*!*/
          /*!*height: 30px;*!*/
          /*!*border-radius: 15px;*!*/
          /*!*}*!*/
          /*}*/
          /*}*/
          /*li:hover{*/
          /*background: rgb(107, 117, 128);*/
          /*}*/
          /*.isGroupChecked{*/
          /*color: rgb(255, 208, 75);*/
          /*}*/
          /*}*/
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
                  //height: 50px;
                  top: 0;
                }
                .el-cascader {
                  //width: 100%;
                  height: 50px;
                  //overflow: hidden;
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
                .isActive{
                  color: rgb(255, 208, 75);
                }
                /*>img{*/
                /*margin-right: 10px;*/
                /*width: 30px;*/
                /*height: 30px;*/
                /*border-radius: 15px;*/
                /*}*/
              }
            }
          }
        }
      }
      .small {
        //width: calc(~'100% - 300px');
        padding-right: 300px;
      }
    }
    .messageField {
      p{
        text-align: center;
        color: gray;
        font-size: 12px;
      }
    }
    .loading-wrap{
      text-align: center;
    }
    .el-footer {
      //position: fixed;
      //padding-left: 0;
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
          //position: relative;
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
      /*.el-icon-picture{*/
      /*position: relative;*/
      /*>.el-icon-picture{*/
      /*position: absolute;*/
      /*top: 0;*/
      /*}*/
      /*}*/
    }
  }
  .express-popover{
    background: #8c939d;
    max-width: 600px;
    /*width: auto !important;*/
    >div{
      min-height: 200px;
      img{
        width: 30px;
        height: 30px;
        margin-left: 5px;
      }
      img:hover{
        /*width: 35px;*/
        /*height: 35px;*/
        width: 26px;
        height: 26px;
        border: 2px solid blue;
      }
    }
  }
  .el-cascader-menus{
    .el-cascader-menu{
      li{
        color: #606266;
      }
    }
  }
</style>
