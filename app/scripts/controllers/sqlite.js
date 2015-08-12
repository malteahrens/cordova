angular.module('starter')
.controller('SqliteCtrl', function ($scope) {
    function populateDB(tx) {
        tx.executeSql('DROP TABLE IF EXISTS DEMO');
        tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
        tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
        tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
    }

    function errorCB(err) {
        console.log("Error processing SQL: "+err.code);
    }

    function successCB() {
        console.log("success!");
    }

    var db = window.sqlitePlugin.openDatabase({name: "my.db"});
    db.transaction(populateDB, errorCB, successCB);

});