

 





<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Service Provicer : Service Front</title>
<script>
  //debugger;
	if ("" !="null" &&  "" !="") { 
		location.href="https://www.ajou.ac.kr/_custom/ajou/_app/sso/login_return.jsp";
	}
	function logoutStuff() {
		var form = document.all.IdentityProviderForm; 
		form.submit();
	} 
	
	function loginStuff() {
		var form = document.all.IdentityProviderForm; 
		form.submit();
	} 
	function onload() {
		
			var form = document.all.IdentityProviderForm; 
			form.submit();
		 
	}
	
</script>

</head>
<body onload="onload()">

	<form name="IdentityProviderForm" action="https://sso.ajou.ac.kr/jsp/sso/ip/login_form.jsp" method="post">
		<div style="display: none"> 
		  <textarea rows=0 cols=0 name="SAMLRequest">3A65828FF982B8FF0105D06ED6791B72782655586BFE69341E49E861FDB70B1C0652AD672B8419D0E855F11C1DE485DBE3398C13EFE60815AD5ECC905730DE639E09DB4220FBBDF2AF446AEEBEFE3C9D408FFFFF8E91833BB34059DA6F98F9F117D51BF4DDE1B135664B4E2583E4D2B197E5415EE9CEA700EDFBC5AE968861ADE1DC5D3F7E2881CA44244747750697CE93EF056E967EB20A1930E8174F0A2EAF23CA04D4CA374D750840598817AF3D442227ED8BFD1A87FF72E34A771AF88E9AB95F3F69D542CE3DD210A14A73632B20A72E95CB9D6EFEC1AB348EEC50028BDC360FAC064C451252703B2FF87086BC804A7093C57EFEF76085BCEF709778E4BE3940AA2CBD1B248735FF4982E45DD036E55FC149F95E7DF11D207308BA0908E41F0E9581B0566EF3F7E2E73DB3C730F048924ACF1248CD328085BDFA196B701CB165C33348A0D690A34EFF12D847BEF5F8003CC70D2A7117001F5DCB8AF2F16A5EE7ABB87439D1758F5517FD5A3C7B327A447F132AB8A879702200A488AA8C382E4734F0C2D6B6C1610E0FF7CE79AB2D7DACEF5B374AD22FA4DCD568E2D968A86670F9650EBA4897AB45B9B428EC43C7</textarea>
		  <input type="hidden" name ="returnPage" value ="https://www.ajou.ac.kr/kr/ajou/notice_scholarship.do">
		</div>
	</form>
	<!-- button type="button" onclick="loginStuff()">Please Login</button><br / --> 



</body>
</html>
