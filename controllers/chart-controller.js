var mongoose = require('mongoose');
var config = require("../config/config.js");
var Data = require("../models/data.js");
var _ = require("underscore");

var ChartController = {
	getCurrentData: function(callback){
		var results = {};
		results.labels = [];
		results.datasets = [];
		results.datasets.push({
			fillColor : "#CAC546",
			strokeColor : "#333",
			pointColor : "rgba(151,187,205,1)",
			pointStrokeColor : "#333",
			data: []
		});

		Data.find(function(error, result){
			if(error){
				console.error(error);
				return null;
			}else{
				var data = [];
				var labels = [];
				if(result && result.length){
					for(var i = 0; i < result.length; i++){
						if(!_.contains(labels, result[i].terms[0])){
							data.push({
								label: result[i].terms[0],
								count: 0
							});
							labels.push(result[i].terms[0]);
						}else{
							for(var j = 0; j < data.length; j++){
								if(data[j].label === result[i].terms[0]){
									data[j].count++;
								}
							}
						}
					}

					for(var k = 0; k < data.length; k++){
						results.labels.push(data[k].label);
						results.datasets[0].data.push(data[k].count);
					}
				}

				callback(results);
			}
		});
	}
};

// (function main(){
// 	/* connect to Mongo when the app initializes */
// 	mongoose.connect(config.DATABASE_URL);
// 	ChartController.getCurrentData();
// })();


module.exports = ChartController;