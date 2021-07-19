import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import parse from './parser.js';
import render from './view';
import updatePosts from './updatePosts.js';

export default (i18nInstance) => {
  const formMain = document.querySelector('.rss-form');
  const getUrlWithProxy = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(
    url,
  )}`;

  const state = {
    formState: '',
    error: '',
    feeds: [],
    posts: [],
    feedsOpened: [],
  };

  const watchedState = onChange(state, (path, value) => {
    render(path, value, i18nInstance);
  });

  const urlValidate = (url) => {
    const urlCheck = yup.string().url().required();
    const doubleCheck = yup.mixed().notOneOf(state.feedsOpened);
    try {
      urlCheck.validateSync(url, { abortEarly: false });
      doubleCheck.validateSync(url, { abortEarly: false });
      return null;
    } catch (error) {
      return error;
    }
  };

  const addFeed = ({
    idFeed, titleFeed, descriptionFeed, postsFeed,
  }) => {
    const { idFor, posts } = postsFeed;
    watchedState.feeds.unshift({ idFeed, titleFeed, descriptionFeed });
    watchedState.posts.unshift({ idFor, posts });
  };

  formMain.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const url = data.get('url').trim();

    watchedState.formState = 'loading';
    const error = urlValidate(url);
    if (!error) {
      watchedState.error = '';
      const urlWithProxy = getUrlWithProxy(url);
      axios(urlWithProxy)
        .then((response) => {
          const feed = parse(response.data.contents);
          addFeed(feed);
          state.feedsOpened.push(url);
          watchedState.formState = 'successful';
        })
        .catch((err) => {
          watchedState.error = err.message;
          watchedState.formState = 'failed';
        });
    } else {
      watchedState.error = error.message;
      watchedState.formState = 'failed';
    }
  });

  updatePosts(watchedState);
};
