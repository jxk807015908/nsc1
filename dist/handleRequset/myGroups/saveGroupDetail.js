const updateUserGroups = require("../../businessLayer/usergroups/updateUserGroups");
const updateUserGroupsToUser = require("../../businessLayer/usergroupstouser/updateUserGroupsToUser");
exports.saveGroupDetail = (app) => {
  app.post('/saveGroupDetail.do', (req, res) => {
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
      let p1=new Promise(resolve => {
        updateUserGroups.updateUserGroups({
          groupId: dataObject.groupId,
          name: dataObject.groupName,
          intro: dataObject.groupIntro
        }, (result) => {
          if (result === 'error') {
            (!isSend) && res.send({
              code: 10000,
              data: null,
              msg: '查询用户表和好友表发生错误',
              success: false
            })
          } else {
            resolve(true)
          }
        });
      });
      let p2=new Promise(resolve => {
        updateUserGroupsToUser.updateUserGroupsToUser({
          groupId: dataObject.groupId,
          groupNick: dataObject.groupNick,
          userId: dataObject.userId
        }, (result) => {
          if (result === 'error') {
            (!isSend) && res.send({
              code: 10000,
              data: null,
              msg: '查询用户表和好友表发生错误',
              success: false
            })
          } else {
            resolve(true)
          }
        });
      });
      Promise.all([p1,p2]).then(result=>{
        if(result[0]&&result[1]){
          (!isSend) && res.send({
            code: 10000,
            data: null,
            msg: '',
            success: true
          })
        }
      })
    })
  });
};
