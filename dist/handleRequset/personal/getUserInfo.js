const getUserInfo = require("../../businessLayer/user/getUserInfo");
exports.getUserInfo = (app) => {
    app.post('/getUserInfo.do', (req, res) => {
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
            getUserInfo.getUserInfo({userId: dataObject.userId}, result => {
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
