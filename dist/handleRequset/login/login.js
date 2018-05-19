const changeUserStatus=require("../../businessLayer/user/changeUserStatus");
const searchUser=require("../../businessLayer/user/searchUser");
exports.login=(app)=>{
  app.post('/login.do',(req,res)=>{
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
    let data='';
    req.on('data',(chunk)=>{
      data += chunk;
    });
    req.on('end',()=>{
      data=decodeURI(data);
      let dataObject=JSON.parse(data);
      searchUser.searchUser(dataObject,(result)=>{
        if(result==='error'){
          (!isSend)&&res.send({
            code:10000,
            data:null,
            msg:'查询用户表发生错误',
            success:false
          })
        }else{
          if(result.length==1){
            (!isSend)&&res.send({
              code:10000,
              data:result[0],
              msg:'',
              success:true
            });
            // changeUserStatus.changeUserStatus({userId:dataObject.userId,status:1},(result2)=>{
            //   if(result2==='error'){
            //     console.log('error')
            //   }
            // })
          }else if(result.length==0){
            (!isSend)&&res.send({
              code:10000,
              data:[],
              msg:'账号或密码不正确',
              success:false
            })
          }else{
            (!isSend)&&res.send({
              code:10000,
              data:null,
              msg:'错误找到多个用户',
              success:false
            })
          }
        }
      });
    })
  });
};
