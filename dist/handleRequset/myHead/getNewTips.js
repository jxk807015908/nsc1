const selectUserMessages = require("../../businessLayer/usermessages/selectUserMessages");
exports.getNewTips = (app) => {
  app.post('/getNewTips.do', (req, res) => {
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
      selectUserMessagesFn({toId: dataObject.userId, isRead: '0'}).then((result) => {
        let remindTips = 0;
        result.forEach(obj => {
          console.log(obj);
          if (obj.UM_MessageType === '1') {
            remindTips += obj.UM_TipNum;
          } else {
            remindTips++;
          }
        });
        (!isSend) && res.send({
          code: 10000,
          data: {remindTips: remindTips},
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
