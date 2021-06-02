let cookie = 'AccessToken=eyJ0cHkiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOiIxIiwiZXhwIjoxNjIyNjA1MTE3MzQ5fQ.BqXNyXj9omud6A8uDOb8n45DIePuEPz6zBTzB4wciK4; hello=helllllo; dsklghslkhglsakh=asdfsAccessTokenadfsadfsadf; sdagehthyhyh=asdfsadtehyhjy; fsr4gr=sdfsdf'
let cookieArr = cookie.split('; ');
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

//어레이 메서드를 사용한 예제 
//첫번째가 더 좋음! 
// let [userid] = 
// cookie.split('; ').filter(v=>v.includes('AccessToken'))
//                     .map(v=>{
//                         let [name,value] = v.split('=');              
//                         return JSON.parse(Buffer.from(value.split('.')[1],'base64').toString()).userid;
//                      })

//                console.log("두번째 방법", userid); 