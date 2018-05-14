const selectUserGroups = require("../../businessLayer/usergroups/selectUserGroups");
exports.checkGroupId = (app) => {
    app.post('/checkGroupId.do', (req, res) => {
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
            selectUserGroups.selectUserGroups({groupId: dataObject.groupId}, (result) => {
                if (result === 'error') {
                    (!isSend) && res.send({
                        code: 10000,
                        data: null,
                        msg: '查询用户群表发生错误',
                        success: false
                    })
                } else {
                  if(result.length===0){
                    (!isSend) && res.send({
                      code: 10000,
                      data: '',
                      msg: '',
                      success: true
                    })
                  }else{
                    (!isSend) && res.send({
                      code: 10000,
                      data: '',
                      msg: '',
                      success: false
                    })
                  }
                }
            });
        })
    });
};
