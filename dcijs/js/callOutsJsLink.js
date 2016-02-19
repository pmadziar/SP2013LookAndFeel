// function to process an accordion item..
window.dci = window.dci || {};
window.dci.callOutItem = {
    customItemHtml: function (ctx) {
        var callOutItemHtml = "isNaN";
        var title = ctx.CurrentItem.Title;
        var linkLocation = ctx.CurrentItem.LinkLocation;
        var tileOrder = ctx.CurrentItem.TileOrder;
        var backgroundImageLocation = ctx.CurrentItem.BackgroundImageLocation;
        var order = parseInt(tileOrder,10);
        if(!isNaN(order) && order>=1 && order <= 5){
            callOutItemHtml = "" +
            '<div class="callOutItemContainer tileOrder' + tileOrder + '" class="callOutItemLinkImg">'  +
            '<a href="' + linkLocation + '">' +
            '<img src="' + backgroundImageLocation + '" class="callOutItemImg img-dci-responsive" />' +
            '</a>' +
            '<a href="' + linkLocation + '" class="callOutItemLinkDesc">'  +
            '<div>' + title + '</div>' +
            '</a>' +
            '</div>';
        }
        return callOutItemHtml;
    }
};

// anonymous self-executing function to setup JSLink templates on page load..
(function () {
    var overrideCtx = {};
    overrideCtx.Templates = {};

    overrideCtx.Templates.Header = "<div id=\"callOutsContainer\">";
    overrideCtx.Templates.Item = window.dci.callOutItem.customItemHtml;
    overrideCtx.Templates.Footer = "</div>";

    //overrideCtx.BaseViewID = 1;
    overrideCtx.ListTemplateType = 170;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
})();
