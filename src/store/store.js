import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);
Vue.use(Vuex);
export default new Vuex.Store({
  mode:'history',
  state:{
    statisFileIp:'localhost:8081',
    // statisFileIp:'192.168.253.4:8081',
    isVideo:false,
    nickName:null,
    userId:null,
    socket:null,
    pageSize:10,
    expressArr:[],
    remindTips:0,
    messagePush:'',
    myFriendCheckedId:'',
    myGroupCheckedId:''
  },
  mutations:{

  },
  actions:{
    connectSocket(context){
      context.state.socket=io.connect();
      // context.state.socket=io.connect('ws://https://localhost:4001/');
      // context.state.socket=io.connect('ws://localhost:4000/');
      // context.state.socket.emit('login',sessionStorage.getItem('userId'));
      // context.state.socket.emit('login',value || this.state.userId);
      context.state.socket.emit('login',this.state.userId);
      context.state.socket.on('loginSuccess',function (arr) {
        new Vue().$message({message:'socket连接成功',type:'success'});
        let messagePush=sessionStorage.getItem("messagePush");
        if(messagePush.indexOf('1')===-1){
          console.log('好友上线推送关闭');
          context.state.socket.removeAllListeners('friendLoginRemand');
          context.state.socket.removeAllListeners('friendDisconnectRemand');
        }
        if(messagePush.indexOf('2')===-1){
          console.log('好友消息推送关闭');
          context.state.socket.removeAllListeners('getMessageToHead');
        }
      });
      // context.state.socket.on('videoRequest',function (obj) {
      //   // new Vue().$notify({
      //   //   title: '提示',
      //   //   dangerouslyUseHTMLString: true,
      //   //   message: `<p>${obj.name}向您发起视频请求</p><button></button>`,
      //   //   duration: 0
      //   // });
      //   new Vue().$confirm(`${obj.name}向您发起视频请求,是否允许？`, '提示', {
      //     confirmButtonText: '是',
      //     cancelButtonText: '否',
      //     type: 'warning'
      //   }).then(() => {
      //     socket.emit('agreeVideoRequest',obj)
      //   }).catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已拒绝视频通话请求'
      //     });
      //   });
      // });
      // context.state.socket.on('agreeVideoRequest',(obj)=>{
      //
      // });
      // context.state.socket.on('getMessage',(obj)=>{
      //   new Vue().$message({message:'你收到一条消息',type:'success'})
      // });
      context.state.socket.on('friendLoginRemand',(obj)=>{
        new Vue().$notify({
          title: 'tip',
          message:'你的好友'+obj.name+'已上线',
          position: 'bottom-right',
          duration:3000
        });
        // new Vue().$message({message:'你的好友'+obj.name+'已上线',type:'success'})
      });
      context.state.socket.on('friendDisconnectRemand',(obj)=>{
        new Vue().$notify({
          title: 'tip',
          message:'你的好友'+obj.name+'已下线',
          position: 'bottom-right',
          duration:3000
        });
        // new Vue().$message({message:'你的好友'+obj.name+'已下线',type:'success'})
      });
      context.state.socket.on('sendError',()=>{
        new Vue().$message.error('发送失败')
      });
      context.state.socket.on('sendSuccess',()=>{
        new Vue().$message.error('发送成功')
      })
      // let ws=new WebSocket('ws://localhost:4000');
      // ws.onopen=function(){
      //   alert(222)
      //   ws.send('11111')
      //   commit('connectSuccess','aaaa')
      // }
    },
    socketDisconnect(context){
      context.state.socket.disconnect();
    },
    friendRemand(context,flag){
      // context.state.socket.on('videoRequest',function (obj) {
      //   // new Vue().$notify({
      //   //   title: '提示',
      //   //   dangerouslyUseHTMLString: true,
      //   //   message: `<p>${obj.name}向您发起视频请求</p><button></button>`,
      //   //   duration: 0
      //   // });
      //   new Vue().$confirm(`${obj.name}向您发起视频请求,是否允许？`, '提示', {
      //     confirmButtonText: '是',
      //     cancelButtonText: '否',
      //     type: 'warning'
      //   }).then(() => {
      //     socket.emit('agreeVideoRequest',obj)
      //   }).catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已拒绝视频通话请求'
      //     });
      //   });
      // });
      // context.state.socket.on('agreeVideoRequest',(obj)=>{
      //
      // });
      // context.state.socket.on('getMessage',(obj)=>{
      //   new Vue().$message({message:'你收到一条消息',type:'success'})
      // });
      console.log('好友上线推送关闭');
      context.state.socket.removeAllListeners('friendLoginRemand');
      context.state.socket.removeAllListeners('friendDisconnectRemand');
      if(flag){
        console.log('好友上线推送开启');
        context.state.socket.on('friendLoginRemand',(obj)=>{
          new Vue().$notify({
            title: 'tip',
            message:'你的好友'+obj.name+'已上线',
            position: 'bottom-right',
            duration:3000
          });
          // new Vue().$message({message:'你的好友'+obj.name+'已上线',type:'success'})
        });
        context.state.socket.on('friendDisconnectRemand',(obj)=>{
          new Vue().$notify({
            title: 'tip',
            message:'你的好友'+obj.name+'已下线',
            position: 'bottom-right',
            duration:3000
          });
          // new Vue().$message({message:'你的好友'+obj.name+'已下线',type:'success'})
        });
      }
    }
  }
})
