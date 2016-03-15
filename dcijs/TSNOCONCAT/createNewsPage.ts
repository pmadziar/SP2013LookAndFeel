/// <reference path="../TS/Common.ts" />
/// <reference path="../TS/SpPublishingHelper.ts" />

module createNewsPageHelper {
	export class createNewsPage {
		public static createPage = (title: string, category: string):void => {
			let catEnc = _.camelCase(_.trim(category));
			dcijs.SpPublishingHelper.getPublishingPagePromise(title, catEnc)
				.then((page: SP.Publishing.PublishingPage): void => {
					let ctx = page.get_context();
					let pageItem: SP.ListItem = page.get_listItem();
					ctx.load(pageItem);
					ctx.executeQueryAsync(
						(sender: any, args: SP.ClientRequestEventArgs): void => {
							window.location.href = pageItem.get_item('FileRef') + '?ControlMode=Edit&DisplayMode=Design';
						},
						(sender: any, args: SP.ClientRequestFailedEventArgs): void => {
							alert(args.get_message());
						});


				}, (error: Error):void => {
					alert(error.message);
				});
		}
	}
}
