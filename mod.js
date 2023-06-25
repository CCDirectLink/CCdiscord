const paths = require('path');
const DiscordRPC = require(paths.join(
  process.cwd(),
  decodeURIComponent(new URL('./node_modules/discord-rpc', import.meta.url).pathname),
));
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

rpc.on('ready', () => {
  // activity can only be set every 15 seconds
  setActivity();
  setInterval(setActivity, 15e3);
});

rpc.login({ clientId: '823908584974450718' }).catch(console.error);

function setActivity() {
  if (!rpc) return;
  if (sc.model.isTitle() || !ig.ready) {
    rpc.setActivity({
      state: 'Menu',
      details: 'In the menu',
      largeImageKey: 'ducklea',
      largeImageText: 'Menu',
      instance: false,
    });
    return;
  }

  const area = getArea();
  const areaName = sc.map.getCurrentAreaName().value;
  const elem = getCurrentElementName();
  const timeStamp = new Date().getTime() - sc.stats.get('player', 'playtime') * 1000;
  var partySize = sc.party.getPartySize() + 1;
  var partyMax = sc.PARTY_MAX_MEMBERS + 1;

  var rpcData = {
    details: getChapterText(),
    state: getState(areaName),
    startTimestamp: timeStamp,
    partySize: partySize,
    partyMax: partyMax,
    smallImageKey: 'e-' + elem.toLowerCase(),
    smallImageText: elem,
    largeImageKey: getArtKey(area),
    largeImageText: areaName,
    instance: false,
  };
  rpc.setActivity(rpcData);
}

function getState(areaName) {
  var state;
  if (sc.model.isPaused()) {
    state = '(Paused)';
  } else {
    if (sc.pvp.isActive()) state = 'In a PvP';
    else if (sc.combat.isInCombat(ig.game.playerEntity)) state = 'In combat ';
    else state = 'Exploring';
  }
  state += ' ' + areaName;
  return state;
}

function getArea() {
  return (ig.game.mapName || '???').split('.')[0];
}

function getChapterText() {
  var chapter = sc.model.player.chapter;
  var chapterData = ig.database.get('chapters')[chapter];
  var chapterRet;
  if (chapterData.prefix) {
    chapterRet = chapterData.prefix[ig.currentLang];
  } else {
    chapter = chapter.toString().padStart(2, '0');
    chapterRet = `Chapter ${chapter}`;
  }
  chapterRet += ': ' + chapterData.name[ig.currentLang];
  return chapterRet;
}

const ART_LIST = [
  'cargo-ship',
  'rhombus-dng',
  'arid',
  'arid-dng',
  'autumn',
  'autumn-fall',
  'beach',
  'bergen',
  'bergen-trail',
  'cold-dng',
  'evo-village',
  'final-dng',
  'forest',
  'heat',
  'heat-dng',
  'heat-village',
  'hideout',
  'jungle',
  'jungle-city',
  'rhombus-sqr',
  'rookie-harbor',
  'shock-dng',
  'wave-dng',
  'tree-dng',
];

function getArtKey(area) {
  if (ART_LIST.indexOf(area) < 0) {
    return 'ducklea';
  }

  return area;
}

function getCurrentElementName() {
  return ['Neutral', 'Heat', 'Cold', 'Shock', 'Wave'][sc.model.player.currentElementMode];
}
