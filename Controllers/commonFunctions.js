"use strict";
var mqtt = require('mqtt'),
    options = { allow_anonymous: false },
    mqtt_client = require("mqtt").connect("mqtt://broker.mqttdashboard.com:1883")
mqtt_client.on("connect", (err) => {
    console.log("connection on ", err);
    mqtt_client.subscribe("chat-room");
});
mqtt_client.on('message', function (topic, message) {
    console.log("\n **Recieving mqtt message Topic: ", topic, "::::", message.toString())
});

// demo function to check the working of pub and sub 
// function publishing() {
//     setInterval(function () {
//         console.log("Publishing message");
//         mqtt_client.publish('presence', 'Hello mqtt');
//     }, 2000);
// }

// publishing();
exports.checkBlank = function (arr) {
    var arrlength = arr.length;
    for (var i = 0; i < arrlength; i++) {
        if (arr[i] == '') {
            return 1;
        }
        else if (arr[i] == undefined) {
            return 1;
        }
        else if (arr[i] == '(null)') {
            return 1;
        }
    }
    return 0;
}
exports.chat_publisher = function (key, message, callback) {
    console.log("\n **Sending message Topic: ", key, "\n", message);
    mqtt_client.publish(key, JSON.stringify(message));
    return callback();
}