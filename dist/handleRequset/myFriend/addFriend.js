const getFriendGroup = require("../../businessLayer/myFriend/getFriendGroup");
const insertFriend = require("../../businessLayer/myFriend/insertFriend");
const insertUserMessages = require("../../businessLayer/usermessages/insertUserMessages");
const querystring = require("querystring");
exports.addFriend = (app) => {
    app.post('/addFriend.do', (req, res) => {
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
              getFriendGroup.getFriendGroup({userId:dataObject.friendId},result=>{
                if (result === 'error') {
                  (!isSend)&&res.send({
                    code: 10000,
                    data: null,
                    msg: '发生错误',
                    success: false
                  });
                  return;
                } else {
                  dataObject.groupId=result.filter(obj=>obj.FG_Name==='我的好友')[0].FG_ID;
                  insertFriend.insertFriend(dataObject,result2=>{
                    if (result === 'error') {
                      (!isSend)&&res.send({
                        code: 10000,
                        data: null,
                        msg: '发生错误',
                        success: false
                      });
                    }else{
                      resolve()
                    }
                  })
                }
              });
            }).then(()=>{
              return new Promise(resolve => {
                let temp={
                  userId:dataObject.friendId,
                  friendId:dataObject.userId,
                };
                getFriendGroup.getFriendGroup({userId:temp.friendId},result=>{
                  if (result === 'error') {
                    (!isSend)&&res.send({
                      code: 10000,
                      data: null,
                      msg: '发生错误',
                      success: false
                    });
                    return;
                  } else {
                    temp.groupId=result.filter(obj=>obj.FG_Name==='我的好友')[0].FG_ID;
                    insertFriend.insertFriend(temp,result2=>{
                      if (result === 'error') {
                        (!isSend)&&res.send({
                          code: 10000,
                          data: null,
                          msg: '发生错误',
                          success: false
                        });
                        return;
                      }else{
                        resolve()
                      }
                    })
                  }
                })
              })
            }).then(()=>{
              insertUserMessages.insertUserMessages({
                fromId:dataObject.userId,
                fromName:dataObject.userName,
                isRead:0,
                toId:dataObject.friendId,
                messageType:'3',
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
                    msg: '添加成功',
                    success: true
                  })
                }
              });
            })
        });
    });
};
