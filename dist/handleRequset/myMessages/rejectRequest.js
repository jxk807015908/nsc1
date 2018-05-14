const updateUserMessages = require("../../businessLayer/usermessages/updateUserMessages");
const insertUserMessages = require("../../businessLayer/usermessages/insertUserMessages");
const deleteUserMessages2 = require("../../businessLayer/usermessages/deleteUserMessages2");
const querystring = require("querystring");
exports.rejectRequest = (app) => {
  app.post('/rejectRequest.do', (req, res) => {
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
      //dataObject.userId = querystring.parse(req.headers.cookie, '; ').userId;
      [dataObject.fromId, dataObject.toId] = [dataObject.toId, dataObject.fromId];
      dataObject.messageType === '2' && (dataObject.messageType = 5);
      dataObject.messageType === '6' && (dataObject.messageType = 7);
      dataObject.messageType === '8' && (dataObject.messageType = 9);
      dataObject.time = new Date().getTime();
      updateUserMessagesFn(dataObject).then(result => {
        if(dataObject.messageType = 9){
          deleteUserMessages2Fn({
            fromId:dataObject.fromId,
            messageType:8,
            remark:`"groupId":"${dataObject.groupId}"`
          }).then(()=>{
            (!isSend) && res.send({
              code: 10000,
              data: result,
              msg: '',
              success: true
            })
          })
        }else{
          (!isSend) && res.send({
            code: 10000,
            data: result,
            msg: '',
            success: true
          })
        }
      }).catch(()=>{
        (!isSend) && res.send({
          code: 10000,
          data: null,
          msg: '发生错误',
          success: false
        })
      });
    })
  });
};

function deleteUserMessages2Fn(obj) {
  return new Promise((resolve, reject) => {
    deleteUserMessages2.deleteUserMessages2(obj, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}

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
