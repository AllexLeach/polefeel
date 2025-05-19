const ebantyai = document.querySelector('.ebantyai');
const ebantyaiInput = document.querySelectorAll('.input');
let eblanArray = [];
let eblans = [];
let eblanPostArray = [];
const shizColor = ['#b10000', '#b10000', '#b12700', '#b12700', '#b18900', '#b18900', '#b0b100', '#b0b100', '#46b100', '#46b100'];

function shizBar(shizValue, key) {
   const shiz = document.getElementById(`#shiz_${key}`);
   shiz.style.width = `${shiz.clientWidth/10*shizValue}px`;
   shiz.style.backgroundColor = shizColor[shizColor.length-shizValue];
   shiz.parentElement.style.borderColor = shizColor[shizColor.length-shizValue];
}

function eblanCards(eblan, key) {
   ebantyai.innerHTML += `<ol class="eblan_card" id="${key}">
      <li><h3>Фио:</h3><p>${eblan[0]}</p></li>
      <li><h3>Возраст:</h3><p>${eblan[1]}</p></li>
      <li><h3>Шиз:</h3><div class="shb"><div class="shiz_bar" id="#shiz_${key}"></div></div></li>
      <li><h3>Коментарий общества:</h2><p>${eblan[2]}</p></li>
      <li><div class="admin_element"><button type="btn" class="admin_element__delete_button" id="${key}">Delete</button></div></li>
   </ol>`
   
   shizBar(eblan[3], key);
}

function getEblans() {
   ebantyai.innerHTML = '';

   const xhttp = new XMLHttpRequest();
   xhttp.onload = () => {
      eblanArray = xhttp.responseText.split(';');
   }
   xhttp.open("GET", "../php/getShiz.php", false);
   xhttp.send();
   eblanArray.pop();
   eblanArray.map((e, i) => {
      eblans[i] = e.split('/');
   });

   eblans.forEach((e, key) => {
      eblanCards(e, key);
   });
}

getEblans();

document.querySelector('.submit').addEventListener('click', () => {
   ebantyaiInput.forEach(e => {
      eblanPostArray.push(e.value)
      e.value = '';
   });
   let bb = eblanPostArray.splice(2);
   eblanPostArray.push(bb.splice(1).join(''));
   eblanPostArray.push(bb.join(''));

   const xmhttp = new XMLHttpRequest();
   xmhttp.open("POST", "../php/postShiz.php?q=" + eblanPostArray.join('/'), false);
   xmhttp.send();

   eblanPostArray = [];
   getEblans();
   document.querySelector('.input_card').style.display = 'none';

   location.reload();
});

document.querySelector('.button_open__input_card').addEventListener('click', () => {
   document.querySelector('.input_card').style.display = 'flex';
});

// document.querySelector('.input_card').addEventListener('click', (e) => {

// });

document.querySelector('.input_card').addEventListener('click', (e) => {
   if (e.target == document.querySelector('.input_card')) {
      document.querySelector('.input_card').style.display = 'none';
   }
});

export default eblans;