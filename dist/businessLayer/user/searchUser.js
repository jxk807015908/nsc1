const databaseSettting = require('../databaseSetting');
// const changeToTableKey = require('../changeToTableKey').changeToTableKey;
exports.searchUser = (params, callback) => {
    let connection = databaseSettting.databaseSettting();
    let sql='SELECT U_NickName FROM User WHERE';
    let i=0;
    // Object.keys(params).forEach(key=>{
    //   if(changeToTableKey(key)){
    //     if(i!==0){
    //       sql+=' and';
    //     }
    //     sql+=` ${changeToTableKey(key)}="${params[key]}"`;
    //     i=1;
    //   }
    // });
    if(params.userId){
      if(i!==0){
        sql+=' and';
      }
      sql+=` U_LoginID="${params.userId}"`;
      i++;
    };
    if(params.password){
      if(i!==0){
        sql+=' and';
      }
      sql+=` U_PassWord="${params.password}"`;
      i++;
    };
    if(params.status){
      if(i!==0){
        sql+=' and';
      }
      sql+=` U_UserStateID="${params.status}"`;
      i++;
    };
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
