const deleteUserGroupsToUser = require("../../businessLayer/usergroupstouser/deleteUserGroupsToUser");
const deleteUserGroups = require("../../businessLayer/usergroups/deleteUserGroups");
const selectUserGroupsToUser2 = require("../../businessLayer/usergroupstouser/selectUserGroupsToUser2");
const deleteGroupsMessage = require("../../businessLayer/groupsMessage/deleteGroupsMessage");
const rimraf = require("rimraf");
const path = require("path");
exports.dismissGroup = (app) => {
  app.post('/dismissGroup.do', (req, res) => {
    let isSend = false;
    res.setTimeout(10000, () => {
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
          Promise.all([deleteUserGroupsToUserFn({groupId: dataObject.groupId}),deleteUserGroupsFn({adminId:dataObject.userId,groupId: dataObject.groupId}),deleteGroupsMessageFn({groupId:dataObject.groupId}),deleteGroupDataFile(path.join(__dirname + "/../../data/groups/"+dataObject.groupId))]).then(()=>{
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
              msg: '发生错误',
              success: false
            })
          });
        }else if(result.length===0){
          (!isSend) && res.send({
            code: 10000,
            data: null,
            msg: '该群不存在',
            success: false
          })
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
function deleteGroupsMessageFn(obj) {
  return new Promise((resolve, reject) => {
    deleteGroupsMessage.deleteGroupsMessage(obj, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}
function deleteGroupDataFile(path) {
  return new Promise((resolve, reject) => {
    rimraf(path,function(err){
      if (err) {
        console.error(err);
        reject();
      }else{
        resolve();
      }
    });
  });
}
