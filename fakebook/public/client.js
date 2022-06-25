
const button = document.getElementById('update_home');
if(button){
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
}


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

const search = document.getElementById('search_form');
if (search){
  search.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e){
 

  e.preventDefault();
  const form = e.currentTarget;
  const url = "/search_user";
  try{
    
    const formData = new FormData(form);
    const responseData = await postFormDataAsJson({url, formData});
    console.log({responseData});
    if(responseData.length != 0){
      for(var i=0; i<responseData.length; i++){
          document.getElementById("search").innerHTML += 
          `<div class="search_result">
              <div class="user_info">
                  <img src="/images/user_pic.png" alt="userpic">
                  ${responseData[i].username} &nbsp;
                  <form method="POST" action="/add_friend" id="form_${responseData[i].username}">
                    <input type="hidden" name="username" value="${responseData[i].username}">
                    <button type="button" onclick="send_friend_request('${responseData[i].username}')">FOLLOW</button>
                  </form>
              </div>
          </div>`
      }
     } return;
  }catch(err){
    console.log(err);
  }
}

async function postFormDataAsJson({ url, formData }) {
  const plainFormData = Object.fromEntries(formData.entries());
	const formDataJsonString = JSON.stringify(plainFormData);
  const fetchOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: formDataJsonString,
	};

	const response = await fetch(url, fetchOptions);

	if (!response.ok) {
		throw new Error("error");
	}

	return response.json();
}


function openPost() {
  document.getElementById("FormPost").style.display = "block";
}
function closePost() {
  document.getElementById("FormPost").style.display = "none";
}