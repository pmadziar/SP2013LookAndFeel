/// <reference path="../typings/main.d.ts" />

module dcijs {
	export class Common {
		public static showHideNav = ():void =>{
			$("#topNavContainer").slideToggle("slow");
		};

		public static showNav = ():void => {
			var width = $(window).width();
			if(width>=600){
				$("#topNavContainer").show();
			} 
		};
	}
}
