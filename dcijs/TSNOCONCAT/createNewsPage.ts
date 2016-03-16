/// <reference path="../TS/Common.ts" />
/// <reference path="../TS/CreateNewsPage.ts" />


((): void => {
    let np = new dcijs.CreateNewsPage();
    $("#createPageSubmit").click((): boolean => {
    	np.CreatePage();
		return false;
    });
    $("#createPageCancel").click(():boolean=>{
		return false;
    });
})();
