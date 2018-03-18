exports.login=(app,connection)=>{
  app.post('/login.do',(req,res)=>{
    let data='';
    req.on('data',(chunk)=>{
      data += chunk;
    });
    req.on('end',()=>{
      data=decodeURI(data);
      let dataObject=JSON.parse(data);
      let sql=`SELECT U_NickName FROM User WHERE U_LoginID="${dataObject.username}" AND U_PassWord="${dataObject.password}"`;
      connection.query(sql,(error,result)=>{
        if(error){
          console.log(error.message);
          res.send({
            code:10000,
            data:null,
            msg:'查询用户表发生错误',
            success:false
          })
        }else{
          if(result.length==1){
            res.send({
              code:10000,
              data:result[0],
              msg:'',
              success:true
            })
          }else if(result.length==0){
            res.send({
              code:10000,
              data:[],
              msg:'账号或密码不正确',
              success:false
            })
          }else{
            res.send({
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
