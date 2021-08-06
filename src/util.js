const elements = {
  formMain: document.querySelector('.rss-form'),
  inputMain: document.querySelector('.form-control'),
  submitButtonMain: document.querySelector('button[type=submit]'),
  feedbackMain: document.querySelector('.feedback'),
  feedsMain: document.querySelector('.feeds'),
  postsMain: document.querySelector('.posts'),
  modalTitle: document.querySelector('.modal-title'),
  modalBody: document.querySelector('.modal-body'),
  modalLink: document.querySelector('.full-article'),
};

const messagePath = {
  url: 'errors.url',
  duplicateUrl: 'errors.duplicate',
  networkError: 'errors.networkError',
  parseError: 'errors.parseError',
  otherError: 'errors.defaultError',
  successful: 'form.successful',
};

export { elements, messagePath };
