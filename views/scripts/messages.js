$(document).ready(function() {
	var SERVER_URL = "/feed";
	var REFRESH_PERIOD = 30000;
	var ID = 0;

	var getFeedData = function(){
		$.ajax({
			url: SERVER_URL,
			type: "GET"
		}).done(function(data) {
			console.log(data);
			for(var i = 0; i < data.length; i++){
				generateHTML(data[i]);
			}
		});
	};
	
	var generateHTML = function(data) {
		var currentID = ID;
		var rowHTML = 
		"<div class=\"message\" id=\"message_\"" + currentID + ">"
					+ "<div class=\"messageleft\">"
						+ "<input type=\"checkbox\" name=\"checkID\" value=\"checkID\" style=\"margin: 20px 0 0 24px; padding:0;\">"
						+ "<p>5 min</p>"
					+"</div>"
					+"<div class=\"messageright\">"
						+"<img src=" + data.user_image_url + " height=\"60\" width=\"60\" title=\"twitpic\" alt=\"twitpic\" />"
						+"<div class=\"tweet\">"
							+"<h1>" + data.user_name + "<i>@" + data.user_handle + "</i></h1>"
							+"<h2>" + data.message + "</h2>"
						+"</div>"
					+"</div>"
               +"</div>";
			   
		$("#messagecontainer").prepend(rowHTML);
		$("#message_" + currentID).fadeIn();
		ID++;
	};
	getFeedData();
	setInterval(getFeedData, REFRESH_PERIOD);
});