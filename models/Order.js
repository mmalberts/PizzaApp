var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var OrderSchema = new Schema({
	date: String,
	size: String,
	toppings: [
    	{
      	type: String
    	}
  	],
  	status: String
});

var Order = mongoose.model("Order", OrderSchema);

module.exports = Order;