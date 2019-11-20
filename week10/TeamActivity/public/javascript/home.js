function getPerson() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("results").innerHTML = this.responseText;
        }
    };

    var id = document.getElementById("id").value;
	var urlParameters = "?id=" + id;

    xmlhttp.open("GET", "/getPerson" + urlParameters, true);
    xmlhttp.send();
}