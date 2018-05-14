const getUserInfo = require("../../businessLayer/user/getUserInfo");
const insertUserMessages = require("../../businessLayer/usermessages/insertUserMessages");
const querystring = require("querystring");
exports.checkFriendRequest = (app) => {
    app.post('/checkFriendRequest.do', (req, res) => {
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
            if(dataObject.friendPolicyType===1){
              getUserInfo.getUserInfo({userId:dataObject.friendId}, result => {
                if (result === 'error') {
                  (!isSend)&&res.send({
                    code: 10000,
                    data: null,
                    msg: '发生错误',
                    success: false
                  })
                } else {
                  if(result[0].U_FriendPolicyPassword==dataObject.friendPolicyPassword){
                    (!isSend)&&res.send({
                      code: 10000,
                      data: null,
                      msg: '验证成功',
                      success: true
                    })
                  }else{
                    (!isSend)&&res.send({
                      code: 10000,
                      data: null,
                      msg: '密码错误',
                      success: true
                    })
                  }
                }
              });
            }else{
              insertUserMessages.insertUserMessages({
                fromId:dataObject.userId,
                fromName:dataObject.userName,
                toId:dataObject.friendId,
                isRead:0,
                remark:dataObject.remark,
                time:new Date().getTime(),
                messageType:2,
                message:dataObject.friendPolicyAnswer
              },result=>{
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
                    msg: '好友请求已发送',
                    success: true
                  })
                }
              })
            }
        })
    });
};
