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
function setActivity(){
    if (!rpc)return;
    var dat={};
    var state=cc.ig.TextCommand.evaluate("\\v[pvp.active]")=="true"?"PvP":cc.ig.TextCommand.evaluate("\\v[combat.active]")=="true"?"Combat":"Exploration";
    var area=(simplify.getActiveMapName()||"???").split('.')[0];
    var elem=["Neutral","Heat","Cold","Wave","Shock"][parseInt(cc.ig.TextCommand.evaluate("\\v[player.element]"))];
    
    rpc.setActivity({
        details: _areas[simplify.getActiveMapName()]||"???",
        state: `${state} (${cc.ig.TextCommand.evaluate("\\v[player.hp]")}/${cc.ig.TextCommand.evaluate("\\v[player.param.hp]")})`,
        startTimestamp: new Date().getTime()/1000-cc.sc.stats.getStat("player", "playtime"),
        partySize :parseInt(cc.ig.TextCommand.evaluate("\\v[party.size]")),
        partyMax:3,
        'smallImageKey':elem.toLowerCase(),
        'smallImageText':elem,
        'largeImageKey':artList.indexOf(area)<0?"ducklea":area.toLowerCase(),
        'largeImageText':aName[area]||"???",
        instance: false,
  });
}
/*


*/
rpc.on('ready', () => {
  setActivity();

  // activity can only be set every 15 seconds
  setInterval(() => {
    setActivity();
  }, 15e3);
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