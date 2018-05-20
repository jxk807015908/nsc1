const searchUser = require("../../businessLayer/user/searchUser");
const nodemailer = require('nodemailer');
const deleteUserGroups = require("../../businessLayer/usergroups/deleteUserGroups");
exports.getPassword = (app) => {
  app.post('/getPassword.do', (req, res) => {
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
      searchUserFn({
        userId:dataObject.forgetId,
        email:dataObject.email
      }).then((result)=>{
        if(result.length===1){
          nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
              // host: 'smtp.qq.com',
              service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
              port: 465, // SMTP 端口
              secureConnection: true, // 使用了 SSL
              auth: {
                user: '2788926558@qq.com',
                // 这里密码不是qq密码，是你设置的smtp授权码
                pass: 'mylfqetmrmvrdheg'
              }
            });
            let password = `<strong>${result[0].U_PassWord}</strong>`;
            let mailOptions = {
              from: "'nsc' <2788926558@qq.com>",        //谁发送的
              to: result[0].U_Email,       //发送给谁的
              subject: 'nsc找回密码', // Subject line
              // text: 'html', // plain text body
              html: '您的密码是：' + password // html body
            };
            console.log('html:', mailOptions.html);
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
                // (!isSend)&&res.send({
                //   code: 10000,
                //   data: null,
                //   msg: '发送邮件失败',
                //   success: false
                // })
              }else{
                (!isSend)&&res.send({
                  code: 10000,
                  data: null,
                  msg: '发送邮件失败',
                  success: true
                })
              }

              // console.log('Message sent: %s', info.messageId);
              // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
          });
        }else{
          (!isSend)&&res.send({
            code: 10000,
            data: null,
            msg: '用户名或邮箱错误',
            success: false
          })
        }
      }).catch(()=>{
        (!isSend)&&res.send({
          code: 10000,
          data: null,
          msg: '发送邮件失败',
          success: false
        })
      });
    });
  })
};

function searchUserFn(obj) {
  return new Promise((resolve, reject) => {
    searchUser.searchUser(obj, (result) => {
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
    deleteUserGroups.deleteUserGroups(obj, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}
