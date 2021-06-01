const chatBtn = document.querySelector('#chatBtn');
const chatRoom = document.querySelector('#chatRoom');

chatBtn.addEventListener('click', async () => {
  let url = 'http://localhost:3000/chat';
  let options = { method: 'GET' }
  let response = await fetch(url, options);
  let result = await response.text();
  chatRoom.innerHTML = result;
})