// Andrew Ton
// Assignment 7 - Train Scheduler
// app.js

// Check that DOM is loaded
$(document).ready(function() {

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyDSWSmU55m4X-BW8FP8eTaHgUsHBsMnMx8",
		authDomain: "scorpion-fleet-shipyard.firebaseapp.com",
		databaseURL: "https://scorpion-fleet-shipyard.firebaseio.com",
		projectId: "scorpion-fleet-shipyard",
		storageBucket: "",
		messagingSenderId: "153024076908"
	};
	firebase.initializeApp(config);

	var database = firebase.database();

	// On-click of submit button function, takes values and sends to FireBase
	$("#submitButton").on("click", function(event) {
		event.preventDefault();
	  
		// Grabs user input from form
		var name = $("#nameInput").val().trim();
		var destination = $("#destinationInput").val().trim();
		var startTime = $("#timeInput").val().trim();
		var frequency = $("#frequencyInput").val().trim();
	  
		// Creates local "temporary" object for holding employee data
		var newRoute = {
			name: name,
			dest: destination,
			time: startTime,
			freq: frequency
		};

		// console.log(newRoute); //test

		// Send new route to FireBase
		database.ref().push(newRoute);

		// Resets forms
		$("#addForm")[0].reset();
	})


	// Function runs when child is added and once for all existing children
	// Grabs values from FireBase, 
	database.ref().on("child_added", function(childSnapshot) {

		// Get current time and append
		$("#timeText").text(moment().format("hh:mm a"));

		// console.log(childSnapshot.val()); //test
		
		// Save FireBase routes to variables
		var name = childSnapshot.val().name;
		var destination = childSnapshot.val().dest;
		var startTime = childSnapshot.val().time;
		var frequency = childSnapshot.val().freq;

		console.log(name, destination, startTime, frequency); //test

		// Add frequency to time until it is equal or greater than current time
		var timeNow = moment();
		startTime = moment(startTime, "HHmm");

		// if start time is negative, add frequency to start time until non-negative
		if (timeNow.diff(startTime, "m") > 0) {
			while (timeNow.diff(startTime, "m") > 0) {
				startTime.add(frequency, "m");
			}
		}

		// Append routes to table
		var newRoute = $("<tr>").append(
			$("<td>").text(name),
			$("<td>").text(destination),
			$("<td>").text(frequency),
			$("<td>").text(startTime.format("hh:mm a")),
			// Add 1 and Math.floor to solve rounding problems
			$("<td>").text(Math.floor(startTime.diff(timeNow, "m") + 1))
		)
		$("#routeText").append(newRoute); // Append new div
	})
})