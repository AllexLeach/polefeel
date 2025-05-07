const video = document.querySelector('.video_input');

document.querySelector('.video_button').addEventListener('click', e => {

   let form_data = new FormData();
   form_data.append('file', video.files[0]);

   const xhttp = new XMLHttpRequest();
   xhttp.onload = () => {
      console.log(xhttp.responseText);
   }
   xhttp.open("POST", "../php/course.php", false);
   xhttp.send(form_data);
   // $.ajax({
   //    url: "../php/course.php",
   //    dataType: 'script',
   //    cache: false,
   //    contentType: false,
   //    processData: false,
   //    data: form_data,
   //    type: 'post'
   // });
});

const httpc = new XMLHttpRequest();
httpc.onload = () => {
   document.querySelector('.vidos').innerHTML = httpc.response;
}
httpc.open("GET", "../php/getVideo.php", false);
httpc.send();