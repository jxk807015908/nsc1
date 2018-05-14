const databaseSettting = require('../databaseSetting');
const changeUserMessageKey = require('../changeUserMessagesKey').changeUserMessageKey;
exports.insertUserMessages = (params, callback) => {
    let connection = databaseSettting.databaseSettting();
    // let sql = `insert into usermessages(UM_FromID,UM_ToID,UM_MessageType,UM_Message,UM_Time,) value ('${params.fromId}','${params.toId}','${params.messageType}','${params.message}','${params.time}')`;
    let front=[];
    let behind=[];
    Object.keys(params).forEach(key=>{
      if(params[key]!=null&&changeUserMessageKey(key)!==null){
        front.push(changeUserMessageKey(key));
        behind.push(`'${params[key]}'`);
      }
    });
  let sql = `insert into usermessages(${front.join(',')}) value (${behind.join(',')})`;
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
