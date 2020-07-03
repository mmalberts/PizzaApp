const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/pizzaapp", {useNewUrlParser: true});

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
	console.log("Connected!")
	// connection.collections.customers.drop();
	// connection.collections.orders.drop();
});

db.Customer.find({})
	.then(function(result) {
		console.log(result);
	})
	.catch(function(err) {
		console.log(err);
	});

var customer_id = ""

app.get("/user/:username", function(req, res) {
	db.Customer.find({username: req.params.username}, function(err, data) {
		if (err) {
			res.json(err);
		}
		else {
			res.json(data);
		}
	})
})

app.post("/user/:username", function(req, res) {
	db.Customer.create({username: req.params.username})
		.then(function(dbCustomer) {
			res.json(dbCustomer);
		})
		.catch(function(err) {
			res.json(err);
		});
});

app.post("/orders/:id", function(req, res) {
	db.Order.create(req.body)
		.then(function(dbOrder) {
			return db.Customer.findOneAndUpdate({_id: req.params.id}, {$push: {orders: dbOrder._id}}, {new: true});
		})
		.then(function(dbCustomer) {
			// console.log(dbCustomer);
			res.json(dbCustomer);
		})
		.catch(function(err) {
			res.json(err);
		})
});

app.get("/orders/:id", function(req, res) {
	db.Customer.find({_id: req.params.id}, function(err, data) {
		if (err) {
			res.json(err);
		}
		else {
			var orders = data[0].orders;
			res.send(orders);
		}
	})
});

app.get("/order/:id", function(req, res) {
	db.Order.findById(req.params.id, function(err, data) {
		if (err) {
			res.json(err);
		}
		else {
			console.log("data!");
			console.log(data);
			res.send(data);
		}
	})
})


app.listen(PORT, function() {
	console.log("App running on port " + PORT + "!");
});