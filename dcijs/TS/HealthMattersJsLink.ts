/// <reference path="Common.ts" />

module dcijs {
	export class HealthMattersJsLink {
		constructor() {

			let overrideCtx: SPClientTemplates.RenderContext = {};
			overrideCtx.Templates = {};

			overrideCtx.Templates.Header = `<div class="healthMattersContainer">`;
			overrideCtx.Templates.Item = this.getItemHtml;
			overrideCtx.Templates.Footer = `</div>`;

			//overrideCtx.BaseViewID = 1;
			overrideCtx.ListTemplateType = 100;

			SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);

		};
		private getItemHtml = (ctx: SPClientTemplates.RenderContext_ItemInView): string => {
			let title: string = ctx.CurrentItem["Title"];

			let startDate: string = ctx.CurrentItem["StartDate"];
			let picture: string = ctx.CurrentItem["NewsPicture"];
			let message: string = ctx.CurrentItem["CategoryDescription"];

			if(startDate){
				startDate = moment(startDate, "MM/D/YYYY").format("dddd, MMMM D, YYYY");
			}

			let html: string = `
<div class="healthMattersItemContainer">
	<h2 class="healthMattersStartDate">${startDate}</h2>
	<h1 class="healthMattersTitle">${title}</h1>
	<img src="${picture}" alt="${title}" class="healthMattersImg" />
	<div class="healthMattersMessage">${message}</div>
</div>
`;
			return html;
		};
		private getSubString = (str:string, len:number):string =>{
		    var ret = str;
		    if(str && len){
		        var strlen = str.length;
		        if(strlen > len){
		            ret = str.substring(0,len) + " ...";
		        }
		    }
		    return ret;
		};
	}
}
