export default (path, value, i18nInstance, elements) => {
  const renderFormStateText = (formState) => {
    elements.feedbackMain.classList.remove('text-success', 'text', 'text-danger');
    if (formState === 'successful') {
      elements.inputMain.removeAttribute('readonly');
      elements.submitButtonMain.removeAttribute('disabled');
      elements.feedbackMain.classList.add('text-success');
      elements.feedbackMain.textContent = i18nInstance.t('form.successful');
      elements.formMain.reset();
      elements.inputMain.focus();
    }
    if (formState === 'loading') {
      elements.inputMain.setAttribute('readonly', true);
      elements.submitButtonMain.setAttribute('disabled', 'disabled');
      elements.feedbackMain.classList.add('text');
      elements.feedbackMain.textContent = '';
    }
    if (formState === 'failed') {
      elements.inputMain.removeAttribute('readonly');
      elements.submitButtonMain.removeAttribute('disabled');
      elements.feedbackMain.classList.add('text-danger');
    }
  };

  const getErrorMessage = (error) => {
    switch (error) {
      case 'this must be a valid URL':
        return i18nInstance.t('errors.url');
      case 'Network Error':
        return i18nInstance.t('errors.no-internet');
      case 'this must not be a double':
        return i18nInstance.t('errors.double');
      case 'no-parse':
        return i18nInstance.t('errors.no-parse');
      default:
        return i18nInstance.t('errors.default');
    }
  };

  const renderError = (err) => {
    if (err) {
      const error = getErrorMessage(err);
      elements.feedbackMain.textContent = error;
      elements.inputMain.className = 'form-control w-100 is-invalid';
      elements.feedbackMain.className = 'feedback m-0 position-absolute small text-danger';
    } else {
      elements.inputMain.className = 'form-control w-100';
      elements.feedbackMain.className = 'feedback m-0 position-absolute small text-success';
    }
  };

  const renderFeeds = (feeds) => {
    elements.feedsMain.innerHTML = '';
    const containerFeeds = document.createElement('div');
    containerFeeds.classList.add('card', 'border-0');
    const containerTitleOfList = document.createElement('div');
    containerTitleOfList.classList.add('card-body');
    const titleOfList = document.createElement('h2');
    titleOfList.classList.add('card-title', 'h4');
    titleOfList.textContent = i18nInstance.t('form.feeds');
    const listFeeds = document.createElement('ul');
    listFeeds.classList.add('list-group', 'border-0', 'rounded-0');

    feeds.forEach(({ title, description }) => {
      const itemFeeds = document.createElement('li');
      itemFeeds.classList.add('list-group-item', 'border-0', 'border-end-0');
      const titleOfItemFeeds = document.createElement('h3');
      titleOfItemFeeds.classList.add('h6', 'm-0');
      titleOfItemFeeds.textContent = title;
      const descriptionOfItemFeeds = document.createElement('p');
      descriptionOfItemFeeds.classList.add('m-0', 'small', 'text-black-50');
      descriptionOfItemFeeds.textContent = description;
      itemFeeds.append(titleOfItemFeeds, descriptionOfItemFeeds);
      listFeeds.append(itemFeeds);
    });

    containerTitleOfList.append(titleOfList);
    containerFeeds.append(containerTitleOfList, listFeeds);
    elements.feedsMain.append(containerFeeds);
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
    linkPost.textContent = title;
    linkPost.setAttribute('href', link);
    linkPost.setAttribute('target', '_blank');
    linkPost.setAttribute('rel', 'noopener noreferrer');
    linkPost.dataset.id = 'link';
    itemPosts.append(linkPost);
    return itemPosts;
  };

  const fillModal = (title, description, link) => {
    elements.modalTitle.textContent = title;
    elements.modalBody.textContent = description;
    elements.modalLink.setAttribute('href', link);
  };

  const makePostsButton = (title, description, link) => {
    const buttonPost = document.createElement('button');
    buttonPost.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    buttonPost.setAttribute('data-bs-toggle', 'modal');
    buttonPost.setAttribute('data-bs-target', '#modal');
    buttonPost.textContent = i18nInstance.t('form.preview');
    buttonPost.addEventListener('click', () => {
      fillModal(title, description, link);
      buttonPost.closest('li').querySelector('a').className = 'fw-normal link-secondary';
    });
    return buttonPost;
  };

  const renderPosts = (postsFeed) => {
    elements.postsMain.innerHTML = '';
    const containerPosts = document.createElement('div');
    containerPosts.classList.add('card', 'border-0');
    const containerTitleOfList = document.createElement('div');
    containerTitleOfList.classList.add('card-body');
    const titleOfList = document.createElement('h2');
    titleOfList.classList.add('card-title', 'h4');
    titleOfList.textContent = i18nInstance.t('form.posts');
    const listPosts = document.createElement('ul');
    listPosts.classList.add('list-group', 'border-0', 'rounded-0');

    listPosts.addEventListener('click', (e) => {
      if (e.target.dataset.id === 'link') {
        e.target.className = 'fw-normal link-secondary';
      }
    });

    postsFeed.map(({ posts }) => posts.forEach(({ title, description, link }) => {
      const refPost = makePostsLink(title, link);
      const buttonPost = makePostsButton(title, description, link);
      refPost.append(buttonPost);
      listPosts.append(refPost);
    }));

    containerTitleOfList.append(titleOfList);
    containerPosts.append(containerTitleOfList, listPosts);
    elements.postsMain.append(containerPosts);
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
