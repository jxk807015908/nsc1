const databaseSettting = require('../databaseSetting');
const changeGroupsMessageKey=require('../changeGroupsMessageKey').changeGroupsMessageKey;
exports.selectGroupsMessage = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  let tableKey=[];
  Object.keys(params).forEach(key=>{
    if(params[key]!==null&&changeGroupsMessageKey(key)!==null){
      tableKey.push(`${changeGroupsMessageKey(key)}='${params[key]}'`)
    }
  });
  let sql;
  if(params.pageNo !== undefined && params.pageSize !== undefined){
    sql = `select * from groupsmessage where ${tableKey.join(' and ')} and GM_CreateTime<"${params.openTime}" order by GM_CreateTime DESC limit ${(params.pageNo-1)*params.pageSize},${params.pageSize}`;
  }else{
    sql = `select * from groupsmessage where ${tableKey.join(' and ')} and GM_CreateTime<"${params.openTime}"`;
  }
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
