import i18next from 'i18next';
import app from './app.js';
import resources from './locales/locale.js';
import { elements } from './util.js';

export default () => {
  const i18nInstance = i18next.createInstance();
  return i18nInstance.init({ lng: 'ru', resources })
    .then(() => {
      app(i18nInstance, elements);
    });
};
