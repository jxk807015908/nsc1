const databaseSettting = require('../databaseSetting');
const changeUserMessageKey = require('../changeUserMessagesKey').changeUserMessageKey;
exports.deleteUserMessages = (params, callback) => {
    let connection = databaseSettting.databaseSettting();
    let tableKey=[];
    Object.keys(params).forEach(key=>{
      if(params[key]!==null&&changeUserMessageKey(key)!==null){
        tableKey.push(`${changeUserMessageKey(key)}='${params[key]}'`)
      }
    });
    let sql = `delete from usermessages where ${tableKey.join(' and ')}`;
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
