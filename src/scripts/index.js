
function LoadDashboard(){
    if($.cookie('userid')){
         $.ajax({
        method : 'get',
        url : `../../public/pages/user_dashboard.html`,
        success : (response) =>{
                $("section").html(response);
                $("#lblUser").text($.cookie('userid'));

                $.ajax({
                    method : 'get',
                    url : `http://127.0.0.1:5000/appointments/${$.cookie('userid')}`,
                    success : (appointments =>{
                        appointments.map(appointment =>{
                                        $(`<div class="card mb-3 border-success  shadow-sm">
                                               <div class="card-body ">
                                              <h5 class="card-title text-success">${appointment.title}</h5>
                                             <p class="card-text">${appointment.description}</p>
                                             <div class="d-flex justify-content-between align-items-center">
                                                    <span class="badge bg-secondary">
                                                        ${appointment.date.slice(0, appointment.date.indexOf('T'))}
                                                    </span>
                                                        <div>
                                                            <button value=${appointment.appointment_id} id="btnEdit" class="btn btn-sm btn-outline-success me-2">
                                                                <i class="bi bi-pencil-fill"></i> Edit
                                                            </button>
                                                            <button value=${appointment.appointment_id} id="btnDelete" class="btn btn-sm btn-outline-danger">
                                                                <i class="bi bi-trash"></i> Delete
                                                            </button>
                                                        </div>
                                               </div>
                                           </div>
                                        </div>`).appendTo("#appointments");

                        })
                    })
                })
      }
    })
    }else{
            $.ajax({
            method : 'get',
            url : `../../public/pages/${page_name}`,
            success : (response) =>{
                $("section").html(response);
            }
          })
        }

} 

function LoadPage(page_name){
    $.ajax({
            method : 'get',
            url : `../../public/pages/${page_name}`,
            success : (response) =>{
                $("section").html(response);
            }
          })   
}

$(function(){
    LoadPage("home.html");

   $(document).on('click', '#btnNewUser', () =>{
     LoadPage('new_user.html');
   })
   

   $(document).on('click' , '#btnSignin', ()=>{
      LoadPage('user_login.html');
   })

   $(document).on('click', '#btnExist' ,() =>{
     LoadPage('user_login.html');
   })

   $(document).on('click', '#btnRegister',() =>{
      
       var user = {
            user_id : $("#user_id").val(),
            user_name: $("#user_name").val(),
            password: $("#password").val(),
            mobile: $("#mobile").val()
        }
        
        if(!user.user_id || !user.user_name || !user.password || !user.mobile){
            alert('All fields are Required')
            return;
        }
        
          

        $.ajax({
            method: "post",
            url: `http://127.0.0.1:5000/register-user`,
            data: user,
            success:()=>{
                alert('User Registered');
            }
        })
        LoadPage("user_login.html");
    })

   $(document).on('click', '#btnLogin' , () =>{
     var user_id = $('#user_id').val().trim();
     
     if(!user_id || !$('#password').val().trim()){
        alert('User id and password are required');
        return;
     }

       $.ajax({
        method : 'get', 
        url : `http://127.0.0.1:5000/users/${user_id}`,
        success : (userDetails)=>{
            if(userDetails){
                if($('#password').val() === userDetails.password){
                    $.cookie('userid', $("#user_id").val());
                    LoadDashboard();
                }else{
                    alert('Invalid Password');
                }
            }else{
                alert(`User Not Found`);
            }
        }
       })
   })

   $(document).on('click', '#btnSignout', () =>{
     $.removeCookie('userid');
     LoadPage('home.html');
   })

   $(document).on('click', '#btnAddAppointment', () =>{
       LoadPage('add_appointment.html');
   })

   $(document).on('click', '#btnCancel' ,() => {
     LoadPage('user_dashboard.html');
   })

   $(document).on('click', '#btnAdd',() =>{
     
    var appointment = {
        appointment_id : $("#appointment_id").val(),
        title : $("#title").val(),
        description : $("#description").val(),
        date : $("#date").val(),
        user_id : $.cookie("userid")
    }
    $.ajax({
        method: "post",
        url : `http://127.0.0.1:5000/add-appointment`,
        data: appointment,
        success : () =>{
            LoadDashboard();
            alert("Appointment Added...")
        }
    })
  })

  $(document).on("click", "#btnEdit", (e) =>{
      LoadPage('edit_appointment.html');
     
    $.ajax({
        method : 'get',
        url : `http://127.0.0.1:5000/appointment/${e.target.value}`,
        success : appointment => {
              $('#appointment_id').val(appointment.appointment_id),
              $('#title').val(appointment.title),
              $('#description').val(appointment.description),
              $('#date').val(appointment.date .slice(0,appointment.date.indexOf('T')))
              sessionStorage.setItem('appointment_id', appointment.appointment_id);
            }
        
    })
  })

    $(document) .on('click', '#btnCancel', () =>{
        LoadDashboard();

    })

  $(document).on('click', '#btnSave',(e) =>{
     
       var appointment = {
        appointment_id : $("#appointment_id").val(),
        title : $("#title").val(),
        description : $("#description").val(),
        date : $("#date").val(),
        user_id : $.cookie("userid")
        }

       $.ajax({
        method : 'put',
        url : `http://127.0.0.1:5000/edit-appointment/${sessionStorage.getItem("appointment_id")}`,
        data : appointment   
       })

       alert('Appointment Updated');
       LoadDashboard();
    })
 
    $(document).on('click', '#btnDelete' , (e) =>{
        
        var choice = confirm('Are you sure you want to delete this appointment?');
          if(choice){
                    $.ajax({
                    method : 'delete',
                    url : `http://127.0.0.1:5000/delete-appointment/${e.target.value}`,
                    success : () => {
                    }
                })
            }
            alert('Appointment Deleted.');
            LoadDashboard();     
    })
    
})