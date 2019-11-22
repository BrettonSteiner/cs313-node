function getInfo() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("results").innerHTML = this.responseText;
        }
    };

    var majorName = document.getElementById("majorName").value;
	var urlParameters = "?majorName=" + majorName;

    xmlhttp.open("GET", "/getInfo" + urlParameters, true);
    xmlhttp.send();
}