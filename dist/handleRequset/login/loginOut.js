const changeUserStatus = require("../../businessLayer/user/changeUserStatus");
exports.loginOut = (app) => {
  app.post('/loginOut.do', (req, res) => {
    let isSend = false;
    res.setTimeout(10000, () => {
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
      changeUserStatus.changeUserStatus({userId:dataObject.userId,status:0},(result2)=>{
        if(result2==='error'){
          (!isSend) && res.send({
            code: 10000,
            data: [],
            msg: '发生错误',
            success: false
          })
        }else{
          (!isSend) && res.send({
            code: 10000,
            data: null,
            msg: '',
            success: true
          })
        }
      })
    })
  });
};
