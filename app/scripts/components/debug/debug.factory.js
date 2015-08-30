angular.module('starter')
    .factory('Debug', function() {
        var log=[];

        var trace=function(text, category, source){
            if(typeof text === 'object') {
                text = JSON.stringify(text, null, 2);
            }
            if(log.length > 20) {
                log.shift();
            }
            log.push({
                text: text,
                time: Date.now(),
                category: category,
                source: source
            })
            console.log(text);
        }


        var all = function() {
            return log;
        }

        return {
            trace: trace,
            all: all
        }
    })