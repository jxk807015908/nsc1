const updateUserMessages2 = require("../../businessLayer/usermessages/updateUserMessages2");
const insertUserMessages = require("../../businessLayer/usermessages/insertUserMessages");
const deleteUserMessages2 = require("../../businessLayer/usermessages/deleteUserMessages2");
const querystring = require("querystring");
exports.updateRemind = (app) => {
  app.post('/updateRemind.do', (req, res) => {
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
      updateUserMessages2Fn({
        update:{
          tipNum:0
        },
        select:{
          fromId:dataObject.fromId,
          toId:dataObject.userId,
          messageType:'1',
          remark:dataObject.type==1?'friend':'group'
        }
      }).then(()=>{
        (!isSend) && res.send({
          code: 10000,
          data: '',
          msg: '',
          success: true
        })
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



function updateUserMessages2Fn(obj) {
  return new Promise((resolve, reject) => {
    updateUserMessages2.updateUserMessages2(obj, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}
