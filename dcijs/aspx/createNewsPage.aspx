<!DOCTYPE html>
<%@ Page language="C#" %>
<%@Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@ Import Namespace="Microsoft.SharePoint" %>
<html>
<head>
<title>Create news page</title>
<link rel="stylesheet" type="text/css" href="/_layouts/15/nova.gov.sp.dci/css/dci.css"/>
<script  type="text/javascript"  src="/_layouts/15/MicrosoftAjax.js"></script>
<script type="text/javascript" src="/_layouts/15/init.js"></script>
<script type="text/javascript" src="/_layouts/15/1033/initstrings.js"></script>
<script type="text/javascript" src="/_layouts/15/1033/strings.js"></script>
<script type="text/javascript" src="/_layouts/15/core.js"></script>
<script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
<script type="text/javascript" src="/_layouts/15/sp.js"></script>
<script type="text/javascript" src="/_layouts/15/sp.init.js"></script>
<script type="text/javascript" src="/_layouts/15/sp.publishing.js"></script>
<script type="text/javascript" src="/_layouts/15/clienttemplates.js"></script>

<script type="text/javascript" src="/_layouts/15/nova.gov.sp.dci/js/lodash.js"></script>
<script type="text/javascript" src="/_layouts/15/nova.gov.sp.dci/js/promise.js"></script>
<script type="text/javascript" src="/_layouts/15/nova.gov.sp.dci/js/jquery.js"></script>
<script type="text/javascript" src="/_layouts/15/nova.gov.sp.dci/js/moment.js"></script>
<script type="text/javascript" src="/_layouts/15/nova.gov.sp.dci/js/shgeneric.js"></script>
<script type="text/javascript" src="/_layouts/15/nova.gov.sp.dci/js/dci.js"></script>
</head>
<body>
    <SharePoint:FormDigest ID="FormDigest1" runat="server"></SharePoint:FormDigest>
	<fieldset>
		<legend>Create news page</legend>
		<div>
			<span>Show on the front page:&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" id="showGlobally" /></span>
		</div>
		<div>
			<span>Title:&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id="title" size="40"></span>
		</div>
		<div>
			<span>Category:&nbsp;&nbsp;&nbsp;&nbsp;<select name="category" id="category">
			</select>
			</span>
		</div>
		<div>
			<input type="button" id="createPageSubmit" name="createPage" value="Create Page" />
			<input type="button" id="createPageCancel" name="cancel" value="Cancel" />
		</div>
	</fieldset>
	<script type="text/javascript" src="/_layouts/15/nova.gov.sp.dci/js/createNewsPage.js"></script>
</body>
</html>
