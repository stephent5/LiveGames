/************************************************************************************************************************************************
User object to store details returned back from Facebook Login and log to database
************************************************************************************************************************************************/
function User(data){
	this.userid = 0;
	this.fbuserid = data.id;
	this.name = data.name;
	this.first_name = data.first_name;
	this.last_name = data.last_name;
	this.link = data.link;
	this.username = data.username;
	this.locale = data.locale;
	this.gender = data.gender; 
	this.loggedIn = false;
	this.credits = 0;
	this.birthday = data.birthday;
	this.email = data.email;
	this.timezone = data.timezone;
	this.updated_time = data.updated_time;
	this.verified = data.verified;
	this.profilepic = "https://graph.facebook.com/" + data.id + "/picture"
	this.currentfixtureid = 0;
	this.extradata = null;
	this.level = 0; //we are going to use this param to determine if the user is the administrator or not
}

function FriendUser(fbuserid, name) {
    this.userid = 0;
    this.fbuserid = fbuserid;
    this.name = name;
    this.first_name = null;
    this.last_name = null;
    this.link = null;
    this.username = null;
    this.locale = null;
    this.gender = null;
    this.loggedIn = false;
    this.credits = 0;
    this.birthday = null;
    this.email = null;
    this.timezone = null;
    this.updated_time = null;
    this.verified = null;
    this.profilepic = null;
}


//User.prototype.logUserDetails = function (callback) { 
//	$.ajax({
//	      headers: { "Content-Type": "application/json", "Accept": "application/json" },
//		  url: WS_URL_ROOT + "/Login/Login",
//		  type: "GET",
//	      data: ({fbuserid : this.fbuserid, first_name: this.first_name, last_name: this.last_name, link: this.link, locale : this.locale, gender:this.gender  }),
//		  dataType: "json",
//		  success: function (response) {

//		      if (callback instanceof Function) {
//		          window.sessionStorage.setItem("facebookuser", $.toJSON(response));
//		        'callback(response);
//		    }
//		  }
//		});
//};

//function placeBet(callback) {
//    $.ajax({
//        url: WS_URL_ROOT + "/Game/PlaceBet",
//        type: "POST",
//        data: JSON.stringify(Currentbet),
//        dataType: "json",
//        contentType: "application/json: charset=utf-8",
//        //success: BetComplete(),
//        success: function (response) {
//            if (callback instanceof Function) {
//                callback(response);
//            }
//        },
//        error: AjaxFail()
//    });
//}