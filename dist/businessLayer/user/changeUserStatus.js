const databaseSettting=require('../databaseSetting');
exports.changeUserStatus=(params,callback)=>{
  let connection=databaseSettting.databaseSettting();
  let sql=`update user set U_UserStateID='${params.status}' where U_LoginID='${params.userId}'`;
  connection.query(sql, (error, result) => {
    if (error) {
      console.log(error.message);
      callback('error');
    } else {
      callback(result);
    }
  });
  console.log(sql);
  connection.end()
};
