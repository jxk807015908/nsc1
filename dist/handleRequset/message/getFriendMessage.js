const getEachUsMessage = require("../../businessLayer/message/getEachUsMessage");
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
    })
  });
};
