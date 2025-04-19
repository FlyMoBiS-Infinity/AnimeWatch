import animeApi from '/frontend/modules/animeApi.js';
import { calculateHalfedRange, getQuerysFromString } from '/frontend/modules/calculats.js';
const storageHOST = 'https://anilibria.tv';

let itemsInPage = 9;
let pagesButtonsN = 9;
let maxPages = Infinity;

const page = document.getElementById('dynamicDiv');
const pagesList = document.getElementById('pagesList');

const urlPath = window.location.pathname.split('/'); urlPath.shift();
const urlParams = getQuerysFromString(window.location.href);

let search = urlParams.search;
urlParams.page = Number(urlParams.page);
let currentPage = typeof urlParams.page === 'number' && urlParams.page > 0 ? urlParams.page : 1;

const allItems = [];
const allPagesButtons = [];

// items Functions
const fillItem = async (itemData, element) => {
    if (typeof element != 'object') { return; };
    if (typeof itemData != 'object') { return; };
    if (typeof itemData.posters == 'object') {
        let posterURL = './frontend/images/example.png';
        if (typeof itemData.posters.original.url === 'string') { posterURL = itemData.posters.original.url }
        else if (typeof itemData.posters.medium.url === 'string') { posterURL = itemData.posters.medium.url };
        element.getElementsByTagName('img')[0].src = storageHOST + posterURL;
    };
    if (typeof itemData.names === 'object') {

        let nameAnime = '';
        if (typeof itemData.names.ru === 'string') { nameAnime = itemData.names.ru }
        else if (typeof itemData.names.alternative === 'string') { nameAnime = itemData.names.alternative }
        else if (typeof itemData.names.en === 'string') { nameAnime = itemData.names.en }
        if (nameAnime.length > 33) { nameAnime = nameAnime.slice(0, 30) + '...' };
        element.getElementsByTagName('p')[0].textContent = nameAnime;
    };
    element.getElementsByTagName('a')[0].href = '/player?id=' + itemData.id;
};
const createItem = (itemData) => {
    const element = document.createElement('div');
    const name = document.createElement('p');
    const link = document.createElement('a');
    const poster = document.createElement('img');

    // name.className = 'name';
    // poster.className = 'poster';
    element.className = 'item';
    // link.className = 'link';

    element.appendChild(poster);
    link.appendChild(name);
    element.appendChild(link);
    page.appendChild(element);

    allItems.push(element);
    fillItem(itemData, element);
};
const createItems = (itemsData) => {
    for (let i = 0; i < itemsData.length; i += 1) { createItem(itemsData[i]); };
};
const deleteItem = (first) => {
    if (first === true) { allItems.shift().remove() } else { allItems.pop().remove() };
};
const deleteItems = (n, first) => { for (let i = 0; i < n; i += 1) { deleteItem(first); } };

const changeItems = (itemsData) => {
    if (typeof itemsData != 'object') { return; };
    for (let i = 0; i < itemsData.length; i += 1) {
        fillItem(itemsData[i], allItems[i]);
    };
    deleteItems(allItems.length - itemsData.length);
    itemsData.splice(0, allItems.length);
    if (itemsData.length < 1) { return; };
    createItems(itemsData);
};
// items Functions END

// page buttons Functions
const pageButtonOnClick = function (pageN) {
    const pN = Number(this.textContent);
    if (pN === currentPage) { return; };
    currentPage = pN;
    changePage();
};
const deletePageButton = (first) => {
    if (first === true) { allPagesButtons.shift().remove() } else { allPagesButtons.pop().remove(); };
};
const deletePagesButtons = (n, first) => { for (let i = 0; i < n; i += 1) { deletePageButton(first); } };
const createPageButton = (n) => {
    const pageButton = document.createElement('button');
    pageButton.className = 'pageButton';
    pageButton.type = 'button';
    pageButton.textContent = typeof n === 'undefined' ? n : 1;
    pagesList.appendChild(pageButton);
    allPagesButtons.push(pageButton);
    pageButton.onclick = pageButtonOnClick;
};
const createPagesButtons = (n) => { for (let i = n; i > 0; i -= 1) { createPageButton(); }; };
function changePagesButtons() {
    const [strt] = calculateHalfedRange(currentPage, allPagesButtons.length, 1, maxPages);
    allPagesButtons.forEach((v, i) => { v.textContent = Math.max(1, strt) + i; });
    deletePagesButtons(-strt)
};
// page buttons Functions END

createPagesButtons(pagesButtonsN);
createItems(new Array(itemsInPage));

function changePage() {
    if (typeof currentPage === 'string') { currentPage = Number.parseInt(currentPage); };
    if (typeof currentPage !== 'number') { currentPage = 1; };
    if (currentPage > maxPages) { return; };
    let req;
    if (typeof search === 'string') {
        req = animeApi.getSearch(search, currentPage, itemsInPage);
    } else {
        req = animeApi.getUpdates(currentPage, itemsInPage);
    };
    req.then((res) => {
        res = JSON.parse(res);
        maxPages = res.pagination.pages;
        changeItems(res.list);
        changePagesButtons();
    }, (err) => {
        console.log('f', err);
    });
};

changePage();