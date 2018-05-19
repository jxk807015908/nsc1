const getEachUsMessage = require("../../businessLayer/message/getEachUsMessage");
const updateUserMessages2 = require("../../businessLayer/usermessages/updateUserMessages2");
const searchFriend = require("../../businessLayer/myFriend/searchFriend");
const fs = require('fs');
const path = require('path');
exports.getFriendMessage = (app) => {
  app.post('/getFriendMessage.do', (req, res) => {
    let isSend = false;
    let timer;
    res.setTimeout(3000, () => {
      isSend = true;
      res.send({
        code: 10000,
        data: null,
        msg: '连接超时',
        success: false
      });
      timer && clearInterval(timer);
    });
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      data = decodeURI(data);
      let total = 0;
      let dataObject = JSON.parse(data);
      searchFriendFn({
        userId:dataObject.userId
      }).then(result3=>{
        // console.log("0000000000000000000000000000000000000000000000000000")
        // console.log(result3)
        if(result3.some(obj=>obj.F_FriendID===dataObject.friendId)){
          updateUserMessages2Fn({
            update:{
              tipNum:0
            },
            select:{
              fromId:dataObject.friendId,
              toId:dataObject.userId,
              messageType:'1',
              remark:'friend'
            }
          });
          getEachUsMessage.getEachUsMessage({
            openTime: dataObject.openTime,
            userId: dataObject.userId,
            friendId: dataObject.friendId
          }, (result) => {
            if (result === 'error') {
              (!isSend) && res.send({
                code: 10000,
                data: null,
                msg: '查询用户表发生错误',
                success: false
              })
            } else {
              total = result.length;
            }
          });
          getEachUsMessage.getEachUsMessage({
            openTime: dataObject.openTime,
            type: 1,
            pageNo: dataObject.pageNo,
            pageSize: dataObject.pageSize,
            userId: dataObject.userId,
            friendId: dataObject.friendId
          }, (result) => {
            if (result === 'error') {
              (!isSend) && res.send({
                code: 10000,
                data: null,
                msg: '查询用户表发生错误',
                success: false
              })
            } else {
              let imgPath = path.join(__dirname + '../../../data/express');
              let imgNumber = 0;
              //(async ()=>{
              result.forEach((obj, index) => {
                if (obj.M_ExpressName) {
                  let expressNameArr = obj.M_ExpressName.split(',');
                  imgNumber += expressNameArr.length;
                  expressNameArr.forEach(value => {
                    if (fs.existsSync(imgPath + '/' + value + '.gif')) {
                      fs.readFile(imgPath + '/' + value + '.gif', function (err, imgData) {
                        if (err) {
                          return console.error(err);
                        }
                        if (!result[index].expressArr) {
                          result[index].expressArr = [];
                        }
                        result[index].expressArr.push({img: imgData.toString('base64'), name: value})
                        imgNumber--;
                      })
                    } else {
                      fs.readFile(imgPath + '/' + value + '.jpg', function (err, imgData) {
                        if (err) {
                          return console.error(err);
                        }
                        if (!result[index].expressArr) {
                          result[index].expressArr = [];
                        }
                        result[index].expressArr.push({img: imgData.toString('base64'), name: value})
                        imgNumber--;
                      })
                    }
                  })
                }
              });
              //})();
              timer = setInterval(() => {
                if (imgNumber === 0) {
                  (!isSend) && res.send({
                    code: 10000,
                    data: result,
                    msg: '',
                    total:total,
                    success: true
                  });
                  clearInterval(timer);
                }
              }, 50)
            }
          });
        }else{
          (!isSend) && res.send({
            code: 1,
            data: null,
            msg: '该用户与你不是好友关系，无法聊天！',
            success: false
          })
        }
      });

    })
  });
};

function updateUserMessages2Fn(obj) {
  return new Promise((resolve, reject) => {
    updateUserMessages2.updateUserMessages2(obj, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}
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
