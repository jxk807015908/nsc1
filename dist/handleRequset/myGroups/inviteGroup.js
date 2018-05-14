const insertUserMessages = require("../../businessLayer/usermessages/insertUserMessages");
exports.inviteGroup = (app) => {
    app.post('/inviteGroup.do', (req, res) => {
        let isSend = false;
        res.setTimeout(3000, () => {
            isSend = true;
            res.send({
                code: 10000,
                data: null,
                msg: '连接超时',
                success: false
            });
        });
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            data = decodeURI(data);
            let dataObject = JSON.parse(data);
            insertUserMessages.insertUserMessages({
              fromId: dataObject.fromId,
              fromName:dataObject.fromName,
              isRead:0,
              toId: dataObject.toId,
              messageType: 6,
              time: new Date().getTime(),
              remark:JSON.stringify(dataObject.remark)
            }, (result) => {
                if (result === 'error') {
                    (!isSend) && res.send({
                        code: 10000,
                        data: null,
                        msg: '查询用户表和好友表发生错误',
                        success: false
                    })
                } else {
                    (!isSend) && res.send({
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
