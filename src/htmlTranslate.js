export default (i18nInstance) => {
  const titleFormMain = document.querySelector('h1.display-3.mb-0');
  const promoMain = document.querySelector('.lead');
  const placeholderInputMain = document.querySelector('.form-floating label');
  const exampleMain = document.querySelector('.mt-2.mb-0.text-muted');
  const buttonSubmitMain = document.querySelector('button[type=submit]');
  const buttonModalLink = document.querySelector('.full-article');
  const buttonModalClose = document.querySelector('.btn.btn-secondary');

  titleFormMain.textContent = i18nInstance.t('mainTitle');
  promoMain.textContent = i18nInstance.t('promo');
  placeholderInputMain.textContent = i18nInstance.t('placeholder');
  exampleMain.textContent = i18nInstance.t('example');
  buttonSubmitMain.textContent = i18nInstance.t('addButton');
  buttonModalLink.textContent = i18nInstance.t('modalMore');
  buttonModalClose.textContent = i18nInstance.t('modalClose');
};
