<template>
  <div class="home">
    <img class="main-bg" src="../assets/imgages/mainbg.jpg" alt="">
    <div class="video-group" v-if="$store.state.isVideo">
      <video ref="yourVideo" class="video video1" src="" autoplay></video>
      <video ref="hisVideo" class="video video2" src="" autoplay></video>
      <i class="el-icon-close" @click="closeVideo"></i>
    </div>
    <myHead></myHead>
    <div class="content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script>
  import myHead from './common/myHead'
  import {setCookie,getCookie} from "../util/common";
  export default {
      name:'home',
      data: function () {
        return {
          pc:null,
          other:null,
          videoStreamTrack:null,
          audioStreamTrack:null
        };
      },
      computed:{
        socket(){
          return this.$store.state.socket;
        }
      },
      methods:{
        closeVideo(){
          this.pc.close();
          this.videoStreamTrack.stop();
          this.audioStreamTrack.stop();
          this.socket.emit('closeVideo',this.other);
          this.$store.state.isVideo=false;
        },
        videoCall(flag,obj){
          window.URL = (window.URL || window.webkitURL || window.mozURL || window.msURL);
          this.other=obj;
          let iceServer = {
            "iceServers": [{
              "url": "stun:stun.l.google.com:19302"
            }, {
              "url": "turn:numb.viagenie.ca",
              "username": "webrtc@live.com",
              "credential": "muazkh"
            }]
          };
          let RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.msRTCPeerConnection;
          let SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
          this.pc = new RTCPeerConnection(iceServer);
          this.pc.onicecandidate = event=>{
            if (event.candidate !== null) {
              console.log('event.candidate:'+event.candidate+' to:', obj);
              this.socket.emit("_ice_candidate", {"candidate": event.candidate,to:obj})
            }
          };
          this.pc.onaddstream = event=>{
            console.log('event.stream:'+event.stream);
            console.log('hisVideoSrc:'+window.URL.createObjectURL(event.stream));
            if ("srcObject" in this.$refs.hisVideo) {
              this.$refs.hisVideo.srcObject = event.stream;
            } else {
              // Avoid using this in new browsers, as it is going away.
              this.$refs.hisVideo.src = window.URL.createObjectURL(event.stream);
            }
            // this.$refs.hisVideo.src = window.URL.createObjectURL(event.stream);
          };

          let sendOfferFn = desc=>{
            this.pc.setLocalDescription(desc);
            console.log('发送offer请求信令 desc:'+desc);
            this.socket.emit("_offer",{"sdp": desc,to:obj})
          };
          let sendAnswerFn = desc=>{
            this.pc.setLocalDescription(desc);
            console.log('回答信令 desc:'+desc);
            this.socket.emit("_answer",{"sdp": desc,to:obj})
          };
          if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia){
            navigator.mediaDevices.getUserMedia({
              "audio": true,
              "video": true
            }).then( stream=>{
              this.audioStreamTrack = stream.getTracks()[0];
              this.videoStreamTrack = stream.getTracks()[1];
              //绑定本地媒体流到video标签用于输出
              if ("srcObject" in this.$refs.yourVideo) {
                this.$refs.yourVideo.srcObject = stream;
              } else {
                // Avoid using this in new browsers, as it is going away.
                this.$refs.yourVideo.src = window.URL.createObjectURL(stream);
              }
              console.log('yourVideoSrc:'+window.URL.createObjectURL(stream));
              // this.$refs.yourVideo.srcObject = stream;
              // this.$refs.yourVideo.src = window.URL.createObjectURL(stream);
              //向PeerConnection中加入需要发送的流
              this.pc.addStream(stream);
              //如果是发起方则发送一个offer信令
              if(flag){
                //console.log('发送一个offer信令');
                this.pc.createOffer(sendOfferFn, error=>{
                  console.log('Failure callback: ' + error);
                });
              }
            }).catch(error=>{
              //处理媒体流创建失败错误
              console.log('getUserMedia error: ' + error);
            })
          }else{
            navigator.getUserMedia = navigator.getUserMedia || navigator.msGetUserMedia || navigator.webkitGetUserMedia||navigator.mozGetUserMedia;
            navigator.getUserMedia({
              "audio": true,
              "video": true
            }, stream=>{
              this.audioStreamTrack = stream.getTracks()[0];
              this.videoStreamTrack = stream.getTracks()[1];
              //绑定本地媒体流到video标签用于输出
              if ("srcObject" in this.$refs.yourVideo) {
                this.$refs.yourVideo.srcObject = stream;
              } else {
                // Avoid using this in new browsers, as it is going away.
                this.$refs.yourVideo.src = window.URL.createObjectURL(stream);
              }
              console.log('yourVideoSrc:'+window.URL.createObjectURL(stream));
              // this.$refs.yourVideo.src = window.URL.createObjectURL(stream);
              //向PeerConnection中加入需要发送的流
              this.pc.addStream(stream);
              //如果是发起方则发送一个offer信令
              if(flag){
                //console.log('发送一个offer信令');
                this.pc.createOffer(sendOfferFn, error=>{
                  console.log('Failure callback: ' + error);
                });
              }
            }, error=>{
              //处理媒体流创建失败错误
              console.log('getUserMedia error: ' + error);
            });
          }
          this.socket.on('_ice_candidate',(data)=>{
            var json = data;
            console.log('增加_ice_candidate: ', json);
            //如果是一个ICE的候选，则将其加入到PeerConnection中，否则设定对方的session描述为传递过来的描述
            //console.log('--------------')
            //console.log(json)
            this.pc.addIceCandidate(new RTCIceCandidate(json.candidate));
          });
          this.socket.on('_offer',(data)=>{
            var json = data;
            //console.log('_offer: ', json);
            //如果是一个ICE的候选，则将其加入到PeerConnection中，否则设定对方的session描述为传递过来的描述
            this.pc.setRemoteDescription(new SessionDescription(json.sdp));
            this.pc.createAnswer(sendAnswerFn, error=> {
              console.log('Failure callback: ' + error);
            });
          });
          this.socket.on('_answer',(data)=>{
            var json = data;
            //console.log('_answer: ', json);
            //如果是一个ICE的候选，则将其加入到PeerConnection中，否则设定对方的session描述为传递过来的描述
            this.pc.setRemoteDescription(new SessionDescription(json.sdp));
          });
          this.socket.on('closeVideo',(obj)=>{
            this.$message({message:'对方关闭了视频聊天',type:'success'});
            this.pc.close();
            this.videoStreamTrack.stop();
            this.audioStreamTrack.stop();
            this.$store.state.isVideo=false;
          });
        }
      },
      watch:{
        socket(val){
          if(val){
            val.removeAllListeners('videoRequest');
            val.on('videoRequest',obj=>{
              if(document.getElementsByClassName(`${obj.from.id}Requset`)[0]) return;
              let notify=this.$notify({
                title: '提示',
                showClose:false,
                dangerouslyUseHTMLString: true,
                message: `<p>${obj.from.name}向您发起视频请求</p><button class="operateVideoRequest ${obj.from.id}Requset">拒绝</button><button class="operateVideoRequest ${obj.from.id}Requset">同意</button>`,
                duration: 0
              });
              let button=document.getElementsByClassName(`${obj.from.id}Requset`);
              console.log(this.$notify)
              button[0].onclick=()=>{
                notify.close();
                this.$message({
                  type: 'danger',
                  message: '已拒绝视频通话请求'
                });
              };
              button[1].onclick=()=>{
                if(this.$store.state.isVideo){
                  this.$message.error('只能同时与一个人进行视频通话');
                  return
                }
                notify.close();
                this.$store.state.isVideo=true;
                val.emit('agreeVideoRequest',obj);
                this.videoCall(false,obj.from)
              };
              // this.$confirm(`${obj.from.name}向您发起视频请求,是否允许？`, '提示', {
              //   confirmButtonText: '是',
              //   cancelButtonText: '否',
              //   type: 'warning'
              // }).then(() => {
              //   this.$store.state.isVideo=true;
              //   val.emit('agreeVideoRequest',obj);
              //   this.videoCall(false,obj.from)
              // }).catch(() => {
              //   this.$message({
              //     type: 'info',
              //     message: '已拒绝视频通话请求'
              //   });
              // });
            });
            val.on('agreeVideoRequest',(obj)=>{
              this.$store.state.isVideo=true;
              this.videoCall(true,obj.to);
            });
            val.on('duplicateLogin',()=> {
              this.$store.dispatch('socketDisconnect');
              this.$alert('您的账号在其他地址登录！该账号即将下线。', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$router.push({name:'login'});
                  sessionStorage.clear();
                }
              });
            });
          }
        }
      },
      mounted(){
        // var hiddenProperty = 'hidden' in document ? 'hidden' :
        //   'webkitHidden' in document ? 'webkitHidden' :
        //     'mozHidden' in document ? 'mozHidden' :
        //       null;
        // var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
        // var onVisibilityChange = ()=>{
        //   if (!document[hiddenProperty]) {
        //     console.log('页面非激活');
        //   }else{
        //     console.log(this.$store.state.userId);
        //     setCookie('userId',this.$store.state.userId,365);
        //     console.log('页面激活')
        //   }
        // }
        // document.addEventListener(visibilityChangeEvent, onVisibilityChange);
        // document.body.onfocus=()=>{
        //   setCookie('userId',this.$store.state.userId);
        // }
        document.oncontextmenu = event=> {
          event.preventDefault();
        };
        if(!this.$store.state.userId){

          // this.$store.dispatch('connectSocket',sessionStorage.getItem('userId'));
          if(sessionStorage.getItem('userId')!==null&&sessionStorage.getItem('password')!==null) {
            // this.$store.dispatch('login', sessionStorage.getItem('userId'), sessionStorage.getItem('password'))
            this.$http.post('/login.do',{userId:sessionStorage.getItem('userId'),password:sessionStorage.getItem('password')}).then(res=>{
              if(res.data.success){
                this.$store.state.userId=sessionStorage.getItem('userId');
                this.$store.state.nickName=res.data.data.U_NickName||'';
                setCookie('userId',sessionStorage.getItem('userId'));
                this.$store.dispatch('connectSocket');
              }
            })
          }else{
            this.$message.error('请重新登录');
            this.$router.push({name:'login'})
          }
        }else {
          this.$store.dispatch('connectSocket')
        }
      },
      components:{
        myHead
      }
    }
</script>
<style lang="less">
  .home{
    //background: url("../assets/imgages/mainbg.jpg") no-repeat;
    height: 100%;
    .content{
      height: calc(~'100% - 61px');
      position: relative;
    }
    .main-bg{
      height: calc(~'100% - 61px');
      position: absolute;
      top: 61px;
      right: 0;
    }
    .video-group{
      position: absolute;
      z-index: 99;
      right: 0;
      top:61px;
      .video1{
        //border: 1px solid red;
        position: absolute;
        width: 100px;
      }
      .video2{
        //border: 1px solid red;
        width: 300px;
      }
      .el-icon-close{
        position: absolute;
        right: 0;
        top:0;
      }
    }
  }
  /*.el-notification__group{*/
    /*width: 100%;*/
    /*.operateVideoRequest{*/
      /*border: none;*/
      /*background: white;*/
      /*margin-right: 10px;*/
      /*border-radius: 3px;*/
      /*margin-top: 5px;*/
      /*float: right;*/
      /*color: white;*/
    /*}*/
    /*.operateVideoRequest:nth-of-type(1){*/
      /*//border:1px solid #f56c6c;*/
      /*background: #f56c6c;*/
    /*}*/
    /*.operateVideoRequest:nth-of-type(1):hover{*/
      /*background: #f58c6c;*/
    /*}*/
    /*.operateVideoRequest:nth-of-type(2){*/
      /*//border:1px solid #409EFF;*/
      /*background: #409EFF;*/
    /*}*/
    /*.operateVideoRequest:nth-of-type(2):hover{*/
      /*background: #40BEFF;*/
    /*}*/
  /*}*/
</style>
