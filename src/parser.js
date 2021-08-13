import _ from 'lodash';

const getPost = (post) => ({
  id: _.uniqueId(),
  title: post.querySelector('title').textContent,
  description: post.querySelector('description').textContent,
  link: post.querySelector('link').textContent,
});

export default (stringXml) => {
  try {
    const parserDom = new DOMParser();
    const parsedXml = parserDom.parseFromString(stringXml, 'application/xml');
    return {
      id: _.uniqueId(),
      title: parsedXml.querySelector('title').textContent,
      description: parsedXml.querySelector('description').textContent,
      items: Array.from(parsedXml.querySelectorAll('item')).map(getPost),
    };
  } catch (err) {
    err.isParseError = true;
    return { items: null, error: err };
  }
};