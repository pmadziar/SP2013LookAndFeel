/// <reference path="Common.ts" />

module dcijs {
	export class SpPublishingHelper {

		private static tmplPageWebRelativePath: string = `/_catalogs/masterpage/govConnectNewsLayout.aspx`;
		private static webPromise: Promise<shgeneric.INvPromiseSvc<SP.Web>> = new shgeneric.NvWebSvc().GetAsync();
		private static pagesPromise: Promise<shgeneric.INvPromiseSvc<SP.List>> = new shgeneric.NvListSvc("Pages", SpPublishingHelper.webPromise).GetAsync();

		public static getPublishingPagePromise = (title: string, folder: string): Promise<SP.Publishing.PublishingPage> => {
			return new Promise<SP.Publishing.PublishingPage>((resolve: (value: SP.Publishing.PublishingPage) => void, reject: (error: any) => void): void => {

				let webSvc: shgeneric.INvPromiseSvc<SP.Web>;
				let pagesSvc: shgeneric.INvPromiseSvc<SP.List>;
				let fld: SP.Folder;
				let tmpl: SP.ListItem;

				SpPublishingHelper.webPromise.then((webSvcVal: shgeneric.INvPromiseSvc<SP.Web>): Promise<shgeneric.INvPromiseSvc<SP.List>> => {
					webSvc = webSvcVal;
					return SpPublishingHelper.pagesPromise;
				})
					.then((pgsSvcVal: shgeneric.INvPromiseSvc<SP.List>): Promise<SP.Folder> => {
						pagesSvc = pgsSvcVal;
						return SpPublishingHelper.ensurePagesFolder(folder);
					})
					.then((fldVal: SP.Folder): Promise<SP.ListItem> => {
						fld = fldVal;
						let tmplSru = `${_.trimEnd(webSvc.Target.get_serverRelativeUrl(), '/')}${SpPublishingHelper.tmplPageWebRelativePath}`;
						return SpPublishingHelper.getListItemByPath(tmplSru);
					})
					.then((tmplVal: SP.ListItem): void => {
						tmpl = tmplVal;
						let ctx = webSvc.ClientContext;
						let pubweb = SP.Publishing.PublishingWeb.getPublishingWeb(ctx, webSvc.Target);
						let pageInfo = new SP.Publishing.PublishingPageInformation();
						pageInfo.set_name(`${title}.aspx`);
						pageInfo.set_folder(fld);
						pageInfo.set_pageLayoutListItem(tmpl);
						let newPage: SP.Publishing.PublishingPage = pubweb.addPublishingPage(pageInfo);
						ctx.load(newPage);
						ctx.executeQueryAsync(
							(sender: any, args: SP.ClientRequestEventArgs): void => {
								if(newPage!=null){
									resolve(newPage);
								} else {
									reject(`Page "${title} creation failed`);
								}

							},
							(sender: any, args: SP.ClientRequestFailedEventArgs): void => {
								let exc = new Error(args.get_message());
								reject(exc);
							});
					});
			});
		};

		private static ensurePagesFolder: (folderName: string) => Promise<SP.Folder> = (folderName: string): Promise<SP.Folder> =>{
			return new Promise<SP.Folder>((resolve: (value: SP.Folder) => void, reject: (error: any) => void): void => {
				let pagesSvc: shgeneric.INvPromiseSvc<SP.List>;
				let serverRelativeUrl: string;
				SpPublishingHelper.pagesPromise.then((value: shgeneric.INvPromiseSvc<SP.List>): Promise<SP.Folder> => {
					pagesSvc = value;
					serverRelativeUrl = `${_.trimEnd(pagesSvc.Web.Target.get_serverRelativeUrl(), '/')}/Pages/${folderName}`;
					return SpPublishingHelper.getSpFolder(serverRelativeUrl);
				}).then((fld: SP.Folder): void => {
					resolve(fld);
				}, (error:Error):void=>{
					let itemCreateInfo = new SP.ListItemCreationInformation();
					itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
					itemCreateInfo.set_leafName(folderName);
					let newFld = pagesSvc.Target.addItem(itemCreateInfo);
					newFld.update();
					pagesSvc.ClientContext.load(newFld);
					pagesSvc.ClientContext.executeQueryAsync(
						(sender: any, args: SP.ClientRequestEventArgs): void => {
							let ff = newFld.get_folder();
							if (ff != null) {
								resolve(ff);
							} else {
								reject(new Error(`Could not create folder: ${folderName}`))
							}
						},
						(sender: any, args: SP.ClientRequestFailedEventArgs): void => {
							let exc = new Error(args.get_message());
							reject(exc);
						});
				});
			});
		};

		private static getListItemByPath: (serverRelativeUrl: string) => Promise<SP.ListItem> = (serverRelativeUrl: string): Promise<SP.ListItem> => {
			return new Promise<SP.ListItem>((resolve: (value: SP.ListItem) => void, reject: (error: any) => void): void => {
				let webSvc: shgeneric.INvPromiseSvc<SP.Web>;
				SpPublishingHelper.webPromise.then((value: shgeneric.INvPromiseSvc<SP.Web>): void => {
					webSvc = value;
				})
				.then((): Promise<SP.File> => {
					return SpPublishingHelper.getSpFile(serverRelativeUrl);
				})
				.then((file:SP.File):void => {
					let item: SP.ListItem = file.get_listItemAllFields();
					webSvc.ClientContext.load(item);


					webSvc.ClientContext.executeQueryAsync(
						(sender: any, args: SP.ClientRequestEventArgs): void => {
							resolve(item);
						},
						(sender: any, args: SP.ClientRequestFailedEventArgs): void => {
							let exc = new Error(args.get_message());
							reject(exc);
						});
				});
			});
		};


		private static getSpFolder: (serverRelativeUrl: string) => Promise<SP.Folder> = (serverRelativeUrl: string): Promise<SP.Folder> => {
			return new Promise<SP.Folder>((resolve: (value: SP.Folder) => void, reject: (error: any) => void): void => {
				SpPublishingHelper.webPromise.then((webSvc: shgeneric.INvPromiseSvc<SP.Web>): void => {
					let web: SP.Web = webSvc.Target;
					let fld: SP.Folder = web.getFolderByServerRelativeUrl(serverRelativeUrl);
					webSvc.ClientContext.load(fld);
					webSvc.ClientContext.executeQueryAsync(
						(sender: any, args: SP.ClientRequestEventArgs): void => {
								resolve(fld);
						},
						(sender: any, args: SP.ClientRequestFailedEventArgs): void => {
							let exc = new Error(args.get_message());
							reject(exc);
						});
				});
			});
		};


		private static getSpFile: (serverRelativeUrl: string) => Promise<SP.File> = (serverRelativeUrl: string): Promise<SP.File> => {
			return new Promise<SP.File>((resolve: (value: SP.File) => void, reject: (error: any) => void): void => {
				SpPublishingHelper.webPromise.then((webSvc: shgeneric.INvPromiseSvc<SP.Web>): void => {
					let web: SP.Web = webSvc.Target;
					let file: SP.File = web.getFileByServerRelativeUrl(serverRelativeUrl);
					webSvc.ClientContext.load(file);
					webSvc.ClientContext.executeQueryAsync(
						(sender: any, args: SP.ClientRequestEventArgs): void => {
							if (file.get_exists()) {
								resolve(file);
							} else {
								let exc = new Error(`Can't find file with path: ${serverRelativeUrl}`);
								reject(exc);
							}

						},
						(sender: any, args: SP.ClientRequestFailedEventArgs): void => {
							let exc = new Error(args.get_message());
							reject(exc);
						});
				});
			});
		};

	}
}
