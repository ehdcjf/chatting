const express = require('express');
const cookieParser = require('cookie-parser');
const ctoken = require('./jwt');
const chash = require('./chash')
const app = express();
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const auth = require('./middleware/auth')
const { sequelize, User } = require('./models')
//소켓 셋팅 마지막에 app.listen 을  server.listen으로 변경 
const socket = require('socket.io'); 
const http = require('http'); 
const server = http.createServer(app); 
const io = socket(server); 


app.set('view engine', 'html')

app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());

nunjucks.configure('views', {
    express: app,
})


sequelize.sync({ force: false })
    .then(() => { // resolve
        console.log('DB접속이 완료되었습니다.')
    })
    .catch((err) => { // reject
        console.log(err)
    })

app.get('/', (req, res) => {
    let { msg } = req.query;
    res.render('index')
})

app.get('/user/info', auth, (req, res) => {
    res.send(`Hello ${req.userid}`)
})

app.get('/user/join', (req, res) => {
    res.render('join')
})

app.get('/user/userid_check', async (req, res) => {
    userid = req.query.userid
    result = await User.findOne({
        where: { userid }
    })
    if (result == undefined) {
        check = true;
    } else {
        check = false;
    }
    res.json({ check })
})


app.post('/user/join_success', async (req, res) => {
    let { userid, userpw, username, gender, userimage, useremail } = req.body
    let token = chash(userpw)
    let result = await User.create({
        userid, token, username, gender, useremail, userimage
    })
    res.json({ result })
})


app.post('/auth/local/login', async (req, res) => {
    let { userid, userpw } = req.body
    // let {userid2, userpw2} = JSON.parse(req.get('data'))
    console.log('body req :', userid, userpw)
    // console.log('data req :',userid2, userpw2)
    let result = {}
    let token = chash(userpw)
    let check = await User.findOne({
        where: { userid, token }
    })
    let token2 = ctoken(userid)
    if (check == null) {
        result = {
            result: false,
            msg: '아이디와 패스워드를 확인해주세요'
        }
    } else {
        result = {
            result: true,
            msg: '로그인에 성공하셨습니다.'
        }
        res.cookie('AccessToken', token2, { httpOnly: true, secure: true, })
    }
    res.json(result)
})

app.get('/chat',auth, (req, res) => {
    
    res.render('chat.html');
});

app.get('/getmyid',auth,(req,res)=>{
    res.json(req.userid) 
})

//소켓 서버에서 받는 부분. 
let id=undefined; 
io.sockets.on("connection", socket=>{ 
    // console.log(socket.handshake.headers.cookie);
    
    let cookieStr = socket.handshake.headers.cookie;
    if(cookieStr!==undefined){
        let cookieArr =  cookieStr.split(';'); 
        cookieArr.forEach(v=>{ 
            let [name,value] = v.split('='); 
            //trim은 공백을 제거하는 메서드.. 
            //replace 교체
            if(name == 'AccessToken'){ 
                let jwt = value.split('.'); 
                //console.log(jwt[1]); 
                let payload = Buffer.from(jwt[1],'base64').toString()
                let {userid} = JSON.parse(payload); 
                id = userid;
            }  
        })
    }
   
    console.log(id); 
    socket.on('send',datas=>{ 
        console.log(datas); 
        socket.broadcast.emit('msg',datas)
    })
})


server.listen(3000, () => {
    console.log('server start port: 3000');
})