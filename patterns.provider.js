(function () {
    'use strict';

    $patterns.$inject = [];

    angular
        .module('patterns.router')
        .provider('$patterns', $patterns);

    function $patterns() {

        var patterns = [];
        var rawPatterns = [];

        var patternsProvider = {
            'registerPattern': registerPattern,
            '$get': patternsAPI
        };

        return patternsProvider;


        function registerPattern(pattern){

            var vm = rawPatterns;

            if(pattern.parent == undefined){
                pattern.parent = 'root'
            }

            if(pattern.parent && vm[pattern.parent]){
                vm[pattern.parent].push({
                    'name':pattern.name
                })
            }else if(pattern.parent){

                vm[pattern.parent] = [];

                vm[pattern.parent].push({
                    'name':pattern.name
                })
            }
        }

        function patternsAPI() {

            return({
                patterns: patterns,
                finalizeHierarchy:finalizeHierarchy
            });

            function finalizeHierarchy() {

                this.patterns = retrieveChildren('root');

                this.patterns = this.patterns[0];

                console.log(this.patterns)
            }

            function retrieveChildren(key) {
                var returnArray = [];

                for (var i in rawPatterns[key]) {
                    returnArray.push({
                        'pname': rawPatterns[key][i].name,
                        'children': []
                    });
                }

                for (var j in returnArray){
                    var parentKey = returnArray[j].pname;
                    if(rawPatterns[parentKey] != undefined){
                        returnArray[j].children = retrieveChildren(parentKey);
                    }else{
                        delete returnArray[j].children;
                    }
                }

                return returnArray;
            }
        }
    }

})();