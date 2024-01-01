

const socket=io();
let username;
do{
    username=prompt('please enter the username : ');
} while(!username)

let textArea=document.querySelector('#textarea');
let messageArea=document.querySelector('.message__area');

textArea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value);
    }
})

function sendMessage(message){
     let msg={
        user:username,
        message: message.trim()
     };

    //  append the message 
    appendMessage(msg,'outgoing');
    textArea.value = '';
    // send message to server 
    socket.emit('message',msg);

}

function appendMessage(msg,type){   
 let mainDiv=document.createElement('div');
 let className=type;
 mainDiv.classList.add(type,'message');
 let markup;
 if(type==='outgoing'){
    markup=`
    <p>${msg.message}</p>
    `;
 }
 else{
    markup=`
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
    `;
 }
      mainDiv.innerHTML=markup;
      messageArea.appendChild(mainDiv);
}


// getting data for chats.json 
function fetchChatsData() {
    return fetch('/chats')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch chats data (${response.status}): ${response.statusText}`);
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error fetching chats data:', error);
      });
  }
  
  function handleRefresh() {
    fetchChatsData()
      .then(function(chatsData) {
        for (var i = 0; i < chatsData.length; i++) {
          var chat = chatsData[i];
          let msg={
            user:chat.username,
            message:chat.message
          };
          if(msg.user===username){
            appendMessage(msg,'outgoing');
          }
          else{
            appendMessage(msg,'incoming');
          }
        }
      });
  }
  
document.addEventListener('DOMContentLoaded', handleRefresh);


// receiving the message 
socket.on('message',(msg)=>{
    appendMessage(msg,'incoming');
})















