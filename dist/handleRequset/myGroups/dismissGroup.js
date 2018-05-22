const deleteUserGroupsToUser = require("../../businessLayer/usergroupstouser/deleteUserGroupsToUser");
const deleteUserGroups = require("../../businessLayer/usergroups/deleteUserGroups");
const selectUserGroupsToUser2 = require("../../businessLayer/usergroupstouser/selectUserGroupsToUser2");
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
      selectUserGroupsToUser2Fn({
        groupId: dataObject.groupId
      }).then(result=>{
        if(result.length===1){
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
        }else{
          (!isSend) && res.send({
            code: 10000,
            data: null,
            msg: '只有一人时才能解散群',
            success: false
          })
        }
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
function selectUserGroupsToUser2Fn(obj) {
  return new Promise((resolve, reject) => {
    selectUserGroupsToUser2.selectUserGroupsToUser2({adminId: obj.adminId, groupId: obj.groupId}, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}
