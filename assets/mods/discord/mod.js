if(!cc)
	throw "No Modloader Found!";
const DiscordRPC=require("discord-rpc")
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
var fs = require('fs')
var areas = fs.readdirSync('assets/data/areas');
var area_names = JSON.parse(fs.readFileSync('assets/data/database.json', 'utf8')).areas;
var _areas = {}; 
var aName={};

var artList="autumn jungle-city bergen heat-dng jungle heat rhombus-sqr heat-village rookie-harbor".split(" ");
 areas.forEach(function(area) {
    var _maparea = JSON.parse(fs.readFileSync('assets/data/areas/' + area, 'utf8'));
    var _basearea = area.split(".json")[0];
    var mapArea = area_names[_basearea].name.en_US;
    _maparea.floors.forEach(function(floor) {
        floor.maps.forEach(function(map) {
            aName[map.path.split('.')[0]]=mapArea;
            if(map.name && map.name.en_US) {
                _areas[map.path] = mapArea + " - " + map.name.en_US;
            }
            else {
                _areas[map.path] = "Untitled";
            }
        });
    });
});
function isInMenu() {
	//this proved to be better at determining whether it is in a menu
	return Object.keys(ig.vars.get("session.maps")).length === 0;
}
function setActivity(){
    if (!rpc)return;
    if(isInMenu()) {
		rpc.setActivity({
			state : 'Menu',
			details : 'In the menu',
			largeImageKey : "ducklea",
			largeImageText : "Menu",
			instance : false
		});
		return;
	} 
	var isPaused = cc.ig.gameMain.paused;
	var dat={};
	var areaName = simplify.getActiveMapName().split(".")[0];
	var chapterNumber = cc.ig.TextCommand.evaluate("\\v[chapter.current]");
	var chapterName = cc.ig.TextCommand.evaluate("\\v[chapter.name."+chapterNumber+"]");
	var chapter = "";
	if(chapterNumber === "0") {
		chapter = 'Prologue - ';
	} else {
		chapter = `Chapter ${chapterNumber} - `;
	}
	chapter += chapterName;
    var partySize = parseInt(cc.ig.TextCommand.evaluate("\\v[party.size]"));
	var partyMax = 3;
	if(partySize === 1) {
		partySize = undefined;
		partyMax = undefined;
	}
	var state= "Exploring";
	if(cc.ig.TextCommand.evaluate("\\v[pvp.active]")=== "true") 
		state = "In a PvP";
	else if(cc.ig.TextCommand.evaluate("\\v[combat.active]")=== "true")
		state = "In combat ";
	 
    area= (simplify.getActiveMapName()||"???").split('.')[0];
    var elementIndex = parseInt(cc.ig.TextCommand.evaluate("\\v[player.element]"))
	var elem = ["Neutral","Heat","Cold","Shock","Wave"][elementIndex];
    rpc.setActivity({
        details: `(${chapter})`,
        state: ((isPaused ? '(Paused) ' : `${state} `) + (_areas[simplify.getActiveMapName()] || areaName )),
        startTimestamp: new Date().getTime()/1000-cc.sc.stats.getStat("player", "playtime"),
        partySize: partySize,
        partyMax: partyMax,
        'smallImageKey':elem.toLowerCase(),
        'smallImageText':elem,
        'largeImageKey':artList.indexOf(area)<0?"ducklea":area.toLowerCase(),
        'largeImageText': aName[area]|| "???",
        instance: false,
  });
}
/*


*/
rpc.on('ready', () => {
  // activity can only be set every 15 seconds
  setActivity();
  setInterval(setActivity, 15e3);
});
rpc.login("376560840012201984").catch(console.error);
/*Max hp: cc.ig.TextCommand.evaluate("\\v[player.param.hp]")
Current hp: cc.ig.TextCommand.evaluate("\\v[player.hp]")
simplify.getActiveMapName() current map (not the official name)
need to get area
In combat: cc.ig.TextCommand.evaluate("\\v[combat.active]")(edited)
In pvp: cc.ig.TextCommand.evaluate("\\v[pvp.active]")

cc.ig.TextCommand.evaluate("\\v[party.size]")

Element (number): cc.ig.TextCommand.evaluate("\\v[player.element]")

cc.sc.stats.getStat("player", "playtime")*/
