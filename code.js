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

//build the lists for each stage
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

var settings = {
	"level": [
		get.getAll("l0Level[]"),
		get.getAll("l1Level[]"),
		get.getAll("l2Level[]"),
		get.getAll("l3Level[]"),
		get.getAll("l4Level[]"),
		get.getAll("l5Level[]")
	],
	"attribute": [
		get.getAll("l0Attribute[]"),
		get.getAll("l1Attribute[]"),
		get.getAll("l2Attribute[]"),
		get.getAll("l3Attribute[]"),
		get.getAll("l4Attribute[]"),
		get.getAll("l5Attribute[]")
	],
	"field": [
		get.getAll("l0Field[]"),
		get.getAll("l1Field[]"),
		get.getAll("l2Field[]"),
		get.getAll("l3Field[]"),
		get.getAll("l4Field[]"),
		get.getAll("l5Field[]")
	],
	"antibody": [
		get.getAll("l0Antibody[]"),
		get.getAll("l1Antibody[]"),
		get.getAll("l2Antibody[]"),
		get.getAll("l3Antibody[]"),
		get.getAll("l4Antibody[]"),
		get.getAll("l5Antibody[]")
	]
}

for (var i = 0; i <= 5; i++) {
	if (settings["level"][i] != undefined) {
		for (const level of settings["level"][i]) {
			if (!validLevels[i].includes(level)) {
				const index = settings["level"][i].indexOf(level);
				if (index !== -1) {
					settings["level"][i].splice(index, 1);
				}
			}
		}
	}
	if (settings["attribute"][i] != undefined) {
		for (const attribute of settings["attribute"][i]) {
			if (!validAttributes.includes(attribute)) {
				const index = settings["attribute"][i].indexOf(attribute);
				if (index !== -1) {
					settings["attribute"][i].splice(index, 1);
				}
			}
		}
	}
	if (settings["field"][i] != undefined) {
		for (const field of settings["field"][i]) {
			if (!validFields.includes(field)) {
				const index = settings["field"][i].indexOf(field);
				if (index !== -1) {
					settings["field"][i].splice(index, 1);
				}
			}
		}
	}
	if (settings["antibody"][i] != undefined) {
		for (const antibody of settings["antibody"][i]) {
			if (!validAntibodies.includes(antibody)) {
				const index = settings["antibody"][i].indexOf(antibody);
				if (index !== -1) {
					settings["antibody"][i].splice(index, 1);
				}
			}
		}
	}
	if (settings["level"][i] == undefined || settings["level"][i].length == 0) {
		settings["level"][i] = defaultLevels[i]
	}
	if (settings["attribute"][i] == undefined || settings["attribute"][i].length == 0) {
		settings["attribute"][i] = validAttributes
	}
	if (settings["field"][i] == undefined || settings["field"][i].length == 0) {
		settings["field"][i] = validFields
	}
	if (settings["antibody"][i] == undefined || settings["antibody"][i].length == 0) {
		settings["antibody"][i] = validAntibodies
	}
}

//check that the current mons are valid
var currentMons = [
		mons.find(item => item.title === get.get("m0")),
		mons.find(item => item.title === get.get("m1")),
		mons.find(item => item.title === get.get("m2")),
		mons.find(item => item.title === get.get("m3")),
		mons.find(item => item.title === get.get("m4")),
		mons.find(item => item.title === get.get("m5"))
	];

for (var i = 0; i < currentMons.length; i++) {
	if (currentMons[i] == undefined) {
		currentMons[i] = noMon;
	}
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
	var list = [];
	for (const mon of mons) {
		var validLevel = false
		for (const level of settings["level"][n]) {
			if (mon["levels"].includes(level)) {
				validLevel = true;
			}
		}
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
		if (validLevel && validAttribute && validField && validAntibody) {
			list.push(mon["title"]);
		}
	}
	var content = "<option hidden disabled selected value> - " + list.length + " Results - Select a mon -</option>"; //make the list start with no selection
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
	
	for (i = 0; i <= 5; i++) {
		for (const level of settings["level"][i]) {
			newUrl += "l" + i + "Level[]=" + level + "&";
		}
		for (const attribute of settings["attribute"][i]) {
			newUrl += "l" + i + "Attribute[]=" + attribute + "&";
		}
		for (const field of settings["field"][i]) {
			newUrl += "l" + i + "Field[]=" + field + "&";
		}
		for (const antibody of settings["antibody"][i]) {
			newUrl += "l" + i + "Antibody[]=" + antibody + "&";
		}
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

function updateCheckboxes() {
	for (var i = 0; i <= 5; i++) {
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
	const index = settings[e.name][n].indexOf(e.value);
	if (e.checked) {
		if (index == -1) {
			settings[e.name][n].push(e.value);
		}
	} else {
		if (index !== -1) {
			settings[e.name][n].splice(index, 1);
		}
	}
	updateUrl();
}

function refresh() {
	location.reload();
}
