const insertUserMessages = require("../../businessLayer/usermessages/insertUserMessages");
const selectUserGroupsToUser3 = require("../../businessLayer/usergroupstouser/selectUserGroupsToUser3");
exports.requestJoinGroup = (app) => {
  app.post('/requestJoinGroup.do', (req, res) => {
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
      selectUserGroupsToUser3Fn({groupId: dataObject.group.groupId,authority:3}).then((result) => {
        result.forEach(item=>{
          insertUserMessagesFn({
            fromId: dataObject.userId,
            fromName: dataObject.userName,
            isRead:0,
            toId:item.UGU_UserID,
            messageType:8,
            time:new Date().getTime(),
            remark:JSON.stringify(dataObject.group)
          }).then(() => {
            (!isSend) && res.send({
              code: 10000,
              data: null,
              msg: '',
              success: true
            })
          })
        })
      }).catch(() => {
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

function selectUserGroupsToUser3Fn(obj) {
  return new Promise((resolve, reject) => {
    selectUserGroupsToUser3.selectUserGroupsToUser3(obj, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}
