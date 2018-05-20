const searchFriend = require("../../businessLayer/myFriend/searchFriend");
exports.getFriendInfo = (app) => {
  app.post('/getFriendInfo.do', (req, res) => {
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
      searchFriendFn({userId: dataObject.userId, friendId: dataObject.friendId}).then((result) => {
        (!isSend) && res.send({
          code: 10000,
          data: result,
          msg: '',
          success: true
        })
      }).catch(() => {
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

function searchFriendFn(obj) {
  return new Promise((resolve, reject) => {
    searchFriend.searchFriend(obj, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}
