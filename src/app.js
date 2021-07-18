import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import parse from './parser.js';
import render from './view';

export default (i18nInstance) => {
  const formMain = document.querySelector('.rss-form');
  const timeFeedsUpdate = 5000;

  const state = {
    formState: '',
    error: '',
    feeds: [],
    posts: [],
    feedsOpened: [],
  };

  const getUrlWithProxy = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(
    url,
  )}`;

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

  const updatePosts = (watchState) => {
    const { feedsOpened } = watchState;
    const promises = feedsOpened.map((url) => axios.get(getUrlWithProxy(url))
      .then((response) => {
        const { postsFeed } = parse(response.data.contents);
        const postsOld = state.posts.find(({ idFor }) => postsFeed.idFor === idFor);
        const postsNew = postsFeed.posts
          .filter((post) => postsOld.posts.every((postOld) => post.idPost !== postOld.idPost));
        if (postsNew.length > 0) {
          watchState.posts.forEach((post) => {
            if (post.idFor === postsOld.ifFor) {
              post.posts.unshift(...postsNew);
            }
          });
        }
      })
      .catch((error) => {
        watchedState.error = error.message;
      }));

    return Promise.all(promises);
  };

  const getFeedsUpdateTimer = (watchState) => {
    setTimeout(() => updatePosts(watchState)
      .finally(() => { getFeedsUpdateTimer(watchState); }), timeFeedsUpdate);
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

  getFeedsUpdateTimer(watchedState);
};
