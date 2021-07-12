import axios from 'axios';
import onChange from 'on-change';

const formMain = document.querySelector('.rss-form');
const inputMain = document.querySelector('.form-control');
const feedbackMain = document.querySelector('.feedback');
const feedsMain = document.querySelector('.feeds');
const postsMain = document.querySelector('.posts');
const modalTitle = document.querySelector('.modal-title');
const modalBody = document.querySelector('.modal-body');
const modalLink = document.querySelector('.full-article');

export const state = {
  errorCurrent: '',
  idCurrent: '',
  feedsParsed: [],
  postsParsed: [],
  feedsConnected: [],
  errors: [],
  idGenerator: 0,
};

const parser = new DOMParser();
const getUrlWithProxy = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(
  url,
)}`;
const xmlParser = (xmlString) => parser.parseFromString(xmlString, 'application/xml');
const trimmer = (text) => text.trim().replace(/^(\/\/\s*)?<!\[CDATA\[|(\/\/\s*)?\]\]>$/g, '');

const makePostsLink = (post) => {
  const itemPosts = document.createElement('li');
  itemPosts.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  );
  const linkPost = document.createElement('a');
  linkPost.classList.add('fw-bold');
  linkPost.setAttribute('href', post.querySelector('link').innerHTML);
  linkPost.textContent = trimmer(post.querySelector('title').innerHTML);
  linkPost.setAttribute('target', '_blank');
  linkPost.setAttribute('rel', 'noopener noreferrer');
  linkPost.addEventListener('click', (e) => {
    e.target.className = 'fw-normal link-secondary';
  });
  itemPosts.append(linkPost);
  return itemPosts;
};

const makePostsButton = (post) => {
  const buttonPost = document.createElement('button');
  buttonPost.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  buttonPost.setAttribute('data-bs-toggle', 'modal');
  buttonPost.setAttribute('data-bs-target', '#modal');
  buttonPost.textContent = 'Просмотр';
  buttonPost.addEventListener('click', () => {
    modalTitle.textContent = trimmer(post.querySelector('title').innerHTML);
    modalBody.textContent = trimmer(
      post.querySelector('description').innerHTML,
    );
    modalLink.setAttribute('href', post.querySelector('link').innerHTML);
    buttonPost.closest('li').querySelector('a').className = 'fw-normal link-secondary';
  });
  return buttonPost;
};

const renderPosts = () => {
  postsMain.innerHTML = '';
  const containerPosts = document.createElement('div');
  containerPosts.classList.add('card', 'border-0');
  const containerOfTitleOfList = document.createElement('div');
  containerOfTitleOfList.classList.add('card-body');
  const titleOfList = document.createElement('h2');
  titleOfList.classList.add('card-title', 'h4');
  titleOfList.textContent = 'Посты';
  const listPosts = document.createElement('ul');
  listPosts.classList.add('list-group', 'border-0', 'rounded-0');

  state.postsParsed.forEach(({ posts }) => {
    posts.forEach((post) => {
      const linkPost = makePostsLink(post);
      const buttonPost = makePostsButton(post);
      linkPost.append(buttonPost);
      listPosts.append(linkPost);
    });
  });

  containerOfTitleOfList.append(titleOfList);
  containerPosts.append(containerOfTitleOfList);
  containerPosts.append(listPosts);
  postsMain.append(containerPosts);
};

const renderFeeds = () => {
  feedsMain.innerHTML = '';
  const containerFeeds = document.createElement('div');
  containerFeeds.classList.add('card', 'border-0');
  const containerOfTitleOfList = document.createElement('div');
  containerOfTitleOfList.classList.add('card-body');
  const titleOfList = document.createElement('h2');
  titleOfList.classList.add('card-title', 'h4');
  titleOfList.textContent = 'Фиды';
  const listFeeds = document.createElement('ul');
  listFeeds.classList.add('list-group', 'border-0', 'rounded-0');

  state.feedsParsed.forEach(({ id, title, description }) => {
    state.idCurrent = id;
    const itemFeeds = document.createElement('li');
    itemFeeds.classList.add('list-group-item', 'border-0', 'border-end-0');
    const titleOfItemFeeds = document.createElement('h3');
    titleOfItemFeeds.classList.add('h6', 'm-0');
    titleOfItemFeeds.textContent = title;
    const descriptionOfItemFeeds = document.createElement('p');
    descriptionOfItemFeeds.classList.add('m-0', 'small', 'text-black-50');
    descriptionOfItemFeeds.textContent = description;
    itemFeeds.append(titleOfItemFeeds);
    itemFeeds.append(descriptionOfItemFeeds);
    listFeeds.append(itemFeeds);
  });

  containerOfTitleOfList.append(titleOfList);
  containerFeeds.append(containerOfTitleOfList);
  containerFeeds.append(listFeeds);
  feedsMain.append(containerFeeds);
  formMain.reset();
};

const getResponseRss = () => {
  const currentLink = state.feedsConnected[state.feedsConnected.length - 1];
  const urlWithProxy = getUrlWithProxy(currentLink);
  axios(urlWithProxy).then((response) => {
    const xmlString = response.data.contents;
    const xmlParsed = xmlParser(xmlString);
    state.feedsParsed.unshift({
      id: state.idGenerator,
      title: xmlParsed.querySelector('title').innerHTML,
      description: xmlParsed.querySelector('description').innerHTML,
    });
    state.postsParsed.unshift({
      idFor: state.idGenerator,
      posts: xmlParsed.querySelectorAll('item'),
    });
    state.idGenerator += 1;
    renderFeeds();
    renderPosts();
  });
};

export const watchedState = onChange(state, () => {
  if (!state.errorCurrent) {
    inputMain.className = 'form-control w-100';
    feedbackMain.textContent = 'RSS успешно загружен';
    feedbackMain.className = 'feedback m-0 position-absolute small text-success';
    getResponseRss();
  } else {
    inputMain.className = 'form-control w-100 is-invalid';
    feedbackMain.textContent = state.errorCurrent === 'this must be a valid URL'
      ? 'Ссылка должна быть валидным URL'
      : 'RSS уже существует';
    feedbackMain.className = 'feedback m-0 position-absolute small text-danger';
  }
});
