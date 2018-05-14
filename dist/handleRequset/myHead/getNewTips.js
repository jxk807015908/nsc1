const selectUserMessages = require("../../businessLayer/usermessages/selectUserMessages");
exports.getNewTips = (app) => {
    app.post('/getNewTips.do', (req, res) => {
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
            selectUserMessagesFn({toId: dataObject.userId,isRead:'0'}).then((result) => {
                (!isSend) && res.send({
                    code: 10000,
                    data: {remindTips:result.length},
                    msg: '',
                    success: true
                })
            }).catch(() => {
                (!isSend) && res.send({
                    code: 10000,
                    data: null,
                    msg: '查询用户表和好友表发生错误',
                    success: false
                })
            });
        });
    })
};

function selectUserMessagesFn(obj) {
    return new Promise((resolve, reject) => {
      selectUserMessages.selectUserMessages(obj, (result) => {
            if (result === 'error') {
                reject();
            } else {
                resolve(result);
            }
        });
    });
}
