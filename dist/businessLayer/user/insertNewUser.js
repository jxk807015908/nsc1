const databaseSettting = require('../databaseSetting');
exports.insertNewUser = (params, callback) => {
    let connection = databaseSettting.databaseSettting();
    let sql = `INSERT INTO User (U_LoginID,U_PassWord,U_Email) VALUES ('${params.userId}','${params.password}','${params.email}')`;
    connection.query(sql, (error, result) => {
        if (error) {
            console.log(error.message);
            callback('error');
        } else {
            callback(result);
        }
    });
    console.log(sql)
    connection.end()
};
