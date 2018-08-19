// Andrew Ton
// Assignment 7 - Train Scheduler
// app.js

// Check that DOM is loaded
$(document).ready(function() {

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyDkLfT2P3pqFymdmdfw_zyevaM7nL4mu8U",
		authDomain: "hollis-feeding.firebaseapp.com",
		databaseURL: "https://hollis-feeding.firebaseio.com",
		projectId: "hollis-feeding",
		storageBucket: "hollis-feeding.appspot.com",
		messagingSenderId: "184476627198"
	};
	firebase.initializeApp(config);

	var database = firebase.database();

	// display placeholder times
	$("#timeText").text(moment().format("HH:mm"));
	$("#dateInput").attr("placeholder", moment().format("YYYY//MM/DD"));
	$("#timeInput").attr("placeholder", moment().format("hh:mm a"));


	// On-click of submit button function, takes values and sends to FireBase
	$("#submitButton").on("click", function(event) {
		event.preventDefault();
		
		if ($("#lengthInput").val()) {
			var timeAuto = moment().subtract($("#lengthInput").val().trim(), "m").format("HH:mm");
			console.log($("#dateInput").val());
			// Grabs user input from form
			if ($("#dateInput").val() == "") {
				var date = moment().format("MM/DD");
			} else {
				var date = moment($("#dateInput").val(), "YYYY-MM-DD").format("MM/DD");
			}
			if ($("#timeInput").val() == "") {
				var time = timeAuto;
			} else {
				var time = $("#timeInput").val().trim();
			}
			var type = $("#typeInput").val().trim();
			var amount = $("#amountInput").val().trim();
			var length = $("#lengthInput").val().trim();

			// Creates local "temporary" object for holding employee data
			var newRoute = {
				date: date,
				time: time,
				type: type,
				amount: amount,
				length: length
			};

			// Send new route to FireBase
			database.ref().push(newRoute);

			// Resets forms
			$("#dateInput").val("");
			$("#timeInput").val("");
			$("#typeInput").val("");
			$("#amountInput").val("");
			$("#lengthInput").val("");
		}
		else {
			alert("Enter length");
		}
	})

	// Function runs when child is added and once for all existing children
	// Grabs values from FireBase, 
	database.ref().on("child_added", function(childSnapshot) {

		// console.log(childSnapshot.val()); //test
		
		// Save FireBase routes to variables
		var date = childSnapshot.val().date;
		var time = childSnapshot.val().time;
		var type = childSnapshot.val().type;
		var amount = childSnapshot.val().amount;
		var length = childSnapshot.val().length;

		console.log(date, time, type, amount, length); //test

		// Append routes to table
		var newRoute = $("<tr>").append(
			$("<td>").text(date),
			$("<td>").text(time),
			$("<td>").text(type),
			$("<td>").text(amount),
			$("<td>").text(length)
		)
		$("#feedText").append(newRoute); // Append new div
	})

		$("#lengthInput").change(function() {
			$("#timeInput").attr("placeholder", moment().subtract($("#lengthInput").val().trim(), "m").format("HH:mm"));
			$("#lengthInput").val()
		});
	})