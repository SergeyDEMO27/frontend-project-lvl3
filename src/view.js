export default (path, value, i18nInstance) => {
  const formMain = document.querySelector('.rss-form');
  const inputMain = document.querySelector('.form-control');
  const submitButtonMain = document.querySelector('button[type=submit]');
  const feedbackMain = document.querySelector('.feedback');
  const feedsMain = document.querySelector('.feeds');
  const postsMain = document.querySelector('.posts');
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const modalLink = document.querySelector('.full-article');

  const trimmer = (text) => text.trim().replace(/^(\/\/\s*)?<!\[CDATA\[|(\/\/\s*)?\]\]>$/g, '');

  const renderFormStateText = (formState) => {
    feedbackMain.classList.remove('text-success', 'text', 'text-danger');
    if (formState === 'successful') {
      inputMain.removeAttribute('readonly');
      submitButtonMain.removeAttribute('disabled');
      feedbackMain.classList.add('text-success');
      feedbackMain.textContent = i18nInstance.t(formState);
    }
    if (formState === 'loading') {
      inputMain.setAttribute('readonly', true);
      submitButtonMain.setAttribute('disabled', 'disabled');
      feedbackMain.classList.add('text');
      feedbackMain.textContent = '';
    }
    if (formState === 'failed') {
      inputMain.removeAttribute('readonly');
      submitButtonMain.removeAttribute('disabled');
      feedbackMain.classList.add('text-danger');
    }
  };

  const getErrorMessage = (error) => {
    if (error === 'this must be a valid URL') {
      return i18nInstance.t('url');
    } if (error === 'Network Error') {
      return i18nInstance.t('no-internet');
    } if (error.startsWith('this must not be one of the following values:')) {
      return i18nInstance.t('double');
    }
    return i18nInstance.t('default');
  };

  const renderError = (err) => {
    if (err) {
      const error = getErrorMessage(err);
      feedbackMain.textContent = error;
      inputMain.className = 'form-control w-100 is-invalid';
      feedbackMain.className = 'feedback m-0 position-absolute small text-danger';
    } else {
      inputMain.className = 'form-control w-100';
      feedbackMain.className = 'feedback m-0 position-absolute small text-success';
    }
  };

  const renderFeeds = (feeds) => {
    feedsMain.innerHTML = '';
    const containerFeeds = document.createElement('div');
    containerFeeds.classList.add('card', 'border-0');
    const containerTitleOfList = document.createElement('div');
    containerTitleOfList.classList.add('card-body');
    const titleOfList = document.createElement('h2');
    titleOfList.classList.add('card-title', 'h4');
    titleOfList.textContent = i18nInstance.t('feeds');
    const listFeeds = document.createElement('ul');
    listFeeds.classList.add('list-group', 'border-0', 'rounded-0');

    feeds.forEach(({ titleFeed, descriptionFeed }) => {
      const itemFeeds = document.createElement('li');
      itemFeeds.classList.add('list-group-item', 'border-0', 'border-end-0');
      const titleOfItemFeeds = document.createElement('h3');
      titleOfItemFeeds.classList.add('h6', 'm-0');
      titleOfItemFeeds.textContent = trimmer(titleFeed);
      const descriptionOfItemFeeds = document.createElement('p');
      descriptionOfItemFeeds.classList.add('m-0', 'small', 'text-black-50');
      descriptionOfItemFeeds.textContent = trimmer(descriptionFeed);
      itemFeeds.append(titleOfItemFeeds, descriptionOfItemFeeds);
      listFeeds.append(itemFeeds);
    });

    containerTitleOfList.append(titleOfList);
    containerFeeds.append(containerTitleOfList, listFeeds);
    feedsMain.append(containerFeeds);
    formMain.reset();
    inputMain.focus();
  };

  const makePostsLink = (title, link) => {
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
    linkPost.textContent = trimmer(title);
    linkPost.setAttribute('href', link);
    linkPost.setAttribute('target', '_blank');
    linkPost.setAttribute('rel', 'noopener noreferrer');
    linkPost.addEventListener('click', (e) => {
      e.target.className = 'fw-normal link-secondary';
    });
    itemPosts.append(linkPost);
    return itemPosts;
  };

  const fillModal = (title, description, link) => {
    modalTitle.textContent = trimmer(title);
    modalBody.textContent = trimmer(description);
    modalLink.setAttribute('href', link);
  };

  const makePostsButton = (title, description, link) => {
    const buttonPost = document.createElement('button');
    buttonPost.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    buttonPost.setAttribute('data-bs-toggle', 'modal');
    buttonPost.setAttribute('data-bs-target', '#modal');
    buttonPost.textContent = i18nInstance.t('preview');
    buttonPost.addEventListener('click', () => {
      fillModal(title, description, link);
      buttonPost.closest('li').querySelector('a').className = 'fw-normal link-secondary';
    });
    return buttonPost;
  };

  const renderPosts = (postsFeed) => {
    postsMain.innerHTML = '';
    const containerPosts = document.createElement('div');
    containerPosts.classList.add('card', 'border-0');
    const containerTitleOfList = document.createElement('div');
    containerTitleOfList.classList.add('card-body');
    const titleOfList = document.createElement('h2');
    titleOfList.classList.add('card-title', 'h4');
    titleOfList.textContent = i18nInstance.t('posts');
    const listPosts = document.createElement('ul');
    listPosts.classList.add('list-group', 'border-0', 'rounded-0');

    postsFeed.forEach(({ posts }) => {
      posts.forEach(({ titlePost, descriptionPost, linkPost }) => {
        const refPost = makePostsLink(titlePost, linkPost);
        const buttonPost = makePostsButton(titlePost, descriptionPost, linkPost);
        refPost.append(buttonPost);
        listPosts.append(refPost);
      });
    });

    containerTitleOfList.append(titleOfList);
    containerPosts.append(containerTitleOfList, listPosts);
    postsMain.append(containerPosts);
  };

  switch (path) {
    case 'formState':
      renderFormStateText(value);
      break;
    case 'error':
      renderError(value);
      break;
    case 'feeds':
      renderFeeds(value);
      break;
    case 'posts':
      renderPosts(value);
      break;
    default:
      throw new Error(`Unknown state ${path}`);
  }
};
