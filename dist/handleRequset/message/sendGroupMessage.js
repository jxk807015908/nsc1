const insertGroupsMessage = require("../../businessLayer/groupsMessage/insertGroupsMessage");
exports.sendGroupMessage = (app) => {
  app.post('/sendGroupMessage.do', (req, res) => {
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
      insertGroupsMessage.insertGroupsMessage({
        messageType: dataObject.messageType,
        message: dataObject.message,
        status: 0,
        time: `${new Date().getTime()}`,
        fromId: dataObject.from,
        uName: dataObject.uName,
        groupId:dataObject.groupId,
        expressName: dataObject.expressName
      }, (result) => {
        if (result === 'error') {
          (!isSend) && res.send({
            code: 10000,
            data: null,
            msg: '发生错误',
            success: false
          })
        } else {
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
