var handlebarsHelpers;
(function (handlebarsHelpers) {
    var functions = (function () {
        function functions() {
        }
        functions.getGuid = function () {
		    var d = new Date().getTime();
		    var uuid = 'xxxxxxxx-xxxx-7666-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		        var r = (d + Math.random()*16)%16 | 0;
		        d = Math.floor(d/16);
		        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		    });
		    return uuid;
        };
        functions.getGuidLow = function () {
			return handlebarsHelpers.functions.getGuid().replace(/[-]/g,'_');
        };
        return functions;
    })();
    handlebarsHelpers.functions = functions;
})(handlebarsHelpers || (handlebarsHelpers = {}));


module.exports = handlebarsHelpers;
