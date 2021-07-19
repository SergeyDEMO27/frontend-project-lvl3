import axios from 'axios';
import parse from './parser.js';

const getUrlWithProxy = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(
  url,
)}`;
const timeFeedsUpdate = 5000;

const updatePosts = (state) => {
  const { feedsOpened } = state;
  const promises = feedsOpened.map((url) => axios.get(getUrlWithProxy(url))
    .then((response) => {
      const { postsFeed } = parse(response.data.contents);
      const postsOld = state.posts.find(({ idFor }) => postsFeed.idFor === idFor);
      const postsNew = postsFeed.posts
        .filter((post) => postsOld.posts.every((postOld) => post.idPost !== postOld.idPost));
      if (postsNew.length > 0) {
        state.posts.forEach((post) => {
          if (post.idFor === postsOld.ifFor) {
            post.posts.unshift(...postsNew);
          }
        });
      }
    })
    .catch(() => {
    }));
  return Promise.all(promises);
};

const getFeedsUpdateTimer = (state) => {
  setTimeout(() => updatePosts(state)
    .finally(() => { getFeedsUpdateTimer(state); }), timeFeedsUpdate);
};

export default getFeedsUpdateTimer;
