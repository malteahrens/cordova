angular.module('starter.services', [])
    .factory('Chats', function(Debug) {
        // Some fake testing data
        var chats = [
            {   "level": 10, // raw RSSI value
                "SSID": 'Wlan bli', // SSID as string, with escaped double quotes: "\"ssid name\""
                "BSSID": "1234" // MAC address of WiFi router as string
            },
            {   "level": 20,
                "SSID": "Wlan bla",
                "BSSID": "2345"
            },
            {   "level": 30,
                "SSID": "Wlan blubb",
                "BSSID": "3456"
            }
        ];

        return {
            all: function() {
                return chats;
            },
            remove: function(chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function(chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    });