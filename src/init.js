import * as yup from 'yup';
import { state, watchedState } from './view';

export default () => {
  const formMain = document.querySelector('.rss-form');

  const urlValidate = (url) => {
    const urlCheck = yup.string().url().required();
    const doubleCheck = yup.mixed().notOneOf(state.feedsConnected);
    try {
      urlCheck.validateSync(url, { abortEarly: false });
      doubleCheck.validateSync(url, { abortEarly: false });
      return null;
    } catch (error) {
      return error;
    }
  };

  const formHandler = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const url = data.get('url').trim();
    const error = urlValidate(url);
    if (!error) {
      state.errorCurrent = '';
      watchedState.feedsConnected.push(url);
    } else {
      state.errors.push(error);
      watchedState.errorCurrent = error.message.trim();
    }
  };

  formMain.addEventListener('submit', formHandler);
};
