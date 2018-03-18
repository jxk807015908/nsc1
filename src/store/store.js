import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../util/axiosApi'
import io from 'socket.io-client'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI);
Vue.use(Vuex);
export default new Vuex.Store({
  mode:'history',
  state:{
    nickName:null,
    userId:null,
    socket:null
  },
  mutations:{

  },
  actions:{
    connectSocket(context){
      context.state.socket=io.connect();
      context.state.socket.emit('login',this.state.userId);
      context.state.socket.on('loginSuccess',function (arr) {
        new Vue().$message({message:'socket连接成功',type:'success'})
      });
      context.state.socket.on('getMessage',(obj)=>{
        new Vue().$message({message:'你收到一条消息',type:'success'})
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
    }
  }
})
