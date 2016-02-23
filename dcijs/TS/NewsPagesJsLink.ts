/// <reference path="Common.ts" />

module dcijs {
	export class NewsPagesJsLink {
		constructor() {

			let overrideCtx: SPClientTemplates.RenderContext = {};
			overrideCtx.Templates = {};

			overrideCtx.Templates.Header = `<div class="newsViewContainer">
											<ul class="cbs-List">`;
			overrideCtx.Templates.Item = this.getItemHtml;
			overrideCtx.Templates.Footer = `</ul>
											</div>`;

			//overrideCtx.BaseViewID = 1;
			overrideCtx.ListTemplateType = 850;

			SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);

		};
		private getItemHtml = (ctx: SPClientTemplates.RenderContext_ItemInView): string => {
			let newsTitle: string = ctx.CurrentItem["Title"];

			let linkURL: string = ctx.CurrentItem["FileRef"];
			let content: string = ctx.CurrentItem["PublishingPageContent"];
			let pictureURL: string = ctx.CurrentItem["PublishingPageImage"];


			let imgSrc:string = $(pictureURL).find("img").attr("src");
			let contentText = $(content).text();

			let html: string = `
<li>
	<div class="dciNewsImgContainer">
		<a href="${linkURL}" class="dciNewsImgLink">
			<img src="${imgSrc}" class="dciNewsImg img-dci-responsive" />
		</a>
	</div>
	  <div class="dciNewsTextContainer">
	     <div class="dciNewsTitleContainer">
	                <a href="${linkURL}" class="dciNewsTitleLink">
	            <h1>${newsTitle}</h1>
	                </a>
	     </div>
	     <div class="dciNewsContentContainer">
	         <div class="dciNewsContentContainerMobile">
	         ${this.getSubString(contentText, 90)}
	         </div>
	         <div class="dciNewsContentContainerTablet">
	         ${this.getSubString(contentText, 180)}
	         </div>
	         <div class="dciNewsContentContainerDesktop">
	         ${this.getSubString(contentText, 360)}
	         </div>
	     </div>
	</div>
</li>
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
