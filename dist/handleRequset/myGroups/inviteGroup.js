const insertUserMessages = require("../../businessLayer/usermessages/insertUserMessages");
const selectUserMessages2 = require("../../businessLayer/usermessages/selectUserMessages2");
exports.inviteGroup = (app) => {
  app.post('/inviteGroup.do', (req, res) => {
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
      selectUserMessages2Fn({
        fromId: dataObject.fromId,
        toId: dataObject.toId,
        messageType: 6,
        remark:`"groupId":"${dataObject.remark.groupId}"`
      }).then((result2)=>{
        if(result2.length!==0){
          (!isSend) && res.send({
            code: 10000,
            data: null,
            msg: '已发送过请求',
            success: false
          })
        }else{
          insertUserMessages.insertUserMessages({
            fromId: dataObject.fromId,
            fromName: dataObject.fromName,
            isRead: 0,
            toId: dataObject.toId,
            messageType: 6,
            time: new Date().getTime(),
            remark: JSON.stringify(dataObject.remark)
          }, (result) => {
            if (result === 'error') {
              (!isSend) && res.send({
                code: 10000,
                data: null,
                msg: '查询用户表和好友表发生错误',
                success: false
              })
            } else {
              (!isSend) && res.send({
                code: 10000,
                data: result,
                msg: '',
                success: true
              })
            }
          });
        }
      });
    })
  });
};

function selectUserMessages2Fn(obj) {
  return new Promise((resolve, reject) => {
    selectUserMessages2.selectUserMessages2(obj, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}
