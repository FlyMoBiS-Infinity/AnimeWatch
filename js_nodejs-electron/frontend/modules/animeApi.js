const apiURL = 'https://api.anilibria.tv/v3';
import network from './network.js';

const module = {
    getUpdates: (pageN, itemsInPage) => {
        if (typeof pageN != 'number' || pageN < 1) { pageN = 1 };
        if (typeof itemsInPage != 'number' || itemsInPage < 1) { itemsInPage = 1 };
        return network.req.xhr(apiURL + '/title/updates', { method: 'GET', timeout: 30000, }, {
            'page': pageN, 'items_per_page': itemsInPage,
            'filter': 'id,names,posters', 'include': 'raw_poster',
        });
    },
    getSearch: (search, pageN, itemsInPage) => {
        if (typeof pageN != 'number' || pageN < 1) { pageN = 1 };
        if (typeof itemsInPage != 'number' || itemsInPage < 1) { itemsInPage = 1 };
        return network.req.xhr(apiURL + '/title/search', { method: 'GET', timeout: 30000, }, {
            'search': search, 'page': pageN, 'items_per_page': itemsInPage,
            'filter': 'id,names,posters',
        });
    },
    getTitle: (id) => {
        return network.req.xhr(apiURL + '/title', { method: 'GET', timeout: 30000, }, {
            'id': id, 'playlist_type': 'array',
            'filter': 'names,description,status.string,type.string,franchises,team,player,posters,blocked',
        });
    },
    getTitleList: (idList, codeList) => {
        if (typeof idList === 'object') {
            const ids = Object.entries(idList)
            idList = '';
            ids.forEach((id) => {
                idList += `${id[1]},`;
            });
        };
        if (typeof codeList === 'object') {
            const codes = Object.entries(codeList)
            codeList = '';
            codes.forEach((code) => {
                codeList += `${code[1]},`;
            });
        };
        return network.req.xhr(apiURL + '/title/list', { method: 'GET', timeout: 3000 }, {
            'id_list': idList, 'code_list': codeList, 'playlist_type': 'array',
            'filter': 'names,description,status.string,type.string,team,player,posters,blocked',
        });
    },
};

export default module;