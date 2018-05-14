const searchUserFuzzily = require("../../businessLayer/user/searchUserFuzzily");
exports.searchUserFuzzily = (app) => {
    app.post('/searchUserFuzzily.do', (req, res) => {
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
            searchUserFuzzily.searchUserFuzzily(dataObject, result => {
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
