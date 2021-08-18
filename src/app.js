import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';
import parse from './parser.js';
import render from './view';
import updatePosts from './updatePosts.js';
import getUrlWithProxy from './urlProxy.js';
import messagePath from './util.js';

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
    yup.setLocale({
      string: {
        url: messagePath.url,
      },
      mixed: {
        notOneOf: messagePath.duplicateUrl,
        required: messagePath.emptyUrl,
      },
    });

    const urlCheck = yup.string().required().url();
    const doubleUrlCheck = yup.mixed().notOneOf(state.openedFeeds);
    try {
      urlCheck.validateSync(url, { abortEarly: false });
      doubleUrlCheck.validateSync(url, { abortEarly: false });
      return null;
    } catch (error) {
      return error.message;
    }
  };

  const addIdToPosts = (posts) => {
    const postsWithId = _.cloneDeep(posts).map((post) => {
      post.id = _.uniqueId();
      return post;
    });
    return postsWithId;
  };

  const addFeed = ({
    title, description, items,
  }) => {
    watchedState.feeds.unshift({ id: _.uniqueId(), title, description });
    watchedState.posts.unshift({ posts: addIdToPosts(items) });
  };

  formMain.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const url = data.get('url').trim();
    const error = urlValidate(url);
    if (error) {
      watchedState.error = error;
      watchedState.formState = 'failed';
      return;
    }
    watchedState.formState = 'loading';
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
