exports.getFriendMessage = (app, connection) => {
    app.post('/getFriendMessage.do', (req, res) => {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            data = decodeURI(data);
            let dataObject = JSON.parse(data);
            let sql = `SELECT M_PostMessages,M_Time,M_FromUserID,M_ToUserID FROM Messages WHERE (M_FromUserID="${dataObject.userId}" AND M_ToUserID="${dataObject.friendId}") OR (M_FromUserID="${dataObject.friendId}" AND M_ToUserID="${dataObject.userId}")`;
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log(error.message);
                    res.send({
                        code: 10000,
                        data: null,
                        msg: '查询用户表发生错误',
                        success: false
                    })
                } else {
                    res.send({
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
