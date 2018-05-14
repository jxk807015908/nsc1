const insertUserGroupsToUser = require("../../businessLayer/usergroupstouser/insertUserGroupsToUser");
const deleteUserMessages = require("../../businessLayer/usermessages/deleteUserMessages");
exports.joinGroup = (app) => {
  app.post('/joinGroup.do', (req, res) => {
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
      Promise.all([insertUserGroupsToUserFn({
        userId: dataObject.userId,
        groupId: dataObject.groupId,
        groupNick: dataObject.nickName,
        time: new Date().getTime(),
        authority: 3,
      }),deleteUserMessagesFn({id:dataObject.id})]).then(()=>{
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
      // insertUserGroupsToUser.insertUserGroupsToUser({
      //   userId: dataObject.userId,
      //   groupId: dataObject.groupId,
      //   time: new Date().getTime(),
      //   authority: 3,
      // }, (result) => {
      //   if (result === 'error') {
      //     (!isSend) && res.send({
      //       code: 10000,
      //       data: null,
      //       msg: '发生错误',
      //       success: false
      //     })
      //   } else {
      //     deleteUserMessages.deleteUserMessages({id:dataObject.id}, (result) => {
      //       if (result === 'error') {
      //         (!isSend) && res.send({
      //           code: 10000,
      //           data: null,
      //           msg: '发生错误',
      //           success: false
      //         })
      //       } else {
      //         (!isSend) && res.send({
      //           code: 10000,
      //           data: '',
      //           msg: '',
      //           success: true
      //         })
      //       }
      //     })
      //   }
      // });
    })
  });
};
function deleteUserMessagesFn(obj) {
  return new Promise((resolve, reject) => {
    deleteUserMessages.deleteUserMessages(obj, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}
function insertUserGroupsToUserFn(obj) {
  return new Promise((resolve, reject) => {
    insertUserGroupsToUser.insertUserGroupsToUser(obj, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}
