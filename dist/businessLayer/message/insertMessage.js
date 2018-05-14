const databaseSettting = require('../databaseSetting');
const changeMessagesKey = require('../changeMessagesKey').changeMessagesKey;
exports.insertMessage = (params, callback) => {
    let connection = databaseSettting.databaseSettting();
    // let sql;
    // if(params.expressName){
    //   sql=`INSERT INTO Messages(M_PostMessages,M_Status,M_Time,M_FromUserID,M_ToUserID,M_MessagesTypeID,M_ExpressName) VALUES ('${params.message}',${params.status},'${params.time}','${params.from}','${params.to}','${params.messagesType}','${params.expressName}')`;
    // }else{
    //   sql=`INSERT INTO Messages(M_PostMessages,M_Status,M_Time,M_FromUserID,M_ToUserID,M_MessagesTypeID) VALUES ('${params.message}',${params.status},'${params.time}','${params.from}','${params.to}','${params.messagesType}')`;
    // }
    let front=[];
    let behind=[];
    Object.keys(params).forEach(key=>{
      if(params[key]!=null&&changeMessagesKey(key)!==null){
        front.push(changeMessagesKey(key));
        behind.push(`'${params[key]}'`);
      }
    });
    let sql = `insert into messages(${front.join(',')}) value (${behind.join(',')})`;
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
