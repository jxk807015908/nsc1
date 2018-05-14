const selectUserMessages = require("../../businessLayer/usermessages/selectUserMessages");
const querystring = require("querystring");
exports.getYourFriendRequest = (app) => {
    app.post('/getYourFriendRequest.do', (req, res) => {
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
            // dataObject.userId = querystring.parse(req.headers.cookie, '; ').userId;
            selectUserMessages.selectUserMessages({fromId:dataObject.userId,messageType:2}, result => {
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
                        data: result,
                        msg: '',
                        success: true
                    })
                }
            });
        })
    });
};
