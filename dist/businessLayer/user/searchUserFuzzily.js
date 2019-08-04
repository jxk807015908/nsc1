const databaseSettting = require('../databaseSetting');
const changeUserKey = require('../changeUserKey').changeUserKey;
exports.searchUserFuzzily = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  let sql;
  if(params.pageNo !== undefined && params.pageSize !== undefined){
    sql = `SELECT * FROM User WHERE (U_LoginID like "%${params.idOrName}%" or U_NickName like "%${params.idOrName}%") and U_LoginID != "${params.userId}" limit ${(params.pageNo-1)*params.pageSize},${params.pageSize}`;
  }else{
    sql = `SELECT * FROM User WHERE (U_LoginID like "%${params.idOrName}%" or U_NickName like "%${params.idOrName}%") and U_LoginID != "${params.userId}"`;
  }
  // let sql=`SELECT * FROM User WHERE U_LoginID like "%${params.idOrName}%" or U_NickName like "%${params.idOrName}%"`;
  // let i=0;
  // Object.keys(params).forEach(key=>{
  //   if(changeToTableKey(key)){
  //     if(i!==0){
  //       sql+=' and';
  //     }
  //     sql+=` ${changeToTableKey(key)}="${params[key]}"`;
  //     i=1;
  //   }
  // });

  console.log(sql);
  connection.query(sql, (error, result) => {
    if (error) {
      console.log(error.message);
      callback('error');
    } else {
      callback(result);
    }
  });
  connection.end()
};
