const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
const users = require('./data').userDB;

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));


app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
});


app.post('/register', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (!foundUser) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User list', users);
    
            res.send("<div align ='center'><h2>会員登録が完了しました。</h2></div><br><br><div align ='center'><h3>ご登録ありがとうございました。</h3></div><br><br><div align='center'><a href='./index.html'>ホームへ</a></div><br><br><div align='center'></div>");
        } else {
            res.send("<div align ='center'><h2>このメールアドレスは既に使用されています。</h2></div><br><br><div align='center'><a href='./registration.html'>新規会員登録画面に戻る</a></div>");
        }
    } catch{
        res.send("Internal server error");
    }
});

app.post('/login', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (foundUser) {
    
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password; 
    
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let usrname = foundUser.username;
                res.send(`<div align ='center'><h2>ログインしました。</h2></div><br><br><br><div align ='center'><h3>ようこそ ${usrname} さん</h3></div><br><br><div align='center'><a href='./index.html'>ホームへ</a></div>`);
            } else {
                res.send("<div align ='center'><h2>メールアドレスかパスワードが間違っています。</h2></div><br><br><div align ='center'><a href='./login.html'>ログイン画面に戻る</a></div><br><br><div align='center'><a href='./index.html'>ホームへ<a><div>");
            }
        }
        else {
    
            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);
    
            res.send("<div align ='center'><h2>メールアドレスかパスワードが間違っています。</h2></div><br><br><div align='center'><a href='./login.html'>ログイン画面に戻る<a><div><br><br><div align='center'><a href='./index.html'>ホームへ<a><div>");
        }
    } catch{
        res.send("Internal server error");
    }
});



server.listen(3000, function(){
    console.log("server is listening on port: 3000");
});