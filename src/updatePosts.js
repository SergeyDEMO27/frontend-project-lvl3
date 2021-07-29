import axios from 'axios';
import _ from 'lodash';
import parse from './parser.js';
import getUrlWithProxy from './urlProxy.js';

const feedsUpdateTimeout = 5000;

const updatePosts = (state) => {
  const { openedFeeds } = state;
  const promises = openedFeeds.map((url) => axios.get(getUrlWithProxy(url))
    .then((response) => {
      const newPosts = parse(response.data.contents);
      const oldPosts = state.posts.find(({ id }) => newPosts.id === id);
      state.posts.forEach((item) => {
        if (item.id === newPosts.id) {
          item = Object.assign(item, ...(_.uniqBy([oldPosts, newPosts], 'id')));
        }
      });
    })
    .catch((error) => {
      console.error(error);
    }));
  return Promise.all(promises);
};

const getFeedsUpdateTimer = (state) => {
  setTimeout(() => updatePosts(state)
    .finally(() => { getFeedsUpdateTimer(state); }),
  feedsUpdateTimeout);
};

export default getFeedsUpdateTimer;
