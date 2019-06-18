// api key from FireBase Example  
var config = {
    apiKey: "AIzaSyCGxqy-EUcpo8Hn_qAU_6O4D0HX-lw6-T4",
    authDomain: "thursdaymagic-2ddc0.firebaseapp.com",
    databaseURL: "https://thursdaymagic-2ddc0.firebaseio.com",
    projectId: "thursdaymagic-2ddc0",
    storageBucket: "thursdaymagic-2ddc0.appspot.com",
    messagingSenderId: "881570175212"
  };
  firebase.initializeApp(config);


var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrainTime = moment($("#first-train-time").val().trim(), "HH:mm").format("X");
  var frequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.trainName);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrainTime);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-time").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().firstTrainTime;
  var frequency = childSnapshot.val().frequency;
  
  

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var remainder = diffTime % frequency;
    console.log(remainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - remainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain =  moment(moment().add(tMinutesTillTrain, "minutes")).format("HH:mm");
    console.log("ARRIVAL TIME: " + nextTrain);
  

  // Train Info
  console.log(trainName);
  console.log(destination);
  console.log(firstTrainTime);
  console.log(frequency);

  // format first train time
  var firstTrainTimePretty = moment.unix(firstTrainTime).format("HH:mm");

 

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextTrain),
    $("<td>").text(tMinutesTillTrain)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});
