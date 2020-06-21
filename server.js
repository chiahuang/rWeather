const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const apiKey = '17bcf4ff55364b1195bf51346794aad6';

var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	console.log('get method ', weatherContent);
	res.render('index', Object.assign({}, {weather: null, degree: null, city: null, error: null, sound: null, attribute: null, backgroundimage: null}, weatherContent));
	//res.send('Hello World!');
})

app.get('/weather', function(req, res) {
	console.log('CALLING GET METHOD');
	//console.log(req.body);
	let city = req.query.city;

	//this is template literal `````````
	let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
	console.log(url);
	request(url, function(error, response, body) {
		if(error) {
			console.log('post err ', weatherContent);
			res.render('index', Object.assign({}, {weather: null, degree:null, city: null, error: 'Error. Please try again!', sound: null, attribute: null, backgroundimage: null}, weatherContent));
		}
		else {
			let json_body = JSON.parse(body);
		  console.log(json_body);

			let currentStatusCode = json_body.cod;
			if(currentStatusCode === 200) {
				let weatherType = json_body.weather[0].main;
				let weatherText = weatherType;
				// let weatherText = json_body.weather[0].description.charAt(0).toUpperCase() + json_body.weather[0].description.slice(1);
				let degree = Math.round(json_body.main.temp) + '°F';
				let city = json_body.name;
				//let weatherText = `${weatherType} ${json_body.main.temp} °F degrees ${json_body.name}`;
				//console.log(json_body.weather[0].main);
				//IconGen(json_body.weather[0].main);
				console.log(weatherType);
				weatherContentCopy = Object.assign({}, weatherContent);
				weatherType = (weatherType.toLowerCase() in differentType ? differentType[weatherType.toLowerCase()] : weatherType.toLowerCase());

				weatherContentCopy[weatherType] = '';
				let attribute = "loop autoplay";
				let sound = `src=/sound/${weatherType}_sound.mp3`
				let backgroundimage = `background-image: url(../image/${weatherType}.gif);`
				console.log('post response ', weatherContentCopy);
				console.log($('.body-container'));
				// $('.body-container').css("background-image", "url(../image/thunderstorm.gif)");
				res.render('index', Object.assign({}, {weather: weatherText, degree: degree, city: city, error: null, sound: sound, attribute: attribute, backgroundimage: backgroundimage}, weatherContentCopy));

			}
			else {
				console.log('post not exist ', weatherContent);
				res.render('index', Object.assign({}, {weather: null, degree: null, city: null, error: 'City does not exist!', sound: null, attribute: null,  backgroundimage: null}, weatherContent) );
			}

		}
	})

	//res.render('index');
})

var differentType = {'mist': 'rain', 'drizzle':'rain', 'haze': 'clouds', 'fog':'clouds', 'sunny':'clear', 'smoke':'clouds'};

var weatherContent = {
	'thunderstorm': 'hide',
	'clouds': 'hide',
	'snow': 'hide',
	'clear': 'hide',
	'rain': 'hide'
};

app.listen(8082, function () {
	console.log('Listening on DEVenv localhost:8082 or QAenv 192.168.1.240:8082')
})
