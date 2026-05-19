function logout() {
	userID = 0;
	firstName = "";
	lastName = "";
	
	username = "";
	password = "";
	
	saveCookie();
	
	window.location.href = "login.php";
}