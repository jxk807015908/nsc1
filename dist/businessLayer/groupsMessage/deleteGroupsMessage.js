const databaseSettting = require('../databaseSetting');
const changeGroupsMessageKey = require('../changeGroupsMessageKey').changeGroupsMessageKey;
exports.deleteGroupsMessage = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  let tableKey=[];
  Object.keys(params).forEach(key=>{
    if(params[key]!==null&&changeGroupsMessageKey(key)!==null){
      tableKey.push(`${changeGroupsMessageKey(key)}='${params[key]}'`)
    }
  });
  let sql = `delete from groupsMessage where ${tableKey.join(' and ')}`;
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
