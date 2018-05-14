const databaseSettting = require('../databaseSetting');
const changeUserKey = require('../changeUserKey').changeUserKey;
exports.updateUserInfo = (params, callback) => {
    let connection = databaseSettting.databaseSettting();
    let tableKey=[];
    Object.keys(params).forEach(key=>{
      if(params[key]!==null&&changeUserKey(key)!==null&&key!=='userId'){
        tableKey.push(`${changeUserKey(key)}='${params[key]}'`)
      }
    });
    let sql=`update user set ${tableKey.join(',')} where U_LoginID='${params.userId}'`;
    console.log(sql)
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
