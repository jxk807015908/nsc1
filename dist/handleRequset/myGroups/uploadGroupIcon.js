// const insertUserGroups=require("../../businessLayer/usergroups/insertUserGroups");
// const insertUserGroupsToUser=require("../../businessLayer/usergroupstouser/insertUserGroupsToUser");
const formidable = require("formidable");
const querystring = require("querystring");
var path = require("path");
var fs = require("fs");
exports.uploadGroupIcon = (app) => {
  app.post('/uploadGroupIcon.do', (req, res) => {
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
    let groupId=req.query.groupId;
    // let groupName=req.query.groupName;
    // let userId=req.query.userId;
    // let userId=req.query.userId;
    // let friendId=req.query.friendId;
    // let userId=querystring.parse(req.headers.cookie, '; ').userId;
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(__dirname + "/../../data/groups/"+groupId);
    if(!fs.existsSync(form.uploadDir)){
      fs.mkdirSync(form.uploadDir, err=>{
        if(err){
          console.log(err);
        }else {
          console.log("目录创建成功。");
        }
      })
    }
    if(!fs.existsSync(form.uploadDir+'/picturesAndVideos')){
      fs.mkdir(form.uploadDir+'/picturesAndVideos', err=>{
        if(err){
          console.log(err);
        }else {
          console.log("目录创建成功。");
        }
      })
    }
    if(!fs.existsSync(form.uploadDir+'/files')){
      fs.mkdir(form.uploadDir+'/files', err=>{
        if(err){
          console.log(err);
        }else {
          console.log("目录创建成功。");
        }
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
      // var name = group;
      // for (var i = 0; i < nameArray.length - 1; i++) {
      //   name = name + nameArray[i];
      // }
      // var date = new Date();
      // var time = '_' + date.getFullYear() + '_' + date.getMonth() + '_' + date.getDay() + '_' + date.getHours() + '_' + date.getMinutes();
      var avatarName = 'groupIcon' + '.' + type;
      var newPath = form.uploadDir + "/" + avatarName;
      try {
        fs.renameSync(files.file.path, newPath);
        (!isSend)&&res.send({
          code:10000,
          data:newPath,
          msg:'',
          success:true
        })
        // insertUserGroups.insertUserGroups({
        //   groupId:groupId,
        //   name:groupName,
        //   time:`${new Date().getTime()}`,
        //   adminId:userId,
        //   icon:newPath.replace(/\\/g,'/').split('/data')[1],
        //   creatorId:userId
        // },(result)=>{
        //   if (result==='error') {
        //     (!isSend)&&res.send({
        //       code: 10000,
        //       data: null,
        //       msg: '发生错误',
        //       success: false
        //     })
        //   } else {
        //     insertUserGroupsToUser.insertUserGroupsToUser({
        //       userId:userId,
        //       groupId:groupId,
        //       time:new Date().getTime()
        //     },(result)=>{
        //       if (result==='error') {
        //         (!isSend)&&res.send({
        //           code: 10000,
        //           data: null,
        //           msg: '发生错误',
        //           success: false
        //         })
        //       } else {
        //         (!isSend)&&res.send({
        //           code: 10000,
        //           data: null,
        //           msg: '',
        //           success: true
        //         })
        //       }
        //     })
        //   }
        // })
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
