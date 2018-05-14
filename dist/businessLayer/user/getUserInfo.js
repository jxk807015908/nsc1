const databaseSettting = require('../databaseSetting');
exports.getUserInfo = (params, callback) => {
    let connection = databaseSettting.databaseSettting();
    let sql = `SELECT * FROM User WHERE U_LoginID='${params.userId}'`;
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
