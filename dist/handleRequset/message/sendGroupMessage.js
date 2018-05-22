const insertGroupsMessage = require("../../businessLayer/groupsMessage/insertGroupsMessage");
const insertUserMessages = require("../../businessLayer/usermessages/insertUserMessages");
const selectUserMessages = require("../../businessLayer/usermessages/selectUserMessages");
const updateUserMessages = require("../../businessLayer/usermessages/updateUserMessages");
const selectUserGroupsToUser2 = require("../../businessLayer/usergroupstouser/selectUserGroupsToUser2");
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
      //增加提醒数量
      function opera() {
        return new Promise((resolve, reject) => {
          selectUserGroupsToUser2Fn({groupId:dataObject.groupId}).then((result2)=>{
            let length=result2.length;
            let num=0;
            if(result2.some(obj=>obj.UGU_UserID===dataObject.from)){
              result2.forEach(obj=>{
                if(obj.UGU_UserID!==dataObject.from){
                  selectUserMessagesFn({
                    fromId:dataObject.groupId,
                    toId: obj.UGU_UserID,
                    messageType: 1,
                    remark: 'group',
                  }).then((result) => {
                    if (result.length === 0) {
                      insertUserMessagesFn({
                        messageType: 1,
                        time: `${new Date().getTime()}`,
                        fromId:dataObject.groupId,
                        toId: obj.UGU_UserID,
                        fromName: dataObject.fromName,
                        remark: 'group',
                        tipNum: 1,
                      }).then(() => {
                        num++;
                        num===length&&resolve();
                      })
                    } else {
                      updateUserMessagesFn({
                        id: result[0].UM_ID,
                        tipNum: result[0].UM_TipNum + 1
                      }).then(() => {
                        num++;
                        num===length&&resolve();
                      })
                    }
                  }).catch(() => {
                    reject();
                  })
                }else{
                  num++;
                  num===length&&resolve();
                }
              })
            }else{
              reject(1);
            }
          });
        })
      }
      Promise.all([insertGroupsMessageFn({
        messageType: dataObject.messageType,
        message: dataObject.message,
        status: 0,
        time: `${new Date().getTime()}`,
        fromId: dataObject.from,
        uName: dataObject.uName,
        groupId: dataObject.groupId,
        expressName: dataObject.expressName
      }), opera()]).then(() => {
        (!isSend) && res.send({
          code: 10000,
          data: null,
          msg: '',
          success: true
        })
      }).catch((val) => {
        let msg='发生错误';
        if(val===1){
          msg='你现在不是群成员无法发言';
        }
        (!isSend) && res.send({
          code: 10000,
          data: null,
          msg: msg,
          success: false
        })
      })
    })
  });
};

function insertGroupsMessageFn(obj) {
  return new Promise((resolve, reject) => {
    insertGroupsMessage.insertGroupsMessage(obj, (result) => {
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

function selectUserGroupsToUser2Fn(obj) {
  return new Promise((resolve, reject) => {
    selectUserGroupsToUser2.selectUserGroupsToUser2(obj, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}
