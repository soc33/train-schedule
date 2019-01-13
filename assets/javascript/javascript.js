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
    $(".error").hide();

    hideAlerts = function () {
        $(".success").hide();
    }
    hideAlerts();

    $("#add-train").on("click", function (e) {
        e.preventDefault();
        // confiriming that al the necessary math values are in place
        if (($("#firstTrain").val() === "") || ($("#lastTrain").val() === "") || ($("#frequency").val() === "")) {
            $(".error").show();
        } else {
            $(".error").hide();
            $(".success").show();
            setTimeout(hideAlerts, 5000);
            var newTrain = {
                name: $("#nameOfTrain").val().trim(),
                destination: $("#nameOfDestination").val().trim(),
                frequency: $("#frequency").val().trim(),
                first: $("#firstTrain").val().trim(),
                last: $("#lastTrain").val().trim()
            }
            database.ref().push({
                newTrain
            });
            $("#nameOfTrain").val("");
            $("#nameOfDestination").val("");
            $("#frequency").val("");
            $("#firstTrain").val("");
            $("#lastTrain").val("");
        }
    });

    database.ref().on("child_added", function (snap) {
        const TIME_FORMAT = "HH:mm";
        var dbNewTrain = snap.val().newTrain;
        var now = moment();
        var newTrainFrequencyNum = parseInt(dbNewTrain.frequency);
        var firstTrainTimeString = dbNewTrain.first;
        var lastTrainTimeString = dbNewTrain.last;
        console.log(firstTrainTimeString);
        var firstTrainMoment = moment(firstTrainTimeString, TIME_FORMAT);
        var lastTrainMoment = moment(lastTrainTimeString, TIME_FORMAT);
        var minutesUntilNextTrain, nextTrainTime;

        if (now.isBefore(firstTrainMoment)) {
            nextTrainTime = firstTrainMoment.format(TIME_FORMAT);
            minutesUntilNextTrain = Math.ceil(firstTrainMoment.diff(now, "minutes", true));
        } else if (now.isAfter(lastTrainMoment)) {
            nextTrainTime = "Tomorrow at: " + firstTrainMoment.format(TIME_FORMAT);
            firstTrainMoment.add(1, "days");
            minutesUntilNextTrain = Math.ceil(firstTrainMoment.diff(now, "minutes", true));
        } else {
            minutesUntilNextTrain = newTrainFrequencyNum - (now.diff(firstTrainMoment, "minutes") % newTrainFrequencyNum);
            nextTrainTime = now.add(minutesUntilNextTrain, "minutes").format(TIME_FORMAT);
        }

        var newRow = $("<tr>");
        newRow.html("<td>" + dbNewTrain.name + "</td>").append("<td>" + dbNewTrain.destination + "</td>").append("<td>" + newTrainFrequencyNum + "</td>").append("<td>" + nextTrainTime + "</td>").append("<td>" + minutesUntilNextTrain + "</td>");

        $("#train-schedule").append(newRow);

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

});
