$(document).ready(function() {
	var SERVER_URL = "/feed";
	var REFRESH_PERIOD = 20000;
	var ID = 0;
	var lastId;

	var getFeedData = function(bootstrap, _id){
		$.ajax({
			url: bootstrap ? SERVER_URL: SERVER_URL + "?_id=" + _id,
			type: "GET"
		}).done(function(data) {
			console.log(data);
			var timeout = 100;
			for(var i = 0; i < data.length; i++){
				(function(index){setTimeout(function(){
					generateHTML(data[index]);
				}, timeout)})(i);
				timeout+= 500;
			}
			if(data && data.length > 0){
				lastId = data[i - 1]._id;
			}
		});
	};
	
	var generateHTML = function(data) {
		var currentID = ID;
		var rowID = "message_" + currentID;
		var rowHTML = 
		"<div class=\"message\" id=" + rowID + " style=\"display:none;border-radius:8px\">"
					+ "<div class=\"messageleft\">"
						+ "<input type=\"checkbox\" name=\"checkID\" value=\"checkID\" style=\"margin: 20px 0 0 24px; padding:0;\">"
						+ "<p>" + getTimeAgo(data.timestamp) + " mins" + "</p>"
					+"</div>"
					+"<div class=\"messageright\">"
						+"<img src=" + data.user_image_url + " height=\"60\" width=\"60\" title=\"twitpic\" alt=\"twitpic\" />"
						+"<div class=\"tweet\">"
							+"<h1 style=\"font-weight:bold;margin-top:2%\">" + data.user_name + "<i>@" + data.user_handle + "</i></h1>"
							+"<h2>" + data.message + "</h2>"
						+"</div>"
					+"</div>"
               +"</div>";
			   
		$("#messagecontainer").prepend(rowHTML);
		$("#message_" + currentID).fadeIn("slow");
		ID++;
	};
	getFeedData(true);
	setInterval(function(){
		getFeedData(false, lastId);
	}, REFRESH_PERIOD);

	var logoutHandler = function(){
		var LOGOUT_URL = "/logout";

		$.ajax(LOGOUT_URL, {
			type: "POST"
		}).done(function(){
			window.location = "/login";
		});
	};

	var getTimeAgo = function(timestamp){
		var current = new Date();
		var tweetDate = new Date(timestamp);

		var MILLIS_IN_MIN = 60 * 1000;
		var minsAgo = (current.getTime() - tweetDate.getTime())/MILLIS_IN_MIN;

		return minsAgo <= 0 ? 0 : Math.floor(minsAgo);
	};

	var homeHandler = function(){
		window.location = "/home";
	};

	/* All event handler assignments go in here */
	var assignEventHandlers = function(){
		$("#logout_link").click(logoutHandler);
		$("#home_link").click(homeHandler);
	};

	assignEventHandlers();

	$(document).on("click", ".stopBot", function(){
			$.ajax("/stop-twitter-bot", {
				type: "POST",
				data: {
					id: $(this).attr("id")
				}
			}).done(function(data){
				if(data){
					console.log(data);
				}
			});
		});

		$("#submit-search-btn").click(function(){
			$.ajax("/start-twitter-bot", {
				type: "POST",
				data: {
					source : "TWITTER",
					searchTerm: $("#search-term").val()
				}
			}).done(function(data) {
    			if(data){
    				$("#bots").append("<span>Started search bot for [" + $("#search-term").val() + "] </span>");
    				$("#bots").append("<input type=\"button\" id=" + data.id + " class=\"stopBot\" value=\"Stop\"/>");
    				$("#bots").append("<br>");
    			}
    		});
	});

	//Get context with jQuery - using jQuery's .get() method.
	var ctx = $("#myChart").get(0).getContext("2d");
	

	var getChartData = function(){
		$.ajax({
			url: "/trends",
			type: "GET"
		}).done(function(data) {
			console.log(data);
			//This will get the first returned node in the jQuery collection.
			var myNewChart = new Chart(ctx).Radar(data, {
				scaleLineColor: "#999",
				angleLineColor : "#999",
				pointLabelFontSize : 16,
				pointLabelFontStyle : "bold"
			});	
		});
	};

	getChartData();
	setInterval(function(){
		getChartData();
	}, REFRESH_PERIOD);
});