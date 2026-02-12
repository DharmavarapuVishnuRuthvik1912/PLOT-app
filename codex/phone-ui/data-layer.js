(function () {
  const tmdbImageBase = 'https://image.tmdb.org/t/p/w500';
  const cinemetaBase = 'https://v3-cinemeta.strem.io';

  const mock = {
    trendingMovies: [
      { id: '101', mediaType: 'movie', title: 'Neon Drift', rating: 8.1, posterPath: 'assets/posters/neon-drift.svg', year: 2026, runtime: 131, overview: 'A courier uncovers a citywide conspiracy.', genres: ['Sci-Fi'], providers: ['Prime', 'Apple TV'], cast: ['J. Vale', 'M. Cori', 'A. Reyes'] },
      { id: '102', mediaType: 'movie', title: 'Glass Harbor', rating: 7.6, posterPath: 'assets/posters/glass-harbor.svg', year: 2026, runtime: 109, overview: 'A detective returns to a stormy hometown.', genres: ['Drama'], providers: ['Netflix'], cast: ['S. Hale', 'D. Kline', 'N. Pruitt'] },
      { id: '103', mediaType: 'movie', title: 'Kite City', rating: 8.4, posterPath: 'assets/posters/kite-city.svg', year: 2026, runtime: 142, overview: 'A pilot races to save a city above the clouds.', genres: ['Adventure'], providers: ['Max'], cast: ['L. Park', 'E. North', 'C. Voss'] }
    ],
    trendingSeries: [
      { id: '201', mediaType: 'tv', title: 'Orbit Line', rating: 9.0, posterPath: 'assets/posters/orbit-line.svg', seasons: 3, overview: 'A crew balances politics and survival in orbit.', providers: ['HBO', 'Max'], cast: ['R. Elgin', 'K. Sun', 'T. Knox'] },
      { id: '202', mediaType: 'tv', title: 'Paper District', rating: 8.3, posterPath: 'assets/posters/paper-district.svg', seasons: 2, overview: 'Rival families fight for control of a city district.', providers: ['Prime'], cast: ['M. Ortiz', 'J. Lane', 'P. Shaw'] },
      { id: '203', mediaType: 'tv', title: 'Zero Hour', rating: 8.7, posterPath: 'assets/posters/zero-hour.svg', seasons: 1, overview: 'A blackout reveals a buried government secret.', providers: ['Netflix'], cast: ['N. Fox', 'A. Reed', 'C. Hart'] }
    ]
  };

  const cache = {
    movie: new Map(),
    tv: new Map(),
    catalogs: {
      movieTop: null,
      tvTop: null
    },
    genres: {
      movie: null,
      tv: null
    }
  };

  function config() {
    return window.PLOT_CONFIG || { mode: 'proxy', tmdbReadToken: '', proxyBaseUrl: '/api', region: 'US' };
  }

  async function fetchJson(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function requestTMDB(path) {
    const cfg = config();
    if (cfg.mode === 'mock') throw new Error('TMDB disabled in mock mode');

    if (cfg.mode === 'proxy') {
      return fetchJson(`${cfg.proxyBaseUrl}${path}`);
    }

    if (cfg.mode === 'tmdb-direct') {
      if (!cfg.tmdbReadToken) throw new Error('Missing TMDB read token');
      return fetchJson(`https://api.themoviedb.org/3${path}`, {
        headers: {
          Authorization: `Bearer ${cfg.tmdbReadToken}`,
          'Content-Type': 'application/json'
        }
      });
    }

    throw new Error('Unknown mode');
  }

  async function requestCinemeta(path) {
    return fetchJson(`${cinemetaBase}${path}`);
  }

  async function requestTVMazeCastByTitle(title) {
    if (!title) return [];
    try {
      const data = await fetchJson(`https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(title)}&embed=cast`);
      const cast = (data._embedded && data._embedded.cast) ? data._embedded.cast : [];
      return cast.map((row) => ({
        name: row.person && row.person.name ? row.person.name : 'Unknown',
        photo: row.person && row.person.image && row.person.image.medium ? row.person.image.medium : ''
      }));
    } catch {
      return [];
    }
  }

  function pageSlice(rows, page, size = 20) {
    const p = Math.max(1, Number(page) || 1);
    const start = (p - 1) * size;
    return rows.slice(start, start + size);
  }

  function filterTheatricalNow(rows) {
    const now = new Date();
    const min = new Date(now);
    min.setDate(min.getDate() - 120);
    return (rows || []).filter((row) => {
      if (!row || !row.releaseDate) return false;
      const d = new Date(row.releaseDate);
      if (Number.isNaN(d.getTime())) return false;
      return d <= now && d >= min;
    });
  }

  async function getCinemetaMovieTop() {
    if (cache.catalogs.movieTop) return cache.catalogs.movieTop;
    const data = await requestCinemeta('/catalog/movie/top.json');
    cache.catalogs.movieTop = (data.metas || []).map((m) => normalizeCinemetaMeta(m, 'movie'));
    return cache.catalogs.movieTop;
  }

  async function getCinemetaTVTop() {
    if (cache.catalogs.tvTop) return cache.catalogs.tvTop;
    const data = await requestCinemeta('/catalog/series/top.json');
    cache.catalogs.tvTop = (data.metas || []).map((m) => normalizeCinemetaMeta(m, 'tv'));
    return cache.catalogs.tvTop;
  }

  async function loadTMDBGenres(mediaType) {
    if (cache.genres[mediaType]) return cache.genres[mediaType];
    const data = await requestTMDB(`/genre/${mediaType}/list`);
    const map = new Map();
    (data.genres || []).forEach((g) => {
      map.set(String(g.name || '').toLowerCase(), Number(g.id));
    });
    cache.genres[mediaType] = map;
    return map;
  }

  function toNum(value, fallback = null) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function normalizeMovie(item) {
    return {
      id: String(item.id),
      mediaType: 'movie',
      title: item.title,
      rating: toNum(item.vote_average, 0).toFixed(1),
      posterPath: item.poster_path ? `${tmdbImageBase}${item.poster_path}` : '',
      backdropPath: item.backdrop_path ? `${tmdbImageBase}${item.backdrop_path}` : '',
      releaseDate: item.release_date || '',
      year: item.release_date ? Number(String(item.release_date).slice(0, 4)) : null,
      runtime: item.runtime || null,
      overview: item.overview || 'No overview available.',
      genres: Array.isArray(item.genres) ? item.genres.map((g) => g.name) : [],
      imdbId: '',
      providers: [],
      cast: []
    };
  }

  function normalizeTV(item) {
    return {
      id: String(item.id),
      mediaType: 'tv',
      title: item.name,
      rating: toNum(item.vote_average, 0).toFixed(1),
      posterPath: item.poster_path ? `${tmdbImageBase}${item.poster_path}` : '',
      backdropPath: item.backdrop_path ? `${tmdbImageBase}${item.backdrop_path}` : '',
      seasons: item.number_of_seasons || null,
      seasonDetails: [],
      overview: item.overview || 'No overview available.',
      imdbId: '',
      providers: [],
      cast: []
    };
  }

  function normalizeCinemetaMeta(meta, mediaType) {
    const isMovie = mediaType === 'movie';
    const seasonCount = Array.isArray(meta.videos)
      ? meta.videos.reduce((max, video) => {
          const s = Number(video.season);
          return Number.isFinite(s) ? Math.max(max, s) : max;
        }, 0)
      : 0;
    return {
      id: String(meta.id),
      mediaType: isMovie ? 'movie' : 'tv',
      title: meta.name || meta.title || 'Unknown',
      rating: toNum(meta.imdbRating, 0).toFixed(1),
      posterPath: meta.poster || '',
      backdropPath: meta.background || meta.poster || '',
      releaseDate: isMovie ? (meta.released || '') : '',
      year: meta.year || null,
      runtime: null,
      seasons: isMovie ? null : (seasonCount || null),
      seasonDetails: [],
      overview: meta.description || 'No overview available.',
      imdbId: String(meta.id || '').startsWith('tt') ? String(meta.id) : '',
      genres: Array.isArray(meta.genre) ? meta.genre : [],
      providers: [],
      cast: []
    };
  }

  function withTimeout(promise, ms) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('timeout')), ms);
      promise.then((value) => {
        clearTimeout(timer);
        resolve(value);
      }).catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
    });
  }

  async function tmdbOrCinemeta(tmdbFn, cinemetaFn) {
    try {
      return await withTimeout(tmdbFn(), 8000);
    } catch {
      return cinemetaFn();
    }
  }

  async function enrichCastFromTMDBByImdb(mediaType, imdbId, item) {
    try {
      if (!imdbId) return item;
      const found = await requestTMDB(`/find/${encodeURIComponent(imdbId)}?external_source=imdb_id`);
      const first = mediaType === 'movie'
        ? (found.movie_results || [])[0]
        : (found.tv_results || [])[0];
      if (!first || !first.id) return item;
      const credits = await requestTMDB(`/${mediaType}/${encodeURIComponent(first.id)}/credits`);
      const castPeople = (credits.cast || []).map((c) => ({
        name: c.name,
        photo: c.profile_path ? `${tmdbImageBase}${c.profile_path}` : ''
      }));
      const crewPeople = (credits.crew || [])
        .filter((c) => ['Director', 'Writer', 'Producer', 'Screenplay', 'Creator'].includes(String(c.job || '')))
        .map((c) => ({
          name: `${c.name} (${c.job})`,
          photo: c.profile_path ? `${tmdbImageBase}${c.profile_path}` : ''
        }));
      const merged = [...castPeople, ...crewPeople];
      if (merged.length) item.cast = merged;
      return item;
    } catch {
      return item;
    }
  }

  async function enrichCastFromTMDBByTitle(mediaType, title, item) {
    try {
      if (!title) return item;
      const query = await requestTMDB(`/search/${mediaType}?query=${encodeURIComponent(title)}&include_adult=false&page=1`);
      const first = (query.results || [])[0];
      if (!first || !first.id) return item;
      const credits = await requestTMDB(`/${mediaType}/${encodeURIComponent(first.id)}/credits`);
      const castPeople = (credits.cast || []).map((c) => ({
        name: c.name,
        photo: c.profile_path ? `${tmdbImageBase}${c.profile_path}` : ''
      }));
      const crewPeople = (credits.crew || [])
        .filter((c) => ['Director', 'Writer', 'Producer', 'Screenplay', 'Creator'].includes(String(c.job || '')))
        .map((c) => ({
          name: `${c.name} (${c.job})`,
          photo: c.profile_path ? `${tmdbImageBase}${c.profile_path}` : ''
        }));
      const merged = [...castPeople, ...crewPeople];
      if (merged.length) item.cast = merged;
      return item;
    } catch {
      return item;
    }
  }

  async function fetchTrendingMovies(page = 1) {
    if (config().mode === 'mock') {
      mock.trendingMovies.forEach((x) => cache.movie.set(x.id, x));
      return mock.trendingMovies;
    }

    return tmdbOrCinemeta(async () => {
      const data = await requestTMDB(`/trending/movie/week?page=${Number(page) || 1}`);
      const list = (data.results || []).map(normalizeMovie);
      list.forEach((x) => cache.movie.set(x.id, x));
      return list;
    }, async () => {
      const all = await getCinemetaMovieTop();
      const list = pageSlice(all, page, 20);
      list.forEach((x) => cache.movie.set(x.id, x));
      return list;
    });
  }

  async function fetchTrendingTV(page = 1) {
    if (config().mode === 'mock') {
      mock.trendingSeries.forEach((x) => cache.tv.set(x.id, x));
      return mock.trendingSeries;
    }

    return tmdbOrCinemeta(async () => {
      const data = await requestTMDB(`/trending/tv/week?page=${Number(page) || 1}`);
      const list = (data.results || []).map(normalizeTV);
      list.forEach((x) => cache.tv.set(x.id, x));
      return list;
    }, async () => {
      const all = await getCinemetaTVTop();
      const list = pageSlice(all, page, 20);
      list.forEach((x) => cache.tv.set(x.id, x));
      return list;
    });
  }

  async function fetchNowPlayingMovies(page = 1) {
    if (config().mode === 'mock') return mock.trendingMovies;
    return tmdbOrCinemeta(async () => {
      const data = await requestTMDB(`/movie/now_playing?page=${Number(page) || 1}`);
      const list = filterTheatricalNow((data.results || []).map(normalizeMovie));
      list.forEach((x) => cache.movie.set(x.id, x));
      return list;
    }, async () => {
      const all = await getCinemetaMovieTop();
      const theatrical = filterTheatricalNow(all);
      const rows = pageSlice(theatrical, page, 20);
      rows.forEach((x) => cache.movie.set(x.id, x));
      return rows;
    });
  }

  async function fetchUpcomingMovies(page = 1) {
    if (config().mode === 'mock') return mock.trendingMovies;
    return tmdbOrCinemeta(async () => {
      const data = await requestTMDB(`/movie/upcoming?page=${Number(page) || 1}`);
      const list = (data.results || []).map(normalizeMovie);
      list.forEach((x) => cache.movie.set(x.id, x));
      return list;
    }, async () => {
      const all = await getCinemetaMovieTop();
      const shifted = all.slice(10);
      const rows = pageSlice(shifted, page, 20);
      rows.forEach((x) => cache.movie.set(x.id, x));
      return rows;
    });
  }

  async function fetchTopTV(page = 1) {
    if (config().mode === 'mock') return mock.trendingSeries;
    return tmdbOrCinemeta(async () => {
      const data = await requestTMDB(`/tv/top_rated?page=${Number(page) || 1}`);
      const list = (data.results || []).map(normalizeTV);
      list.forEach((x) => cache.tv.set(x.id, x));
      return list;
    }, async () => {
      const all = await getCinemetaTVTop();
      const list = pageSlice(all, page, 20);
      list.forEach((x) => cache.tv.set(x.id, x));
      return list;
    });
  }

  async function fetchOnTheAirTV(page = 1) {
    if (config().mode === 'mock') return mock.trendingSeries;
    return tmdbOrCinemeta(async () => {
      const data = await requestTMDB(`/tv/on_the_air?page=${Number(page) || 1}`);
      const list = (data.results || []).map(normalizeTV);
      list.forEach((x) => cache.tv.set(x.id, x));
      return list;
    }, async () => {
      const all = await getCinemetaTVTop();
      const rows = pageSlice(all, page, 20);
      rows.forEach((x) => cache.tv.set(x.id, x));
      return rows;
    });
  }

  async function fetchMovieDetail(id) {
    const key = String(id);
    if (config().mode === 'mock') return cache.movie.get(key) || mock.trendingMovies[0];

    return tmdbOrCinemeta(async () => {
      const [detail, credits, watch, external] = await Promise.all([
        requestTMDB(`/movie/${encodeURIComponent(key)}`),
        requestTMDB(`/movie/${encodeURIComponent(key)}/credits`),
        requestTMDB(`/movie/${encodeURIComponent(key)}/watch/providers`),
        requestTMDB(`/movie/${encodeURIComponent(key)}/external_ids`)
      ]);

      const item = normalizeMovie(detail);
      item.imdbId = external && external.imdb_id ? external.imdb_id : '';
      const castPeople = (credits.cast || []).map((c) => ({
        name: c.name,
        photo: c.profile_path ? `${tmdbImageBase}${c.profile_path}` : ''
      }));
      const crewPeople = (credits.crew || [])
        .filter((c) => ['Director', 'Writer', 'Producer', 'Screenplay'].includes(String(c.job || '')))
        .map((c) => ({
          name: `${c.name} (${c.job})`,
          photo: c.profile_path ? `${tmdbImageBase}${c.profile_path}` : ''
        }));
      item.cast = [...castPeople, ...crewPeople];
      const region = config().region || 'US';
      const providerBlock = watch.results && watch.results[region];
      const flatrate = providerBlock && providerBlock.flatrate ? providerBlock.flatrate : [];
      item.providers = flatrate.slice(0, 4).map((p) => p.provider_name);
      if (external && external.imdb_id) {
        try {
          const meta = await requestCinemeta(`/meta/movie/${encodeURIComponent(external.imdb_id)}.json`);
          if (meta && meta.meta && meta.meta.imdbRating) {
            item.imdbRating = toNum(meta.meta.imdbRating, null);
          }
        } catch {}
      }
      cache.movie.set(item.id, item);
      return item;
    }, async () => {
      const meta = await requestCinemeta(`/meta/movie/${encodeURIComponent(key)}.json`);
      const item = normalizeCinemetaMeta(meta.meta || {}, 'movie');
      if (!item.imdbId && meta && meta.meta && String(meta.meta.id || '').startsWith('tt')) {
        item.imdbId = String(meta.meta.id);
      }
      item.cast = Array.isArray(meta.meta && meta.meta.cast)
        ? meta.meta.cast.map((name) => ({ name, photo: '' }))
        : [];
      if (item.cast.length < 8) {
        await enrichCastFromTMDBByImdb('movie', item.imdbId, item);
      }
      if (item.cast.length < 8) {
        await enrichCastFromTMDBByTitle('movie', item.title, item);
      }
      if (meta && meta.meta && meta.meta.imdbRating) {
        item.imdbRating = toNum(meta.meta.imdbRating, null);
      }
      cache.movie.set(item.id, item);
      return item;
    });
  }

  async function fetchTVDetail(id) {
    const key = String(id);
    if (config().mode === 'mock') return cache.tv.get(key) || mock.trendingSeries[0];

    return tmdbOrCinemeta(async () => {
      const [detail, credits, watch, external] = await Promise.all([
        requestTMDB(`/tv/${encodeURIComponent(key)}`),
        requestTMDB(`/tv/${encodeURIComponent(key)}/credits`),
        requestTMDB(`/tv/${encodeURIComponent(key)}/watch/providers`),
        requestTMDB(`/tv/${encodeURIComponent(key)}/external_ids`)
      ]);

      const item = normalizeTV(detail);
      item.imdbId = external && external.imdb_id ? external.imdb_id : '';
      const castPeople = (credits.cast || []).map((c) => ({
        name: c.name,
        photo: c.profile_path ? `${tmdbImageBase}${c.profile_path}` : ''
      }));
      const crewPeople = (credits.crew || [])
        .filter((c) => ['Director', 'Writer', 'Producer', 'Creator'].includes(String(c.job || '')))
        .map((c) => ({
          name: `${c.name} (${c.job})`,
          photo: c.profile_path ? `${tmdbImageBase}${c.profile_path}` : ''
        }));
      item.cast = [...castPeople, ...crewPeople];
      item.seasonDetails = (detail.seasons || [])
        .filter((s) => Number(s.season_number) > 0)
        .map((s) => ({
          season: Number(s.season_number),
          name: s.name || `Season ${s.season_number}`,
          episodeCount: Number(s.episode_count) || 0
        }));
      const region = config().region || 'US';
      const providerBlock = watch.results && watch.results[region];
      const flatrate = providerBlock && providerBlock.flatrate ? providerBlock.flatrate : [];
      item.providers = flatrate.slice(0, 4).map((p) => p.provider_name);
      if (external && external.imdb_id) {
        try {
          const meta = await requestCinemeta(`/meta/series/${encodeURIComponent(external.imdb_id)}.json`);
          if (meta && meta.meta && meta.meta.imdbRating) {
            item.imdbRating = toNum(meta.meta.imdbRating, null);
          }
        } catch {}
      }
      cache.tv.set(item.id, item);
      return item;
    }, async () => {
      const meta = await requestCinemeta(`/meta/series/${encodeURIComponent(key)}.json`);
      const item = normalizeCinemetaMeta(meta.meta || {}, 'tv');
      if (!item.imdbId && meta && meta.meta && String(meta.meta.id || '').startsWith('tt')) {
        item.imdbId = String(meta.meta.id);
      }
      item.cast = Array.isArray(meta.meta && meta.meta.cast)
        ? meta.meta.cast.map((name) => ({ name, photo: '' }))
        : [];
      if (item.cast.length < 8) {
        await enrichCastFromTMDBByImdb('tv', item.imdbId, item);
      }
      if (item.cast.length < 8) {
        await enrichCastFromTMDBByTitle('tv', item.title, item);
      }
      if (item.cast.length < 8) {
        const tvmazeCast = await requestTVMazeCastByTitle(item.title);
        if (tvmazeCast.length) item.cast = tvmazeCast;
      }
      if (meta && meta.meta && meta.meta.imdbRating) {
        item.imdbRating = toNum(meta.meta.imdbRating, null);
      }
      const bySeason = new Map();
      const videos = Array.isArray(meta.meta && meta.meta.videos) ? meta.meta.videos : [];
      videos.forEach((v) => {
        const s = Number(v.season);
        if (!Number.isFinite(s) || s < 1) return;
        bySeason.set(s, (bySeason.get(s) || 0) + 1);
      });
      item.seasonDetails = Array.from(bySeason.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([season, episodeCount]) => ({
          season,
          name: `Season ${season}`,
          episodeCount
        }));
      cache.tv.set(item.id, item);
      return item;
    });
  }

  async function fetchTVSeasonEpisodes(id, season) {
    const key = String(id);
    const seasonNumber = Number(season);
    if (!seasonNumber || seasonNumber < 1) return [];

    if (config().mode === 'mock') {
      return Array.from({ length: 10 }, (_, i) => ({
        index: i + 1,
        title: `Episode ${i + 1}`,
        runtime: '45m',
        rating: '8.0',
        plot: 'No episode plot available.',
        providers: []
      }));
    }

    return tmdbOrCinemeta(async () => {
      const data = await requestTMDB(`/tv/${encodeURIComponent(key)}/season/${seasonNumber}`);
      const show = cache.tv.get(key);
      const fallbackProviders = Array.isArray(show && show.providers) ? show.providers.slice(0, 4) : [];
      return (data.episodes || []).map((ep) => ({
        index: Number(ep.episode_number),
        title: ep.name || `Episode ${ep.episode_number}`,
        runtime: Number(ep.runtime) ? `${Number(ep.runtime)}m` : 'Runtime N/A',
        rating: Number(ep.vote_average) > 0 ? toNum(ep.vote_average, 0).toFixed(1) : 'NR',
        plot: ep.overview || 'No episode plot available.',
        providers: fallbackProviders
      }));
    }, async () => {
      const meta = await requestCinemeta(`/meta/series/${encodeURIComponent(key)}.json`);
      const videos = Array.isArray(meta.meta && meta.meta.videos) ? meta.meta.videos : [];
      const show = cache.tv.get(key);
      const fallbackProviders = Array.isArray(show && show.providers) ? show.providers.slice(0, 4) : [];
      return videos
        .filter((v) => Number(v.season) === seasonNumber)
        .sort((a, b) => Number(a.episode) - Number(b.episode))
        .map((v, idx) => ({
          index: Number(v.episode) || idx + 1,
          title: v.title || `Episode ${Number(v.episode) || idx + 1}`,
          runtime: 'Runtime N/A',
          rating: 'NR',
          plot: v.overview || v.description || 'No episode plot available.',
          providers: fallbackProviders
        }));
    });
  }

  async function searchMulti(query) {
    const q = String(query || '').trim();
    if (!q) return [];

    if (config().mode === 'mock') {
      const all = [...mock.trendingMovies, ...mock.trendingSeries];
      return all.filter((x) => x.title.toLowerCase().includes(q.toLowerCase()));
    }

    try {
      const data = await requestTMDB(`/search/multi?query=${encodeURIComponent(q)}&include_adult=false`);
      const rows = (data.results || [])
        .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
        .slice(0, 20)
        .map((r) => (r.media_type === 'movie' ? normalizeMovie(r) : normalizeTV(r)));
      rows.forEach((x) => {
        if (x.mediaType === 'movie') cache.movie.set(x.id, x);
        if (x.mediaType === 'tv') cache.tv.set(x.id, x);
      });
      return rows;
    } catch {
      const [movies, series] = await Promise.all([
        requestCinemeta(`/catalog/movie/top/search=${encodeURIComponent(q)}.json`),
        requestCinemeta(`/catalog/series/top/search=${encodeURIComponent(q)}.json`)
      ]);

      const rows = [
        ...(movies.metas || []).slice(0, 10).map((m) => normalizeCinemetaMeta(m, 'movie')),
        ...(series.metas || []).slice(0, 10).map((m) => normalizeCinemetaMeta(m, 'tv'))
      ];

      rows.forEach((x) => {
        if (x.mediaType === 'movie') cache.movie.set(x.id, x);
        if (x.mediaType === 'tv') cache.tv.set(x.id, x);
      });
      return rows;
    }
  }

  async function fetchSectionPage(sectionId, page = 1) {
    const p = Number(page) || 1;
    if (sectionId === 'home-trending-movies' || sectionId === 'movies-trending') return fetchTrendingMovies(p);
    if (sectionId === 'home-trending-series' || sectionId === 'series-trending') return fetchTrendingTV(p);
    if (sectionId === 'movies-theatres') return fetchNowPlayingMovies(p);
    if (sectionId === 'movies-upcoming') return fetchUpcomingMovies(p);
    if (sectionId === 'series-top') return fetchTopTV(p);
    if (sectionId === 'series-on-air') return fetchOnTheAirTV(p);
    return [];
  }

  async function fetchByGenre(genreName, page = 1) {
    const name = String(genreName || '').trim();
    const p = Number(page) || 1;
    if (!name) return [];

    try {
      const [movieGenres, tvGenres] = await Promise.all([loadTMDBGenres('movie'), loadTMDBGenres('tv')]);
      const movieGenreId = movieGenres.get(name.toLowerCase());
      const tvGenreId = tvGenres.get(name.toLowerCase());
      const moviePromise = movieGenreId
        ? requestTMDB(`/discover/movie?with_genres=${movieGenreId}&sort_by=popularity.desc&page=${p}`)
        : Promise.resolve({ results: [] });
      const tvPromise = tvGenreId
        ? requestTMDB(`/discover/tv?with_genres=${tvGenreId}&sort_by=popularity.desc&page=${p}`)
        : Promise.resolve({ results: [] });
      const [movieData, tvData] = await Promise.all([moviePromise, tvPromise]);
      const movies = (movieData.results || []).filter((r) => r.title).map(normalizeMovie);
      const shows = (tvData.results || []).filter((r) => r.name).map(normalizeTV);
      const all = [...movies, ...shows];
      all.forEach((x) => {
        if (x.mediaType === 'movie') cache.movie.set(x.id, x);
        if (x.mediaType === 'tv') cache.tv.set(x.id, x);
      });
      return all;
    } catch {
      if (p > 1) return [];
      const [movieRows, tvRows] = await Promise.all([getCinemetaMovieTop(), getCinemetaTVTop()]);
      const exact = (m) => Array.isArray(m.genre) && m.genre.some((g) => String(g).toLowerCase() === name.toLowerCase());
      const loose = (m) => Array.isArray(m.genre) && m.genre.some((g) => String(g).toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(String(g).toLowerCase()));
      let all = [
        ...movieRows.filter(exact),
        ...tvRows.filter(exact)
      ];
      if (!all.length) {
        all = [
          ...movieRows.filter(loose),
          ...tvRows.filter(loose)
        ];
      }
      if (!all.length) {
        return searchMulti(name);
      }
      all = pageSlice(all, p, 20);
      all.forEach((x) => {
        if (x.mediaType === 'movie') cache.movie.set(x.id, x);
        if (x.mediaType === 'tv') cache.tv.set(x.id, x);
      });
      return all;
    }
  }

  async function fetchTrailers(mediaType, id, title) {
    const key = String(id);
    const type = mediaType === 'movie' ? 'movie' : 'tv';
    return tmdbOrCinemeta(async () => {
      const data = await requestTMDB(`/${type}/${encodeURIComponent(key)}/videos`);
      const rows = (data.results || [])
        .filter((v) => (v.site === 'YouTube' || v.site === 'Vimeo') && (v.type === 'Trailer' || v.type === 'Teaser'))
        .map((v) => {
          const url = v.site === 'YouTube'
            ? `https://www.youtube.com/watch?v=${encodeURIComponent(v.key)}`
            : `https://vimeo.com/${encodeURIComponent(v.key)}`;
          return {
            name: v.name || `${title} Trailer`,
            source: v.site,
            type: v.type || 'Trailer',
            url
          };
        });
      return rows;
    }, async () => {
      const q = encodeURIComponent(`${title} trailer`);
      return [
        { name: `${title} Trailer Search`, source: 'YouTube', type: 'Search', url: `https://www.youtube.com/results?search_query=${q}` },
        { name: `${title} Trailer Search`, source: 'Google', type: 'Search', url: `https://www.google.com/search?q=${q}` }
      ];
    });
  }

  window.PlotData = {
    fetchTrendingMovies,
    fetchTrendingTV,
    fetchNowPlayingMovies,
    fetchUpcomingMovies,
    fetchTopTV,
    fetchOnTheAirTV,
    fetchMovieDetail,
    fetchTVDetail,
    fetchTVSeasonEpisodes,
    searchMulti,
    fetchSectionPage,
    fetchByGenre,
    fetchTrailers
  };
})();
