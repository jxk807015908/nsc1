exports.sendMessage = (app, connection) => {
    app.post('/sendMessage.do', (req, res) => {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            data = decodeURI(data);
            let dataObject = JSON.parse(data);
            let sql=`INSERT INTO Messages(M_PostMessages,M_Status,M_Time,M_FromUserID,M_ToUserID) VALUES ('${dataObject.message}',0,'${new Date().getTime()}','${dataObject.from}','${dataObject.to}')`;
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log(error.message);
                    res.send({
                        code: 10000,
                        data: null,
                        msg: '发生错误',
                        success: false
                    })
                } else {
                    res.send({
                      code: 10000,
                      data: null,
                      msg: '',
                      success: true
                    })
                }
            });
        })
    });
};
