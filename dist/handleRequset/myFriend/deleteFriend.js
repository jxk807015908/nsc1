const deleteFriend = require("../../businessLayer/myFriend/deleteFriend");
const insertUserMessages = require("../../businessLayer/usermessages/insertUserMessages");
const querystring = require("querystring");
exports.deleteFriend = (app) => {
    app.post('/deleteFriend.do', (req, res) => {
        let isSend=false;
        res.setTimeout(3000,()=>{
          isSend=true;
          res.send({
            code:10000,
            data:null,
            msg:'连接超时',
            success:false
          });
        });
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            data = decodeURI(data);
            let dataObject = JSON.parse(data);
            //dataObject.userId = querystring.parse(req.headers.cookie, '; ').userId;
            new Promise(resolve => {
              deleteFriend.deleteFriend({
                userId:dataObject.userId,
                friendId:dataObject.friendId
              }, result => {
                if (result === 'error') {
                  (!isSend)&&res.send({
                    code: 10000,
                    data: null,
                    msg: '发生错误',
                    success: false
                  })
                } else {
                  resolve();
                }
              });
            }).then(()=>{
              return new Promise(resolve => {
                deleteFriend.deleteFriend({
                  userId:dataObject.friendId,
                  friendId:dataObject.userId
                }, result => {
                  if (result === 'error') {
                    (!isSend)&&res.send({
                      code: 10000,
                      data: null,
                      msg: '发生错误',
                      success: false
                    })
                  } else {
                    resolve()
                  }
                });
              })
            }).then(()=>{
              insertUserMessages.insertUserMessages({
                fromId:dataObject.userId,
                isRead:0,
                fromName:dataObject.userName,
                toId:dataObject.friendId,
                messageType:'4',
                time:new Date().getTime()
              }, result => {
                if (result === 'error') {
                  (!isSend)&&res.send({
                    code: 10000,
                    data: null,
                    msg: '发生错误',
                    success: false
                  })
                } else {
                  (!isSend)&&res.send({
                    code: 10000,
                    data: null,
                    msg: '',
                    success: true
                  })
                }
              });
            })
        })
    });
};
