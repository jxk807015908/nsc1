let socketIo=require('socket.io');
exports.socket=(server,connection)=>{
  let io=socketIo.listen(server);
  let users = [];
  let abandenUser=[];
  io.sockets.on('connection', function(socket) {
    socket.on('login', function(userId) {
      if(userId!=''){
        let isExist=false;
        users.forEach((obj, index) => {
          if(obj.userId==userId){
            users[index].socketId=socket.id;
            isExist=true;
            return;
          }
        });
        (!isExist)&&users.push({"socketId":socket.id,"userId":userId})
        console.log(userId+' enter!!!'+' now has '+(users.length)+' people');
        socket.emit('loginSuccess');
      }
      //io.sockets.to(socket.id).emit('loginSuccess')
      //io.sockets.emit('system', nickname, users.length, 'login');
    });
    //user leaves
    socket.on('disconnect', function() {
      let userId;
      users.forEach((user,index)=>{
        if(user.socketId==socket.id){
          userId=user.userId;
          console.log(user);
          users.splice(index,1);
          abandenUser.push(user);
          return;
        }
      });
      console.log(userId+' leave!!!'+'  now has '+(users.length)+' people');
    });
    socket.on('remandFriend', function(obj) {
      let toUser=users.filter(item=>item.userId==obj.to);
      if(toUser.length===1){
        io.sockets.to(toUser[0].socketId).emit('getMessage',obj);
      }
    });
    //new image get
    socket.on('img', function(imgData, color) {
      socket.broadcast.emit('newImg', socket.nickname, imgData, color);
    });
  });
}
