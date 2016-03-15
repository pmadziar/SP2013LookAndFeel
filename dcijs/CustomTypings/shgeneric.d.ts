/// <reference path="../typings/tsd.d.ts" />

declare module shgeneric {
    interface IDictionary<T> {
        [key: string]: T;
    }
    class Helpers {
        static guidRx: RegExp;
    }
    function iterateSpCollection<T>(collection: SP.ClientObjectCollection<T>): Array<T>;
    function newIgnoreErrorsPromise<T>(promise: Promise<T>): Promise<T>;
    function cloneSpCamlQuery(query: SP.CamlQuery): SP.CamlQuery;

    interface INvPromiseSvc<T> {
        GetAsync: () => Promise<INvPromiseSvc<T>>;
        ClientContext: SP.ClientContext;
        Site: INvPromiseSvc<SP.Site>;
        Web: INvPromiseSvc<SP.Web>;
        List: INvPromiseSvc<SP.List>;
        Target: T;
    }

    class NvSiteSvc implements INvPromiseSvc<SP.Site> {
        private siteServerRelativeUrl;
        private _site;
        constructor(siteServerRelativeUrl?: string);
        GetAsync: () => Promise<INvPromiseSvc<SP.Site>>;
        ClientContext: SP.ClientContext;
        Site: INvPromiseSvc<SP.Site>;
        Web: INvPromiseSvc<SP.Web>;
        List: INvPromiseSvc<SP.List>;
        Target: SP.Site;
    }

    class NvWebSvc implements INvPromiseSvc<SP.Web> {
        private webUrlOrId;
        private _web;
        private _sitePromise;
        constructor(webUrlOrId?: string, site?: Promise<INvPromiseSvc<SP.Site>>);
        GetAsync: () => Promise<INvPromiseSvc<SP.Web>>;
        ClientContext: SP.ClientContext;
        Site: INvPromiseSvc<SP.Site>;
        Web: INvPromiseSvc<SP.Web>;
        List: INvPromiseSvc<SP.List>;
        Target: SP.Web;
    }

    class NvListSvc implements INvPromiseSvc<SP.List> {
        private listNameOrId;
        private _list;
        private _webPromise;
        constructor(listNameOrId: string, web?: Promise<INvPromiseSvc<SP.Web>>);
        GetAsync: () => Promise<INvPromiseSvc<SP.List>>;
        ClientContext: SP.ClientContext;
        Site: INvPromiseSvc<SP.Site>;
        Web: INvPromiseSvc<SP.Web>;
        List: INvPromiseSvc<SP.List>;
        Target: SP.List;
    }

    class NvViewSvc implements INvPromiseSvc<SP.View> {
        private viewNameOrId;
        private _view;
        private _listPromise;
        constructor(viewNameOrId: string, list: Promise<INvPromiseSvc<SP.List>>);
        GetAsync: () => Promise<INvPromiseSvc<SP.View>>;
        ClientContext: SP.ClientContext;
        Site: INvPromiseSvc<SP.Site>;
        Web: INvPromiseSvc<SP.Web>;
        List: INvPromiseSvc<SP.List>;
        Target: SP.View;
    }

    class NvListUtils {
        static getListFieldsInternalNames: (listPromise: Promise<INvPromiseSvc<SP.List>>) => Promise<string[]>;
        static rowLimitRx: RegExp;
        static getListItems: (listPromise: Promise<INvPromiseSvc<SP.List>>, query: SP.CamlQuery) => Promise<SP.ListItem[]>;
    }
}
