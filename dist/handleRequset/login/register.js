exports.register = (app, connection) => {
    app.get('/register.do', (req, res) => {
        let sql = `INSERT INTO User (U_LoginID,U_PassWord,U_Email) VALUES ('${req.query.username}','${req.query.password}','${req.query.email}')`;
        console.log(sql)
        connection.query(sql, (error, result) => {
            if (error) {
                console.log(error.message);
                res.send({
                    code: 10000,
                    data: null,
                    msg: '查询用户表发生错误',
                    success: false
                })
            } else {
                res.send({
                  code: 10000,
                  data: null,
                  msg: '注册成功',
                  success: true
                });
                let sql=`INSERT INTO friendgroups (FG_Name,FG_UserID) VALUES ('我的好友','${req.query.username}')`;
                connection.query(sql,(error,result)=>{
                  if(error){
                    console.log(error.message);
                  }
                })
            }
        });
    })
};
