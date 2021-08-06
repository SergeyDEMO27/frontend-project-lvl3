import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import parse from './parser.js';
import render from './view';
import updatePosts from './updatePosts.js';
import getUrlWithProxy from './urlProxy.js';
import { messagePath } from './util.js';

export default (i18nInstance, elements) => {
  const formMain = document.querySelector('.rss-form');

  const state = {
    formState: '',
    error: '',
    feeds: [],
    posts: [],
    openedFeeds: [],
  };

  const watchedState = onChange(state, (path, value) => {
    render(path, value, i18nInstance, elements);
  });

  const urlValidate = (url) => {
    const urlCheck = yup.string().url(i18nInstance.t(messagePath.url)).required();
    const doubleCheck = yup
      .mixed().notOneOf(state.openedFeeds, i18nInstance.t(messagePath.duplicateUrl));
    try {
      urlCheck.validateSync(url, { abortEarly: false });
      doubleCheck.validateSync(url, { abortEarly: false });
      return null;
    } catch (error) {
      return error.message;
    }
  };

  const addFeed = ({
    id, title, description, items,
  }) => {
    watchedState.feeds.unshift({ id, title, description });
    watchedState.posts.unshift({ id, posts: items });
  };

  formMain.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const url = data.get('url').trim();

    watchedState.formState = 'loading';
    const error = urlValidate(url);
    if (error) {
      watchedState.error = error;
      watchedState.formState = 'failed';
      return;
    }
    watchedState.error = '';
    const urlWithProxy = getUrlWithProxy(url);
    axios.get(urlWithProxy)
      .then((response) => {
        const feed = parse(response.data.contents);
        addFeed(feed);
        state.openedFeeds.push(url);
        watchedState.formState = 'successful';
      })
      .catch((err) => {
        if (err.isAxiosError) {
          watchedState.error = messagePath.networkError;
        } else if (err.isParseError) {
          watchedState.error = messagePath.parseError;
        } else {
          watchedState.error = messagePath.defaultError;
        }
        watchedState.formState = 'failed';
      });
  });

  updatePosts(watchedState);
};
