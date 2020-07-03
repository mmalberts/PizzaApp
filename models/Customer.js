var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
	username: {
		type: String,
		unique: true
	},
	orders: [
		{
			type: Schema.Types.ObjectId,
			ref: "Order"
		}
	]
});

var Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;