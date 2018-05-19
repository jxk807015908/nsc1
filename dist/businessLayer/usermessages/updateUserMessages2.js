const databaseSettting = require('../databaseSetting');
const changeUserMessageKey = require('../changeUserMessagesKey').changeUserMessageKey;
exports.updateUserMessages2 = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  let updateKey=[];
  let selectKey=[];
  Object.keys(params.update).forEach(key=>{
    if(params.update[key]!==null&&changeUserMessageKey(key)!==null){
      updateKey.push(`${changeUserMessageKey(key)}='${params.update[key]}'`)
    }
  });
  Object.keys(params.select).forEach(key=>{
    if(params.select[key]!==null&&changeUserMessageKey(key)!==null){
      selectKey.push(`${changeUserMessageKey(key)}='${params.select[key]}'`)
    }
  });
  let sql = `update usermessages set ${updateKey.join(',')} where ${selectKey.join(' and ')}`;
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
