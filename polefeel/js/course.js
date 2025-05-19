// const video = document.querySelector('.video_input');
const workSession = document.querySelector('.work_sessions');
const queueBox = document.querySelector('.queue');
let queue = [];
let sessionContinues = false;

function queueEntity(name, state) {
   this['name'] = name;
   this['state'] = state;
}

function isAdmin() {
   let flag = false;
   document.cookie.split(';').forEach(e => {
      if (e.trim() == 'admin=true') {
         flag = true;
      }
   });
   return flag;
}

function showAdmins() {
   let responseStr = '';
   admins.forEach(e => {
         responseStr += `
            <div class="admin_name ${e.login}" style="display: flex; gap: 1vw;">
               <h2 class="all_admin_for_sessions__login">${e.login}</h2>
               <h2 class="all_admin_for_sessions__a">prickol</h2>
            </div>
         `
   });
   return responseStr;
}

function getQueue(strResponse) {
   let arrayResponse = strResponse.split(';');
   arrayResponse.pop();
   arrayResponse.forEach(e => {
      let entity = new queueEntity(e.split('/')[0], e.split('/')[1]);
      if (!Number(e.split('/')[1])) {
         queue.push(entity);
      } else {
         setTimeout(() => {
            document.querySelector(`.${e.split('/')[0]}`).innerHTML += `<h2><-- Занимается</h2>`;
         }, 250);
         sessionContinues = true;
      }
   });
   return queue;
}

function showQueue() {
   const sessionQueueRequest = new XMLHttpRequest();
   sessionQueueRequest.onload = () => {
      getQueue(sessionQueueRequest.responseText);
   }
   sessionQueueRequest.open("GET", "../php/courses.php?q=" + 'show_queue', false);
   sessionQueueRequest.send();
}

async function apiTelegramMessage(action) {
   const token = "secret";
   const chat_id = "-4643503706";
   let message = '';
   let name = '';
   let nextName = queue[0] ? queue[0]['name']: '';

   document.cookie.split(';').forEach(e => {
      if (e.trim().split('=')[0] == 'adminLogin') {
         name = e.trim().split('=')[1];
      }
   });

   if (action == 'start_session') {
      message = `${name} начал просмотр курсов.%0A%0AНикому не заходить на SkilBox!!!`;
   } else if (action == 'end_session') {
      if (!nextName) {
         message = `${name} закончил просмотр курсов.%0A%0AТеперь можно заходить заходить на SkilBox!!!%0A%0AВ очереди никого нет!!! Свободно!!`;
      } else {
         message = `${name} закончил просмотр курсов.%0A%0AТеперь можно заходить заходить на SkilBox!!!%0A%0AСледующий в очереди ${nextName}!!!`;
      }
   }

   const url = "https://api.telegram.org/bot"+token+"/sendMessage?chat_id="+chat_id+"&text="+message;
   await fetch(url);
}

// document.querySelector('.video_button').addEventListener('click', e => {

//    let form_data = new FormData();
//    form_data.append('file', video.files[0]);

//    const xhttp = new XMLHttpRequest();
//    xhttp.onload = () => {
//       console.log(xhttp.responseText);
//    }
//    xhttp.open("POST", "../php/course.php", false);
//    xhttp.send(form_data);
// });

if (location.pathname == '/polefeel/pages/course/DataSince.html' && isAdmin()) {
   const httpc = new XMLHttpRequest();
   httpc.onload = () => {
      document.querySelector('.vidos').innerHTML = httpc.response;
   }
   httpc.open("GET", "../php/getVideo.php", false);
   httpc.send();
}

showQueue();
setTimeout(() => {
   queue.forEach((e, index) => {
      queueBox.innerHTML += `<div class="queue_entity entity_${index}" style="display: flex; gap: 1vw;"><h2>${index+1}</h2><p>${e['name']}</p></div>`;
   });
   queueBox.innerHTML += `<button type="btn" class="add_queue_entiti_button">Встать в очередь</button>`;
}, 250);

console.log(queue);

workSession.innerHTML = `
   <div class="all_admin_for_sessions">
      ${showAdmins()}
      <button type="btn" class="start_session_button">Начать занятие</button>
      <button type="btn" class="end_session_button" style="display: none;">Закончить занятие</button>
   </div>
`;

const sessionRequest = new XMLHttpRequest();
sessionRequest.onload = () => {
   console.log(sessionRequest.responseText);
};

document.cookie.split(';').forEach(e => {
   if (e.trim().split('=')[0] == 'startSessionDate') {
      startDate = new Date(e.trim().split('=')[1])
      document.querySelector('.start_session_button').style.display = 'none';
      document.querySelector('.end_session_button').style.display = 'block';
   }
})


document.querySelector('.start_session_button').addEventListener('click', (e) => {
   if (!sessionContinues) {
      e.target.style.display = 'none';
      document.querySelector('.end_session_button').style.display = 'block';
   
      let date = new Date(Date.now() + 86400e3);
      date = date.toUTCString();
      document.cookie = `startSessionDate=${Date(Date.now())}; path=/; expires=${date}`;
      apiTelegramMessage('start_session');
      sessionRequest.open("POST", "../php/courses.php?q=" + 'start_session', false);
      sessionRequest.send();

      location.reload();
   } else {
      e.target.style.display = 'none';
      e.target.parentElement.innerHTML += '<h1>Занято</h1>';
   }
});

document.querySelector('.end_session_button').addEventListener('click', (e) => {
   e.target.style.display = 'none';
   document.querySelector('.start_session_button').style.display = 'block';

   let startDate, endDate, time;
   let date = new Date(Date.now() + 86400e3);
   date = date.toUTCString();
   
   document.cookie = `endSessionDate=${Date(Date.now())}; path=/; expires=${date}`;

   document.cookie.split(';').forEach(e => {
      if (e.trim().split('=')[0] == 'startSessionDate') {
         startDate = new Date(e.trim().split('=')[1])
      } else if (e.trim().split('=')[0] == 'endSessionDate') {
         endDate = new Date(e.trim().split('=')[1])
      }
   })

   let hours = Math.trunc(Math.floor(endDate.getTime()-startDate.getTime())/(1000*60*60));
   let minutes = Math.trunc(Math.floor(endDate.getTime()-startDate.getTime())/(1000*60)) - hours*60;
   let seconds = Math.floor(endDate.getTime()-startDate.getTime())/(1000) - minutes*60;

   time = `${hours}:${minutes}:${seconds}`;
   document.cookie = `sessionTime=${time}; path=/; expires=${date}`;
   //post coments for anyones
   document.cookie = queue[0] ? `firstQueue=${queue[0]['name']}; path=/; expires=${date}`: 'none';
   apiTelegramMessage('end_session');
   sessionRequest.open("POST", "../php/courses.php?q=" + 'end_session', false);
   sessionRequest.send();
   
   // location.reload();
});


setTimeout(() => {
   queue.forEach(e => {
      document.cookie.split(';').forEach(cook => {
         if (cook.trim().split('=')[0] == 'adminLogin') {
            if (cook.trim().split('=')[1] == e['name']) {
               document.querySelector('.add_queue_entiti_button').style.display = 'none';
            }
         }
      });
   });

   document.querySelector('.add_queue_entiti_button').addEventListener('click', e => {
      const addEntityQueueRequest = new XMLHttpRequest();
      addEntityQueueRequest.open("POST", "../php/courses.php?q=" + 'add_entity_queue', false);
      addEntityQueueRequest.send();

      location.reload();
   });
}, 251);
