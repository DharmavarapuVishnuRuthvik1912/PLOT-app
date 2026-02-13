const STORAGE_KEY = 'plot-prototype-state-v1';

const screens = document.querySelectorAll('.screen');
const tabs = document.querySelectorAll('.tab');
const overlay = document.getElementById('overlay');
const sheets = document.querySelectorAll('.sheet');
const menu = document.getElementById('sort-menu');
const tabBubble = document.querySelector('.tab-bubble');
const optionBubble = document.querySelector('.option-bubble');

const loginForm = document.getElementById('login-form');
const plotLogoImg = document.getElementById('plot-logo-img');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');
const loginMessage = document.getElementById('login-message');

const accountPanel = document.getElementById('account-panel');
const accountName = document.getElementById('account-name');
const accountEmail = document.getElementById('account-email');
const logoutBtn = document.getElementById('logout-btn');
const resetBtn = document.getElementById('reset-btn');
const accountStateBtn = document.querySelector('[data-toggle="account-state"]');

const createName = document.getElementById('create-name');
const createEmail = document.getElementById('create-email');
const createPassword = document.getElementById('create-password');
const createRepeat = document.getElementById('create-repeat');
const createBtn = document.getElementById('create-btn');
const createMessage = document.getElementById('create-message');

const watchedList = document.getElementById('series-watching-list');
const watchedDoneList = document.getElementById('series-watched-list');
const nextUpLabel = document.getElementById('next-up-label');
const allBtn = document.querySelector('[data-toggle="all-watched"]');
const globalSearchInput = document.getElementById('global-search-input');
const globalSearchBtn = document.getElementById('global-search-btn');
const clearSearchBtn = document.getElementById('clear-search-btn');
const searchResultsSection = document.getElementById('search-results-section');
const homeGenreChips = document.getElementById('home-genre-chips');
const movieWatchlistBtn = document.getElementById('movie-watchlist-btn');
const movieWatchedBtn = document.getElementById('movie-watched-btn');
const movieAddListBtn = document.getElementById('movie-add-list-btn');
const movieTrailersBtn = document.getElementById('movie-trailers-btn');
const seriesWatchlistBtn = document.getElementById('series-watchlist-btn');
const seriesWatchedBtn = document.getElementById('series-watched-btn');
const seriesAddListBtn = document.getElementById('series-add-list-btn');
const seriesTrailersBtn = document.getElementById('series-trailers-btn');
const movieRecommendations = document.getElementById('movie-recommendations');
const seriesRecommendations = document.getElementById('series-recommendations');
const moviesWatchlistCarousel = document.getElementById('movies-watchlist');
const moviesWatchedList = document.getElementById('movies-watched-list');
const seriesWatchlistCarousel = document.getElementById('series-watchlist');
const seasonSlider = document.getElementById('season-slider');
const episodesList = document.getElementById('episodes-list');
const currentSeasonPill = document.getElementById('current-season-pill');
const catalogTitle = document.getElementById('catalog-title');
const catalogGrid = document.getElementById('catalog-grid');
const catalogLoading = document.getElementById('catalog-loading');
const catalogScreen = document.getElementById('catalog-screen');
const catalogLoadMoreBtn = document.getElementById('catalog-load-more-btn');
const catalogBackBtn = document.getElementById('catalog-back-btn');
const addToListTitle = document.getElementById('add-to-list-title');
const addToListOptions = document.getElementById('add-to-list-options');
const addToListMessage = document.getElementById('add-to-list-message');
const quickListNameInput = document.getElementById('quick-list-name-input');
const quickCreateListBtn = document.getElementById('quick-create-list-btn');
const quickContextMenu = document.getElementById('quick-context-menu');
const quickTitleActionsTitle = document.getElementById('quick-title-actions-title');
const quickTitleActionsMessage = document.getElementById('quick-title-actions-message');
const quickActionWatchlistBtn = document.getElementById('quick-action-watchlist');
const quickActionWatchedBtn = document.getElementById('quick-action-watched');
const quickActionAddListBtn = document.getElementById('quick-action-add-list');
const trailersTitle = document.getElementById('trailers-title');
const trailersList = document.getElementById('trailers-list');
const newListBtn = document.getElementById('new-list-btn');
const userLists = document.getElementById('user-lists');
const listNameInput = document.getElementById('list-name-input');
const saveListBtn = document.getElementById('save-list-btn');
const listSearchInput = document.getElementById('list-search-input');
const listSearchBtn = document.getElementById('list-search-btn');
const listSearchResults = document.getElementById('list-search-results');
const listItems = document.getElementById('list-items');
const selectFolderBtn = document.getElementById('select-folder-btn');
const folderPickerInput = document.getElementById('folder-picker-input');
const folderStatus = document.getElementById('folder-status');
let searchDebounce = null;
let currentScreenId = 'home';
let previousScreenId = 'home';
let lastMainScreenId = 'home';
let lastDetailScreenId = '';
const selectedMedia = {
  movie: null,
  tv: null
};
const selectedDetail = {
  movie: null,
  tv: null
};
const detailRequestSeq = {
  movie: 0,
  tv: 0
};
const sectionData = {
  'home-trending-movies': [],
  'home-trending-series': [],
  'movies-trending': [],
  'movies-theatres': [],
  'movies-upcoming': [],
  'series-trending': [],
  'series-on-air': []
};
const knownMedia = {
  movieById: new Map(),
  tvById: new Map(),
  movieByTitle: new Map(),
  tvByTitle: new Map()
};
const seriesView = {
  id: null,
  title: '',
  seasons: [],
  activeSeason: 1
};
const catalogState = {
  mode: 'section',
  sectionId: '',
  genre: '',
  mediaFilter: 'all',
  page: 1,
  loading: false,
  hasMore: true,
  items: []
};
const listEditor = {
  activeListId: null,
  draftItems: []
};
let listItemsViewMode = 'list';
let addToListTarget = null;
let quickActionTarget = null;
let longPressTimer = null;
let suppressNextClick = false;
let longPressStartX = 0;
let longPressStartY = 0;
let quickActionAnchorEl = null;
const CATALOG_BATCH_SIZE = 12;
const HOME_GENRES = [
  'Science Fiction',
  'Drama',
  'Animation',
  'Thriller',
  'Action',
  'Comedy',
  'Crime',
  'Mystery',
  'Fantasy',
  'Romance',
  'Horror',
  'Adventure',
  'Family',
  'Documentary',
  'History',
  'War',
  'Music'
];
let genresExpanded = false;
const GENRE_IDS = {
  movie: {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    history: 36,
    horror: 27,
    music: 10402,
    mystery: 9648,
    romance: 10749,
    'science fiction': 878,
    thriller: 53,
    war: 10752,
    western: 37
  },
  tv: {
    action: 10759,
    adventure: 10759,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    kids: 10762,
    mystery: 9648,
    news: 10763,
    reality: 10764,
    'science fiction': 10765,
    fantasy: 10765,
    war: 10768,
    western: 37
  }
};

const state = loadState();
let customOrder = Array.from(document.querySelectorAll('#series-watching-list .list-item')).map((item) => {
  return item.querySelector('.item-title')?.textContent.trim() || '';
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function asElement(node) {
  if (!node) return null;
  if (node.nodeType === 1) return node;
  return node.parentElement || null;
}

function movieMeta(movie) {
  const parts = [];
  if (movie.rating) parts.push(`${movie.rating}`);
  if (movie.runtime) {
    const hours = Math.floor(movie.runtime / 60);
    const mins = movie.runtime % 60;
    parts.push(`${hours}h ${mins}m`);
  }
  return parts.join(' • ') || 'No metadata';
}

function tvMeta(show) {
  const parts = [];
  if (show.seasons) parts.push(`Season ${show.seasons}`);
  if (show.rating) parts.push(`${show.rating}`);
  return parts.join(' • ') || 'No metadata';
}

function registerKnownItem(item) {
  if (!item || !item.id || !item.mediaType || !item.title) return;
  const id = String(item.id);
  const title = String(item.title).trim().toLowerCase();
  if (!title) return;
  if (item.mediaType === 'movie') {
    knownMedia.movieById.set(id, item);
    knownMedia.movieByTitle.set(title, item);
  } else if (item.mediaType === 'tv') {
    knownMedia.tvById.set(id, item);
    knownMedia.tvByTitle.set(title, item);
  }
}

function resolveKnownByTitle(title, mediaType) {
  const key = String(title || '').trim().toLowerCase();
  if (!key) return null;
  if (mediaType === 'movie') return knownMedia.movieByTitle.get(key) || null;
  return knownMedia.tvByTitle.get(key) || null;
}

function createCardHtml(item) {
  registerKnownItem(item);
  const meta = item.mediaType === 'movie' ? movieMeta(item) : tvMeta(item);
  const style = item.posterPath ? ` style=\"background-image:url('${escapeHtml(item.posterPath)}')\"` : '';
  const open = item.mediaType === 'movie' ? 'movie-detail' : 'series-detail';
  return `<article class=\"card\" data-open=\"${open}\" data-media-type=\"${item.mediaType}\" data-media-id=\"${item.id}\"><div class=\"poster\"${style}></div><div class=\"card-title\">${escapeHtml(item.title)}</div><div class=\"card-meta\">${escapeHtml(meta)}</div></article>`;
}

function fillCarousel(id, items) {
  const el = document.getElementById(id);
  if (!el || !Array.isArray(items) || !items.length) return;
  items.forEach(registerKnownItem);
  el.innerHTML = items.map(createCardHtml).join('');
}

function fillErrorCard(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `<article class=\"card\"><div class=\"poster\"></div><div class=\"card-title\">Live Data Error</div><div class=\"card-meta\">${escapeHtml(message)}</div></article>`;
}

function rotate(list, offset) {
  if (!Array.isArray(list) || !list.length) return [];
  const n = offset % list.length;
  return list.slice(n).concat(list.slice(0, n));
}

function setSectionData(id, items) {
  sectionData[id] = Array.isArray(items) ? items.slice() : [];
}

function renderCatalogCards(items, append = false) {
  if (!catalogGrid) return;
  const source = Array.isArray(items) ? items : [];
  const filtered = catalogState.mediaFilter === 'all'
    ? source
    : source.filter((item) => item && item.mediaType === catalogState.mediaFilter);
  const html = filtered.length
    ? filtered.map(createCardHtml).join('')
    : '<article class="card"><div class="poster"></div><div class="card-title">No items</div><div class="card-meta">Try again later</div></article>';
  if (!append) {
    catalogGrid.innerHTML = html;
  } else if (filtered.length) {
    catalogGrid.insertAdjacentHTML('beforeend', filtered.map(createCardHtml).join(''));
  }
}

function refreshCatalogLoadMoreVisibility() {
  if (!catalogLoadMoreBtn) return;
  const show = catalogState.mode === 'genre' && catalogState.hasMore;
  catalogLoadMoreBtn.style.display = show ? 'inline-flex' : 'none';
}

function dedupeCatalogItems(items) {
  const seen = new Set();
  return (items || []).filter((item) => {
    const key = `${item.mediaType}:${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function matchesGenreItem(item, genreName) {
  if (!item) return false;
  const name = String(genreName || '').trim().toLowerCase();
  if (!name) return false;
  const genreNames = Array.isArray(item.genres) ? item.genres.map((g) => String(g).toLowerCase()) : [];
  if (genreNames.some((g) => g === name || g.includes(name) || name.includes(g))) return true;
  const ids = Array.isArray(item.genreIds) ? item.genreIds.map((id) => Number(id)).filter(Number.isFinite) : [];
  if (!ids.length) return false;
  const key = item.mediaType === 'tv' ? 'tv' : 'movie';
  const wanted = GENRE_IDS[key][name];
  return Number.isFinite(wanted) ? ids.includes(wanted) : false;
}

function localGenreSeed(genreName) {
  const pool = [];
  Object.values(sectionData).forEach((rows) => {
    (rows || []).forEach((item) => pool.push(item));
  });
  const matches = pool.filter((item) => matchesGenreItem(item, genreName));
  return dedupeCatalogItems(matches).slice(0, CATALOG_BATCH_SIZE);
}

async function loadMoreCatalog() {
  if (!window.PlotData || catalogState.loading || !catalogState.hasMore) return;
  if (currentScreenId !== 'catalog-screen') return;
  catalogState.loading = true;
  if (catalogLoading) catalogLoading.textContent = 'Loading more...';
  try {
    const existing = new Set(catalogState.items.map((item) => `${item.mediaType}:${item.id}`));
    let loadedAny = false;
    const maxTries = catalogState.mode === 'genre' ? 2 : 1;
    for (let tries = 0; tries < maxTries; tries += 1) {
      const nextPage = catalogState.page + 1;
      const rows = catalogState.mode === 'genre'
        ? await window.PlotData.fetchByGenre(catalogState.genre, nextPage)
        : await window.PlotData.fetchSectionPage(catalogState.sectionId, nextPage);
      catalogState.page = nextPage;
      if (!rows.length) continue;
      const batch = rows.slice(0, CATALOG_BATCH_SIZE);
      const newItems = batch.filter((item) => !existing.has(`${item.mediaType}:${item.id}`));
      newItems.forEach((item) => existing.add(`${item.mediaType}:${item.id}`));
      if (!newItems.length) {
        if (catalogState.mode === 'genre' && batch.length) {
          renderCatalogCards(batch, true);
          loadedAny = true;
          break;
        }
        continue;
      }
      catalogState.items = dedupeCatalogItems(catalogState.items.concat(newItems));
      renderCatalogCards(newItems, true);
      loadedAny = true;
      break;
    }
    if (!loadedAny) {
      if (catalogState.mode === 'genre') {
        if (catalogLoading) catalogLoading.textContent = 'Loading more suggestions...';
        refreshCatalogLoadMoreVisibility();
        return;
      }
      catalogState.hasMore = false;
      if (catalogLoading) catalogLoading.textContent = 'No more titles';
      refreshCatalogLoadMoreVisibility();
      return;
    }
    if (catalogLoading) catalogLoading.textContent = 'Scroll for more';
    refreshCatalogLoadMoreVisibility();
  } catch {
    catalogState.hasMore = false;
    if (catalogLoading) catalogLoading.textContent = 'Could not load more';
    refreshCatalogLoadMoreVisibility();
  } finally {
    catalogState.loading = false;
    if (catalogState.mode === 'genre' && catalogScreen && currentScreenId === 'catalog-screen') {
      const nearBottom = catalogScreen.scrollTop + catalogScreen.clientHeight >= catalogScreen.scrollHeight - 900;
      if (nearBottom && catalogState.hasMore) {
        setTimeout(() => { loadMoreCatalog(); }, 30);
      }
    }
  }
}

async function ensureCatalogFilled() {
  if (!catalogScreen) return;
  for (let i = 0; i < 3; i += 1) {
    if (!catalogState.hasMore || catalogState.loading) break;
    const nearBottom = catalogScreen.scrollHeight <= catalogScreen.clientHeight + 80;
    if (!nearBottom) break;
    await loadMoreCatalog();
  }
}

async function openCatalogForSection(sectionId) {
  if (!catalogGrid || !catalogTitle) return;
  const titles = {
    'home-trending-movies': 'All Trending Movies',
    'home-trending-series': 'All Trending Series',
    'movies-trending': 'Trending Movies',
    'movies-theatres': 'In Theatres',
    'movies-upcoming': 'Upcoming Movies',
    'series-trending': 'Trending Shows',
    'series-on-air': 'On The Air'
  };
  catalogTitle.textContent = titles[sectionId] || 'Catalog';
  catalogState.mode = 'section';
  catalogState.sectionId = sectionId;
  catalogState.genre = '';
  catalogState.mediaFilter = 'all';
  catalogState.page = 1;
  catalogState.hasMore = true;
  catalogState.items = [];
  updateCatalogFilterUI();
  refreshCatalogLoadMoreVisibility();
  const screen = document.getElementById('catalog-screen');
  if (screen) screen.classList.remove('genre-heading-shift');
  if (catalogLoading) catalogLoading.textContent = 'Loading...';
  try {
    const rows = window.PlotData ? await window.PlotData.fetchSectionPage(sectionId, 1) : [];
    const seedRows = rows.length ? rows.slice(0, CATALOG_BATCH_SIZE) : (sectionData[sectionId] || []).slice(0, CATALOG_BATCH_SIZE);
    catalogState.items = dedupeCatalogItems(seedRows);
  } catch {
    catalogState.items = dedupeCatalogItems((sectionData[sectionId] || []).slice(0, CATALOG_BATCH_SIZE));
  }
  renderCatalogCards(catalogState.items, false);
  if (catalogLoading) catalogLoading.textContent = catalogState.items.length ? 'Scroll for more' : 'No items';
  ensureCatalogFilled();
  if (catalogState.mode === 'genre' && catalogState.items.length < 24) {
    setTimeout(() => {
      loadMoreCatalog();
      setTimeout(() => loadMoreCatalog(), 250);
    }, 50);
  }
}

async function openCatalogForGenre(genreName) {
  if (!window.PlotData || !catalogGrid || !catalogTitle) return;
  catalogTitle.textContent = `${genreName} Picks`;
  catalogState.mode = 'genre';
  catalogState.sectionId = '';
  catalogState.genre = genreName;
  catalogState.mediaFilter = 'all';
  catalogState.page = 1;
  catalogState.hasMore = true;
  catalogState.items = [];
  updateCatalogFilterUI();
  refreshCatalogLoadMoreVisibility();
  catalogGrid.innerHTML = '';
  const seed = localGenreSeed(genreName);
  if (seed.length) {
    catalogState.items = seed.slice();
    renderCatalogCards(seed, false);
    if (catalogLoading) catalogLoading.textContent = 'Refreshing...';
  } else if (catalogLoading) {
    catalogLoading.textContent = 'Loading...';
  }
  try {
    const rows = await window.PlotData.fetchByGenre(genreName, 1);
    const fresh = dedupeCatalogItems((rows || []).slice(0, CATALOG_BATCH_SIZE));
    if (fresh.length) {
      catalogState.items = fresh;
      catalogState.hasMore = true;
      renderCatalogCards(fresh, false);
      if (catalogLoading) catalogLoading.textContent = 'Scroll for more';
      refreshCatalogLoadMoreVisibility();
    } else if (seed.length) {
      catalogState.hasMore = true;
      if (catalogLoading) catalogLoading.textContent = 'Scroll for more';
      refreshCatalogLoadMoreVisibility();
    } else {
      catalogState.hasMore = true;
      if (catalogLoading) catalogLoading.textContent = 'No results yet — tap Load more';
      refreshCatalogLoadMoreVisibility();
    }
  } catch {
    if (!seed.length) {
      catalogState.hasMore = true;
      if (catalogLoading) catalogLoading.textContent = 'Could not load now — tap Load more';
      refreshCatalogLoadMoreVisibility();
    } else if (catalogLoading) {
      catalogLoading.textContent = 'Scroll for more';
      refreshCatalogLoadMoreVisibility();
    }
  }
  ensureCatalogFilled();

  const screen = document.getElementById('catalog-screen');
  if (screen) {
    screen.classList.remove('genre-heading-shift');
    requestAnimationFrame(() => screen.classList.add('genre-heading-shift'));
  }
}

function fillChips(containerId, values) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const chips = (values || []).slice(0, 4);
  el.innerHTML = chips.length
    ? chips.map((value) => `<button class=\"chip\">${escapeHtml(value)}</button>`).join('')
    : '<button class=\"chip\">Not available</button>';
}

function genreLabel(name) {
  return name === 'Science Fiction' ? 'Sci‑Fi' : name;
}

function renderHomeGenres() {
  if (!homeGenreChips) return;
  const visible = genresExpanded ? HOME_GENRES : HOME_GENRES.slice(0, 6);
  const html = visible
    .map((name) => `<button class="chip" data-genre="${escapeHtml(name)}">${escapeHtml(genreLabel(name))}</button>`)
    .join('');
  const toggle = `<button class="chip" data-action="toggle-genres">${genresExpanded ? 'Less' : 'More'}</button>`;
  homeGenreChips.innerHTML = html + toggle;
}

function updateCatalogFilterUI() {
  const row = document.getElementById('catalog-filter-row');
  if (!row) return;
  row.style.display = catalogState.mode === 'genre' ? 'flex' : 'none';
  row.querySelectorAll('[data-catalog-filter]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.catalogFilter === catalogState.mediaFilter);
  });
}

function fillCast(containerId, names) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const cast = (names || []).slice(0, 20);
  el.innerHTML = cast.length
    ? cast.map((entry) => {
      const name = typeof entry === 'string' ? entry : (entry.name || 'Unknown');
      const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1f1f1f&color=f2f2f2&size=256`;
      const src = (typeof entry === 'object' && entry.photo) ? entry.photo : fallback;
      const photo = ` style="background-image:url('${escapeHtml(src)}');background-size:cover;background-position:center;"`;
      return `<div class=\"cast\"><div class=\"avatar\"${photo}></div><div class=\"cast-name\">${escapeHtml(name)}</div></div>`;
    }).join('')
    : '<div class=\"cast\"><div class=\"avatar\"></div><div class=\"cast-name\">No cast data</div></div>';
}

function fillSourceLinks(containerId, item, mediaType) {
  const el = document.getElementById(containerId);
  if (!el || !item) return;
  const typePath = mediaType === 'movie' ? 'movie' : 'tv';
  const links = [];
  if (item.imdbId) {
    links.push({ label: 'IMDb', url: `https://www.imdb.com/title/${encodeURIComponent(item.imdbId)}/` });
  }
  links.push({ label: 'TMDB', url: `https://www.themoviedb.org/${typePath}/${encodeURIComponent(item.id)}` });
  links.push({ label: 'Search', url: `https://www.google.com/search?q=${encodeURIComponent(`${item.title} streaming`)}` });
  if (Array.isArray(item.providers) && item.providers.length) {
    links.push({ label: 'Where to Watch', url: `https://www.justwatch.com/us/search?q=${encodeURIComponent(item.title)}` });
  }
  el.innerHTML = links.map((link) => `<button class="chip" data-link="${escapeHtml(link.url)}">${escapeHtml(link.label)}</button>`).join('');
}

function renderRecommendationsFor(item, container, mediaType) {
  if (!container || !item) return;
  const allRows = [];
  Object.values(sectionData).forEach((rows) => {
    (rows || []).forEach((row) => allRows.push(row));
  });
  const primaryGenre = Array.isArray(item.genres) && item.genres.length ? String(item.genres[0]).toLowerCase() : '';
  const seen = new Set();
  const unique = allRows.filter((row) => {
    if (!row || row.mediaType !== mediaType || String(row.id) === String(item.id)) return false;
    const key = `${row.mediaType}:${row.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const scored = unique
    .map((row) => {
      const g = Array.isArray(row.genres) && row.genres.length ? String(row.genres[0]).toLowerCase() : '';
      return { row, score: primaryGenre && g === primaryGenre ? 2 : 1, rand: Math.random() };
    })
    .sort((a, b) => (b.score - a.score) || (a.rand - b.rand));

  const picks = scored.slice(0, 12).map((x) => x.row);
  container.innerHTML = picks.length
    ? picks.map(createCardHtml).join('')
    : '<article class="card"><div class="poster"></div><div class="card-title">No recommendations yet</div><div class="card-meta">Load more titles first</div></article>';
}

function findMediaItem(mediaType, id) {
  const pools = [
    state.myMoviesWatchlist,
    state.myMoviesWatched,
    state.mySeriesWatchlist,
    state.mySeriesWatched,
    ...Object.values(sectionData)
  ];
  for (const pool of pools) {
    const hit = (pool || []).find((row) => row && row.mediaType === mediaType && String(row.id) === String(id));
    if (hit) return hit;
  }
  return null;
}

function renderListsHome() {
  if (!userLists) return;
  const lists = Array.isArray(state.customLists) ? state.customLists : [];
  if (!lists.length) {
    userLists.innerHTML = '<div class="list-item"><div><div class="item-title">No lists yet</div><div class="item-sub">Tap + Add to create a list</div></div></div>';
    return;
  }
  userLists.innerHTML = lists.map((list) => {
    const top3 = Array.isArray(list.items) ? list.items.slice(0, 3) : [];
    const stack = top3.length
      ? top3.map((item) => {
        const style = item.posterPath ? ` style="background-image:url('${escapeHtml(item.posterPath)}')"` : '';
        return `<div class="stack-poster"${style}></div>`;
      }).join('')
      : '<div class="stack-poster"></div>';
    return `<div class="list-card" data-open="list-detail" data-list-id="${escapeHtml(list.id)}"><div class="poster-stack">${stack}</div><div><div class="item-title">${escapeHtml(list.name || 'My List')}</div><div class="item-sub">${(list.items || []).length} titles</div></div><button class="movie-action" data-delete-list="${escapeHtml(list.id)}">Remove</button></div>`;
  }).join('');
}

function openListEditor(listId) {
  let list = (state.customLists || []).find((x) => String(x.id) === String(listId));
  if (!list) {
    list = { id: `list-${Date.now()}`, name: 'My List', items: [] };
    state.customLists.unshift(list);
  }
  listEditor.activeListId = list.id;
  listEditor.draftItems = Array.isArray(list.items) ? list.items.slice() : [];
  if (listNameInput) listNameInput.value = list.name || 'My List';
  if (listSearchInput) listSearchInput.value = '';
  if (listSearchResults) listSearchResults.innerHTML = '';
  document.querySelectorAll('[data-list-items-view]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.listItemsView === listItemsViewMode);
  });
  renderListEditorItems();
}

function renderListEditorItems() {
  if (!listItems) return;
  listItems.classList.toggle('grid-mode', listItemsViewMode === 'grid');
  if (!listEditor.draftItems.length) {
    listItems.innerHTML = '<div class="list-item"><div><div class="item-title">No titles yet</div><div class="item-sub">Search and add titles</div></div></div>';
    return;
  }
  listItems.innerHTML = listEditor.draftItems.map((item) => {
    const style = item.posterPath ? ` style=\"background-image:url('${escapeHtml(item.posterPath)}');background-size:cover;background-position:center;\"` : '';
    const open = item.mediaType === 'movie' ? 'movie-detail' : 'series-detail';
    const watchedMovie = item.mediaType === 'movie' && !!findStoredItem(state.myMoviesWatched, item.id);
    const watchedSeries = item.mediaType === 'tv' && !!findStoredItem(state.mySeriesWatched, item.id);
    const watchedBadge = (watchedMovie || watchedSeries) ? '<span class="watched-dot">✓</span>' : '';
    return `<div class="list-item" data-open="${open}" data-media-type="${escapeHtml(item.mediaType)}" data-media-id="${escapeHtml(item.id)}"><div class="thumb-wrap"><div class="thumb"${style}></div>${watchedBadge}</div><div><div class="item-title">${escapeHtml(item.title)}</div><div class="item-sub">${item.mediaType === 'movie' ? 'Movie' : 'Series'}</div></div><button class="movie-action" data-remove-list-item="${escapeHtml(item.mediaType)}:${escapeHtml(item.id)}">Remove</button></div>`;
  }).join('');
}

function renderFolderStatus() {
  if (!folderStatus) return;
  folderStatus.textContent = state.localFolderName ? `Selected: ${state.localFolderName}` : 'Not selected';
}

function setupBrandLogo() {
  if (!plotLogoImg) return;
  const fallbackSvg = plotLogoImg.nextElementSibling;
  const sources = [
    'assets/plot-logo.PNG',
    'assets/plot-logo.png',
    'assets/plot-logo.jpg',
    'assets/plot-logo.jpeg',
    'assets/plot-logo.webp',
    'assets/plot-logo.svg'
  ];
  let idx = 0;
  const tryNext = () => {
    if (idx >= sources.length) {
      plotLogoImg.style.display = 'none';
      if (fallbackSvg) fallbackSvg.style.display = 'block';
      return;
    }
    const src = sources[idx];
    idx += 1;
    plotLogoImg.src = src;
  };
  plotLogoImg.onerror = () => tryNext();
  plotLogoImg.onload = () => {
    plotLogoImg.style.display = 'block';
    if (fallbackSvg) fallbackSvg.style.display = 'none';
  };
  tryNext();
}

function renderAddToListSheet(item) {
  if (!addToListOptions) return;
  const title = item && item.title ? item.title : 'Title';
  if (addToListTitle) addToListTitle.textContent = `Add "${title}" To List`;
  if (addToListMessage) addToListMessage.textContent = '';
  if (quickListNameInput) quickListNameInput.value = '';

  const lists = Array.isArray(state.customLists) ? state.customLists : [];
  if (!lists.length) {
    addToListOptions.innerHTML = '<div class="list-item"><div><div class="item-title">No lists yet</div><div class="item-sub">Create one above to add this title now</div></div></div>';
    return;
  }

  addToListOptions.innerHTML = lists.map((list) => {
    const count = Array.isArray(list.items) ? list.items.length : 0;
    const top3 = Array.isArray(list.items) ? list.items.slice(0, 3) : [];
    const stack = top3.length
      ? top3.map((row) => {
        const style = row.posterPath ? ` style="background-image:url('${escapeHtml(row.posterPath)}')"` : '';
        return `<div class="stack-poster"${style}></div>`;
      }).join('')
      : '<div class="stack-poster"></div>';
    return `<button class="list-item add-to-list-item" data-add-to-list-id="${escapeHtml(list.id)}"><div class="poster-stack">${stack}</div><div><div class="item-title">${escapeHtml(list.name || 'My List')}</div><div class="item-sub">${count} title${count === 1 ? '' : 's'}</div></div></button>`;
  }).join('');
}

function setAddToListMessage(text, error = false) {
  if (!addToListMessage) return;
  addToListMessage.textContent = text || '';
  addToListMessage.style.color = error ? '#ff8f8f' : '';
}

function addCurrentTargetToList(list) {
  if (!list || !addToListTarget) return { ok: false, reason: 'No title selected.' };
  list.items = Array.isArray(list.items) ? list.items : [];
  const exists = list.items.some((row) => String(row.id) === String(addToListTarget.id) && row.mediaType === addToListTarget.mediaType);
  if (exists) return { ok: false, reason: `Already in "${list.name}".` };
  list.items.unshift(addToListTarget);
  saveState();
  renderListsHome();
  if (listEditor.activeListId && String(listEditor.activeListId) === String(list.id)) {
    listEditor.draftItems = list.items.slice();
    renderListEditorItems();
  }
  return { ok: true, reason: `Added to "${list.name}".` };
}

function createListFromQuickInput() {
  if (!quickListNameInput) {
    setAddToListMessage('Input not available.', true);
    return;
  }
  const name = String(quickListNameInput.value || '').trim();
  if (!name) {
    setAddToListMessage('Enter a list name.', true);
    return;
  }
  const existing = (state.customLists || []).find((row) => String(row.name || '').trim().toLowerCase() === name.toLowerCase());
  if (existing) {
    const result = addCurrentTargetToList(existing);
    setAddToListMessage(result.reason, !result.ok);
    renderAddToListSheet(addToListTarget);
    return;
  }

  const newList = {
    id: `list-${Date.now()}`,
    name,
    items: []
  };
  state.customLists = Array.isArray(state.customLists) ? state.customLists : [];
  state.customLists.unshift(newList);
  const result = addCurrentTargetToList(newList);
  renderAddToListSheet(addToListTarget);
  setAddToListMessage(result.reason, !result.ok);
}

async function openAddToList(mediaType) {
  let item = null;
  try {
    if (mediaType === 'movie') item = await getSelectedMovie();
    if (mediaType === 'tv') item = await getSelectedSeries();
  } catch {}
  if (!item) return;
  addToListTarget = simplifyItem(item);
  renderAddToListSheet(item);
  openSheet('add-to-list-sheet');
}

function setQuickActionMessage(text, error = false) {
  if (!quickTitleActionsMessage) return;
  quickTitleActionsMessage.textContent = text || '';
  quickTitleActionsMessage.style.color = error ? '#ff8f8f' : '';
}

function clearQuickActionHighlight() {
  if (quickActionAnchorEl && quickActionAnchorEl.classList) {
    quickActionAnchorEl.classList.remove('longpress-active');
  }
  quickActionAnchorEl = null;
}

function closeQuickContextMenu() {
  if (quickContextMenu) quickContextMenu.classList.remove('active');
  clearQuickActionHighlight();
}

function positionQuickContextMenu(anchorEl) {
  if (!quickContextMenu || !anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const pad = 10;
  quickContextMenu.style.left = '-9999px';
  quickContextMenu.style.top = '-9999px';
  quickContextMenu.classList.add('active');
  const menuRect = quickContextMenu.getBoundingClientRect();
  let left = rect.left + (rect.width / 2) - (menuRect.width / 2);
  left = Math.max(pad, Math.min(window.innerWidth - menuRect.width - pad, left));
  let top = rect.bottom + 10;
  let placement = 'bottom';
  if ((top + menuRect.height) > (window.innerHeight - pad)) {
    top = rect.top - menuRect.height - 10;
    placement = 'top';
  }
  if (top < pad) top = pad;
  quickContextMenu.style.left = `${Math.round(left)}px`;
  quickContextMenu.style.top = `${Math.round(top)}px`;
  quickContextMenu.dataset.placement = placement;
  const arrowX = Math.max(16, Math.min(menuRect.width - 16, (rect.left + rect.width / 2) - left));
  quickContextMenu.style.setProperty('--arrow-x', `${Math.round(arrowX)}px`);
}

async function getMediaItemById(mediaType, mediaId) {
  let item = findMediaItem(mediaType, mediaId);
  if (item) return item;
  if (!window.PlotData) return null;
  try {
    if (mediaType === 'movie') return await window.PlotData.fetchMovieDetail(mediaId);
    if (mediaType === 'tv') return await window.PlotData.fetchTVDetail(mediaId);
  } catch {}
  return null;
}

async function addItemToWatchlist(item) {
  if (!item) return { ok: false, reason: 'Title not found.' };
  if (item.mediaType === 'movie') {
    const existing = findStoredItem(state.myMoviesWatchlist, item.id);
    if (existing) return { ok: false, reason: 'Already in watchlist.' };
    const row = simplifyItem(item);
    row.added = new Date().toISOString().slice(0, 10);
    state.myMoviesWatchlist.unshift(row);
    saveState();
    renderMyLists();
    return { ok: true, reason: 'Added to movie watchlist.' };
  }
  if (item.mediaType === 'tv') {
    const existing = findStoredItem(state.mySeriesWatchlist, item.id);
    if (existing) return { ok: false, reason: 'Already in watchlist.' };
    const row = simplifyItem(item);
    row.added = new Date().toISOString().slice(0, 10);
    state.mySeriesWatchlist.unshift(row);
    saveState();
    renderMyLists();
    return { ok: true, reason: 'Added to series watchlist.' };
  }
  return { ok: false, reason: 'Unsupported type.' };
}

async function addItemToWatched(item) {
  if (!item) return { ok: false, reason: 'Title not found.' };
  if (item.mediaType === 'movie') {
    const existing = findStoredItem(state.myMoviesWatched, item.id);
    if (existing) {
      existing.count = (Number(existing.count) || 1) + 1;
    } else {
      const row = simplifyItem(item);
      row.count = 1;
      row.added = new Date().toISOString().slice(0, 10);
      state.myMoviesWatched.unshift(row);
    }
    saveState();
    renderMyLists();
    return { ok: true, reason: 'Added to watched movies.' };
  }

  if (item.mediaType === 'tv') {
    const show = item.seasonDetails ? item : await getMediaItemById('tv', item.id);
    if (!show) return { ok: false, reason: 'Series details not available.' };
    const watchedScan = await markAiredEpisodesAsWatched(show);
    const totalEpisodes = Math.max(0, Number(watchedScan.airedCount) || 0);
    const existing = findStoredItem(state.mySeriesWatched, show.id);
    const nextSeason = Math.max(1, Number(watchedScan.nextSeason) || 1);
    const nextEpisode = Math.max(1, Number(watchedScan.nextEpisode) || 1);
    if (existing) {
      existing.count = totalEpisodes;
      existing.totalEpisodes = totalEpisodes;
      existing.left = 0;
      existing.nextSeason = nextSeason;
      existing.nextEpisode = nextEpisode;
      existing.inProduction = Boolean(show.inProduction);
      existing.status = show.status || '';
      existing.nextAirDate = show.nextAirDate || '';
    } else {
      const row = simplifyItem(show);
      row.count = totalEpisodes;
      row.totalEpisodes = totalEpisodes;
      row.left = 0;
      row.nextSeason = nextSeason;
      row.nextEpisode = nextEpisode;
      row.nextAirDate = show.nextAirDate || '';
      row.added = new Date().toISOString().slice(0, 10);
      state.mySeriesWatched.unshift(row);
    }
    saveState();
    renderMyLists();
    sortWatchedList(state.sortMode);
    return { ok: true, reason: 'Added to watched series.' };
  }
  return { ok: false, reason: 'Unsupported type.' };
}

function openQuickTitleActionsSheet(item) {
  if (!item || !quickActionAnchorEl) return;
  quickActionTarget = simplifyItem(item);
  if (quickTitleActionsTitle) {
    quickTitleActionsTitle.textContent = item.title ? `"${item.title}"` : 'Title Actions';
  }
  setQuickActionMessage('');
  positionQuickContextMenu(quickActionAnchorEl);
}

function setupLongPressActions() {
  const clearPress = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  };

  document.addEventListener('pointerdown', (event) => {
    const targetEl = asElement(event.target);
    if (!targetEl) return;
    if (targetEl.closest('button,input,textarea,select,a,[data-episode],[data-undo],[data-close],[data-next-inc],[data-next-dec],[data-movie-inc],[data-movie-dec],[data-remove-list],[data-delete-list],[data-movie-remove],[data-series-remove]')) return;
    const holder = targetEl.closest('[data-media-id][data-media-type]');
    if (!holder) return;
    const mediaId = String(holder.dataset.mediaId || '').trim();
    const mediaType = String(holder.dataset.mediaType || '').trim();
    if (!mediaId || (mediaType !== 'movie' && mediaType !== 'tv')) return;
    longPressStartX = Number(event.clientX) || 0;
    longPressStartY = Number(event.clientY) || 0;
    clearPress();
    longPressTimer = setTimeout(async () => {
      suppressNextClick = true;
      const item = await getMediaItemById(mediaType, mediaId);
      if (item) {
        clearQuickActionHighlight();
        quickActionAnchorEl = holder;
        if (quickActionAnchorEl.classList) quickActionAnchorEl.classList.add('longpress-active');
        openQuickTitleActionsSheet(item);
      }
    }, 420);
  });

  document.addEventListener('pointerup', clearPress);
  document.addEventListener('pointercancel', clearPress);
  document.addEventListener('pointermove', (event) => {
    const dx = Math.abs((Number(event.clientX) || 0) - longPressStartX);
    const dy = Math.abs((Number(event.clientY) || 0) - longPressStartY);
    if (dx > 12 || dy > 12) clearPress();
  });
  window.addEventListener('resize', () => {
    closeQuickContextMenu();
    clearPress();
  });
  document.addEventListener('scroll', () => {
    closeQuickContextMenu();
    clearPress();
  }, true);
}

function setLocalFolder(name, uri = '') {
  state.localFolderName = name || 'Selected folder';
  state.localFolderUri = uri || '';
  saveState();
  renderFolderStatus();
}


function renderTrailersScreen(title, rows) {
  if (trailersTitle) trailersTitle.textContent = `${title} Trailers`;
  if (!trailersList) return;
  if (!Array.isArray(rows) || !rows.length) {
    trailersList.innerHTML = '<div class="list-item"><div><div class="item-title">No trailers found</div><div class="item-sub">Try source links</div></div></div>';
    return;
  }
  trailersList.innerHTML = rows.map((row) => {
    const name = row.name || 'Trailer';
    const src = row.source || 'Source';
    const type = row.type || 'Trailer';
    const url = row.url || '';
    return `<div class="list-item"><div><div class="item-title">${escapeHtml(name)}</div><div class="item-sub">${escapeHtml(type)} • ${escapeHtml(src)}</div></div><button class="movie-action" data-link="${escapeHtml(url)}">Open</button></div>`;
  }).join('');
}

function totalEpisodesForShow(show) {
  if (!show) return 0;
  if (Array.isArray(show.seasonDetails) && show.seasonDetails.length) {
    return show.seasonDetails.reduce((sum, season) => sum + (Number(season.episodeCount) || 0), 0);
  }
  return 0;
}

function computeSeriesProgress(seriesId, totalEpisodes) {
  const prefix = `SER:${seriesId}:S`;
  const keys = Object.keys(state.episodeCounts).filter((key) => key.startsWith(prefix));
  const watchedKeys = keys.filter((key) => (Number(state.episodeCounts[key]) || 0) > 0);
  const watchedCount = watchedKeys.length;

  const parsed = watchedKeys
    .map((key) => {
      const match = key.match(/:S(\d+)E(\d+)$/);
      if (!match) return null;
      return { season: Number(match[1]), episode: Number(match[2]) };
    })
    .filter(Boolean)
    .sort((a, b) => (a.season - b.season) || (a.episode - b.episode));

  let nextSeason = 1;
  let nextEpisode = 1;
  if (parsed.length) {
    const last = parsed[parsed.length - 1];
    nextSeason = last.season;
    nextEpisode = last.episode + 1;
  }

  const left = Math.max(0, (Number(totalEpisodes) || 0) - watchedCount);
  return { watchedCount, left, nextSeason, nextEpisode };
}

function renderMovieDetail(movie) {
  if (!movie) return;
  registerKnownItem(movie);
  selectedMedia.movie = movie.id;
  selectedDetail.movie = movie;
  const title = document.getElementById('movie-detail-title');
  const meta = document.getElementById('movie-detail-meta');
  const overview = document.getElementById('movie-detail-overview');
  if (title) title.textContent = movie.title;
  if (meta) {
    const genre = movie.genres && movie.genres.length ? movie.genres[0] : 'Movie';
    const year = movie.year ? String(movie.year) : '';
    const runtimePart = movie.runtime ? movieMeta(movie).split(' • ').slice(1).join(' • ') : '';
    const ratings = [];
    if (movie.rating) ratings.push(`TMDB ${movie.rating}`);
    if (movie.imdbRating) ratings.push(`IMDb ${Number(movie.imdbRating).toFixed(1)}`);
    meta.textContent = [genre, runtimePart, year, ...ratings].filter(Boolean).join(' • ');
  }
  if (overview) overview.textContent = movie.overview || 'No overview available.';
  const providerChips = Array.isArray(movie.providers) && movie.providers.length
    ? movie.providers
    : (movie.releaseDate ? (new Date(movie.releaseDate) > new Date() ? ['Coming Soon'] : ['In Theatres']) : ['Not available']);
  fillChips('movie-detail-providers', providerChips);
  fillSourceLinks('movie-detail-sources', movie, 'movie');
  fillCast('movie-detail-cast', movie.cast);
  renderRecommendationsFor(movie, movieRecommendations, 'movie');
  const hero = document.querySelector('#movie-detail .hero-poster');
  if (hero) {
    const src = movie.backdropPath || movie.posterPath || '';
    hero.style.backgroundImage = src ? `url('${src}')` : '';
    hero.style.backgroundSize = src ? 'cover' : '';
    hero.style.backgroundPosition = src ? 'center' : '';
  }
  if (movieWatchlistBtn) {
    const exists = Boolean(findStoredItem(state.myMoviesWatchlist, movie.id));
    movieWatchlistBtn.textContent = exists ? 'Added' : 'Watchlist';
  }
  if (movieWatchedBtn) movieWatchedBtn.textContent = 'Watched';
}

function renderSeriesDetail(show, options = {}) {
  if (!show) return;
  registerKnownItem(show);
  selectedMedia.tv = show.id;
  selectedDetail.tv = show;
  const title = document.getElementById('series-detail-title');
  const meta = document.getElementById('series-detail-meta');
  const overview = document.getElementById('series-detail-overview');
  if (title) title.textContent = show.title;
  if (meta) {
    const ratings = [];
    if (show.rating) ratings.push(`TMDB ${show.rating}`);
    if (show.imdbRating) ratings.push(`IMDb ${Number(show.imdbRating).toFixed(1)}`);
    meta.textContent = [`${show.seasons || '-'} seasons`, ...ratings].join(' • ');
  }
  if (overview) overview.textContent = show.overview || 'No overview available.';
  fillChips('series-detail-networks', show.providers);
  fillSourceLinks('series-detail-sources', show, 'tv');
  renderRecommendationsFor(show, seriesRecommendations, 'tv');
  const hero = document.querySelector('#series-detail .hero-poster');
  if (hero) {
    const src = show.backdropPath || show.posterPath || '';
    hero.style.backgroundImage = src ? `url('${src}')` : '';
    hero.style.backgroundSize = src ? 'cover' : '';
    hero.style.backgroundPosition = src ? 'center' : '';
  }
  if (seriesWatchlistBtn) {
    const exists = Boolean(findStoredItem(state.mySeriesWatchlist, show.id));
    seriesWatchlistBtn.textContent = exists ? 'Added' : 'Watchlist';
  }
  const tracked = findStoredItem(state.mySeriesWatched, show.id);
  if (tracked) {
    const totalEpisodes = totalEpisodesForShow(show);
    tracked.totalEpisodes = totalEpisodes;
    tracked.left = Math.max(0, totalEpisodes - (Number(tracked.count) || 0));
    tracked.inProduction = Boolean(show.inProduction);
    tracked.status = show.status || '';
    tracked.nextAirDate = show.nextAirDate || '';
    saveState();
  }
  if (seriesWatchedBtn) seriesWatchedBtn.textContent = 'Add to Watched';
  const trackedSeason = tracked && (Number(tracked.left) || 0) > 0 ? Number(tracked.nextSeason) || 1 : 1;
  const requestedSeason = Number(options.preferredSeason);
  const preferredSeason = (Number.isFinite(requestedSeason) && requestedSeason > 0)
    ? requestedSeason
    : (trackedSeason || 1);
  initializeSeriesSeasons(show, preferredSeason);
}

function buildSeriesSeasons(show) {
  const fromShow = Array.isArray(show.seasonDetails) ? show.seasonDetails : [];
  if (fromShow.length) {
    return fromShow
      .map((s) => ({ season: Number(s.season), name: s.name || `Season ${s.season}`, episodeCount: Number(s.episodeCount) || 0 }))
      .filter((s) => s.season > 0)
      .sort((a, b) => a.season - b.season);
  }
  const total = Math.max(1, Number(show.seasons) || 1);
  return Array.from({ length: total }, (_, i) => ({
    season: i + 1,
    name: `Season ${i + 1}`,
    episodeCount: 0
  }));
}

function episodeKey(seriesId, seasonNumber, episodeNumber) {
  return `SER:${seriesId}:S${seasonNumber}E${episodeNumber}`;
}

function clearSeriesEpisodeCounts(seriesId) {
  const prefix = `SER:${seriesId}:S`;
  Object.keys(state.episodeCounts || {}).forEach((key) => {
    if (key.startsWith(prefix)) delete state.episodeCounts[key];
  });
}

function renderEpisodesForActiveSeason() {
  if (!seriesView.id || !window.PlotData) return;
  if (!episodesList) return;
  const block = seriesView.seasons.find((row) => row.season === seriesView.activeSeason);
  if (!block) {
    episodesList.innerHTML = '';
    return;
  }

  if (currentSeasonPill) currentSeasonPill.textContent = `Season ${seriesView.activeSeason}`;
  episodesList.innerHTML = '<div class="list-item"><div class="item-title">Loading episodes...</div></div>';
  const targetSeason = seriesView.activeSeason;
  const targetSeriesId = seriesView.id;
  window.PlotData.fetchTVSeasonEpisodes(targetSeriesId, targetSeason)
    .then((episodes) => {
      if (String(seriesView.id) !== String(targetSeriesId) || Number(seriesView.activeSeason) !== Number(targetSeason)) return;
      if (!Array.isArray(episodes) || !episodes.length) {
        episodesList.innerHTML = '<div class="list-item"><div class="item-title">No episode data for this season</div></div>';
        return;
      }
      episodesList.innerHTML = episodes
        .map((ep) => {
          const key = episodeKey(seriesView.id, targetSeason, ep.index);
          const count = Number(state.episodeCounts[key]) || 0;
          const watched = count > 0 ? ' watched' : '';
          const circle = count > 0 ? '✓' : '○';
          const providers = Array.isArray(ep.providers) && ep.providers.length ? ep.providers.slice(0, 4).join('|') : '';
          return `<div class=\"episode${watched}\" data-open=\"episode-sheet\" data-season=\"${targetSeason}\" data-episode-index=\"${ep.index}\" data-episode-title=\"${escapeHtml(ep.title || `Episode ${ep.index}`)}\" data-episode-runtime=\"${escapeHtml(ep.runtime || 'Runtime N/A')}\" data-episode-rating=\"${escapeHtml(ep.rating || 'NR')}\" data-episode-plot=\"${escapeHtml(ep.plot || 'No episode plot available.')}\" data-episode-providers=\"${escapeHtml(providers)}\"><div><div class=\"ep-title\">EP${ep.index}: ${escapeHtml(ep.title)}</div><div class=\"ep-meta\">${escapeHtml(ep.runtime || 'Runtime N/A')} • ${escapeHtml(ep.rating || 'NR')}</div></div><div class=\"ep-watch\"><button class=\"circle\" data-episode=\"${ep.index}\">${circle}</button><span class=\"ep-count\">${count}X</span><button class=\"undo\" data-undo>Undo</button></div></div>`;
        })
        .join('');
      refreshMarkAllForActiveSeason();
    })
    .catch(() => {
      if (String(seriesView.id) !== String(targetSeriesId) || Number(seriesView.activeSeason) !== Number(targetSeason)) return;
      episodesList.innerHTML = '<div class="list-item"><div class="item-title">Failed to load episodes</div></div>';
      refreshMarkAllForActiveSeason();
    });
}

function renderSeasonTabs() {
  if (!seasonSlider) return;
  seasonSlider.innerHTML = seriesView.seasons
    .map((row) => {
      const active = row.season === seriesView.activeSeason ? ' active' : '';
      return `<button class=\"season${active}\" data-season-tab=\"${row.season}\">S${row.season}</button>`;
    })
    .join('');
}

function initializeSeriesSeasons(show, preferredSeason = 1) {
  seriesView.id = String(show.id);
  seriesView.title = show.title;
  seriesView.seasons = buildSeriesSeasons(show);
  const available = seriesView.seasons.map((row) => Number(row.season)).filter((x) => Number.isFinite(x) && x > 0);
  const minSeason = available.length ? Math.min(...available) : 1;
  const maxSeason = available.length ? Math.max(...available) : 1;
  const target = Number.isFinite(Number(preferredSeason)) ? Number(preferredSeason) : 1;
  seriesView.activeSeason = Math.max(minSeason, Math.min(maxSeason, Math.floor(target)));
  renderSeasonTabs();
  renderEpisodesForActiveSeason();
}

function refreshMarkAllForActiveSeason() {
  if (!allBtn || !episodesList) return;
  const rows = Array.from(episodesList.querySelectorAll('.episode'));
  if (!rows.length) {
    allBtn.dataset.on = 'false';
    allBtn.textContent = 'Mark all watched';
    return;
  }
  const allWatched = rows.every((row) => {
    const count = Number(row.querySelector('.ep-count')?.textContent.replace('X', '')) || 0;
    return count > 0;
  });
  allBtn.dataset.on = allWatched ? 'true' : 'false';
  allBtn.textContent = allWatched ? 'Unmark all' : 'Mark all watched';
}

function updateSeriesWatchedFromEpisodes() {
  if (!seriesView.id || !selectedDetail.tv) return;
  const totalEpisodes = totalEpisodesForShow(selectedDetail.tv);
  const progress = computeSeriesProgress(seriesView.id, totalEpisodes);
  const existing = findStoredItem(state.mySeriesWatched, seriesView.id);

  if (progress.watchedCount === 0) {
    state.mySeriesWatched = state.mySeriesWatched.filter((row) => String(row.id) !== String(seriesView.id));
  } else if (existing) {
    existing.count = progress.watchedCount;
    existing.left = progress.left;
    existing.totalEpisodes = totalEpisodes;
    existing.nextSeason = progress.nextSeason;
    existing.nextEpisode = progress.nextEpisode;
    existing.inProduction = Boolean(selectedDetail.tv.inProduction);
    existing.status = selectedDetail.tv.status || '';
    existing.nextAirDate = selectedDetail.tv.nextAirDate || '';
  } else {
    const row = simplifyItem(selectedDetail.tv);
    row.count = progress.watchedCount;
    row.left = progress.left;
    row.totalEpisodes = totalEpisodes;
    row.nextSeason = progress.nextSeason;
    row.nextEpisode = progress.nextEpisode;
    row.added = new Date().toISOString().slice(0, 10);
    state.mySeriesWatched.unshift(row);
  }
  saveState();
  renderMyLists();
  sortWatchedList(state.sortMode);
}

function simplifyItem(item) {
  if (!item) return null;
  return {
    id: item.id,
    mediaType: item.mediaType,
    title: item.title,
    rating: item.rating || '',
    posterPath: item.posterPath || '',
    runtime: item.runtime || null,
    seasons: item.seasons || null,
    year: item.year || null,
    count: item.count || 1,
    inProduction: Boolean(item.inProduction),
    status: item.status || '',
    nextAirDate: item.nextAirDate || '',
    seasonDetails: Array.isArray(item.seasonDetails)
      ? item.seasonDetails
        .map((s) => ({
          season: Number(s.season) || Number(s.season_number) || 0,
          episodeCount: Number(s.episodeCount) || Number(s.episode_count) || 0
        }))
        .filter((s) => s.season > 0)
      : []
  };
}

async function markAiredEpisodesAsWatched(show) {
  if (!show || !window.PlotData) {
    return { airedCount: 0, nextSeason: 1, nextEpisode: 1 };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const seasons = buildSeriesSeasons(show);
  let airedCount = 0;
  let nextSeason = 1;
  let nextEpisode = 1;
  let nextFound = false;

  for (const seasonRow of seasons) {
    const seasonNum = Number(seasonRow.season) || 0;
    if (!seasonNum) continue;
    let episodes = [];
    try {
      episodes = await window.PlotData.fetchTVSeasonEpisodes(String(show.id), seasonNum);
    } catch {
      continue;
    }
    for (const ep of episodes || []) {
      const epNum = Number(ep.index) || 0;
      if (!epNum) continue;
      const airRaw = String(ep.airDate || '').trim();
      const airDate = airRaw ? new Date(airRaw) : null;
      const isAired = !airDate || !Number.isNaN(airDate.getTime()) && airDate <= today;
      if (isAired) {
        const key = episodeKey(show.id, seasonNum, epNum);
        state.episodeCounts[key] = Math.max(1, Number(state.episodeCounts[key]) || 0);
        airedCount += 1;
      } else if (!nextFound) {
        nextSeason = seasonNum;
        nextEpisode = epNum;
        nextFound = true;
      }
    }
  }

  if (!nextFound && seasons.length) {
    const last = seasons[seasons.length - 1];
    nextSeason = Number(last.season) || 1;
    nextEpisode = Math.max(1, Number(last.episodeCount) + 1 || 1);
  }

  return { airedCount, nextSeason, nextEpisode };
}

async function ensureSeriesSeasonBounds(row) {
  if (!row) return row;
  const current = Array.isArray(row.seasonDetails) ? row.seasonDetails : [];
  if (current.some((s) => Number(s.episodeCount) > 0)) return row;
  if (!window.PlotData) return row;
  try {
    const show = await window.PlotData.fetchTVDetail(String(row.id));
    if (!show) return row;
    row.seasonDetails = Array.isArray(show.seasonDetails)
      ? show.seasonDetails.map((s) => ({
          season: Number(s.season) || 0,
          episodeCount: Number(s.episodeCount) || 0
        })).filter((s) => s.season > 0)
      : [];
    row.seasons = Number(show.seasons) || row.seasons || 1;
    row.nextAirDate = show.nextAirDate || row.nextAirDate || '';
  } catch {}
  return row;
}

function buildSeasonCapMap(row) {
  const map = new Map();
  const seasonDetails = Array.isArray(row?.seasonDetails) ? row.seasonDetails : [];
  seasonDetails.forEach((s) => {
    const season = Number(s.season);
    const cap = Number(s.episodeCount);
    if (season > 0 && cap > 0) map.set(season, cap);
  });
  if (!map.size) {
    const seasons = Math.max(1, Number(row?.seasons) || 1);
    for (let s = 1; s <= seasons; s += 1) map.set(s, 24);
  }
  return map;
}

function seriesProgressLabel(row) {
  const caps = buildSeasonCapMap(row);
  const seasons = Array.from(caps.keys()).sort((a, b) => a - b);
  const minSeason = seasons[0] || 1;
  const nextSeason = Math.max(minSeason, Number(row?.nextSeason) || minSeason);
  const nextEpisode = Math.max(1, Number(row?.nextEpisode) || 1);

  // Tile should show last marked episode, not the next pointer.
  if (nextEpisode > 1) {
    return `S${nextSeason} E${nextEpisode - 1}`;
  }

  const prevSeason = nextSeason - 1;
  if (prevSeason >= minSeason) {
    const prevCap = Math.max(1, Number(caps.get(prevSeason)) || 1);
    return `S${prevSeason} E${prevCap}`;
  }

  return `S${nextSeason} E1`;
}

function isBeforePointer(season, episode, nextSeason, nextEpisode) {
  if (season < nextSeason) return true;
  if (season > nextSeason) return false;
  return episode < nextEpisode;
}

function stepSeriesPointer(row, dir) {
  const caps = buildSeasonCapMap(row);
  const seasons = Array.from(caps.keys()).sort((a, b) => a - b);
  const minSeason = seasons[0] || 1;
  const maxSeason = seasons[seasons.length - 1] || minSeason;
  let season = Math.max(minSeason, Number(row.nextSeason) || minSeason);
  let episode = Math.max(1, Number(row.nextEpisode) || 1);
  const cap = Math.max(1, Number(caps.get(season)) || 1);
  const doneEpisode = (season === maxSeason) ? (Math.max(1, Number(caps.get(maxSeason)) || 1) + 1) : cap + 1;

  if (dir > 0) {
    if (season === maxSeason && episode >= doneEpisode) {
      return { nextSeason: season, nextEpisode: doneEpisode };
    }
    if (episode < cap) return { nextSeason: season, nextEpisode: episode + 1 };
    if (episode === cap) {
      if (season < maxSeason) return { nextSeason: season + 1, nextEpisode: 1 };
      return { nextSeason: season, nextEpisode: cap + 1 };
    }
    return { nextSeason: season, nextEpisode: episode };
  }

  if (season === minSeason && episode <= 1) return { nextSeason: minSeason, nextEpisode: 1 };
  if (episode > 1) return { nextSeason: season, nextEpisode: episode - 1 };
  const prevSeason = Math.max(minSeason, season - 1);
  const prevCap = Math.max(1, Number(caps.get(prevSeason)) || 1);
  return { nextSeason: prevSeason, nextEpisode: prevCap };
}

function syncSeriesProgressFromPointer(row) {
  if (!row) return;
  const caps = buildSeasonCapMap(row);
  const seasons = Array.from(caps.keys()).sort((a, b) => a - b);
  let watched = 0;
  let total = 0;
  seasons.forEach((season) => {
    const cap = Math.max(1, Number(caps.get(season)) || 1);
    for (let ep = 1; ep <= cap; ep += 1) {
      total += 1;
      const key = episodeKey(row.id, season, ep);
      const before = isBeforePointer(season, ep, Number(row.nextSeason) || 1, Number(row.nextEpisode) || 1);
      if (before) {
        if ((Number(state.episodeCounts[key]) || 0) < 1) state.episodeCounts[key] = 1;
        watched += 1;
      } else {
        state.episodeCounts[key] = 0;
      }
    }
  });
  row.count = watched;
  row.totalEpisodes = total;
  row.left = Math.max(0, total - watched);
}

function findStoredItem(list, id) {
  const key = String(id);
  return list.find((row) => String(row.id) === key);
}

function renderMyLists() {
  state.mySeriesWatched = (state.mySeriesWatched || []).filter((item) => (Number(item && item.count) || 0) > 0);

  if (moviesWatchlistCarousel) {
    if (state.myMoviesWatchlist.length) {
      state.myMoviesWatchlist.forEach(registerKnownItem);
      moviesWatchlistCarousel.innerHTML = state.myMoviesWatchlist
        .map((item) => createCardHtml(item).replace('</article>', `<div class="tag">Watchlist</div><button class="remove-btn" data-remove-list="movie-watchlist" data-remove-id="${escapeHtml(item.id)}">×</button></article>`))
        .join('');
    } else {
      moviesWatchlistCarousel.innerHTML = '<article class="card"><div class="poster"></div><div class="card-title">No movies yet</div><div class="card-meta">Search and add items</div></article>';
    }
  }

  if (moviesWatchedList) {
    if (state.myMoviesWatched.length) {
      state.myMoviesWatched.forEach(registerKnownItem);
      const isListMode = state.moviesViewMode === 'list';
      moviesWatchedList.innerHTML = state.myMoviesWatched
        .map((item) => {
          const style = item.posterPath ? ` style=\"background-image:url('${escapeHtml(item.posterPath)}');background-size:cover;background-position:center;\"` : '';
          const ratingNum = Number(item.rating);
          const rating = Number.isFinite(ratingNum) && ratingNum > 0 ? ratingNum.toFixed(1) : 'NR';
          const count = Math.max(1, Number(item.count) || 1);
          if (isListMode) {
            return `<div class=\"list-item movie-watched-item\" data-open=\"movie-detail\" data-media-type=\"movie\" data-media-id=\"${item.id}\"><div class=\"thumb-wrap\"><div class=\"thumb\"${style}></div><button class=\"remove-btn\" data-movie-remove=\"${item.id}\">×</button></div><div><div class=\"item-title\">${escapeHtml(item.title)}</div><div class=\"item-sub\">TMDB ${escapeHtml(rating)}</div></div><div class=\"next-stepper movie-watch-stepper\"><button class=\"step-btn\" data-movie-dec=\"${item.id}\">‹</button><div class=\"step-label\">${count}X</div><button class=\"step-btn\" data-movie-inc=\"${item.id}\">›</button></div></div>`;
          }
          return `<div class=\"movie-watched-card\" data-open=\"movie-detail\" data-media-type=\"movie\" data-media-id=\"${item.id}\"><div class=\"thumb-wrap\"><div class=\"thumb\"${style}></div><button class=\"remove-btn\" data-movie-remove=\"${item.id}\">×</button></div><div class=\"item-title\">${escapeHtml(item.title)}</div><div class=\"item-sub\">TMDB ${escapeHtml(rating)}</div><div class=\"next-stepper movie-watch-stepper\"><button class=\"step-btn\" data-movie-dec=\"${item.id}\">‹</button><div class=\"step-label\">${count}X</div><button class=\"step-btn\" data-movie-inc=\"${item.id}\">›</button></div></div>`;
        })
        .join('');
    } else {
      moviesWatchedList.innerHTML = '<div class="list-item"><div><div class="item-title">No watched movies</div><div class="item-sub">Tap watched on any movie</div></div></div>';
    }
  }

  if (seriesWatchlistCarousel) {
    if (state.mySeriesWatchlist.length) {
      state.mySeriesWatchlist.forEach(registerKnownItem);
      seriesWatchlistCarousel.innerHTML = state.mySeriesWatchlist
        .map((item) => createCardHtml(item).replace('</article>', `<div class="tag">Watchlist</div><button class="remove-btn" data-remove-list="series-watchlist" data-remove-id="${escapeHtml(item.id)}">×</button></article>`))
        .join('');
    } else {
      seriesWatchlistCarousel.innerHTML = '<article class="card"><div class="poster series"></div><div class="card-title">No series yet</div><div class="card-meta">Search and add items</div></article>';
    }
  }

  const seriesAll = Array.isArray(state.mySeriesWatched) ? state.mySeriesWatched.slice() : [];
  seriesAll.forEach(registerKnownItem);
  const watchingRows = seriesAll.filter((item) => (Number(item.left) || 0) > 0);
  const doneRows = seriesAll.filter((item) => (Number(item.left) || 0) <= 0);

  if (watchedList) {
    if (watchingRows.length) {
      const isSeriesListMode = state.seriesViewMode === 'list';
      watchedList.innerHTML = watchingRows
        .map((item) => {
          const style = item.posterPath ? ` style=\"background-image:url('${escapeHtml(item.posterPath)}');background-size:cover;background-position:center;\"` : '';
          const left = Number(item.left);
          const fallbackLeft = Number(item.totalEpisodes) > 0 ? Math.max(0, Number(item.totalEpisodes) - (Number(item.count) || 0)) : 0;
          const leftLabel = Number.isFinite(left) && left >= 0 ? left : fallbackLeft;
          const stepLabel = seriesProgressLabel(item);
          if (isSeriesListMode) {
            return `<div class=\"list-item\" data-open=\"series-detail\" data-media-type=\"tv\" data-media-id=\"${item.id}\" data-added=\"${item.added || new Date().toISOString().slice(0, 10)}\" data-progress=\"${item.count || 1}\" data-next-season=\"${item.nextSeason || 1}\" data-next-episode=\"${item.nextEpisode || 1}\"><div class=\"thumb series\"${style}></div><div><div class=\"item-title\">${escapeHtml(item.title)}</div><div class=\"item-sub\">${leftLabel} Episode${leftLabel === 1 ? '' : 's'} left</div></div><div class=\"next-stepper\"><button class=\"step-btn\" data-next-dec=\"${item.id}\">‹</button><div class=\"step-label\">${escapeHtml(stepLabel)}</div><button class=\"step-btn\" data-next-inc=\"${item.id}\">›</button></div></div>`;
          }
          return `<div class=\"series-watching-card\" data-open=\"series-detail\" data-media-type=\"tv\" data-media-id=\"${item.id}\" data-added=\"${item.added || new Date().toISOString().slice(0, 10)}\" data-progress=\"${item.count || 1}\" data-next-season=\"${item.nextSeason || 1}\" data-next-episode=\"${item.nextEpisode || 1}\"><div class=\"thumb-wrap\"><div class=\"thumb series\"${style}></div><button class=\"remove-btn\" data-series-remove=\"${item.id}\">×</button></div><div class=\"item-title\">${escapeHtml(item.title)}</div><div class=\"item-sub\">${leftLabel} Episode${leftLabel === 1 ? '' : 's'} left</div><div class=\"next-stepper\"><button class=\"step-btn\" data-next-dec=\"${item.id}\">‹</button><div class=\"step-label\">${escapeHtml(stepLabel)}</div><button class=\"step-btn\" data-next-inc=\"${item.id}\">›</button></div></div>`;
        })
        .join('');
    } else {
      watchedList.innerHTML = '<div class="list-item"><div><div class="item-title">No watching series</div><div class="item-sub">Add from details or episode tracking</div></div></div>';
    }
  }

  if (watchedDoneList) {
    if (doneRows.length) {
      watchedDoneList.innerHTML = doneRows
        .map((item) => {
          const style = item.posterPath ? ` style=\"background-image:url('${escapeHtml(item.posterPath)}');background-size:cover;background-position:center;\"` : '';
          const nextAir = String(item.nextAirDate || '').trim();
          let note = 'All episodes watched';
          if (nextAir) {
            const now = new Date();
            const air = new Date(nextAir);
            const sixty = 1000 * 60 * 60 * 24 * 60;
            if (!Number.isNaN(air.getTime()) && air > now && (air.getTime() - now.getTime()) <= sixty) {
              note += ` • Next in ${Math.max(1, Math.ceil((air.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))}d`;
            }
          }
          return `<div class=\"list-item\" data-open=\"series-detail\" data-media-type=\"tv\" data-media-id=\"${item.id}\"><div class=\"thumb series\"${style}></div><div><div class=\"item-title\">${escapeHtml(item.title)}</div><div class=\"item-sub\">${escapeHtml(note)}</div></div><div class=\"count\">Done</div></div>`;
        })
        .join('');
    } else {
      watchedDoneList.innerHTML = '<div class="list-item"><div><div class="item-title">No completed series</div><div class="item-sub">Completed shows appear here</div></div></div>';
    }
  }
}

async function searchAndRender(query) {
  if (!window.PlotData || !searchResultsSection) return;
  const trimmed = String(query || '').trim();
  const target = document.getElementById('search-results');
  if (!target || !trimmed) return;

  searchResultsSection.style.display = 'block';
  target.innerHTML = '<article class="card"><div class="poster"></div><div class="card-title">Searching...</div><div class="card-meta">Checking TMDB</div></article>';

  try {
    const results = await window.PlotData.searchMulti(trimmed);
    if (!results.length) {
      target.innerHTML = '<article class="card"><div class="poster"></div><div class="card-title">No results</div><div class="card-meta">Try a different title</div></article>';
    } else {
      target.innerHTML = results.map(createCardHtml).join('');
    }
  } catch (error) {
    console.warn('Search failed:', error);
    target.innerHTML = '<article class="card"><div class="poster"></div><div class="card-title">Search failed</div><div class="card-meta">TMDB request timed out or was blocked.</div></article>';
  }
}

async function loadDynamicContent() {
  if (!window.PlotData) return;
  const msg = 'TMDB unavailable. Add token and restart server.';
  let firstMovieDone = false;
  let firstSeriesDone = false;
  try {
    const [homeMovies, homeSeries] = await Promise.all([
      window.PlotData.fetchTrendingMovies(),
      window.PlotData.fetchTrendingTV()
    ]);
    setSectionData('home-trending-movies', homeMovies);
    setSectionData('home-trending-series', homeSeries);
    setSectionData('movies-trending', homeMovies);
    setSectionData('series-trending', homeSeries);
    fillCarousel('home-trending-movies', rotate(homeMovies, 0).slice(0, 8));
    fillCarousel('home-trending-series', rotate(homeSeries, 0).slice(0, 8));
    fillCarousel('movies-trending', rotate(homeMovies, 2).slice(0, 8));
    fillCarousel('series-trending', rotate(homeSeries, 1).slice(0, 8));
    if (!firstMovieDone && homeMovies[0]) {
      renderMovieDetail(homeMovies[0]);
      firstMovieDone = true;
    }
    if (!firstSeriesDone && homeSeries[0]) {
      renderSeriesDetail(homeSeries[0]);
      firstSeriesDone = true;
    }
  } catch (error) {
    console.warn('Core home load failed:', error);
    fillErrorCard('home-trending-movies', msg);
    fillErrorCard('home-trending-series', msg);
    fillErrorCard('movies-trending', msg);
    fillErrorCard('series-trending', msg);
  }

  const secondaryTasks = [
    {
      fetcher: () => window.PlotData.fetchNowPlayingMovies(),
      onOk: (rows) => {
        setSectionData('movies-theatres', rows);
        fillCarousel('movies-theatres', rotate(rows, 0).slice(0, 8));
      },
      onFail: () => fillErrorCard('movies-theatres', msg)
    },
    {
      fetcher: () => window.PlotData.fetchUpcomingMovies(),
      onOk: (rows) => {
        setSectionData('movies-upcoming', rows);
        fillCarousel('movies-upcoming', rotate(rows, 0).slice(0, 8));
      },
      onFail: () => fillErrorCard('movies-upcoming', msg)
    },
    {
      fetcher: () => window.PlotData.fetchOnTheAirTV(),
      onOk: (rows) => {
        setSectionData('series-on-air', rows);
        fillCarousel('series-on-air', rotate(rows, 0).slice(0, 8));
      },
      onFail: () => fillErrorCard('series-on-air', msg)
    }
  ];

  Promise.all(secondaryTasks.map(async (task) => {
    try {
      const rows = await task.fetcher();
      task.onOk(Array.isArray(rows) ? rows : []);
    } catch (error) {
      console.warn('Secondary section load failed:', error);
      task.onFail();
    }
  }));
}

async function handleMediaOpen(target, id) {
  if (!window.PlotData) return;
  let mediaId = '';
  let mediaType = '';
  let preferredSeason = null;
  const container = target.closest('[data-media-id][data-media-type]');
  if (container) {
    mediaId = String(container.dataset.mediaId || '').trim();
    mediaType = String(container.dataset.mediaType || '').trim();
    const rowSeason = Number(container.dataset.nextSeason || '');
    if (Number.isFinite(rowSeason) && rowSeason > 0) preferredSeason = rowSeason;
  } else {
    mediaType = id === 'movie-detail' ? 'movie' : 'tv';
    const card = target.closest('.card,.list-item');
    const titleNode = card ? card.querySelector('.card-title,.item-title') : null;
    const title = titleNode ? titleNode.textContent.trim() : '';
    const known = resolveKnownByTitle(title, mediaType);
    if (known) mediaId = String(known.id);
  }

  if (!mediaId || !mediaType) return;
  const kind = mediaType === 'movie' ? 'movie' : 'tv';
  detailRequestSeq[kind] += 1;
  const requestId = detailRequestSeq[kind];
  if (kind === 'movie') {
    selectedDetail.movie = null;
    const t = document.getElementById('movie-detail-title');
    const m = document.getElementById('movie-detail-meta');
    const o = document.getElementById('movie-detail-overview');
    if (t) t.textContent = 'Loading...';
    if (m) m.textContent = 'Fetching details';
    if (o) o.textContent = 'Please wait.';
  } else {
    selectedDetail.tv = null;
    const t = document.getElementById('series-detail-title');
    const m = document.getElementById('series-detail-meta');
    const o = document.getElementById('series-detail-overview');
    if (t) t.textContent = 'Loading...';
    if (m) m.textContent = 'Fetching details';
    if (o) o.textContent = 'Please wait.';
  }

  try {
    if (id === 'movie-detail' && mediaType === 'movie') {
      const movie = await window.PlotData.fetchMovieDetail(mediaId);
      if (requestId !== detailRequestSeq.movie) return;
      renderMovieDetail(movie);
    }
    if (id === 'series-detail' && mediaType === 'tv') {
      const show = await window.PlotData.fetchTVDetail(mediaId);
      if (requestId !== detailRequestSeq.tv) return;
      renderSeriesDetail(show, { preferredSeason });
    }
  } catch (error) {
    console.warn('Failed to load detail:', error);
    const fallback = mediaType === 'movie' ? knownMedia.movieById.get(mediaId) : knownMedia.tvById.get(mediaId);
    if (fallback) {
      if (mediaType === 'movie') renderMovieDetail(fallback);
      if (mediaType === 'tv') renderSeriesDetail(fallback, { preferredSeason });
    }
  }
}

async function getSelectedMovie() {
  if (selectedDetail.movie) return selectedDetail.movie;
  if (!selectedMedia.movie || !window.PlotData) return null;
  const movie = await window.PlotData.fetchMovieDetail(String(selectedMedia.movie));
  selectedDetail.movie = movie;
  return movie;
}

async function getSelectedSeries() {
  if (selectedDetail.tv) return selectedDetail.tv;
  if (!selectedMedia.tv || !window.PlotData) return null;
  const show = await window.PlotData.fetchTVDetail(String(selectedMedia.tv));
  selectedDetail.tv = show;
  return show;
}

function loadState() {
  const cleanObjArray = (value) => (Array.isArray(value) ? value.filter((x) => x && typeof x === 'object') : []);
  const cleanLists = (value) => cleanObjArray(value).map((list) => ({
    id: String(list.id || `list-${Date.now()}`),
    name: String(list.name || 'My List'),
    items: cleanObjArray(list.items)
  }));
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      users: cleanObjArray(parsed.users),
      currentEmail: typeof parsed.currentEmail === 'string' ? parsed.currentEmail : '',
      moviesViewMode: parsed.moviesViewMode === 'list' ? 'list' : 'grid',
      seriesViewMode: parsed.seriesViewMode === 'list' ? 'list' : 'grid',
      themeMode: typeof parsed.themeMode === 'string' ? parsed.themeMode : 'dark',
      sortMode: typeof parsed.sortMode === 'string' ? parsed.sortMode : 'custom',
      customOrder: Array.isArray(parsed.customOrder) ? parsed.customOrder.filter((x) => typeof x === 'string') : [],
      localFolderName: typeof parsed.localFolderName === 'string' ? parsed.localFolderName : '',
      localFolderUri: typeof parsed.localFolderUri === 'string' ? parsed.localFolderUri : '',
      episodeCounts: parsed.episodeCounts && typeof parsed.episodeCounts === 'object' ? parsed.episodeCounts : {},
      myMoviesWatchlist: cleanObjArray(parsed.myMoviesWatchlist),
      myMoviesWatched: cleanObjArray(parsed.myMoviesWatched),
      mySeriesWatchlist: cleanObjArray(parsed.mySeriesWatchlist),
      mySeriesWatched: cleanObjArray(parsed.mySeriesWatched),
      customLists: cleanLists(parsed.customLists),
    };
  } catch {
    return {
      users: [],
      currentEmail: '',
      moviesViewMode: 'grid',
      seriesViewMode: 'grid',
      themeMode: 'dark',
      sortMode: 'custom',
      customOrder: [],
      localFolderName: '',
      localFolderUri: '',
      episodeCounts: {},
      myMoviesWatchlist: [],
      myMoviesWatched: [],
      mySeriesWatchlist: [],
      mySeriesWatched: [],
      customLists: [],
    };
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      users: state.users,
      currentEmail: state.currentEmail,
      moviesViewMode: state.moviesViewMode,
      seriesViewMode: state.seriesViewMode,
      themeMode: state.themeMode,
      sortMode: state.sortMode,
      customOrder,
      localFolderName: state.localFolderName,
      localFolderUri: state.localFolderUri,
      episodeCounts: state.episodeCounts,
      myMoviesWatchlist: state.myMoviesWatchlist,
      myMoviesWatched: state.myMoviesWatched,
      mySeriesWatchlist: state.mySeriesWatchlist,
      mySeriesWatched: state.mySeriesWatched,
      customLists: state.customLists,
    })
  );
}

function showScreen(id) {
  if (id !== currentScreenId) {
    previousScreenId = currentScreenId;
    currentScreenId = id;
  }
  if (id === 'home' || id === 'movies' || id === 'series' || id === 'lists') {
    lastMainScreenId = id;
  }
  if (id === 'movie-detail' || id === 'series-detail') {
    lastDetailScreenId = id;
  }

  screens.forEach((screen) => {
    screen.classList.toggle('active', screen.id === id);
  });

  tabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.open === id);
  });

  const activeScreen = document.getElementById(id);
  const tabbar = document.querySelector('.tabbar');
  const phone = document.querySelector('.phone');
  const hideTabs = Boolean(activeScreen && activeScreen.dataset.hideTabs === 'true');
  if (tabbar) {
    tabbar.style.display = hideTabs ? 'none' : 'grid';
  }
  if (phone) {
    phone.classList.toggle('tabs-hidden', hideTabs);
  }

  updateTabBubble();
}

function updateTabBubble() {
  if (!tabBubble) return;
  const activeTab = document.querySelector('.tab.active');
  const tabbar = document.querySelector('.tabbar');
  if (!activeTab || !tabbar) return;
  const tabRect = activeTab.getBoundingClientRect();
  const barRect = tabbar.getBoundingClientRect();
  tabBubble.style.width = `${tabRect.width}px`;
  tabBubble.style.transform = `translateX(${tabRect.left - barRect.left}px)`;
}

function updateOptionBubble(target) {
  if (!optionBubble || !target) return;
  const rect = target.getBoundingClientRect();
  const parentRect = target.parentElement.getBoundingClientRect();
  optionBubble.style.width = `${rect.width}px`;
  optionBubble.style.transform = `translateX(${rect.left - parentRect.left}px)`;
}

function openSheet(id) {
  const sheet = document.getElementById(id);
  if (!sheet) return;
  sheet.classList.add('active');
  overlay.classList.add('active');
}

function closeSheets() {
  sheets.forEach((sheet) => sheet.classList.remove('active'));
  overlay.classList.remove('active');
  closeQuickContextMenu();
}

function renderCastSheet() {
  const list = document.getElementById('cast-sheet-list');
  const title = document.getElementById('cast-sheet-title');
  if (!list || !title) return;

  const inSeries = document.getElementById('series-detail')?.classList.contains('active');
  const detail = inSeries ? selectedDetail.tv : (selectedDetail.movie || selectedDetail.tv);
  const cast = detail && Array.isArray(detail.cast) ? detail.cast : [];
  title.textContent = detail ? `${detail.title} Cast & Crew (${cast.length})` : 'Cast & Crew';

  list.innerHTML = cast.length
    ? cast.map((entry) => {
      const name = typeof entry === 'string' ? entry : (entry.name || 'Unknown');
      const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1f1f1f&color=f2f2f2&size=256`;
      const src = (typeof entry === 'object' && entry.photo) ? entry.photo : fallback;
      const photo = ` style="background-image:url('${escapeHtml(src)}');background-size:cover;background-position:center;"`;
      return `<div class="cast large"><div class="avatar"${photo}></div><div class="cast-name">${escapeHtml(name)}</div></div>`;
    }).join('')
    : '<div class="cast large"><div class="avatar"></div><div class="cast-name">No cast data available</div></div>';
}

function renderEpisodeSheetFromRow(row) {
  if (!row) return;
  const title = document.getElementById('episode-sheet-title');
  const meta = document.getElementById('episode-sheet-meta');
  const overview = document.getElementById('episode-sheet-overview');
  const providers = document.getElementById('episode-sheet-providers');
  const season = row.dataset.season || '-';
  const episodeIndex = row.dataset.episodeIndex || '-';
  const runtime = row.dataset.episodeRuntime || 'Runtime N/A';
  const rating = row.dataset.episodeRating || 'NR';
  const epTitle = row.dataset.episodeTitle || `Episode ${episodeIndex}`;
  const plot = row.dataset.episodePlot || 'No episode plot available.';
  const providerList = String(row.dataset.episodeProviders || '')
    .split('|')
    .map((v) => v.trim())
    .filter(Boolean);

  if (title) title.textContent = `EP${episodeIndex}: ${epTitle}`;
  if (meta) meta.textContent = `Season ${season} • ${runtime} • Rating ${rating}`;
  if (overview) overview.textContent = plot;
  if (providers) {
    providers.innerHTML = providerList.length
      ? providerList.map((p) => `<button class="chip">${escapeHtml(p)}</button>`).join('')
      : '<button class="chip">Not available</button>';
  }
}

function setAccountMessage(target, message, isError = false) {
  if (!target) return;
  target.textContent = message;
  target.style.color = isError ? '#ff8f8f' : '#b5b5b5';
}

function currentUser() {
  return state.users.find((user) => user.email === state.currentEmail);
}

function renderAccountUI() {
  const user = currentUser();
  const loggedIn = Boolean(user);

  if (loginForm) {
    loginForm.classList.toggle('hidden', loggedIn);
    loginForm.classList.toggle('active', !loggedIn);
  }
  if (accountPanel) {
    accountPanel.classList.toggle('active', loggedIn);
  }
  if (accountStateBtn) {
    accountStateBtn.textContent = loggedIn ? 'Signed in' : 'Sign in required';
  }

  if (loggedIn && user) {
    accountName.textContent = user.name;
    accountEmail.textContent = user.email;
  }
}

function loginWithCredentials(email, password) {
  const user = state.users.find((item) => item.email === email && item.password === password);
  if (!user) return false;
  state.currentEmail = user.email;
  saveState();
  renderAccountUI();
  return true;
}

function logout() {
  state.currentEmail = '';
  saveState();
  renderAccountUI();
  if (loginPassword) loginPassword.value = '';
}

function setEpisodeWatchState(episode, count) {
  const countEl = episode.querySelector('.ep-count');
  const circle = episode.querySelector('.circle');
  if (!countEl || !circle) return;
  countEl.textContent = `${count}X`;
  circle.textContent = count > 0 ? '✓' : '○';
  episode.classList.toggle('watched', count > 0);
}

function applyEpisodeState() {
  document.querySelectorAll('.episode').forEach((episode) => {
    const episodeIndex = episode.dataset.episodeIndex;
    const season = episode.dataset.season;
    const key = `S${season}E${episodeIndex}`;

    const countEl = episode.querySelector('.ep-count');
    if (!countEl) return;

    const domCount = Number(countEl.textContent.replace('X', '')) || 0;
    const count = Number.isInteger(state.episodeCounts[key]) ? state.episodeCounts[key] : domCount;

    state.episodeCounts[key] = count;
    setEpisodeWatchState(episode, count);
  });

  saveState();
}

function updateOrbitProgressFromEpisodes() {
  const episodes = Array.from(document.querySelectorAll('.episode'));
  const orbitRow = Array.from(document.querySelectorAll('#series-watching-list .list-item')).find((item) => {
    return item.querySelector('.item-title')?.textContent.trim() === 'Orbit Line';
  });
  if (!orbitRow) return;

  const watchedCount = episodes.reduce((sum, episode) => {
    const count = Number(episode.querySelector('.ep-count')?.textContent.replace('X', '')) || 0;
    return sum + (count > 0 ? 1 : 0);
  }, 0);

  const nextEpisode = episodes.find((episode) => {
    const count = Number(episode.querySelector('.ep-count')?.textContent.replace('X', '')) || 0;
    return count === 0;
  });

  orbitRow.dataset.progress = String(watchedCount);
  orbitRow.querySelector('.count').textContent = String(watchedCount);
  orbitRow.querySelector('.item-sub').textContent = `Season 1 • ${watchedCount} episodes watched`;

  if (nextEpisode) {
    orbitRow.dataset.nextSeason = nextEpisode.dataset.season;
    orbitRow.dataset.nextEpisode = nextEpisode.dataset.episodeIndex;
  } else {
    orbitRow.dataset.nextSeason = 'Done';
    orbitRow.dataset.nextEpisode = '';
  }
}

function updateNextUpLabel() {
  if (!nextUpLabel || !watchedList) return;
  const first = Array.from(watchedList.querySelectorAll('.list-item')).find((row) => row.dataset.mediaId);
  if (!first) {
    nextUpLabel.textContent = 'Next up: -';
    return;
  }
  const season = first.dataset.nextSeason;
  const episode = first.dataset.nextEpisode;
  if (!season || season === 'Done') {
    nextUpLabel.textContent = 'Next up: Completed';
    return;
  }
  nextUpLabel.textContent = `Next up: S${season} E${episode}`;
}

function sortWatchedList(mode) {
  if (!watchedList) return;
  const items = Array.from(watchedList.querySelectorAll('.list-item')).filter((row) => row.dataset.mediaId);
  if (!items.length) {
    updateNextUpLabel();
    return;
  }

  const compareNew = (a, b) => new Date(b.dataset.added) - new Date(a.dataset.added);
  const compareOld = (a, b) => new Date(a.dataset.added) - new Date(b.dataset.added);
  const compareWatched = (a, b) => Number(b.dataset.progress) - Number(a.dataset.progress);

  if (mode === 'new') items.sort(compareNew);
  if (mode === 'old') items.sort(compareOld);
  if (mode === 'watched') items.sort(compareWatched);
  if (mode === 'custom') {
    const order = customOrder.length ? customOrder : items.map((item) => item.querySelector('.item-title')?.textContent.trim() || '');
    items.sort((a, b) => {
      const aTitle = a.querySelector('.item-title')?.textContent.trim() || '';
      const bTitle = b.querySelector('.item-title')?.textContent.trim() || '';
      return order.indexOf(aTitle) - order.indexOf(bTitle);
    });
  }

  items.forEach((item) => watchedList.appendChild(item));

  state.sortMode = mode;
  if (mode === 'custom') {
    customOrder = Array.from(watchedList.querySelectorAll('.list-item')).map((item) => {
      return item.querySelector('.item-title')?.textContent.trim() || '';
    });
  }

  document.querySelectorAll('.menu-item').forEach((item) => {
    item.style.color = item.dataset.sort === mode ? '#ffb000' : '#f2f2f2';
  });

  saveState();
  updateNextUpLabel();
}

function wireEvents() {
  document.addEventListener('click', async (event) => {
    if (suppressNextClick) {
      event.preventDefault();
      event.stopPropagation();
      suppressNextClick = false;
      return;
    }

    const targetEl = asElement(event.target);
    if (!targetEl) return;
    if (quickContextMenu && quickContextMenu.classList.contains('active')) {
      if (!targetEl.closest('#quick-context-menu') && !(quickActionAnchorEl && quickActionAnchorEl.contains(targetEl))) {
        closeQuickContextMenu();
      }
    }

    const actionEl = targetEl.closest('[data-action]');
    if (actionEl && actionEl.dataset.action === 'toggle-genres') {
      genresExpanded = !genresExpanded;
      renderHomeGenres();
      return;
    }

    const listViewBtn = targetEl.closest('[data-list-items-view]');
    if (listViewBtn) {
      listItemsViewMode = listViewBtn.dataset.listItemsView === 'grid' ? 'grid' : 'list';
      document.querySelectorAll('[data-list-items-view]').forEach((btn) => {
        btn.classList.toggle('active', btn === listViewBtn);
      });
      renderListEditorItems();
      return;
    }

    const filterBtn = targetEl.closest('[data-catalog-filter]');
    if (filterBtn) {
      const mode = String(filterBtn.dataset.catalogFilter || 'all');
      catalogState.mediaFilter = (mode === 'movie' || mode === 'tv') ? mode : 'all';
      updateCatalogFilterUI();
      renderCatalogCards(catalogState.items, false);
      if (catalogState.items.length) {
        const filteredCount = catalogState.mediaFilter === 'all'
          ? catalogState.items.length
          : catalogState.items.filter((item) => item.mediaType === catalogState.mediaFilter).length;
        if (catalogLoading) {
          catalogLoading.textContent = filteredCount ? 'Scroll for more' : 'No items for this filter';
        }
      }
      return;
    }

    const genreChip = targetEl.closest('[data-genre]');
    if (genreChip) {
      const genre = String(genreChip.dataset.genre || '').trim();
      if (!genre) return;
      showScreen('catalog-screen');
      await openCatalogForGenre(genre);
      return;
    }

    const linkChip = targetEl.closest('[data-link]');
    if (linkChip) {
      const url = String(linkChip.dataset.link || '').trim();
      if (url) window.open(url, '_blank', 'noopener');
      return;
    }

    const deleteListBtn = targetEl.closest('[data-delete-list]');
    if (deleteListBtn) {
      event.preventDefault();
      event.stopPropagation();
      const id = String(deleteListBtn.dataset.deleteList || '');
      state.customLists = (state.customLists || []).filter((row) => String(row.id) !== id);
      saveState();
      renderListsHome();
      return;
    }

    const addToListBtn = targetEl.closest('[data-add-to-list-id]');
    if (addToListBtn) {
      event.preventDefault();
      event.stopPropagation();
      const listId = String(addToListBtn.dataset.addToListId || '');
      const list = (state.customLists || []).find((row) => String(row.id) === listId);
      if (!list) {
        setAddToListMessage('List not found.', true);
        return;
      }
      const result = addCurrentTargetToList(list);
      setAddToListMessage(result.reason, !result.ok);
      return;
    }

    const removeListItem = targetEl.closest('[data-remove-list-item]');
    if (removeListItem) {
      event.preventDefault();
      event.stopPropagation();
      const key = String(removeListItem.dataset.removeListItem || '');
      listEditor.draftItems = listEditor.draftItems.filter((row) => `${row.mediaType}:${row.id}` !== key);
      renderListEditorItems();
      return;
    }


    const viewToggle = targetEl.closest('[data-view-toggle][data-mode]');
    if (viewToggle) {
      const screenId = viewToggle.dataset.viewToggle;
      const mode = viewToggle.dataset.mode;
      const screen = document.getElementById(screenId);
      if (!screen) return;
      screen.classList.toggle('list-mode', mode === 'list');
      screen.querySelectorAll('[data-view-toggle]').forEach((btn) => {
        btn.classList.toggle('active', btn === viewToggle);
      });
      if (screenId === 'movies') state.moviesViewMode = mode;
      if (screenId === 'series') state.seriesViewMode = mode;
      saveState();
      renderMyLists();
      return;
    }

    const movieInc = targetEl.closest('[data-movie-inc]');
    if (movieInc) {
      event.preventDefault();
      event.stopPropagation();
      const id = String(movieInc.dataset.movieInc || '');
      const row = findStoredItem(state.myMoviesWatched, id);
      if (!row) return;
      row.count = (Number(row.count) || 0) + 1;
      saveState();
      renderMyLists();
      return;
    }

    const movieDec = targetEl.closest('[data-movie-dec]');
    if (movieDec) {
      event.preventDefault();
      event.stopPropagation();
      const id = String(movieDec.dataset.movieDec || '');
      const row = findStoredItem(state.myMoviesWatched, id);
      if (!row) return;
      row.count = Math.max(0, (Number(row.count) || 0) - 1);
      if (row.count === 0) {
        state.myMoviesWatched = state.myMoviesWatched.filter((item) => String(item.id) !== id);
      }
      saveState();
      renderMyLists();
      return;
    }

    const movieRemove = targetEl.closest('[data-movie-remove]');
    if (movieRemove) {
      event.preventDefault();
      event.stopPropagation();
      const id = String(movieRemove.dataset.movieRemove || '');
      state.myMoviesWatched = state.myMoviesWatched.filter((item) => String(item.id) !== id);
      saveState();
      renderMyLists();
      return;
    }

    const seriesRemove = targetEl.closest('[data-series-remove]');
    if (seriesRemove) {
      event.preventDefault();
      event.stopPropagation();
      const id = String(seriesRemove.dataset.seriesRemove || '');
      clearSeriesEpisodeCounts(id);
      state.mySeriesWatched = state.mySeriesWatched.filter((item) => String(item.id) !== id);
      saveState();
      renderMyLists();
      sortWatchedList(state.sortMode);
      return;
    }

    const nextDec = targetEl.closest('[data-next-dec]');
    if (nextDec) {
      event.preventDefault();
      event.stopPropagation();
      const id = String(nextDec.dataset.nextDec || '');
      const row = findStoredItem(state.mySeriesWatched, id);
      if (!row) return;
      await ensureSeriesSeasonBounds(row);
      const next = stepSeriesPointer(row, -1);
      row.nextSeason = next.nextSeason;
      row.nextEpisode = next.nextEpisode;
      syncSeriesProgressFromPointer(row);
      saveState();
      renderMyLists();
      sortWatchedList(state.sortMode);
      return;
    }

    const nextInc = targetEl.closest('[data-next-inc]');
    if (nextInc) {
      event.preventDefault();
      event.stopPropagation();
      const id = String(nextInc.dataset.nextInc || '');
      const row = findStoredItem(state.mySeriesWatched, id);
      if (!row) return;
      await ensureSeriesSeasonBounds(row);
      const next = stepSeriesPointer(row, 1);
      row.nextSeason = next.nextSeason;
      row.nextEpisode = next.nextEpisode;
      syncSeriesProgressFromPointer(row);
      saveState();
      renderMyLists();
      sortWatchedList(state.sortMode);
      return;
    }

    const removeBtn = targetEl.closest('[data-remove-list][data-remove-id]');
    if (removeBtn) {
      event.preventDefault();
      event.stopPropagation();
      const list = removeBtn.dataset.removeList;
      const id = String(removeBtn.dataset.removeId || '');
      if (list === 'movie-watchlist') {
        state.myMoviesWatchlist = state.myMoviesWatchlist.filter((row) => String(row.id) !== id);
      }
      if (list === 'series-watchlist') {
        state.mySeriesWatchlist = state.mySeriesWatchlist.filter((row) => String(row.id) !== id);
      }
      saveState();
      renderMyLists();
      return;
    }

    const seeAll = targetEl.closest('[data-see-all]');
    if (seeAll) {
      const sectionId = seeAll.dataset.seeAll;
      showScreen('catalog-screen');
      await openCatalogForSection(sectionId);
      return;
    }

    const seasonTab = targetEl.closest('[data-season-tab]');
    if (seasonTab) {
      const next = Number(seasonTab.dataset.seasonTab);
      if (Number.isFinite(next)) {
        seriesView.activeSeason = next;
        renderSeasonTabs();
        renderEpisodesForActiveSeason();
      }
      return;
    }

    const epBtn = targetEl.closest('[data-episode]');
    if (epBtn) {
      event.preventDefault();
      event.stopPropagation();
      const episodeRow = epBtn.closest('.episode');
      if (!episodeRow || !seriesView.id) return;
      const countEl = episodeRow.querySelector('.ep-count');
      if (!countEl) return;
      const current = Number(countEl.textContent.replace('X', '')) || 0;
      const next = current + 1;
      setEpisodeWatchState(episodeRow, next);
      const key = episodeKey(seriesView.id, episodeRow.dataset.season, episodeRow.dataset.episodeIndex);
      state.episodeCounts[key] = next;
      saveState();
      refreshMarkAllForActiveSeason();
      updateSeriesWatchedFromEpisodes();
      return;
    }

    const undoBtn = targetEl.closest('[data-undo]');
    if (undoBtn) {
      event.preventDefault();
      event.stopPropagation();
      const episodeRow = undoBtn.closest('.episode');
      if (!episodeRow || !seriesView.id) return;
      const countEl = episodeRow.querySelector('.ep-count');
      if (!countEl) return;
      const current = Number(countEl.textContent.replace('X', '')) || 0;
      const next = Math.max(0, current - 1);
      setEpisodeWatchState(episodeRow, next);
      const key = episodeKey(seriesView.id, episodeRow.dataset.season, episodeRow.dataset.episodeIndex);
      state.episodeCounts[key] = next;
      saveState();
      refreshMarkAllForActiveSeason();
      updateSeriesWatchedFromEpisodes();
      return;
    }

    const openTarget = targetEl.closest('[data-open]');
    if (openTarget) {
      const id = openTarget.dataset.open;
      if (id === 'sort-menu') {
        menu.classList.toggle('active');
        return;
      }
      if (id === 'cast-sheet') {
        const inSeries = document.getElementById('series-detail')?.classList.contains('active');
        try {
          if (inSeries) {
            const show = selectedMedia.tv && window.PlotData
              ? await window.PlotData.fetchTVDetail(String(selectedMedia.tv))
              : await getSelectedSeries();
            if (show) selectedDetail.tv = show;
          } else {
            const movie = selectedMedia.movie && window.PlotData
              ? await window.PlotData.fetchMovieDetail(String(selectedMedia.movie))
              : await getSelectedMovie();
            if (movie) selectedDetail.movie = movie;
          }
        } catch {}
        renderCastSheet();
        openSheet(id);
        return;
      }
      if (id === 'episode-sheet') {
        const row = openTarget.closest('.episode');
        renderEpisodeSheetFromRow(row);
        openSheet(id);
        return;
      }
      if (id === 'movie-detail' || id === 'series-detail') {
        handleMediaOpen(openTarget, id);
      }
      if (id === 'list-detail') {
        const listId = openTarget.dataset.listId;
        openListEditor(listId);
      }
      showScreen(id);
    }

    if (targetEl.classList.contains('pill')) {
      const group = targetEl.closest('.card.options');
      if (group) {
        group.querySelectorAll('.pill').forEach((pill) => pill.classList.remove('active'));
        targetEl.classList.add('active');
        updateOptionBubble(targetEl);
      }
    }

    const sortItem = targetEl.closest('.menu-item[data-sort]');
    if (sortItem) {
      sortWatchedList(sortItem.dataset.sort);
      menu.classList.remove('active');
    }

    const closeTarget = targetEl.closest('[data-close]');
    if (closeTarget) {
      const activeScreen = closeTarget.closest('.screen.active');
      if (activeScreen && activeScreen.id === 'catalog-screen') {
        showScreen(lastMainScreenId || previousScreenId || 'home');
        return;
      }
      if (activeScreen && activeScreen.id === 'trailers-screen') {
        showScreen(lastDetailScreenId || previousScreenId || 'home');
        return;
      }
      if (activeScreen && activeScreen.id === 'list-detail') {
        showScreen('lists');
        return;
      }
      const activeDetail = closeTarget.closest('.screen.detail.active');
      if (activeDetail) {
        showScreen(lastMainScreenId || previousScreenId || 'home');
      } else {
        closeSheets();
      }
    } else if (event.target === overlay) {
      closeSheets();
    }

    if (!targetEl.closest('.menu') && !targetEl.closest('.sort-btn')) {
      menu.classList.remove('active');
    }
  });

  if (loginBtn) {
    loginBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const email = loginEmail.value.trim().toLowerCase();
      const password = loginPassword.value;
      if (!email || !password) {
        setAccountMessage(loginMessage, 'Enter email and password.', true);
        return;
      }
      const ok = loginWithCredentials(email, password);
      if (ok) {
        setAccountMessage(loginMessage, 'Logged in successfully.');
      } else {
        setAccountMessage(loginMessage, 'Invalid credentials.', true);
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (event) => {
      event.preventDefault();
      logout();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', (event) => {
      event.preventDefault();
      setAccountMessage(loginMessage, 'Reset link sent to your email.');
      if (state.currentEmail) {
        loginEmail.value = state.currentEmail;
      }
      logout();
    });
  }

  if (createBtn) {
    createBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const name = createName.value.trim();
      const email = createEmail.value.trim().toLowerCase();
      const password = createPassword.value;
      const repeat = createRepeat.value;

      if (!name || !email || !password || !repeat) {
        setAccountMessage(createMessage, 'All fields are required.', true);
        return;
      }
      if (password !== repeat) {
        setAccountMessage(createMessage, 'Passwords do not match.', true);
        return;
      }
      if (state.users.some((user) => user.email === email)) {
        setAccountMessage(createMessage, 'Account already exists for this email.', true);
        return;
      }

      state.users.push({ name, email, password });
      saveState();
      setAccountMessage(createMessage, 'Account created. Use credentials to log in.');

      loginEmail.value = email;
      loginPassword.value = '';
      showScreen('settings');
    });
  }

  if (globalSearchBtn && globalSearchInput) {
    globalSearchBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      try {
        await searchAndRender(globalSearchInput.value);
      } catch (error) {
        console.warn('Search failed:', error);
      }
    });
  }

  if (globalSearchInput) {
    globalSearchInput.addEventListener('keydown', async (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      await searchAndRender(globalSearchInput.value);
    });

    globalSearchInput.addEventListener('input', () => {
      const value = globalSearchInput.value.trim();
      if (searchDebounce) clearTimeout(searchDebounce);
      if (!value || value.length < 2) {
        if (searchResultsSection) searchResultsSection.style.display = 'none';
        return;
      }
      searchDebounce = setTimeout(() => {
        searchAndRender(value);
      }, 350);
    });
  }

  if (clearSearchBtn && searchResultsSection) {
    clearSearchBtn.addEventListener('click', () => {
      searchResultsSection.style.display = 'none';
      const target = document.getElementById('search-results');
      if (target) target.innerHTML = '';
      if (globalSearchInput) globalSearchInput.value = '';
    });
  }

  if (newListBtn) {
    newListBtn.addEventListener('click', () => {
      openListEditor(null);
      showScreen('list-detail');
    });
  }

  if (saveListBtn) {
    saveListBtn.addEventListener('click', () => {
      if (!listEditor.activeListId) return;
      const row = (state.customLists || []).find((x) => String(x.id) === String(listEditor.activeListId));
      if (!row) return;
      row.name = String(listNameInput?.value || '').trim() || 'My List';
      row.items = listEditor.draftItems.slice();
      saveState();
      renderListsHome();
      showScreen('lists');
    });
  }

  if (listSearchBtn && listSearchInput && listSearchResults) {
    listSearchBtn.addEventListener('click', async () => {
      const q = String(listSearchInput.value || '').trim();
      if (!q || !window.PlotData) return;
      listSearchResults.innerHTML = '<article class="card"><div class="poster"></div><div class="card-title">Searching...</div></article>';
      try {
        const rows = await window.PlotData.searchMulti(q);
        listSearchResults.innerHTML = rows.length ? rows.map(createCardHtml).join('') : '<article class="card"><div class="poster"></div><div class="card-title">No results</div></article>';
      } catch {
        listSearchResults.innerHTML = '<article class="card"><div class="poster"></div><div class="card-title">Search failed</div></article>';
      }
    });
  }

  if (listSearchResults) {
    listSearchResults.addEventListener('click', async (event) => {
      const target = asElement(event.target);
      if (!target) return;
      const card = target.closest('.card[data-media-id][data-media-type]');
      if (!card) return;
      event.preventDefault();
      event.stopPropagation();
      const mediaId = card.dataset.mediaId;
      const mediaType = card.dataset.mediaType;
      let item = findMediaItem(mediaType, mediaId);
      try {
        if (!item && mediaType === 'movie' && window.PlotData) item = await window.PlotData.fetchMovieDetail(mediaId);
        if (!item && mediaType === 'tv' && window.PlotData) item = await window.PlotData.fetchTVDetail(mediaId);
      } catch {}
      if (!item) return;
      const exists = listEditor.draftItems.some((row) => String(row.id) === String(item.id) && row.mediaType === item.mediaType);
      if (exists) return;
      listEditor.draftItems.unshift(simplifyItem(item));
      renderListEditorItems();
    });
  }

  if (quickCreateListBtn) {
    quickCreateListBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      createListFromQuickInput();
    });
  }

  if (quickActionWatchlistBtn) {
    quickActionWatchlistBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const target = quickActionTarget;
      if (!target) return;
      const item = await getMediaItemById(target.mediaType, target.id);
      const result = await addItemToWatchlist(item);
      setQuickActionMessage(result.reason, !result.ok);
      if (result.ok) setTimeout(closeQuickContextMenu, 280);
    });
  }

  if (quickActionWatchedBtn) {
    quickActionWatchedBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const target = quickActionTarget;
      if (!target) return;
      const item = await getMediaItemById(target.mediaType, target.id);
      const result = await addItemToWatched(item);
      setQuickActionMessage(result.reason, !result.ok);
      if (result.ok) setTimeout(closeQuickContextMenu, 280);
    });
  }

  if (quickActionAddListBtn) {
    quickActionAddListBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const target = quickActionTarget;
      if (!target) return;
      const item = await getMediaItemById(target.mediaType, target.id);
      if (!item) {
        setQuickActionMessage('Title not found.', true);
        return;
      }
      closeQuickContextMenu();
      addToListTarget = simplifyItem(item);
      renderAddToListSheet(item);
      closeSheets();
      openSheet('add-to-list-sheet');
    });
  }

  if (quickListNameInput) {
    quickListNameInput.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      createListFromQuickInput();
    });
  }

  window.onNativeFolderPicked = (name, uri) => {
    setLocalFolder(String(name || 'Selected folder'), String(uri || ''));
  };

  window.onNativeFolderPickError = (message) => {
    if (message) alert(String(message));
  };

  if (folderPickerInput) {
    folderPickerInput.addEventListener('change', () => {
      const files = Array.from(folderPickerInput.files || []);
      if (!files.length) return;
      const first = files[0];
      const rel = String(first.webkitRelativePath || '');
      const rootName = rel.includes('/') ? rel.split('/')[0] : (first.name || 'Selected folder');
      setLocalFolder(rootName, '');
      folderPickerInput.value = '';
    });
  }

  if (selectFolderBtn) {
    selectFolderBtn.addEventListener('click', async () => {
      if (window.PlotAndroid && typeof window.PlotAndroid.pickLocalFolder === 'function') {
        window.PlotAndroid.pickLocalFolder();
        return;
      }
      if (!window.showDirectoryPicker) {
        if (folderPickerInput) {
          folderPickerInput.click();
          return;
        }
        alert('Folder selection is not supported on this browser.');
        return;
      }
      try {
        const handle = await window.showDirectoryPicker();
        const name = handle && handle.name ? handle.name : 'Selected folder';
        setLocalFolder(name, '');
      } catch {
        // User canceled; do nothing.
      }
    });
  }

  if (movieWatchlistBtn) {
    movieWatchlistBtn.addEventListener('click', async () => {
      const movie = await getSelectedMovie();
      if (!movie) return;
      const existing = findStoredItem(state.myMoviesWatchlist, movie.id);
      if (existing) {
        state.myMoviesWatchlist = state.myMoviesWatchlist.filter((row) => String(row.id) !== String(movie.id));
      } else {
        const row = simplifyItem(movie);
        row.added = new Date().toISOString().slice(0, 10);
        state.myMoviesWatchlist.unshift(row);
      }
      saveState();
      renderMyLists();
      movieWatchlistBtn.textContent = existing ? 'Watchlist' : 'Added';
    });
  }

  if (movieWatchedBtn) {
    movieWatchedBtn.addEventListener('click', async () => {
      const movie = await getSelectedMovie();
      if (!movie) return;
      const existing = findStoredItem(state.myMoviesWatched, movie.id);
      if (existing) {
        existing.count = (Number(existing.count) || 1) + 1;
      } else {
        const row = simplifyItem(movie);
        row.count = 1;
        row.added = new Date().toISOString().slice(0, 10);
        state.myMoviesWatched.unshift(row);
      }
      saveState();
      renderMyLists();
      movieWatchedBtn.textContent = 'Watched +1';
    });
  }

  if (movieTrailersBtn) {
    movieTrailersBtn.addEventListener('click', async () => {
      const movie = await getSelectedMovie();
      if (!movie || !window.PlotData) return;
      renderTrailersScreen(movie.title, []);
      showScreen('trailers-screen');
      try {
        const rows = await window.PlotData.fetchTrailers('movie', movie.id, movie.title);
        renderTrailersScreen(movie.title, rows);
      } catch {
        renderTrailersScreen(movie.title, []);
      }
    });
  }

  if (movieAddListBtn) {
    movieAddListBtn.addEventListener('click', async () => {
      await openAddToList('movie');
    });
  }

  if (seriesWatchlistBtn) {
    seriesWatchlistBtn.addEventListener('click', async () => {
      const show = await getSelectedSeries();
      if (!show) return;
      const existing = findStoredItem(state.mySeriesWatchlist, show.id);
      if (existing) {
        state.mySeriesWatchlist = state.mySeriesWatchlist.filter((row) => String(row.id) !== String(show.id));
      } else {
        const row = simplifyItem(show);
        row.added = new Date().toISOString().slice(0, 10);
        state.mySeriesWatchlist.unshift(row);
      }
      saveState();
      renderMyLists();
      seriesWatchlistBtn.textContent = existing ? 'Watchlist' : 'Added';
    });
  }

  if (seriesWatchedBtn) {
    seriesWatchedBtn.addEventListener('click', async () => {
      const show = await getSelectedSeries();
      if (!show) return;
      const watchedScan = await markAiredEpisodesAsWatched(show);
      const totalEpisodes = Math.max(0, Number(watchedScan.airedCount) || 0);
      const existing = findStoredItem(state.mySeriesWatched, show.id);
      const markAllSeen = totalEpisodes;
      const nextSeason = Math.max(1, Number(watchedScan.nextSeason) || 1);
      const nextEpisode = Math.max(1, Number(watchedScan.nextEpisode) || 1);
      if (existing) {
        existing.count = markAllSeen;
        existing.totalEpisodes = markAllSeen;
        existing.left = 0;
        existing.nextSeason = nextSeason;
        existing.nextEpisode = nextEpisode;
        existing.inProduction = Boolean(show.inProduction);
        existing.status = show.status || '';
        existing.nextAirDate = show.nextAirDate || '';
      } else {
        const row = simplifyItem(show);
        row.count = markAllSeen;
        row.totalEpisodes = markAllSeen;
        row.left = 0;
        row.nextSeason = nextSeason;
        row.nextEpisode = nextEpisode;
        row.nextAirDate = show.nextAirDate || '';
        row.added = new Date().toISOString().slice(0, 10);
        state.mySeriesWatched.unshift(row);
      }
      saveState();
      renderMyLists();
      sortWatchedList(state.sortMode);
      seriesWatchedBtn.textContent = 'Marked watched';
    });
  }

  if (seriesTrailersBtn) {
    seriesTrailersBtn.addEventListener('click', async () => {
      const show = await getSelectedSeries();
      if (!show || !window.PlotData) return;
      renderTrailersScreen(show.title, []);
      showScreen('trailers-screen');
      try {
        const rows = await window.PlotData.fetchTrailers('tv', show.id, show.title);
        renderTrailersScreen(show.title, rows);
      } catch {
        renderTrailersScreen(show.title, []);
      }
    });
  }

  if (seriesAddListBtn) {
    seriesAddListBtn.addEventListener('click', async () => {
      await openAddToList('tv');
    });
  }

  if (allBtn) {
    allBtn.addEventListener('click', () => {
      const isOn = allBtn.dataset.on === 'true';
      const episodes = episodesList ? episodesList.querySelectorAll('.episode') : document.querySelectorAll('.episode');

      episodes.forEach((episode) => {
        const countEl = episode.querySelector('.ep-count');
        if (!countEl) return;

        const nextCount = isOn ? 0 : 1;
        setEpisodeWatchState(episode, nextCount);

        const key = episodeKey(seriesView.id || selectedMedia.tv || 'default', episode.dataset.season, episode.dataset.episodeIndex);
        state.episodeCounts[key] = nextCount;
      });

      allBtn.dataset.on = isOn ? 'false' : 'true';
      allBtn.textContent = isOn ? 'Mark all watched' : 'Unmark all';

      saveState();
      refreshMarkAllForActiveSeason();
      updateSeriesWatchedFromEpisodes();
    });
  }

  if (watchedList) {
    watchedList.addEventListener('click', (event) => {
      if (state.sortMode !== 'custom') return;
      const targetEl = asElement(event.target);
      if (!targetEl) return;
      const item = targetEl.closest('.list-item');
      if (!item) return;
      watchedList.prepend(item);
      customOrder = Array.from(watchedList.querySelectorAll('.list-item')).map((row) => {
        return row.querySelector('.item-title')?.textContent.trim() || '';
      });
      saveState();
      updateNextUpLabel();
    });
  }

  window.addEventListener('resize', () => {
    updateTabBubble();
    const activePill = document.querySelector('.card.options .pill.active');
    if (activePill) updateOptionBubble(activePill);
  });

  if (catalogScreen) {
    catalogScreen.addEventListener('scroll', () => {
      if (currentScreenId !== 'catalog-screen') return;
      const nearBottom = catalogScreen.scrollTop + catalogScreen.clientHeight >= catalogScreen.scrollHeight - 700;
      if (nearBottom) loadMoreCatalog();
    });
  }

  if (catalogLoadMoreBtn) {
    catalogLoadMoreBtn.addEventListener('click', async () => {
      await loadMoreCatalog();
      await loadMoreCatalog();
    });
  }

  if (catalogBackBtn) {
    catalogBackBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      showScreen(lastMainScreenId || previousScreenId || 'home');
    });
  }
}

async function bootstrap() {
  try {
    setupBrandLogo();

    if (!state.users.length) {
      state.users.push({
        name: 'Ruthvik',
        email: 'ruthvik@email.com',
        password: 'password123',
      });
    }

    if (state.customOrder.length) {
      customOrder = state.customOrder;
    }

    applyEpisodeState();
    updateOrbitProgressFromEpisodes();
    renderMyLists();
    renderListsHome();
    renderFolderStatus();
    renderHomeGenres();
    renderAccountUI();
    wireEvents();
    setupLongPressActions();

    const moviesScreen = document.getElementById('movies');
    const seriesScreen = document.getElementById('series');
    if (moviesScreen) {
      const isList = state.moviesViewMode === 'list';
      moviesScreen.classList.toggle('list-mode', isList);
      moviesScreen.querySelectorAll('[data-view-toggle="movies"]').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.mode === (isList ? 'list' : 'grid'));
      });
    }
    if (seriesScreen) {
      const isList = state.seriesViewMode === 'list';
      seriesScreen.classList.toggle('list-mode', isList);
      seriesScreen.querySelectorAll('[data-view-toggle="series"]').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.mode === (isList ? 'list' : 'grid'));
      });
    }

    showScreen('home');
    updateTabBubble();

    const initialPill = document.querySelector('.card.options .pill.active');
    if (initialPill) updateOptionBubble(initialPill);

    sortWatchedList(state.sortMode);
    loadDynamicContent();
  } catch (error) {
    console.error('Bootstrap failed:', error);
    wireEvents();
    showScreen('home');
  }
}

bootstrap();
