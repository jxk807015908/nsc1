const insertNewUser = require("../../businessLayer/user/insertNewUser");
const searchUser = require("../../businessLayer/user/searchUser");
const insertNewGroup = require("../../businessLayer/myFriend/insertNewGroup");
const selectUserRegister = require("../../businessLayer/userRegister/selectUserRegister");
exports.emailReg = (app, connection) => {
  app.get('/emailReg.do', (req, res) => {
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
    selectUserRegisterFn({
      uid: req.query.uid,
      expiryDate: new Date().getTime()
    }).then((result) => {
      if (result.length !== 0) {
        let length = result.length;
        searchUserFn({
          userId: result[length - 1].UR_RegisterId
        }).then((result4) => {
          if (result4.length !== 0) {
            (!isSend) && res.send({
              code: 10000,
              data: null,
              msg: '该用户已存在',
              success: false
            })
          } else {
            // let length = result.length;
            insertNewUserFn({
              userId: result[length - 1].UR_RegisterId,
              // nickName:req.query.userId,
              password: result[length - 1].UR_Password,
              email: result[length - 1].UR_Email
            }).then(() => {
              insertNewGroupFn({groupName: '我的好友', userId: result[length - 1].UR_RegisterId}).then(() => {
                (!isSend) && res.send({
                  code: 10000,
                  data: null,
                  msg: '注册成功',
                  success: true
                });
              });
            });
          }
        });
      } else {
        (!isSend) && res.send({
          code: 10000,
          data: null,
          msg: '该链接已失效',
          success: false
        })
      }
    }).catch(() => {
      (!isSend) && res.send({
        code: 10000,
        data: null,
        msg: '发生错误',
        success: false
      })
    });
  })
};

function insertNewUserFn(obj) {
  return new Promise((resolve, reject) => {
    insertNewUser.insertNewUser(obj, (result) => {
      if (result === 'error') {
        reject()
      } else {
        resolve(result)
      }
    })
  })
}

function searchUserFn(obj) {
  return new Promise((resolve, reject) => {
    searchUser.searchUser(obj, (result) => {
      if (result === 'error') {
        reject()
      } else {
        resolve(result)
      }
    })
  })
}

function insertNewGroupFn(obj) {
  return new Promise((resolve, reject) => {
    insertNewGroup.insertNewGroup(obj, (result) => {
      if (result === 'error') {
        reject()
      } else {
        resolve(result)
      }
    })
  })
}

function selectUserRegisterFn(obj) {
  return new Promise((resolve, reject) => {
    selectUserRegister.selectUserRegister(obj, (result) => {
      if (result === 'error') {
        reject()
      } else {
        resolve(result)
      }
    })
  })
}
