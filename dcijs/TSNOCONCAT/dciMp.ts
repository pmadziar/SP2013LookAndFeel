/// <reference path="../TS/Common.ts" />

(():void=>{
	$(window).on('resize', _.debounce(dcijs.Common.showNav, 250));
})();
