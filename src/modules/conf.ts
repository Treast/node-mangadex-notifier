import Conf from 'conf';
import { configDotenv } from 'dotenv';

configDotenv();

const config = new Conf({
  configName: 'config',
  cwd: './',
  encryptionKey: process.env.ENCRYPTION_KEY,
  projectName: 'config'
});

export { config };
