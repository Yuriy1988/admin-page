APP.directive("fileread", [function () {
   return {
      scope: {
         fileread: "="
      },
      link: function (scope, element, attributes) {
         element.bind("change", function (changeEvent) {
            var reader = new FileReader();

            reader.onload = function (loadEvent) {
               scope.$apply(function () {
                  var blob       = loadEvent.target.result;
                  if(1048576 < blob.length) {
                     alert("Превышен допустимый размер изображения!");
                     console.log(element)
                     element.value  = '';
                  }else
                     scope.fileread = btoa(blob);
               });
            }

            reader.readAsBinaryString(changeEvent.target.files[0]);
         });
      }
   }
}]);