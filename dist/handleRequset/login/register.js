const insertNewUser=require("../../businessLayer/user/insertNewUser");
const insertNewGroup=require("../../businessLayer/myFriend/insertNewGroup");
exports.register = (app, connection) => {
    app.get('/register.do', (req, res) => {
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
      insertNewUser.insertNewUser({
        userId:req.query.userId,
        // nickName:req.query.userId,
        password:req.query.password,
        email:req.query.email
      },(result)=>{
        if (result==='error') {
          (!isSend)&&res.send({
            code: 10000,
            data: null,
            msg: '查询用户表发生错误',
            success: false
          })
        } else {
          (!isSend)&&res.send({
            code: 10000,
            data: null,
            msg: '注册成功',
            success: true
          });
          insertNewGroup.insertNewGroup({groupName:'我的好友',userId:req.query.userId},(result)=>{
            if(result==='error'){
              console.log('error');
            }
          });
        }
      });
    })
};
