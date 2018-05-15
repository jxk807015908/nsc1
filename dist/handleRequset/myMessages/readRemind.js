const updateUserMessages = require("../../businessLayer/usermessages/updateUserMessages");
exports.readRemind = (app) => {
  app.post('/readRemind.do', (req, res) => {
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
      let prarms;
      if(dataObject.type==='1'){
        prarms={
          id:dataObject.id,
          tipNum:0
        }
      }else{
        prarms={
          id:dataObject.id,
          isRead:1,
          tipNum:0
        }
      }
      updateUserMessagesFn(prarms).then(() => {
        (!isSend) && res.send({
          code: 10000,
          data: null,
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

function updateUserMessagesFn(obj) {
  return new Promise((resolve, reject) => {
    updateUserMessages.updateUserMessages(obj, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}

