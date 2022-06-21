const mysql = require('mysql');

db_info = {
    host: "10.211.55.10",
    user: "fakebook",
    password: "password",
    database: "fakebook"
};

async function getUserPass(con, userName, passWord){
    return new Promise((resolve, reject) => {
        var sql = 'SELECT username as un, password as pwd FROM USER WHERE username = "'+userName+ '" and password = "'+passWord+'";';
        con.query(sql, (err, row, field) => {
            if(err){
                reject(err);
            } else{
                if (row.length == 0) {
                    // Modify it later
                    console.log("User does not exist")
                }else{
                    result = [row[0].un, row[0].pwd];
                    resolve(result);
                } 
            }
        });
    });
}

async function UserAuth(username, password){
    const con = await mysql.createConnection(db_info);
    const  tmp = await getUserPass(con, username, password);
    con.end();
    return tmp;
}

/*
f = UserAuth("keisuke135", "mDijin3456")
Promise.all([f]).then((value) => {
    console.log(value[0][0]);
}) ;  */

async function getFollowerPost(con, userName){
    return new Promise((resolve, reject) => {
        var sql = 'select username as un , post_date_time as time, post_description as post from POST inner join USER on POST.user_id = USER.user_id where POST.user_id in (SELECT USER.user_id from USER inner join FOLLOW_FOLLOWED on USER.user_id = FOLLOW_FOLLOWED.followed_id where FOLLOW_FOLLOWED.follower_id = (select user_id from USER where username ="' +userName+ '")) order by post_date_time desc;';
        con.query(sql, (err, row, field) => {
            if(err){
                reject(err);
            }
            if (row.length == 0) {
                // Modify it later
                console.log("NO POST")
            }else{
                var posts = []

                for(var i=0; i<row.length; i++){
                    var post =  {
                        'un':row[i].un,
                        'time':row[i].time,
                        'post':row[i].post
                    }
                    posts.push(post);
                }
                //const result = Object.values(JSON.parse(JSON.stringify(row)));
                resolve(posts);
            } 
        });
    });
}

async function showFollowerPost(username){
    const con = await mysql.createConnection(db_info);
    const tmp = await getFollowerPost(con, username);
    con.end();
    return tmp
}

/*
showFollowerPost('mini').then(value => {
    if (value){
         console.log(value) 
    } 
    //console.log(value)
})

UserAuth('keisuke135', 'mDijin3456').then(value => {
    //console.log(value)
}) */
// use this
// tmp = showFollowerPost('keisuke135');
// Promise.all([tmp]).then((value) => {
//     console.log(value[0])
//     for(let i = 0; i<value.length; i++){
//         console.log(value[0][i].un);
//     } 
// })

module.exports = { getUserPass, UserAuth, getFollowerPost, showFollowerPost };