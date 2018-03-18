<template>
  <div class="myFriend">
    <el-container>
      <el-aside width="200px">
        <div class="operate">

        </div>
        <el-menu
          @select="select"
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu v-for="item in friendGroup" :index="item.value">
            <template slot="title"><span>{{item.name}}</span></template>
            <el-menu-item v-for="friend in item.content" :index="friend.friendId">{{friend.remark||friend.nickName||friend.friendId}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <div class="messageField">
            <aMessage v-for="item in messageRecord" :name="item.name" :message="item.message" :isAtRight="item.isAtRight"></aMessage>
          </div>
        </el-main>
        <el-footer>
          <div class="inputField">
            <div class="input-menu">
              <i class="fa fa-font"></i>
              <i class="fa fa-smile-o"></i>
              <i class="fa fa-picture-o"></i>
              <i class="fa  fa-video-camera"></i>
              <i class="fa fa-file-image-o"></i>
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
    export default {
        name:'myFriend',
        data: function () {
            return {
              friendGroup:[],
              message:'',
              curGroupId:'',
              curFriendId:'',
              messageRecord:[]
            };
        },
      mounted(){
        (async ()=>{
          await this.getFriendGroup();
          await this.getFriend();
          })();
        this.$store.state.socket.on('getMessage',(item)=>{
          if(item.from===this.curFriendId){
            let friendName=this.friendGroup.filter(obj=>obj.value==this.curGroupId)[0].content.filter(obj=>obj.friendId==this.curFriendId)[0];
            this.messageRecord.push({
              senderId:item.from,
              name:friendName.remark||friendName.nickName||friendName.friendId,
              message:item.message,
              isAtRight:false
            })
          }
        });
      },
      methods:{
        sendMessage(){
          this.message!==''&&this.$http.post('/sendMessage.do',{message:this.message,from:sessionStorage.getItem('username'),to:this.curFriendId}).then(res=>{
            if(res.data.success){
              this.$message({message:'发送成功',type:'success'});
              this.messageRecord.push({
                senderId:this.curFriendId,
                name:this.$store.state.nickName||this.$store.state.userId,
                message:this.message,
                isAtRight:true
              });
              this.$store.state.socket.emit('remandFriend',{message:this.message,from:sessionStorage.getItem('username'),to:this.curFriendId})
              this.message='';
            }
          });
        },
        select(index,indexPath){
          if(this.curFriendId==index) return;
          this.curFriendId=index;
          this.curGroupId=indexPath[0];
          this.getFriendMessage(index,indexPath)
        },
        getFriendMessage(index,indexPath){
          this.messageRecord=[];
          this.$http.post('/getFriendMessage.do',{userId:sessionStorage.getItem('username'),friendId:index}).then(res=>{
            if(res.data.success){
              res.data.data.length!==0&&res.data.data.forEach(obj=>{
                let friendName;
                if(obj.M_FromUserID===index){
                  friendName=this.friendGroup.filter(obj=>obj.value==indexPath[0])[0].content.filter(obj=>obj.friendId==index)[0]
                }
                this.messageRecord.push({
                  senderId:obj.M_FromUserID,
                  name:obj.M_FromUserID!==index?(this.$store.state.nickName||this.$store.state.userId):(friendName.remark||friendName.nickName||friendName.friendId),
                  message:obj.M_PostMessages,
                  isAtRight:obj.M_FromUserID!==index
                })
              });
            }
          })
        },
        getFriend(){
          return new Promise(resolve => {
            this.$http.post('/getFriend.do',{username:sessionStorage.getItem('username')}).then(res=>{
              if(res.data.success){
                res.data.data.forEach((obj,index)=>{
                  this.friendGroup.forEach((item,index)=>{
                    if(item.value==obj.F_FriendGroupsID){
                      this.friendGroup[index].content.push({
                        remark:obj.F_Name,
                        nickName:obj.U_NickName,
                        friendId:obj.F_FriendID
                      })
                    }
                  })
                });
                resolve();
              }
            })
          })
        },
        getFriendGroup(){
          return new Promise(resolve => {
            this.friendGroup=[];
            this.$http.post('/getFriendGroup.do',{username:sessionStorage.getItem('username')}).then(res=>{
              if(res.data.success){
                res.data.data.forEach((obj,index)=>{
                  this.friendGroup.push({
                    name:obj.FG_Name,
                    value:obj.FG_ID,
                    content:[]
                  })
                })
                resolve();
              }
            })
          })
        }
      },
      components:{
        aMessage
      }
    }
</script>
<style lang="less">
  .myFriend{
    height: 100%;
    >.el-container{
      height: 100%;
      .el-aside{
        background: rgb(84, 92, 100);
        padding-top: 30px;
        //height: calc(~'100% - 61px');
        .el-menu{
          min-height: calc(~'100% - 30px');
          border:0;
        }
      }
    }
    .el-aside{
      //background: rgb(84, 92, 100);
    }
    .messageField{

    }
    .el-footer{
      //position: fixed;
      //padding-left: 0;
      margin-bottom: 20px;
      height: 100px !important;
      .inputField{
        .input-menu{
          i{
            margin:5px;
          }
        }
        .input-wrap{
          //position: relative;
          height: 74px;
          >textarea{
            width: calc(~'100% - 70px');
            resize: none;
            height: 63px;
          }
          .send-button{
            width: 50px;
            margin-left: -3px;
            border:1px solid rgb(169, 169, 169);
            border-left: none;
            height: 69px;
            vertical-align: top;
          }
        }

      }
    }

  }
</style>
