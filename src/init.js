import i18next from 'i18next';
import app from './app.js';
import resources from './locales/locale.js';

export default () => {
  const elements = {
    formMain: document.querySelector('.rss-form'),
    inputMain: document.querySelector('.form-control'),
    submitButtonMain: document.querySelector('button[type=submit]'),
    feedbackMain: document.querySelector('.feedback'),
    feedsMain: document.querySelector('.feeds'),
    postsMain: document.querySelector('.posts'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalLink: document.querySelector('.full-article'),
  };

  const i18nInstance = i18next.createInstance();
  return i18nInstance.init({ lng: 'ru', resources })
    .then(() => {
      app(i18nInstance, elements);
    });
};
