const updateUserInfo = require("../../businessLayer/user/updateUserInfo");
const searchUser = require("../../businessLayer/user/searchUser");
const querystring = require("querystring");
exports.changePassword = (app) => {
    app.post('/changePassword.do', (req, res) => {
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
            //dataObject.userId = querystring.parse(req.headers.cookie, '; ').userId;
            searchUser.searchUser(dataObject,result=>{
              if(result === 'error'){
                (!isSend)&&res.send({
                  code: 10000,
                  data: null,
                  msg: '发生错误',
                  success: false
                })
              }else{
                if(result.length===0){
                  (!isSend)&&res.send({
                    code: 10000,
                    data: null,
                    msg: '密码错误',
                    success: true
                  })
                }else{
                  dataObject.password=dataObject.newPassword;
                  updateUserInfo.updateUserInfo(dataObject, result2 => {
                    if (result2 === 'error') {
                      (!isSend)&&res.send({
                        code: 10000,
                        data: null,
                        msg: '发生错误',
                        success: false
                      })
                    } else {
                      (!isSend)&&res.send({
                        code: 10000,
                        data: result2,
                        msg: '',
                        success: true
                      })
                    }
                  });
                }
              }
            });

        })
    });
};
