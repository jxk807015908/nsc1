const deleteUserGroupsToUser = require("../../businessLayer/usergroupstouser/deleteUserGroupsToUser");
// const selectUserGroups = require("../../businessLayer/usergroups/selectUserGroups");
// const updateUserGroups = require("../../businessLayer/usergroups/updateUserGroups");
exports.quitGroup = (app) => {
  app.post('/quitGroup.do', (req, res) => {
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
      deleteUserGroupsToUserFn({userId: dataObject.userId, groupId: dataObject.groupId}).then(result=>{
        console.log(result);
        (!isSend) && res.send({
          code: 10000,
          data: null,
          msg: '',
          success: true
        })
      },()=>{
        (!isSend) && res.send({
          code: 10000,
          data: null,
          msg: '查询用户表和好友表发生错误',
          success: false
        })
      })
      // selectUserGroupsFn({group: dataObject.groupId}).then(result=>{
      //   if (result[0].UG_AdminID === dataObject.userId) {
      //     Promise.all([deleteUserGroupsToUserFn({userId: dataObject.userId, groupId: dataObject.groupId}),updateUserGroupsFn({adminId:dataObject.nextAdminId,groupId:dataObject.groupId})]).then(results=>{
      //       console.log(results);
      //       (!isSend) && res.send({
      //         code: 10000,
      //         data: null,
      //         msg: '',
      //         success: true
      //       })
      //     },()=>{
      //       (!isSend) && res.send({
      //         code: 10000,
      //         data: null,
      //         msg: '查询用户表和好友表发生错误',
      //         success: false
      //       })
      //     })
      //   }else{
      //     deleteUserGroupsToUserFn({userId: dataObject.userId, groupId: dataObject.groupId}).then(results=>{
      //       console.log(results);
      //       (!isSend) && res.send({
      //         code: 10000,
      //         data: null,
      //         msg: '',
      //         success: true
      //       })
      //     },()=>{
      //       (!isSend) && res.send({
      //         code: 10000,
      //         data: null,
      //         msg: '查询用户表和好友表发生错误',
      //         success: false
      //       })
      //     })
      //   }
      // },()=>{
      //   (!isSend) && res.send({
      //     code: 10000,
      //     data: null,
      //     msg: '查询用户表和好友表发生错误',
      //     success: false
      //   })
      // }).catch(()=>{
      //   console.log('---------------------sadsa-----------------------')
      // });

        // deleteUserGroupsToUserFn({userId: dataObject.userId, groupId: dataObject.groupId}).then(result => {
        //   if (result === 'error') {
        //     (!isSend) && res.send({
        //       code: 10000,
        //       data: null,
        //       msg: '查询用户表和好友表发生错误',
        //       success: false
        //     })
        //   } else {
        //     (!isSend) && res.send({
        //       code: 10000,
        //       data: result,
        //       msg: '',
        //       success: true
        //     })
        //   }
        // });
    });
  })
};

function deleteUserGroupsToUserFn(obj) {
  return new Promise((resolve, reject) => {
    deleteUserGroupsToUser.deleteUserGroupsToUser({userId: obj.userId, groupId: obj.groupId}, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}

// function updateUserGroupsFn(obj) {
//   return new Promise((resolve, reject) => {
//     updateUserGroups.updateUserGroups({adminId: obj.adminId, groupId: obj.groupId}, (result) => {
//       if (result === 'error') {
//         reject();
//       } else {
//         resolve(result);
//       }
//     });
//   });
// }
//
// function selectUserGroupsFn(obj) {
//   return new Promise((resolve, reject) => {
//     selectUserGroups.selectUserGroups({groupId: obj.groupId}, (result) => {
//       if (result === 'error') {
//         reject();
//       } else {
//         resolve(result);
//       }
//     });
//   });
// }
