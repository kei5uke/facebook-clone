const button = document.getElementById('update_home');
button.addEventListener('click', function(e) {
  console.log('button was clicked');

  fetch('/update', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('Click was recorded');
        return response.json();
      }
      throw new Error('Request failed.');
    })
    .then(function(data){
        console.log(data.length);
        if(data.length != 0){
            for(var i=0; i<data.length; i++){
                document.getElementById("home_posts").innerHTML += 
                `<div class="post">
                    <div class="user_info">
                        <img src="/images/user_pic.png" alt="userpic">
                        ${data[i].un} &nbsp;<span class="post_time">${data[i].time}</span>
                    </div>
                    <div class="post_info">
                        <p>${data[i].post}</p>
                    </div>
                </div>`
            }
        } return;
        
    })
    .catch(function(error) {
      console.log(error);
    });
});

function send_friend_request(id){
  document.getElementById("form_"+id).submit();
  const element = document.getElementById(id)
  element.parentNode.removeChild(element);
}

if (window.performance) {
    if (window.performance.navigation.type === 1) {
      fetch('/refresh', {method: 'POST'})
        .then(function(response){
            if(response.ok){
                var div = document.getElementById('post');
                div.parentNode.removeChild(div);
            }
        })
        
        .catch(function(error) {
            console.log(error);
        });
    }
  }
// setInterval(function() {
//     fetch('/update', {method: 'GET'})
//       .then(function(response) {
//         if(response.ok) return response.json();
//         throw new Error('Request failed.');
//       })
//       .then(function(data) {
//         console.log(data);
//       })
//       .catch(function(error) {
//         console.log(error);
//       });
//   }, 1000);