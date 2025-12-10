const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// 정적 파일(CSS, JS 등) 사용 설정
app.use(express.static(path.join(__dirname)));

// 1. 로그인(메인) 화면
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/qna-list', (_, res) => {
    res.sendFile(path.join(__dirname, '/html/board-qna.html'));
});

// 2. 회원가입 화면
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// 3. 비밀번호 찾기 화면
app.get('/find', (req, res) => {
    res.sendFile(path.join(__dirname, 'find.html'));
});

// 4. server.js 에 추가
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

app.listen(port, () => {
    console.log(`서버 실행 중: http://localhost:${port}`);
});