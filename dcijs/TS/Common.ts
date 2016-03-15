/// <reference path="../typings/tsd.d.ts" />
/// <reference path='../CustomTypings/shgeneric.d.ts' />

module dcijs {
	export class Common {
		public static showHideNav = (): void => {
			$("#topNavContainer").slideToggle("slow");
		};

		public static showNav = (): void => {
			var width = $(window).width();
			if (width >= 600) {
				$("#topNavContainer").show();
			}
		};

		public static toUpperCamelCase = (str: string): string => {
			var ret = str.toLowerCase()
			return ret
				.replace(/[-_]/g, ' ')
				.replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
				.replace(/\s+/g, '')
				.replace(/^(.)/, function($1) { return $1.toUpperCase(); });
		};
	}
}
