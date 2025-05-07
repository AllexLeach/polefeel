// import eblans from './people.js';
const andminHeaderButton = document.querySelector('.admin_panel').childNodes[1];
const adm = document.querySelector('.admin_panel').childNodes[3];
const adminLogInCard = document.querySelector('.admin_login_card');
let postArrayQuery = [];
let admins = [];

function admin(login, password) {
   this['login'] = login;
   this['password'] = password;
}

function getAdmins(adminInfo) {
   let adminf = adminInfo.split(';');
   adminf.pop();
   adminf.forEach(e => {
      const adminO = new admin(e.split('/')[0], e.split('/')[1]);
      admins.push(adminO);
   });
}

function validateAdmins(admi, logus) {
   for (let i=0; i<admi.length; i++) {
      if (admi[i]['login'] == logus[0] && admi[i]['password'] == logus[1]) {
         return true;
      }
   }
   return false;
}

function everywhereAdmin(e, adminPerson) {
   // location.search='?admin';
   // e.preventDefault();
   let date = new Date(Date.now() + 86400e3);
   date = date.toUTCString();
   document.cookie = 'admin=true; path=/; expires=' + date;
   document.cookie = `adminLogin=${adminPerson[0]}; path=/; expires=${date}`;
}

async function getEblanModulePeople() {
   let ebl = [];
   ebl = await import('./people.js').then(module => {
      return module.default;
   });
   return ebl;
}
// eblan -> all pages
function deleteInfo(locate, info) {
   const xmhttp = new XMLHttpRequest();
   xmhttp.onload = () => {
      console.log(xmhttp.responseText);
      location.reload();
   }
   xmhttp.open("POST", "../php/delete.php?q=" + locate + "/" + info, false);
   xmhttp.send();
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


const xhttp = new XMLHttpRequest();
xhttp.onload = () => {
   getAdmins(xhttp.responseText);
}

if (location.pathname.split('/').length == 3) {
   xhttp.open("POST", "./php/admin.php?q=" + 'logIn/', false);
   xhttp.send();
} else if (location.pathname.split('/').length == 4) {
   xhttp.open("POST", "../php/admin.php?q=" + 'logIn/', false);
   xhttp.send();
}


andminHeaderButton.addEventListener('click', () => {
   adminLogInCard.style.display = 'flex';
});

document.querySelector('.login_button').addEventListener('click', e => {
   adminLogInCard.style.display = 'none';
   // e.preventDefault();

   document.querySelectorAll('.admin_input').forEach(el => {
      postArrayQuery.push(el.value);
   });

   if (validateAdmins(admins, postArrayQuery)) {
      everywhereAdmin(e, postArrayQuery);
   }

   document.querySelectorAll('.admin_input').forEach(e => {
      e.value = '';
   });
});

adminLogInCard.addEventListener('click', e => {
   if (e.target == adminLogInCard) {
      adminLogInCard.style.display = 'none';
   }
});

if (isAdmin()) {
   andminHeaderButton.style.display = 'none';
   adm.style.display = 'block';
   setTimeout(() => {
      const ad = document.querySelectorAll('.admin_element');
      if (ad) {
         ad.forEach(e => {
            e.style.display = 'block';
         });
      }
   }, 250);
   
   if (location.pathname == '/polefeel/pages/people.html') {
      getEblanModulePeople().then(eblans => {
         setTimeout(() => {
            const deleteButton = document.querySelectorAll('.admin_element__delete_button');
            deleteButton.forEach(eblansdeleteButton => {
               eblansdeleteButton.addEventListener('click', eblanchik => {
                  deleteInfo('people', eblans[eblanchik.target.id][0]);
               });
            });
         }, 500);
      });
   } else if (location.pathname == '/polefeel/pages/course.html') {                             // new function
      document.querySelector('.add_video').style.display = 'flex'
      setTimeout(() => {
         document.querySelectorAll('.delete_video').forEach(e => {
            e.style.display = 'block';
            e.addEventListener('click', () => {
               deleteInfo('course', e.name);
            });
         });
      }, 500);
   }
}