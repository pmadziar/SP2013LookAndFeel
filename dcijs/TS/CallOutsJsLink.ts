/// <reference path="Common.ts" />

module dcijs {
    export class CallOutsJsLink {
        constructor() {

            let overrideCtx: SPClientTemplates.RenderContext = {};
            overrideCtx.Templates = {};

            overrideCtx.Templates.Header = `<div id="callOutsItemsContainer">`;
            overrideCtx.Templates.Item = this.getItemHtml;
            overrideCtx.Templates.Footer = '</div>';

            //overrideCtx.BaseViewID = 1;
            overrideCtx.ListTemplateType = 170;

            SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);

        };
        private getItemHtml = (ctx: SPClientTemplates.RenderContext_ItemInView): string => {
            let callOutItemHtml = ``;
            let title = ctx.CurrentItem["Title"];
            let linkLocation = ctx.CurrentItem["LinkLocation"];
            let tileOrder = ctx.CurrentItem["TileOrder"];
            let backgroundImageLocation = ctx.CurrentItem["BackgroundImageLocation"];
            let order = parseInt(tileOrder, 10);
            if (!isNaN(order) && order >= 1 && order <= 5) {
                callOutItemHtml = `
<div class="callOutItemContainer tileOrder${tileOrder}">
    <a href="${linkLocation}">
        <img src="${backgroundImageLocation}" class="callOutItemImg" alt="${title}" />
    </a>
    <a href="${linkLocation}" class="callOutItemCaptionLink tileOrder${tileOrder}">
        <div class="callOutItemCaptionContainer">${title}</div>
    </a>
</div>`;
            }
            return callOutItemHtml;
        };
    }
}
