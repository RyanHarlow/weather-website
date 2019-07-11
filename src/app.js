const express = require('express');
const path = require('path');
const app = express();
const hbs = require('hbs');
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');
const port = process.env.PORT || 3000;

//define paths for express config

//define public directory for static html pages, img, scripts, css
const publicDirPath = path.join(__dirname, '../public');
//define views path
const viewsPath = path.join(__dirname, '../templates/views');
//define partials path
const partialsPath = path.join(__dirname, '../templates/partials');


//set up handlebars engine and views location
app.set('view engine', 'hbs');
//tell express to use view paths for views
app.set('views', viewsPath);
//tell express where partials are located
hbs.registerPartials(partialsPath);

//set up static directory to serve
app.use(express.static(publicDirPath));

app.get('', (req, res) => {
	res.render('index', {title: 'Weather', name: 'Ryan Harlow'});
});

app.get('/about', (req, res) => {
	res.render('about', {title: 'About Me', name: 'Ryan Harlow'});
});

app.get('/help', (req, res) => {
	res.render('help', 
			   {
				message: 'This is the help page',
			   	title: 'Help',
			   	name: 'Ryan Harlow'
				});
});


app.get('/weather', (req, res) => {
	if(!req.query.address){
		return res.send({
			error: 'You must provide an address'
		});
	}
	geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
		if(error){
			return res.send({ error });
		}
		
		forecast(latitude, longitude, (error, forecastData) => {
			if(error){
				return res.send({ error });
			}
			res.send({
				forecast: forecastData,
				location,
				address: req.query.address
			});
		});
	});
});

app.get('/products', (req, res) => {
	if(!req.query.search){
		return res.send({
			error: 'You must provide a search term'
		});
	}
	console.log(req.query.search);
	res.send({
		products: []
	});
});

app.get('/help/*', (req, res) => {
	res.render('404', {
		title: '404',
		errorMessage: 'Help Article Not Found',
		name: 'Ryan Harlow'
	});
});

app.get('*', (req, res) => {
	res.render('404', {
		title: '404',
		errorMessage: 'Page Not Found',
		name: 'Ryan Harlow'
	});
});

app.listen(port, () => {
	console.log("server running on port " + port);
});