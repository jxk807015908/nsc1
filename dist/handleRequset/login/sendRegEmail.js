const nodemailer = require('nodemailer');
const uuid = require('uuid');
const os=require('os');
const insertUserRegister=require("../../businessLayer/userRegister/insertUserRegister");
exports.sendRegEmail = (app, connection) => {
  app.get('/sendRegEmail.do', (req, res) => {
    let isSend=false;
    res.setTimeout(10000,()=>{
      isSend=true;
      res.send({
        code:10000,
        data:null,
        msg:'连接超时',
        success:false
      });
    });
    // let account={
    //   user:"2788926558@qq.com",      // 你的QQ用户
    //   pass:"mylfqetmrmvrdheg"
    // };
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

      let iptable={};
      let ifaces=os.networkInterfaces();
      for (var dev in ifaces) {
        ifaces[dev].forEach(function(details,alias){
          if (details.family=='IPv4') {
            iptable[dev+(alias?':'+alias:'')]=details.address;
          }
        });
      }
      let ip=iptable[Object.keys(iptable)[0]];
      // console.log(iptable);
      let uid=uuid.v1();
      let herf=`http://${ip}/#/register?uid=${uid}`;
      let html=`<a href="${herf}">${herf}</a>`;
      let mailOptions = {
        from:    "'nsc' <2788926558@qq.com>",        //谁发送的
        to:      req.query.email,       //发送给谁的
        subject: 'nsc注册', // Subject line
        // text: 'html', // plain text body
        html: '点击链接完成注册'+html // html body
      };
      console.log('html:',mailOptions.html);
      insertUserRegisterFn({
        uid:uid,
        registerId:req.query.userId,
        // nickName:req.query.userId,
        password:req.query.password,
        email:req.query.email,
        expiryDate:new Date().getTime()+60000
      }).then(()=>{
        (!isSend)&&res.send({
          code: 10000,
          data: null,
          msg: '',
          success: true
        })
      }).catch(()=>{
        (!isSend)&&res.send({
          code: 10000,
          data: null,
          msg: '发送邮件失败',
          success: false
        })
      });
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          // (!isSend)&&res.send({
          //   code: 10000,
          //   data: null,
          //   msg: '发送邮件失败',
          //   success: false
          // })
        }

        // console.log('Message sent: %s', info.messageId);
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
    });
  })
};

function insertUserRegisterFn(obj) {
  return new Promise((resolve, reject) => {
    insertUserRegister.insertUserRegister(obj, (result) => {
      if (result === 'error') {
        reject()
      } else {
        resolve(result)
      }
    })
  })
}
