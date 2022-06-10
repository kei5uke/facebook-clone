const mysql = require('mysql');

async function getUserPass(con, userName, passWord){
    return new Promise((resolve, reject) => {
        var sql = 'SELECT username as un, password as pwd FROM USER WHERE username = "'+userName+ '" and password = "'+passWord+'";';
        con.query(sql, (err, row, field) => {
            if(err){
                reject(err);
            } else{
                result = [row[0].un, row[0].pwd];
                resolve(result);
            }
        });
    });
}

async function UserAuth(username, password){
    const con = await mysql.createConnection({
        host: "10.211.55.10",
        user: "fakebook",
        password: "password",
        database: "fakebook"
    });
    const  tmp = await getUserPass(con, username, password);
    con.end();
    return tmp;
}

/*
f = UserAuth("keisuke135", "mDijin3456")
Promise.all([f]).then((value) => {
    console.log(value[0][0]);
}) ;  */

module.exports = { getUserPass, UserAuth };