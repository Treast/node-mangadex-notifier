import axios from 'axios';

class Notifier {
  public async sendTestNotification() {
    const response = await axios({
      method: 'POST',
      url: process.env.DISCORD_WEBHOOK,
      data: {
        content: `Test Notification`,
        username: 'MangaDex',
        avatar_url: 'https://treast.dev/mangadex.png'
      }
    });

    return response.data;
  }

  public async sendMangaNotification(manga: any, chapter: any) {
    await axios({
      method: 'POST',
      url: process.env.DISCORD_WEBHOOK,
      data: {
        content: `**${manga.attributes.title?.en} - Chapter ${chapter.attributes.chapter} is out !**

Read it now on MangaDex : https://mangadex.org/title/${manga.id}`,
        username: 'MangaDex',
        avatar_url: 'https://treast.dev/mangadex.png'
      }
    });
  }
}

export default new Notifier();
