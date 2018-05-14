const insertMessage=require("../../businessLayer/message/insertMessage");
const formidable = require("formidable");
const querystring = require("querystring");
var path = require("path");
var fs = require("fs");
exports.uploadFile = (app) => {
  app.post('/uploadFile.do', (req, res) => {
    let isSend=false;
    res.setTimeout(3000,()=>{
      isSend=true;
      res.send({
        code:10000,
        data:null,
        msg:'连接超时',
        success:false
      });
    });
    let userId=req.query.userId;
    let friendId=req.query.friendId;
    // let userId=querystring.parse(req.headers.cookie, '; ').userId;
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(__dirname + "/../../data/file/"+userId);
    if(!fs.existsSync(form.uploadDir)){
      fs.mkdir(form.uploadDir, err=>{
        if(err){
          console.log(err);
        }
        console.log("目录创建成功。");
      })
    }
    form.keepExtensions = true;//保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.parse(req,(err, fields, files)=>{
      if (err) {
        res.send={
          msg:err,
          success:true
        };
        return;
      }
      var filename = files.file.name;
      var nameArray = filename.split('.');
      var type = nameArray[nameArray.length - 1];
      var name = userId;
      // for (var i = 0; i < nameArray.length - 1; i++) {
      //   name = name + nameArray[i];
      // }
      var date = new Date();
      var time = '_' + date.getFullYear() + '_' + date.getMonth() + '_' + date.getDay() + '_' + date.getHours() + '_' + date.getMinutes();
      var avatarName = name + time + '.' + type;
      var newPath = form.uploadDir + "/" + filename;
      // var newPath = form.uploadDir + "/" + avatarName;
      try {
        fs.renameSync(files.file.path, newPath);
        insertMessage.insertMessage({
          messageType:4,
          status:0,
          time:`${new Date().getTime()}`,
          from:userId,
          to:friendId,
          filePath:newPath.replace(/\\/g,'/').split('/data')[1]
        },(result)=>{
          if (result==='error') {
            (!isSend)&&res.send({
              code: 10000,
              data: null,
              msg: '发生错误',
              success: false
            })
          } else {
            (!isSend)&&res.send({
              code: 10000,
              data: {
                messageType:4,
                status:0,
                time:`${new Date().getTime()}`,
                from:userId,
                to:friendId,
                filePath:newPath.replace(/\\/g,'/').split('/data')[1]
              },
              msg: '',
              success: true
            })
          }
        })
      }catch(e) {
        console.log(e)
        (!isSend)&&res.send({
          code:10000,
          data:null,
          msg:'发送失败',
          success:false
        })
      }
    });
    // let data = '';
    // req.on('data', (chunk) => {
    //   data += chunk;
    // });
    // req.on('end', () => {
    // console.log(data);

    // res.send({
    //   code:10000,
    //   data:data,
    //   msg:'',
    //   success:true
    // });
    // data = decodeURI(data);
    // let dataObject = JSON.parse(data);
    // searchFriend.searchFriend({userId:dataObject.userId},(result)=>{
    //   if (result==='error') {
    //     (!isSend)&&res.send({
    //       code: 10000,
    //       data: null,
    //       msg: '查询用户表和好友表发生错误',
    //       success: false
    //     })
    //   } else {
    //     (!isSend)&&res.send({
    //       code: 10000,
    //       data: result,
    //       msg: '',
    //       success: true
    //     })
    //   }
    // });
    // })
  });
};
