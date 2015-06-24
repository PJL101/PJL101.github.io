(function( exampleModule, $, undefined ) {

  'use strict';

  // Private variable for this module only
  var privateVar = "This is a private var";

  // Public variable for anyone
  exampleModule.publicVar = "This is a public var";

  // Public Method
  exampleModule.init = function() {
    console.log('in example module: init/public function');
    console.log('in example module: ' + privateVar);
    console.log('in example module: ' + exampleModule.publicVar);

    privateFunction();
  };

  // Private Method
  function privateFunction() {
    console.log('in example module: private function');
  }
}( window.exampleModule = window.exampleModule || {}, jQuery ));
