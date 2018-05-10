let socketIo=require('socket.io');
const changeUserStatus = require('./../businessLayer/user/changeUserStatus');
const searchUser2 = require('./../businessLayer/user/searchUser2');
const searchUser = require('./../businessLayer/user/searchUser');
exports.socket=(server)=>{
  let io=socketIo.listen(server);
  let users = [];
  let abandenUser=[];
  io.sockets.on('connection', function(socket) {
    socket.on('login', function(userId) {
      if(userId!=''){
        let isExist=false;
        console.log(users);
        console.log(socket.id);
        searchUser.searchUser({userId:userId,status:1},(result)=>{
          if(result==='error'){
            console.log('error')
          }else {
            if(result.length !== 0){
              console.log('result',result);
              let oldUser = users.filter(obj=>obj.userId === userId);
              if(oldUser.length !== 0){
                console.log(oldUser[0].socketId);
                io.sockets.to(oldUser[0].socketId).emit('duplicateLogin')
              }
            }
            users.forEach((obj, index) => {
              if(obj.userId==userId){
                users[index].socketId=socket.id;
                isExist=true;
                return;
              }
            });
            (!isExist)&&users.push({socketId:socket.id,userId:userId});

            changeUserStatus.changeUserStatus({userId:userId,status:1},(result)=>{
              if(result==='error'){
                console.log('error')
              }
            });

            //用户上线消息提示发送
            searchUser2.searchUser2({
              friendId:userId,
              status:1
            },(result) => {
              if (result === 'error') {
                console.log('error');
              } else {
                // console.log('-------------------');
                // console.log(result);
                if(result.length !== 0){
                  result.forEach(obj=>{
                    let toUser=users.filter(item=>item.userId === obj.F_UserID)[0];
                    if(toUser){
                      searchUser.searchUser({userId:userId},result2=>{
                        if (result2 === 'error') {
                          console.log('error');
                        } else {
                          io.sockets.to(toUser.socketId).emit('friendLoginRemand',{userId:userId,name:obj.F_Name||result2[0].U_NickName||userId});
                        }
                      });
                    }
                    // console.log(users.filter(item=>item.userId === obj.F_UserID)[0]);
                    // console.log(toUser.socketId);
                    // console.log(obj.F_UserID);
                    // console.log(socketId);

                  })
                }
              }
            });
            //console.log(userId+' enter!!!'+' now has '+(users.length)+' people');
            socket.emit('loginSuccess');

          }
        });
        // users.forEach((obj, index) => {
        //   if(obj.userId==userId){
        //     users[index].socketId=socket.id;
        //     isExist=true;
        //     return;
        //   }
        // });
        // (!isExist)&&users.push({socketId:socket.id,userId:userId});
        // changeUserStatus.changeUserStatus({userId:userId,status:1},(result)=>{
        //   if(result==='error'){
        //     console.log('error')
        //   }
        // });
        //
        // //用户上线消息提示发送
        // searchUser2.searchUser2({
        //   friendId:userId,
        //   status:1
        // },(result) => {
        //   if (result === 'error') {
        //     console.log('error');
        //   } else {
        //     // console.log('-------------------');
        //     // console.log(result);
        //     if(result.length !== 0){
        //       result.forEach(obj=>{
        //         let toUser=users.filter(item=>item.userId === obj.F_UserID)[0];
        //         if(toUser){
        //           searchUser.searchUser({userId:userId},result2=>{
        //             if (result2 === 'error') {
        //               console.log('error');
        //             } else {
        //               io.sockets.to(toUser.socketId).emit('friendLoginRemand',{userId:userId,name:obj.F_Name||result2[0].U_NickName||userId});
        //             }
        //           });
        //         }
        //         // console.log(users.filter(item=>item.userId === obj.F_UserID)[0]);
        //         // console.log(toUser.socketId);
        //         // console.log(obj.F_UserID);
        //         // console.log(socketId);
        //
        //       })
        //     }
        //   }
        // });
        // //console.log(userId+' enter!!!'+' now has '+(users.length)+' people');
        // socket.emit('loginSuccess');
      }
      //io.sockets.to(socket.id).emit('loginSuccess')
      //io.sockets.emit('system', nickname, users.length, 'login');
    });
    //user leaves
    socket.on('disconnect', function() {
      let userId;
      console.log('***************************************************');
      users.forEach((user,index)=>{
        if(user.socketId==socket.id){
          userId=user.userId;
          //console.log(user);
          users.splice(index,1);
          abandenUser.push(user);
          changeUserStatus.changeUserStatus({userId:userId,status:0},(result)=>{
            if(result==='error'){
              console.log('error')
            }
          });
          searchUser2.searchUser2({
            friendId:userId,
            status:1
          },(result) => {
            if (result === 'error') {
              console.log('error');
            } else {
              // console.log('-------------------');
              // console.log(result);
              if(result.length !== 0){
                result.forEach(obj=>{
                  let toUser=users.filter(item=>item.userId === obj.F_UserID)[0];
                  if(toUser){
                    searchUser.searchUser({userId:userId},result2=>{
                      if (result2 === 'error') {
                        console.log('error');
                      } else {
                        io.sockets.to(toUser.socketId).emit('friendDisconnectRemand',{userId:userId,name:obj.F_Name||result2[0].U_NickName||userId});
                      }
                    });
                    // io.sockets.to(toUser.socketId).emit('friendDisconnectRemand',{userId:userId,name:obj.F_Name||obj.U_NickName||obj.U_LoginID});
                  }
                  // console.log(users.filter(item=>item.userId === obj.F_UserID)[0]);
                  // console.log(toUser.socketId);
                  // console.log(obj.F_UserID);
                  // console.log(socketId);

                })
              }
            }
          });
          return;
        }
      });
      //console.log(userId+' leave!!!'+'  now has '+(users.length)+' people');
    });
    socket.on('remandFriend', function(obj) {
      if(obj.groupId){
        let selectUserGroupsToUser2=require('../businessLayer/usergroupstouser/selectUserGroupsToUser2').selectUserGroupsToUser2;
        selectUserGroupsToUser2({groupId:obj.groupId},(result)=>{
          if (result==='error') {

          } else {
            let members=[];
            result.forEach(item=>{
              members.push(item.UGU_UserID);
            });
            let toUsers=users.filter(item=>members.includes(item.userId)&&item.userId!==obj.from);
            console.log('-------------------------------------');
            console.log(users);
            console.log(toUsers);
            console.log(members);
            toUsers.forEach(item=>{
              console.log('给'+item.userId+'发送消息推送');
              io.sockets.to(item.socketId).emit('getMessage',obj);
            })
          }
        });
      }else{
        let toUser=users.filter(item=>item.userId==obj.to);
        if(toUser.length===1){
          io.sockets.to(toUser[0].socketId).emit('getMessage',obj);
        }
      }
    });
    //new image get
    socket.on('img', function(imgData, color) {
      //console.log('---------------------')
      //socket.broadcast.emit('newImg', socket.nickname, imgData, color);
    });





    //----------------视频通信-----------------
    socket.on('_ice_candidate', function(obj) {
      //console.log('_ice_candidate'+'received (): ');
      let toUser=users.filter(item=>item.userId==obj.to.id);
      if(toUser.length===1){
        io.sockets.to(toUser[0].socketId).emit('_ice_candidate',obj);
      }
      //socket.broadcast.emit('_ice_candidate',message );
    });
    socket.on('_offer', function(obj) {
      //console.log('_offer'+'received (' + '' + '): ');
      let toUser=users.filter(item=>item.userId==obj.to.id);
      if(toUser.length===1){
        io.sockets.to(toUser[0].socketId).emit('_offer',obj);
      }
      // socket.broadcast.emit('_offer',message );
    });
    socket.on('_answer', function(obj) {
      //console.log('_answer'+'received (' + '' + '): ');
      let toUser=users.filter(item=>item.userId==obj.to.id);
      if(toUser.length===1){
        io.sockets.to(toUser[0].socketId).emit('_answer',obj);
      }
      // socket.broadcast.emit('_answer',message );
    });
    socket.on('videoRequest', function(obj) {
      let toUser=users.filter(item=>item.userId==obj.to.id);
      if(toUser.length===1){
        io.sockets.to(toUser[0].socketId).emit('videoRequest',obj);
      }
    });
    socket.on('agreeVideoRequest', function(obj) {
      let toUser=users.filter(item=>item.userId==obj.from.id);
      if(toUser.length===1){
        io.sockets.to(toUser[0].socketId).emit('agreeVideoRequest',obj);
      }
    });
    socket.on('closeVideo', function(obj) {
      let toUser=users.filter(item=>item.userId==obj.id);
      if(toUser.length===1){
        io.sockets.to(toUser[0].socketId).emit('closeVideo',obj);
      }
    });
  });
};
