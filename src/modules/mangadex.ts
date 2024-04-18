import axios from 'axios';

import Auth from './auth.js';
import { config } from './conf.js';
import log from './log.js';

enum MangadexUrl {
  USER_FOLLOWS = 'https://api.mangadex.org/user/follows/manga?includes[]=manga?limit=50',
  USER_LISTS = 'https://api.mangadex.org/user/list?limit=50',
  USER_FEED = 'https://api.mangadex.org/user/follows/manga/feed?limit=500&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&contentRating%5B%5D=pornographic&includeFutureUpdates=1&order%5BcreatedAt%5D=asc&order%5BupdatedAt%5D=asc&order%5BpublishAt%5D=asc&order%5BreadableAt%5D=asc&order%5Bvolume%5D=asc&order%5Bchapter%5D=asc&includes%5B%5D=manga'
}

class Mangadex {
  public async getUserFollows() {
    const response = await axios({
      headers: Auth.injectAuthHeaders(),
      method: 'GET',
      url: MangadexUrl.USER_FOLLOWS
    });

    return response.data.data;
  }

  public async getUserLists() {
    const response = await axios({
      headers: Auth.injectAuthHeaders(),
      method: 'GET',
      url: MangadexUrl.USER_LISTS
    });

    return response.data.data;
  }

  public async getUserFeed() {
    const response = await axios({
      headers: Auth.injectAuthHeaders(),
      method: 'GET',
      url: MangadexUrl.USER_FEED
    });

    return response.data.data;
  }

  public async getUserFeedSince() {
    const lastUpdate = config.get('last_update');

    config.set('last_update', new Date().toISOString().split('.')[0]);

    if (!lastUpdate) return;

    const response = await axios({
      headers: Auth.injectAuthHeaders(),
      method: 'GET',
      url: `https://api.mangadex.org/user/follows/manga/feed?limit=500&publishAtSince=${lastUpdate}&translatedLanguage[]=en&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&includeFutureUpdates=0&order[createdAt]=asc&order[updatedAt]=asc&order[publishAt]=asc&includes[]=manga`
    });

    return response.data.data;
  }
}

export default new Mangadex();
