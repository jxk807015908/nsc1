const insertNewUser=require("../../businessLayer/user/insertNewUser");
const insertNewGroup=require("../../businessLayer/myFriend/insertNewGroup");
const selectUserRegister=require("../../businessLayer/userRegister/selectUserRegister");
exports.emailReg = (app, connection) => {
  app.get('/emailReg.do', (req, res) => {
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
    selectUserRegister.selectUserRegister({
      uid:req.query.uid,
      expiryDate:new Date().getTime()
    },(result)=>{
      if(result==='error'){
        (!isSend)&&res.send({
          code: 10000,
          data: null,
          msg: '查询用户表发生错误',
          success: false
        })
      }else{
        if(result.length!==0){
          let length=result.length;
          insertNewUser.insertNewUser({
            userId:result[length-1].UR_RegisterId,
            // nickName:req.query.userId,
            password:result[length-1].UR_Password,
            email:result[length-1].UR_Email
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
        }else{
          (!isSend)&&res.send({
            code: 10000,
            data: null,
            msg: '该链接已过期',
            success: false
          })
        }
      }
    });
  })
};
