exports.getFriend = (app, connection) => {
    app.post('/getFriend.do', (req, res) => {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            data = decodeURI(data);
            let dataObject = JSON.parse(data);
            let sql = `SELECT friends.F_FriendID,friends.F_Name,user.U_NickName,friends.F_FriendGroupsID FROM friends,user WHERE friends.F_FriendID=user.U_LoginID AND friends.F_UserID="${dataObject.username}"`;
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log(error.message);
                    res.send({
                        code: 10000,
                        data: null,
                        msg: '查询用户表和好友表发生错误',
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
