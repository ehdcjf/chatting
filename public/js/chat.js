const chatBtn = document.querySelector('#chatBtn');
const chatRoom = document.querySelector('#chatRoom');
let flag = undefined; 

let socket = io(); 

document.querySelector('#chatSend').addEventListener('keyup', (e)=>{
  if (e.keyCode === 13) {
      send(); 
  }  
});



chatBtn.addEventListener('click', () => {
  switch(flag){ 
    case true:
      //열린 상태에서 다시 누를 때,  
      flag= false; 
      chatRoom.style.display = "none"
    break; 
    case false:
      //처음 제외하고 다시 열릴때.
      flag = true;  
      chatBtn.innerHTML = '채팅'; 
      chatBtn.dataset.value = 0; 
      chatRoom.style.display = "block"
    break; 
    case undefined: 
    //처음으로 이 버튼을 눌렀을 때. 
      flag = true;
      getChatRoom();  
    break; 
  }
})



async function getChatRoom(){
  let url = 'http://localhost:3000/chat';
  let options = { method: 'GET' }
  let response = await fetch(url, options);
  let result = await response.text();
  //result 값에 실패시에는 json 형태로 오는데 
  //result 값이 성공시에는 html 형태. 즉 text로 준다. 
  if(isJson(result)){ 
    //로그인 처리가 잘 안되었을 때, 
    let json  = JSON.parse(result); 
    if(json.result === false) alert(json.msg);
  }else{ 
    //로그인 처리가 완료가 잘 되었을때.
    chatRoom.innerHTML = result;
    //로그인 처리가 잘 되고 화면이 잘 그려졌을 때
    socketChat(); 
  }
}

function socketChat(){ 
  socket.on("connect",()=>{ 

  }); 

  socket.on('msg',datas=>{ 
    chatBtn.dataset.value = parseInt(chatBtn.dataset.value)+1; 
  //dataset
    if(flag==false){ 
      
      chatBtn.innerHTML = `채팅 <span style = "color:red; padding:2px;">${chatBtn.dataset.value}</span>`
    }
    addCard2(datas,'yourchat'); 

  })
}


const chatSend = document.querySelector('#chatSend'); 
console.log(chatSend); 



async function send(){ 
  const msg = document.querySelector('#msg'); 
  console.log(msg.value); 

  let url = 'http://localhost:3000/getmyid';
  let options = { method: 'GET' }
  let response = await fetch(url, options);
  let userid = await response.json();
  
  let datas = []; 
  datas.push(userid); 
  datas.push(msg.value); 
  if(msg.value=='') return false; 
  socket.emit('send',datas); 
  addCard(msg.value,'mychat')
  msg.value = ''; 
  msg.focus(); 
  
}


//input -> textarea   span -> pre 
// pre 최소 너비 설정해주기. 
function addCard(text,type){ //mychat  yourchat 
  const chat = document.querySelector('#chat')
  const div = document.createElement('div');
  const pre = document.createElement('pre');
  
  pre.innerHTML = text; 
  pre.classList.add(type); 
  div.appendChild(pre); 
  chat.appendChild(div); 
}


function addCard2(datas,type){ //mychat  yourchat 
  const chat = document.querySelector('#chat')
  const div = document.createElement('div');
  const subdiv1 = document.createElement('div');
  const subdiv2 = document.createElement('div');

  const pre = document.createElement('pre');
  const span = document.createElement('span');
  

  span.innerHTML = datas[0]; 
  pre.innerHTML = datas[1]; 
  pre.classList.add(type); 
  subdiv1.appendChild(span); 
  subdiv2.appendChild(pre);
  div.appendChild(subdiv1); 
  div.appendChild(subdiv2); 
  chat.appendChild(div); 
}






function isJson(str){ 
  try{
    let json = JSON.parse(str); 
    return (typeof json == 'object')
  }catch(e) { 
    return false; 
  }
  
}



