const selectUserMessages = require("../../businessLayer/usermessages/selectUserMessages");
exports.getYourGroupRequest = (app) => {
  app.post('/getYourGroupRequest.do', (req, res) => {
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
      selectUserMessagesFn({fromId: dataObject.userId,messageType:8}).then((result) => {
        (!isSend) && res.send({
          code: 10000,
          data: result,
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
