import i18next from 'i18next';
import app from './app.js';
import resources from './locales/locale.js';
import htmlTranslator from './htmlTranslate.js';

export default () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({ lng: 'ru', resources })
    .then(() => {
      htmlTranslator(i18nInstance);
      app(i18nInstance);
    });
};
