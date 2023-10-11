const express = require('express');
const mysql = require('mysql2/promise'); // mysql2/promise 모듈 사용
const app = express();
app.use(express.json());
const PORT = 8030;

const connect = {
    host: '127.0.0.1',
    port: "3306",
    user: "root",
    password: '1234',
    database: 'practice_database'
};

app.listen(PORT, () => {
    console.log(`${PORT}번 port에 연결 되었습니다.`);
});

const createUser = async (req, res) => {
    console.log("확인 한 번 해봤습니다~ ㅋ");
    try {
        let conn = await mysql.createConnection(connect);
        const sql = "INSERT INTO users (name, email, pw) VALUES (?, ?, ?)";
        const userInfo = {
            "name": req.body.name,
            "email": req.body.email,
            "pw": req.body.pw
        };
        await conn.execute(sql, [userInfo.name, userInfo.email, userInfo.pw]);
        conn.end();
        res.status(201).json({ message: "DataPool Created" });
    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).json({ message: "ERROR CREATE!" });
    }
}

const writePost = async (req, res) => {
    console.log("마! 게시글 함 써보까!");
    try {
        const conn = await mysql.createConnection(connect);
        const sql = "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)";
        const postInfo = {
            "title": req.body.title,
            "content": req.body.content,
            "user_id": req.body.user_id
        };
        await conn.execute(sql, [postInfo.title, postInfo.content, postInfo.user_id]);
        conn.end();
        res.status(201).json({ message: "SUCCESS!!!"});
    } catch(error) {
        console.error("Error ", error);
        res.status(500).json({message: "으악 에러야! 돔황챠!!!"});
    }
};

const showPosts = async (req, res) => {
    console.log("게시글 전체 확인");
    try{
        const conn = await mysql.createConnection(connect);
        const sql = "SELECT title, content, user_id FROM posts ";
        await conn.query(sql);
        conn.end();
        res.status(200).json({ message: "짜잔"});
    } catch(error) {
        res.status(500).json({ message: "으악 또 에러야!!"});
    }
};

const specificUser = async (req, res) => {
    console.log("특정 유저 게시글 확인");
    try {
        const conn = await mysql.createConnection(connect);
        const user_id = req.body.user_id;
        const sql = "SELECT users.name, posts.title, posts.content FROM posts JOIN users on users.id = posts.user_id WHERE users.id = ?";
        const result = await conn.query(sql, [user_id]);
        conn.end();
        res.status(201).json({message: result}); 

    } catch(error) {
        res.status(500).json({ message: "으악 또 에러야!!"});
    }
};

const modifyContent = async (req, res) => {
    console.log("게시글 수정 페이지");
    try {
        const conn = mysql.createConnection(connect);
        const id = req.body.userid;
        const user_id = req.body.postid;
        const connect = req.body.content;
        const sql = `UPDATE posts SET content = ? WHERE user_id = ? AND id = ?`;
        const result = await conn.query(sql, [connect, id, user_id]);

        conn.end();
        if (result[0].affectedRows === 1) {
            res.status(200).json({ message: "게시글 수정 성공" });
        } else {
            res.status(404).json({ message: "게시글 수정 실패" });
        }

    } catch(error) {
        res.status(500).json({ message: "에러 발생: " + error.message });
    }
};




app.post('/insertUserInfo', createUser);
app.post('/writePost', writePost);
app.get('/showPosts', showPosts);
app.get('/specificUser', specificUser);
app.post('/modifyContent', modifyContent);