/// <reference path="Common.ts" />
/// <reference path="../TS/SpPublishingHelper.ts" />

module dcijs {
	export class CreateNewsPage {
		public static CategoryListName = "News Categories";
		public static PagesListName = "Pages";
		public static ContentTypeName = "News Page";
		public static InvalidCharacters = /[&"?<>#{}%~\/\\.]/g;
		private listSvcPromise: Promise<shgeneric.INvPromiseSvc<SP.List>> = new shgeneric.NvListSvc(CreateNewsPage.CategoryListName).GetAsync();
		private pageSvcPromise: Promise<shgeneric.INvPromiseSvc<SP.List>> = new shgeneric.NvListSvc(CreateNewsPage.PagesListName).GetAsync();
		private ctypeId: string;

		constructor() {
			this.loadDropDownItems();
			this.pageSvcPromise.then((pageSvc: shgeneric.INvPromiseSvc<SP.List>): void => {
				let ctypes: SP.ContentTypeCollection = pageSvc.Target.get_contentTypes();
				pageSvc.ClientContext.load(ctypes);
				pageSvc.ClientContext.executeQueryAsync(
					(sender: any, args: SP.ClientRequestEventArgs): void => {
						let ctypeArr: Array<SP.ContentType> = shgeneric.iterateSpCollection<SP.ContentType>(ctypes);
						let ctype: SP.ContentType;
						_.forEach(ctypeArr, (ct:SP.ContentType):void=>{
							let ctName = ct.get_name();
							if(ctName===CreateNewsPage.ContentTypeName){
								this.ctypeId = ct.get_stringId();
							}
						});

					},
					(sender: any, args: SP.ClientRequestFailedEventArgs): void => {
						alert(`Error occured: ${args.get_message()}`);
					});
			}, (error: Error): void => {
				alert(`Error occured: ${error.message}`);
			});
		}

		private loadDropDownItems = (): void => {
			let caml: SP.CamlQuery = SP.CamlQuery.createAllItemsQuery();
			shgeneric.NvListUtils.getListItems(this.listSvcPromise, caml).then((items: Array<SP.ListItem>):void=>{
				let html: string = ``;
				_.forEach(items, (item:SP.ListItem):void=>{
					let title:string = item.get_item("Title");
					let id:number = item.get_id();
					html  += `<option value="${id.toString()}">${title}</option>`;
				});
				$("#category").append(html);
			}, (error: Error):void=>{
				alert(`Error occured: ${error.message}`);
			});
		};

		private createNewsPage = (title: string, categoryName: string, categoryId: number, showOnFP: boolean): void => {
			let catEnc = _.camelCase(_.trim(categoryName));
			let titleEnc = title.replace(CreateNewsPage.InvalidCharacters, ' ').replace(/\s+/, '_');
			titleEnc = _.camelCase(titleEnc);
			dcijs.SpPublishingHelper.getPublishingPagePromise(titleEnc, catEnc)
				.then((page: SP.Publishing.PublishingPage): void => {
					let ctx = page.get_context();
					let pageItem: SP.ListItem = page.get_listItem();
					pageItem.set_item("ContentTypeId", this.ctypeId);

					let cat = new SP.FieldLookupValue();
					cat.set_lookupId(categoryId);

					pageItem.set_item("Title", title);
					pageItem.set_item("NewsCategory", cat); 
					pageItem.set_item("ShowOnFrontPage", showOnFP);
					pageItem.update();
					ctx.load(pageItem);
					ctx.executeQueryAsync(
						(sender: any, args: SP.ClientRequestEventArgs): void => {
							window.top.location.href = pageItem.get_item('FileRef') + '?ControlMode=Edit&DisplayMode=Design';
						},
						(sender: any, args: SP.ClientRequestFailedEventArgs): void => {
							alert(args.get_message());
						});


				}, (error: Error): void => {
					alert(error.message);
				});
		};

		public CreatePage = (): void => {
			let title: string = $("#title").val();
			let showOnFP: boolean = $("#title").is(':checked');
			let categoryText = $("#category option:selected").text();
			let categoryId = $("#category").val();
			this.createNewsPage(title, categoryText, categoryId, showOnFP);

		};

		public static Show = (): void => {
			let options: SP.UI.DialogOptions = SP.UI.$create_DialogOptions();
			options.url = _.trimEnd(_spPageContextInfo.siteServerRelativeUrl,'/') + "/_layouts/15/nova.gov.sp.dci/createNewsPage.aspx";
			options.dialogReturnValueCallback = ():void => {
				CreateNewsPage.Close();
			}
			SP.UI.ModalDialog.showModalDialog(options);
		}

		public static Close = (): void => {
				SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK, null);
		};

	}
}
