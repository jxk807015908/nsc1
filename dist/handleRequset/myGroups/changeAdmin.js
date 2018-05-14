const updateUserGroups = require("../../businessLayer/usergroups/updateUserGroups");
const updateUserGroupsToUser = require("../../businessLayer/usergroupstouser/updateUserGroupsToUser");
exports.changeAdmin = (app) => {
  app.post('/changeAdmin.do', (req, res) => {
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
      Promise.all([updateUserGroupsFn({groupId: dataObject.groupId, adminId: dataObject.adminId}),updateUserGroupsToUserFn({groupId: dataObject.groupId, userId: dataObject.userId,authority:3}),updateUserGroupsToUserFn({groupId: dataObject.groupId, userId: dataObject.adminId,authority:1})]).then(result=>{
        (!isSend) && res.send({
          code: 10000,
          data: result,
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
    })
  });
};

function updateUserGroupsFn(obj) {
  return new Promise((resolve, reject) => {
    updateUserGroups.updateUserGroups({groupId: obj.groupId, adminId: obj.adminId}, (result) => {
      if (result === 'error') {
        reject()
      } else {
        resolve(result)
      }
    })
  })
}

function updateUserGroupsToUserFn(obj) {
  return new Promise((resolve, reject) => {
    updateUserGroupsToUser.updateUserGroupsToUser({groupId: obj.groupId, userId: obj.userId,authority:obj.authority}, (result) => {
      if (result === 'error') {
        reject()
      } else {
        resolve(result)
      }
    })
  })
}
