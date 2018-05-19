const databaseSettting = require('../databaseSetting');
const changeUserRegisterKey = require('../changeUserRegisterKey').changeUserRegisterKey;
exports.insertUserRegister = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  // let sql = `insert into usermessages(UM_FromID,UM_ToID,UM_MessageType,UM_Message,UM_Time,) value ('${params.fromId}','${params.toId}','${params.messageType}','${params.message}','${params.time}')`;
  let front=[];
  let behind=[];
  Object.keys(params).forEach(key=>{
    if(params[key]!=null&&changeUserRegisterKey(key)!==null){
      front.push(changeUserRegisterKey(key));
      behind.push(`'${params[key]}'`);
    }
  });
  let sql = `insert into userregister(${front.join(',')}) value (${behind.join(',')})`;
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
