$(document).ready(function() {
	var SERVER_URL = "http://localhost:9000/feed";

	var getFeedData = function(){
		$.ajax({
			url: SERVER_URL,
			method: GET
		}).done(function(data) {
			console.log(data);
		});
	};
});