const getPost = (post) => ({
  titlePost: post.querySelector('title').textContent,
  descriptionPost: post.querySelector('description').textContent,
  linkPost: post.querySelector('link').textContent,
  // postId: element.querySelector('guid').textContent,
});

export default (stringXml) => {
  const parserDom = new DOMParser();
  const parsedXml = parserDom.parseFromString(stringXml, 'application/xml');
  if (parsedXml.querySelector('parsererror')) {
    throw new Error('no-parse');
  }
  return {
    idFeed: parsedXml.querySelector('guid').textContent,
    titleFeed: parsedXml.querySelector('title').textContent,
    descriptionFeed: parsedXml.querySelector('description').textContent,
    postsFeed: Array.from(parsedXml.querySelectorAll('item')).map(getPost),
  };
};
