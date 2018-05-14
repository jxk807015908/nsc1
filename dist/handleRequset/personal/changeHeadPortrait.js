const formidable = require("formidable");
const querystring = require("querystring");
var path = require("path");
var fs = require("fs");
exports.changeHeadPortrait = (app) => {
  app.post('/changeHeadPortrait.do', (req, res) => {
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
    // let userId=querystring.parse(req.headers.cookie, '; ').userId;
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(__dirname + "/../../data/headProtrait");
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
      var avatarName = userId + '.jpg';
      var newPath = form.uploadDir + "/" + avatarName;
      try {
        fs.renameSync(files.file.path, newPath);
      }catch(e) {
        console.log(e)
      }
      (!isSend)&&res.send({data:"/upload/"+avatarName})
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
