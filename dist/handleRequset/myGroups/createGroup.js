const insertUserGroups = require("../../businessLayer/usergroups/insertUserGroups");
const insertUserGroupsToUser = require("../../businessLayer/usergroupstouser/insertUserGroupsToUser");
exports.createGroup = (app) => {
  app.post('/createGroup.do', (req, res) => {
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
      insertUserGroups.insertUserGroups({
        groupId: dataObject.groupId,
        name: dataObject.groupName,
        time: `${new Date().getTime()}`,
        adminId: dataObject.userId,
        icon: dataObject.icon.replace(/\\/g, '/').split('/data')[1],
        creatorId: dataObject.userId
      }, (result) => {
        if (result === 'error') {
          (!isSend) && res.send({
            code: 10000,
            data: null,
            msg: '发生错误',
            success: false
          })
        } else {
          insertUserGroupsToUser.insertUserGroupsToUser({
            userId: dataObject.userId,
            groupId: dataObject.groupId,
            groupNick: dataObject.nickName,
            time: new Date().getTime(),
            authority:1
          }, (result) => {
            if (result === 'error') {
              (!isSend) && res.send({
                code: 10000,
                data: null,
                msg: '发生错误',
                success: false
              })
            } else {
              (!isSend) && res.send({
                code: 10000,
                data: null,
                msg: '',
                success: true
              })
            }
          })
        }
      })
    })
  });
};
