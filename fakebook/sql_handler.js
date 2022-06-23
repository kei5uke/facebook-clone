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

async function queryFollowingPost(con, userName, start, step){
    return new Promise((resolve, reject) => {
        var sql = 'select username as un , post_date_time as time, post_description as post from POST inner join USER on POST.user_id = USER.user_id where POST.user_id in (SELECT USER.user_id from USER inner join FOLLOW_FOLLOWED on USER.user_id = FOLLOW_FOLLOWED.followed_id where FOLLOW_FOLLOWED.follower_id = (select user_id from USER where username ="' +userName+ '")) order by post_date_time desc limit '+ String(start) + ',' + String(step) +';';
        con.query(sql, (err, row, field) => {
            if(err){
                reject(err);
            }
            if (row.length == 0) {
                console.log("NO POST");
                resolve(0);
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
async function getFollowingPost(username, start, step){
    const con = await mysql.createConnection(db_info);
    const tmp = await queryFollowingPost(con, username, start, step);
    con.end();
    return tmp
}

async function queryFollowiongList(con, username){
    return new Promise((resolve, reject) => {
        var sql = "select  username  from USER where USER.user_id in (SELECT USER.user_id from USER inner join FOLLOW_FOLLOWED on USER.user_id = FOLLOW_FOLLOWED.followed_id where FOLLOW_FOLLOWED.follower_id = (select user_id from USER where username ='"+username+"'));";
        con.query(sql, (err, row, field) => {
            if(err){
                reject(err);
            }
            if (row.length == 0) {
                console.log("NO FOLLOWING");
                resolve(0);
            }else{
                var followings = []

                for(var i=0; i<row.length; i++){
                    var following =  {
                        'username':row[i].username
                    }
                    followings.push(following);
                }
                resolve(followings);
            } 
        });
    });
}
async function getFollowingList(username){
    const con = await mysql.createConnection(db_info);
    const tmp = await queryFollowiongList(con, username);
    con.end();
    return tmp
}

async function queryFollowerList(con, username){
    return new Promise((resolve, reject) => {
        var sql = "SELECT USER.username from USER inner join FOLLOW_FOLLOWED on USER.user_id = FOLLOW_FOLLOWED.follower_id where FOLLOW_FOLLOWED.followed_id = (select user_id from USER where username = '"+username+"');";
        con.query(sql, (err, row, field) => {
            if(err){
                reject(err);
            }
            if (row.length == 0) {
                console.log("NO FOLLOWER");
                resolve(0);
            }else{
                var followers = []
                for(var i=0; i<row.length; i++){
                    var follower =  {
                        'username':row[i].username
                    }
                    followers.push(follower);
                }
                resolve(followers);
            } 
        });
    });
}
async function getFollowerList(username){
    const con = await mysql.createConnection(db_info);
    const tmp = await queryFollowerList(con, username);
    con.end();
    return tmp
}

async function queryUserId(con, username){
    return new Promise((resolve, reject) => {
        var sql = "select user_id as id from USER where username = '"+username+"';";
        con.query(sql, (err, row, field) => {
            if(err){
                reject(err);
            }
            if (row.length == 0) {
                resolve(0);
            }else{
                var id = [{'id':row[0].id}];
                resolve(id);
            } 
        });
    });
}
async function getUserId(username){
    const con = await mysql.createConnection(db_info);
    const tmp = await queryUserId(con, username);
    con.end();
    return tmp
}

async function queryGettingFriendRequests(con, id){
    return new Promise((resolve, reject) => {
        var sql = "select username from USER where user_id in (select follower_id as id from FOLLOW_FOLLOWED where followed_id = 1 and follower_id not in (select followed_id from FOLLOW_FOLLOWED where follower_id ="+id.toString()+"));";
        con.query(sql, (err, row, field) => {
            if(err){
                reject(err);
            }
            if (row.length == 0) {
                resolve(0);
            }else{
                var requests = []
                for(var i=0; i<row.length; i++){
                    var request =  {
                        'username':row[i].username
                    }
                    requests.push(request);
                }
                resolve(requests);
            } 
        });
    });
}
async function getFriendRequests(username){
    const con = await mysql.createConnection(db_info);
    const id = await queryUserId(con, username);
    const tmp = await queryGettingFriendRequests(con, id[0].id)
    con.end();
    return tmp
}

async function queryAddingFollower(con, follower_id, followed_id){
    return new Promise((resolve, reject) => {
        var sql = "insert into FOLLOW_FOLLOWED (follower_id, followed_id) values ("+follower_id.toString()+", "+followed_id.toString()+");";
        con.query(sql, (err, row, field) => {
            if(err){
                reject(err);
            }
            //console.log(row);
            if(row){
                if(row.affectedRows){
                    resolve(1);
                }else{
                    resolve(0);
                }
            }else{
                resolve(0);
            }
            
        });
    });
}
async function addFollower(follower_id, followed_id){
    const con = await mysql.createConnection(db_info);
    const tmp = await queryAddingFollower(con, follower_id, followed_id);
    con.end();
    return tmp
}

// tmp = addingFollower(6, 7);
// Promise.all([tmp]).then((value) => {
//     if (value == 0){
//         console.log('Empty');
//         return;
//     }
//     console.log(value)
// })

module.exports = {UserAuth, getFollowerList, getFollowingList, 
    getFollowingPost, addFollower, getFriendRequests,
    getUserId};