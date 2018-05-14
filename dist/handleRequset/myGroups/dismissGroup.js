const deleteUserGroupsToUser = require("../../businessLayer/usergroupstouser/deleteUserGroupsToUser");
const deleteUserGroups = require("../../businessLayer/usergroups/deleteUserGroups");
exports.dismissGroup = (app) => {
  app.post('/dismissGroup.do', (req, res) => {
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
      Promise.all([deleteUserGroupsToUserFn({groupId: dataObject.groupId}),deleteUserGroupsFn({adminId:dataObject.userId,groupId: dataObject.groupId})]).then(()=>{
        (!isSend) && res.send({
          code: 10000,
          data: null,
          msg: '',
          success: true
        })
      }).catch(()=>{
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

function deleteUserGroupsToUserFn(obj) {
  return new Promise((resolve, reject) => {
    deleteUserGroupsToUser.deleteUserGroupsToUser({groupId: obj.groupId}, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}

function deleteUserGroupsFn(obj) {
  return new Promise((resolve, reject) => {
    deleteUserGroups.deleteUserGroups({adminId: obj.adminId, groupId: obj.groupId}, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}
