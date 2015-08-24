angular.module('starter')
  .factory('Observer',
    function( trim ) {
        // Define the constructor function.
        var observerCallbacks;
        function Observer() {
            this.observerCallbacks = []
        }

        // Define the "instance" methods using the prototype
        // and standard prototypal inheritance.
        Observer.prototype = {
            subscribe: function(callback) {
                this.observerCallbacks.push(callback);
            },
            publish: function() {
                return( this.firstName + " " + this.lastName );
            }
        };

        // Return constructor - this is what defines the actual
        // injectable in the DI framework.
        return( Observer );
    }
);