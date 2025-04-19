import animeApi from '../modules/animeApi.js';
import { getQuerysFromString } from '../modules/calculats.js';
import { animeResNormal } from '../modules/animeResNormal.js'

let storage_HOST = 'https://anilibria.tv';
let player_HOST = 'https://cache.libria.fun';
const urlParams = getQuerysFromString(window.location.href);
let id = urlParams.id;
let maxTitleLength = 30;

if (typeof id !== 'string') {
    window.location.href = '../pages/home.html';
};

const makeEpisodesList = (episodesList) => {
    const folderArr = [];
    episodesList.forEach((episode, i) => {
        const episodeInfo = {};
        let episodeURLS = '';
        if (typeof player_HOST === 'string' && player_HOST.length > 1) {
            if (typeof episode['hls'] === 'object') {
                if (typeof episode['hls']['fhd'] === 'string' && episode['hls']['fhd'].length > 1) {
                    episodeURLS += `[1080]https://${player_HOST}/${episode['hls']['fhd']},`;
                };
                if (typeof episode['hls']['hd'] === 'string' && episode['hls']['hd'].length > 1) {
                    episodeURLS += `[720]https://${player_HOST}/${episode['hls']['hd']},`;
                };
                if (typeof episode['hls']['sd'] === 'string' && episode['hls']['sd'].length > 1) {
                    episodeURLS += `[480]https://${player_HOST}/${episode['hls']['sd']},`;
                };
            };
        };

        episodeInfo['title'] = `${typeof episode['name'] === 'string' ?
            episode['name'] : 'Episode'} - ` +
            `${typeof episode['episode'] === 'string' && episode['episode'].length > 0 ?
                episode['episode'] : i + 1}`;
        episodeInfo['file'] = episodeURLS;
        episodeInfo['poster'] = storage_HOST + episode['preview'];

        folderArr.push(episodeInfo);
    });
    return folderArr;
};

const makeFranchisesList = (franchisesList) => {
    const folderArr = [];
    franchisesList.forEach((franchise) => {
        let titleName = String(franchise['names']['ru']) || String(franchise['names']['en']) ||
            String(franchise['names']['alternative']) || '???';
        if (titleName.length > maxTitleLength) { titleName = titleName.slice(0, maxTitleLength + 1) + '...' };
        player_HOST = franchise['player']['host'];
        const folderList = {
            'title': `${titleName} {${String(franchise['type']['string'])}} ` +
                `|${String(franchise['player']['episodes']['string'])}| [${String(franchise['status']['string'])}]`,
            'folder': makeEpisodesList(franchise['player']['list']),
        };
        folderArr.push(folderList);
    });
    return folderArr;
};

animeApi.getTitle(id).then((resTitle) => {
    resTitle = animeResNormal(resTitle);

    const playerHost = resTitle.player.host;
    const watchList = { 'id': 'player', 'file': [] };

    if (typeof resTitle['franchises'] === 'object' && typeof resTitle['franchises'][0] === 'object') {
        const franchisesIdArr = []; const franchisesCodeArr = [];
        resTitle['franchises'][0]['releases'].forEach((F_ID) => {
            franchisesIdArr.push(F_ID.id);
            franchisesCodeArr.push(F_ID.code);
        });

        animeApi.getTitleList(franchisesIdArr, franchisesCodeArr).then((resTitlesList) => {
            resTitlesList = animeResNormal(resTitlesList);

            watchList['file'] = makeFranchisesList(resTitlesList);
            new Playerjs(watchList);
        }, (err) => { });
        return;
    };

    let titleName = String(resTitle['names']['ru']) || String(resTitle['names']['en']) ||
        String(franchise['names']['alternative']) || '???';
    if (titleName.length > maxTitleLength) { titleName = titleName.slice(0, maxTitleLength + 1) + '...' };
    player_HOST = resTitle['player']['host'];
    console.log(makeEpisodesList(resTitle.player.list))
    watchList['file'] = makeEpisodesList(resTitle.player.list);
    new Playerjs(watchList);
}, (err) => {
    // error
});