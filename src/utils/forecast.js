const request = require('request');

const forecast = (latitude, longitude, callback) => {
	const url = 'https://api.darksky.net/forecast/0a66aae43f53b833b90117d8a6e9cf49/' + latitude + ',' + longitude + '?units=us';

	request({url, json: true}, (error, {body}) => {
		if(error){
			callback('Unable to connect to weather service', undefined);
		}else if(body.error){
			callback('Unable to find location', undefined);
		}else{
			callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' degrees. The high for the day will be ' + body.daily.data[0].temperatureHigh + '. The low for the day will be ' + body.daily.data[0].temperatureLow + '. There is a ' + (body.currently.precipProbability * 100) + '% chance of rain.');
		}
	});

};


module.exports = forecast;