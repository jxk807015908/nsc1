const insertMessage = require("../../businessLayer/message/insertMessage");
const insertUserMessages = require("../../businessLayer/usermessages/insertUserMessages");
const selectUserMessages = require("../../businessLayer/usermessages/selectUserMessages");
const updateUserMessages = require("../../businessLayer/usermessages/updateUserMessages");
exports.sendMessage = (app) => {
  app.post('/sendMessage.do', (req, res) => {
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
      function opera() {
        return new Promise((resolve, reject) => {
          selectUserMessagesFn({
            fromId:dataObject.from,
            toId:dataObject.to,
            messageType: 1,
            remark:'friend'
          }).then((result)=>{
            if(result.length===0){
              insertUserMessagesFn({
                messageType: 1,
                time: `${new Date().getTime()}`,
                fromId: dataObject.from,
                toId: dataObject.to,
                fromName: dataObject.userName,
                remark:'friend',
                tipNum:1,
              }).then(()=>{
                resolve();
              })
            }else{
              updateUserMessagesFn({
                id:result[0].UM_ID,
                tipNum:result[0].UM_TipNum+1
              }).then(()=>{
                resolve()
              })
            }
          }).catch(()=>{
            reject();
          })
        })
      }
      Promise.all([insertMessageFn({
        messageType: dataObject.messageType,
        message: dataObject.message,
        status: 0,
        time: `${new Date().getTime()}`,
        from: dataObject.from,
        to: dataObject.to,
        expressName: dataObject.expressName
      }),opera()]).then(() => {
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
          msg: '发生错误',
          success: false
        })
      })
    })
  });
};

function insertMessageFn(obj) {
  return new Promise((resolve, reject) => {
    insertMessage.insertMessage(obj, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}

function insertUserMessagesFn(obj) {
  return new Promise((resolve, reject) => {
    insertUserMessages.insertUserMessages(obj, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}

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
