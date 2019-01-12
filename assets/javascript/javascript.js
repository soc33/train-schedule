// Initialize Firebase
var config = {
    apiKey: "AIzaSyDN1FXNaysOt8WmNsFK9kSyT8auT-OYxxg",
    authDomain: "train-schedule-e538a.firebaseapp.com",
    databaseURL: "https://train-schedule-e538a.firebaseio.com",
    projectId: "train-schedule-e538a",
    storageBucket: "train-schedule-e538a.appspot.com",
    messagingSenderId: "793091183174"
};
firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function () {

    $("#add-train").on("click", function (e) {
        e.preventDefault();
        var newTrain = {
            name: $("#nameOfTrain").val().trim(),
            destination: $("#nameOfDestination").val().trim(),
            frequency: $("#frequency").val().trim(),
            first: $("#firstTrain").val().trim()
        }
        database.ref().push({
            newTrain
        });
        $("#nameOfTrain").val("");
        $("#nameOfDestination").val("");
        $("#frequency").val("");
        $("#firstTrain").val("");

    });

    database.ref().on("child_added", function (snap) {
        var format = "HH:mm";
        var nowMin = moment().format("mm");
        var nowHour = moment().format("HH");
        var nextTrainTime = "";
        var firstTrain = snap.val().newTrain.first;
        console.log(firstTrain);
        var convertedTrainTime = moment(firstTrain, format);
        var trainMath = ((convertedTrainTime.diff(moment(), "minutes")) % snap.val().newTrain.frequency) +1;
        // var trial = ((convertedTrainTime.diff(moment(), "minutes")) % snap.val().newTrain.frequency);
        // console.log(trial);
        // console.log(trainMath);
        var nextTrainMin = parseInt(nowMin) + parseInt(trainMath);
        // if (nextTrainMin.length === 1) {
        //     var newTime = "0" + nextTrainMin;
        //     nextTrainTime = nowHour + ":" + newTime;
        // }
        if (nextTrainMin > 59) {
            var newHour = parseInt(nowHour) + 1;
            var newMin = nextTrainMin % 60;
            if (newMin < 10) {
                newMin = "0" + newMin;
            }
            if (newHour === 24) {
                newHour = "00";
            }
            nextTrainTime = newHour + ":" + newMin;
            // console.log(nextTrainTime);
        } else {
            nextTrainTime = nowHour + ":" + nextTrainMin;
            // console.log(nextTrainTime);
        }

        // console.log(trainMath);
        var newRow = $("<tr>");
        newRow.html("<td>" + snap.val().newTrain.name + "</td>").append("<td>" + snap.val().newTrain.destination + "</td>").append("<td>" + snap.val().newTrain.frequency + "</td>").append("<td>" + nextTrainTime + "</td>").append("<td>" + trainMath + "</td>");

        $("#train-schedule").append(newRow);

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

});
