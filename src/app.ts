import { configDotenv } from 'dotenv';
import Auth from './modules/auth.js';
import Mangadex from './modules/mangadex.js';
import Notifier from './modules/notifier.js';

configDotenv();

await Auth.getAccessToken();

const feed = await Mangadex.getUserFeedSince();

if (feed) {
  feed.forEach((chapter: any) => {
    const manga = chapter.relationships.find(
      (relationship: any) => relationship.type === 'manga'
    );

    if (manga) {
      Notifier.sendMangaNotification(manga, chapter);
    }
  });
}
