//empty mon, for when an invalid mon is passed
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

//default and valid possibilities for the different settings
const defaultLevels = [
	["Baby I"],
	["Baby II"],
	["Child"],
	["Adult"],
	["Perfect"],
	["Ultimate"]
]
const validLevels = [
	["Baby I", "Armor", "Hybrid", "Unknown"],
	["Baby II", "Armor", "Hybrid", "Unknown"],
	["Child", "Armor", "Hybrid", "Unknown"],
	["Adult", "Armor", "Hybrid", "Unknown"],
	["Perfect", "Armor", "Hybrid", "Unknown"],
	["Ultimate", "Armor", "Hybrid", "Unknown"]
]
const validAttributes = ["Vaccine", "Data", "Virus", "Free/None", "Variable", "Unknown"]
const validFields = [
	"Deep Savers",
	"Nature Spirits",
	"Virus Busters",
	"Wind Guardians",
	"Dragon's Roar",
	"Nightmare Soldiers",
	"Metal Empire",
	"Jungle Troopers",
	"Dark Area",
	"Unknown",
	"N/A"
]
const validAntibodies = ["Not a carrier", "Carrier", "Natural Carrier"]

//parse GET parameters
const get = (new URL(window.location.href)).searchParams

//initialize the json data
var data;
var xobj = new XMLHttpRequest();
xobj.overrideMimeType("application/json");
xobj.open("GET", "data.json", false);
xobj.onreadystatechange = function () {
	if (xobj.readyState == 4 && xobj.status == "200") {
		data = JSON.parse(xobj.responseText);
	}
};
xobj.send(null);
const mons = data["mons"];

//recover all of the settings, set to default if not found
var settings = {
	"level": [[], [], [], [], [], []],
	"attribute": [[], [], [], [], [], []],
	"field": [[], [], [], [], [], []],
	"antibody": [[], [], [], [], [], []]
}

for (var i = 0; i <= 5; i++) {
	//recover the settings radix 32 string, if it exists
	const n = get.get("s" + i);
	//convert it to integer
	const s = (n == undefined || n == null) ? 0 : parseInt(n, 32);
	//for each setting
	for (var j = 0; j < 4; j++) {
		//if the corresponding bit is set
		if (s & (1 << j)) {
			//add it to the list
			settings["level"][i].push(validLevels[i][j]);
		}
	}
	//same as above
	for (var j = 4; j < 10; j++) {
		if (s & (1 << j)) {
			settings["attribute"][i].push(validAttributes[j - 4]);
		}
	}
	for (var j = 10; j < 21; j++) {
		if (s & (1 << j)) {
			settings["field"][i].push(validFields[j - 10]);
		}
	}
	for (var j = 21; j < 24; j++) {
		if (s & (1 << j)) {
			settings["antibody"][i].push(validAntibodies[j - 21]);
		}
	}
	//if the settings are empty, set to default
	if (settings["level"][i].length == 0) {
		settings["level"][i] = [...defaultLevels[i]];
	}
	//same as above
	if (settings["attribute"][i].length == 0) {
		settings["attribute"][i] = [...validAttributes];
	}
	if (settings["field"][i].length == 0) {
		settings["field"][i] = [...validFields];
	}
	if (settings["antibody"][i].length == 0) {
		settings["antibody"][i] = [...validAntibodies];
	}
	
}

//get the mons from the GET parameters
var currentMons = [
		mons.find(item => item.title === get.get("m0")),
		mons.find(item => item.title === get.get("m1")),
		mons.find(item => item.title === get.get("m2")),
		mons.find(item => item.title === get.get("m3")),
		mons.find(item => item.title === get.get("m4")),
		mons.find(item => item.title === get.get("m5"))
	];

//TODO: maybe check that the current mons are valid (are in the list)?

//replace the mons that were not found, with the empty mon
for (var i = 0; i < currentMons.length; i++) {
	if (currentMons[i] == undefined || currentMons[i] == null) {
		currentMons[i] = noMon;
	}
}

//update the url
updateUrl();

function init() {
	//paint every mon
	for (var i = 0; i < currentMons.length; i++) {
		paintMon(i);
		listOptions(i);
	}
}

//update the selection list to include only the matching mons
function listOptions(n) {
	var list = [];
	//for each mon in our json
	for (const mon of mons) {
		var validLevel = false
		//for each value in the settings
		for (const level of settings["level"][n]) {
			//check if the mon has this attribute
			if (mon["levels"].includes(level)) {
				//if there's even one match, the attribute is valid
				validLevel = true;
			}
		}
		//same as above
		var validAttribute = false
		for (const attribute of settings["attribute"][n]) {
			if (mon["attributes"].includes(attribute)) {
				validAttribute = true;
			}
		}
		var validField = false
		for (const field of settings["field"][n]) {
			if (mon["fields"].includes(field)) {
				validField = true;
			}
		}
		var validAntibody = false
		for (const antibody of settings["antibody"][n]) {
			if (mon["xAntibody"].includes(antibody)) {
				validAntibody = true;
			}
		}
		//if all the checks have been passed, add it to the list
		if (validLevel && validAttribute && validField && validAntibody) {
			list.push(mon["title"]);
		}
	}
	//finally, write the list
	var content = "<option hidden disabled selected value> - " + list.length + " Results - Select a mon -</option>"; //make the list start with no selection
	for (const title of list) {
		content += "<option value=\"" + title + "\">" + title + "</option>";
	}
	document.getElementById("l" + n + "List").innerHTML = content;
}

function updateUrl() {
	var newUrl = "?";
	//for each mon, add their name
	var i = 0;
	for (const mon of currentMons) {
		if (mon !== noMon) {
			newUrl += "m" + i + "=" + mon["title"] + "&";
		}
		i++;
	}
	//for each mon, add their settings
	for (i = 0; i <= 5; i++) {
		var s = 0;
		//for each possible settings
		for (var j = 0; j < 4; j++) {
			const level = validLevels[i][j];
			//if that settings is set
			if (settings["level"][i].includes(level)) {
				s |= 1 << j; //set the corresponding bit of our settings number
			}
		}
		//same as above
		for (var j = 4; j < 10; j++) { 
			const attribute = validAttributes[j - 4];
			if (settings["attribute"][i].includes(attribute)) {
				s |= 1 << j;
			}
		}
		for (var j = 10; j < 21; j++) { 
			const field = validFields[j - 10];
			if (settings["field"][i].includes(field)) {
				s |= 1 << j;
			}
		}
		for (var j = 21; j < 24; j++) { 
			const antibody = validAntibodies[j - 21];
			if (settings["antibody"][i].includes(antibody)) {
				s |= 1 << j;
			}
		}
		//finally, add the resulting number to the url, in radix 32
		newUrl += "s" + i + "=" + s.toString(32) + "&";
	}
	//and update the url
	window.history.pushState("", "Title", newUrl);
}

function paintMon(n) {
	//get the mon to paint
	var mon = currentMons[n];
	//if there's no mon, don't try to draw its image
	if (mon.url == "N/A") {
		document.getElementById("m" + n + "Img").innerHTML = "";
	} else {
		document.getElementById("m" + n + "Img").innerHTML = "<a target=\"_blank\" href=\"" + mon.url + "\"><img src=\"" + mon.img + "\" alt=\"" + mon.title + "\" title=\"" + mon.title + "\"/></a>";
	}
	//the rest of the attributes we can just draw
	document.getElementById("m" + n + "Name").innerHTML = mon.title;
	document.getElementById("m" + n + "Dub").innerHTML = mon.dubs.join(', ');
	document.getElementById("m" + n + "Level").innerHTML = mon.levels.join(', ');
	document.getElementById("m" + n + "Attribute").innerHTML = mon.attributes.join(', ');
	document.getElementById("m" + n + "Type").innerHTML = mon.types.join(', ');
	document.getElementById("m" + n + "Field").innerHTML = mon.fields.join(', ');
	document.getElementById("m" + n + "HasX").innerHTML = mon.xAntibody;
}

function onSelect(title, n) {
	//get the selected mon
	currentMons[n] = mons.find(item => item.title === title);
	//and update their page
	paintMon(n);
	updateUrl();
}

function updateCheckboxes() {
	//for each mon
	for (var i = 0; i <= 5; i++) {
		//check if each setting is set, and update the checkbox accordingly
		for (level of settings["level"][i]) {
			document.getElementById("c" + i + "Level" + level).checked = true;
		}
		for (attribute of settings["attribute"][i]) {
			document.getElementById("c" + i + "Attribute" + attribute).checked = true;
		}
		for (field of settings["field"][i]) {
			document.getElementById("c" + i + "Field" + field).checked = true;
		}
		for (antibody of settings["antibody"][i]) {
			document.getElementById("c" + i + "Antibody" + antibody).checked = true;
		}
	}
}

function updateSetting(e, n) {
	//get the index of the setting, if it existed
	const index = settings[e.name][n].indexOf(e.value);
	//if the checkbox is checked
	if (e.checked) {
		//and the setting doesn't exist
		if (index == -1) {
			//add it
			settings[e.name][n].push(e.value);
		}
	}
	//if the checkbox is unchecked
	else {
		//and the setting exists
		if (index !== -1) {
			//remove it
			settings[e.name][n].splice(index, 1);
		}
	}
	updateUrl();
}
