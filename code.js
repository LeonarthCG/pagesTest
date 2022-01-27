//constants
const levels = ["Baby I", "Baby II", "Child", "Adult", "Perfect", "Ultimate"];
const noMon = {
            "title": "N/A",
            "dubs": ["N/A"],
            "url": "N/A",
            "img": "N/A",
            "levels": ["N/A"],
            "attributes": ["N/A"],
            "types": ["N/A"],
            "fields": ["N/A"],
            "xAntibody": "N/A"
        };

//parse GET parameters
var get = {}
location.search.substr(1).split("&").forEach(function(item) {get[item.split("=")[0]] = item.split("=")[1]})

//initialize the json data
var data;
var xobj = new XMLHttpRequest();
xobj.overrideMimeType("application/json");
xobj.open("GET", "/data.json", false);
xobj.onreadystatechange = function () {
	if (xobj.readyState == 4 && xobj.status == "200") {
		data = JSON.parse(xobj.responseText);
	}
};
xobj.send(null);
const mons = data["mons"];

//build the lists for each stage

//check that the current mons are valid
var currentMons = [
		mons.find(item => item.title === decodeURIComponent(get["m0"])),
		mons.find(item => item.title === decodeURIComponent(get["m1"])),
		mons.find(item => item.title === decodeURIComponent(get["m2"])),
		mons.find(item => item.title === decodeURIComponent(get["m3"])),
		mons.find(item => item.title === decodeURIComponent(get["m4"])),
		mons.find(item => item.title === decodeURIComponent(get["m5"]))
	];
for (var i = 0; i < currentMons.length; i++) {
	if (currentMons[i] == undefined) {
		currentMons[i] = noMon;
	}
}
for (var i = 0; i < currentMons.length; i++) {
	//check if mon is in the list for its level, if not then set to noMon
}

//update the url
updateUrl();

function init() {
	for (var i = 0; i < currentMons.length; i++) {
		paintMon(i);
		listOptions(i);
	}
}

function listOptions(n) {
	//<option disabled selected value/>
	var list = [];
	var content = "";
	for (const mon of mons) {
		if (mon["levels"].includes(levels[n])) {
			list.push(mon["title"]);
		}
	}
	for (const title of list) {
		content += "<option value=\"" + title + "\">" + title + "</option>";
	}
	document.getElementById("l" + n + "List").innerHTML = content;
}

function updateUrl() {
	var newUrl = "?";
	var i = 0;
	for (const mon of currentMons) {
		if (mon !== noMon) {
			newUrl += "m" + i + "=" + mon["title"] + "&";
		}
		i++;
	}
	window.history.pushState("", "Title", newUrl);
}

function paintMon(n) {
	var mon = currentMons[n];
	if (mon.url == "N/A") {
		document.getElementById("m" + n + "Img").innerHTML = "";
	} else {
		document.getElementById("m" + n + "Img").innerHTML = "<a target=\"_blank\" href=\"" + mon.url + "\"><img src=\"" + mon.img + "\" alt=\"" + mon.title + "\" title=\"" + mon.title + "\"/></a>";
	}
	document.getElementById("m" + n + "Name").innerHTML = mon.title;
	document.getElementById("m" + n + "Dub").innerHTML = mon.dubs.join(', ');
	document.getElementById("m" + n + "Level").innerHTML = mon.levels.join(', ');
	document.getElementById("m" + n + "Attribute").innerHTML = mon.attributes.join(', ');
	document.getElementById("m" + n + "Type").innerHTML = mon.types.join(', ');
	document.getElementById("m" + n + "Field").innerHTML = mon.fields.join(', ');
	document.getElementById("m" + n + "HasX").innerHTML = mon.xAntibody;
}

function onSelect(title, n) {
	currentMons[n] = mons.find(item => item.title === title);
	paintMon(n);
	updateUrl();
}
