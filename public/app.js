
$(document).on("click", "#order", function() {
	console.log($(this));
})

$(document).on("click", "#user-submit", function(event) {
	event.preventDefault();
	var username = $("#username").val().trim();
	$.ajax({
		method: "GET",
		url: "/user/" + username
	})
		.then(function(data) {
			if (data.length != 0) {
				console.log(data);
				alert("Welcome back " + username + "!");
				displayOrderForm(data[0]._id);
			}
			else {
				alert("Looks like you're new here! Welcome!");
				createNewUser(username);
			}
		})
})

function createNewUser(username) {
	$.ajax({
		method: "POST",
		url: "/user/" + username
	})
		.then(function(data) {
			displayOrderForm(data._id);
		})
		.catch(function(error) {
			console.log(error);
		})
};

function displayOrderForm(id) {
	var url = "/orders/" + id;
	$("#orderform").attr("action", url);
	$("#orderform").attr("style", "display:block");
	$("#show-table-button").attr("style", "display:block");
}

$(document).on("click", "#order-submit", function() {
	var url = $("#orderform").attr("action");
	var size = $("#size").val();
	console.log(size);
	var toppings = [];
	var checked = $(".form-check-input");
	for (var i = 0; i < checked.length; i++) {
		if (checked[i].checked) {
			toppings.push(checked[i].value);
		}
	}
	var date = new Date();
	date.toUTCString()
	var body = {
		date: date,
		size: size,
		toppings: toppings,
		status: "ordered"
	}
	console.log(body);
	// console.log(toppings);
	$.ajax({
		method: "POST",
		url: url,
		data: body
	})
		.then(function(results) {
			console.log(results);
			alert("Thanks for your order! Click the button below to track it.");
		})
		.catch(function(err) {
			console.log(err);
		})
})

$(document).on("click", "#show-table-button", function(event) {
	event.preventDefault();
	$("#order-table").attr("style", "display:block");
	$("#show-table-button").text("Refresh");
	initializeTable();
	const url = $("#orderform").attr("action");
	console.log(url);
	$.ajax({
		method: "GET",
		url: url
	})
		.then(function(orders) {
			console.log(orders);
			for (var i = 0; i < orders.length; i++) {
				$.ajax({
					method: "GET",
					url: "/order/" + orders[i]
				})
					.then(function(order) {
						console.log(order);
						createUserTableRow(order);
					})
					.catch(function(err) {
						console.log(err)
					})
			}
		})
		.catch(function(error) {
			console.log(error);
		})
})

function initializeTable() {
	$("#order-table").empty();
	var thDate = "<th>Order Time</th>";
	var thSize = "<th>Size</th>";
	var thToppings = "<th>Toppings</th>";
	var thStatus = "<th>Status</th>";
	var thRow = "<tr>"+thDate+thSize+thToppings+thStatus+"</tr>";
	$("#order-table").append(thRow);
}

function createUserTableRow(order) {
	var date = "<td>" + order.date + "</td>";
	var size = "<td>" + order.size + "</td>";
	var toppings = "<td>" + order.toppings.join(", ") + "</td>";
	var status = "<td>" + order.status + "</td>";
	var row = "<tr>"+date+size+toppings+status+"</tr>";
	$("#order-table").append(row);
}
