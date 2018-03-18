exports.getFriendGroup = (app, connection) => {
    app.post('/getFriendGroup.do', (req, res) => {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            data = decodeURI(data);
            let dataObject = JSON.parse(data);
            let sql = `SELECT FG_ID,FG_Name FROM friendgroups WHERE FG_UserID="${dataObject.username}"`;
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log(error.message);
                    res.send({
                        code: 10000,
                        data: null,
                        msg: '查询好友分组表发生错误',
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
