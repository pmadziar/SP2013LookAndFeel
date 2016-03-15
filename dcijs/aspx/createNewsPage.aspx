<!DOCTYPE html>
<%@ Page language="C#" %>
<%@Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@ Import Namespace="Microsoft.SharePoint" %>
<html>
<head>
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
<script type="text/javascript" src="/_layouts/15/nova.gov.sp.dci/js/createNewsPage.js"></script>
</head>
<body>
    <SharePoint:FormDigest ID="FormDigest1" runat="server"></SharePoint:FormDigest>
	<fieldset>
	<legend>Create new news page</legend>
	<input type="radio" id="showGlobally"> <label for="showGlobally">Show on the start page</label>
	<input type="text" id="title"> <label for="showGlobally">News title</label>
	<select name="category">
		<option selected="selected">Global</option>
		<option>Human Resources</option>
		<option>Spotlight</option>
		<option>Around the Public Services</option>
	</select>
	<button type="submit" onclick="createNewsPageHelper.createNewsPage.createPage('test 01', 'Around the Public Services'); return false;">Create Page</button>
	</fieldset>
</body>
</html>
