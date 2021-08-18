const getPost = (post) => ({
  title: post.querySelector('title').textContent,
  description: post.querySelector('description').textContent,
  link: post.querySelector('link').textContent,
});

export default (stringXml) => {
  try {
    const parserDom = new DOMParser();
    const parsedXml = parserDom.parseFromString(stringXml, 'application/xml');
    return {
      title: parsedXml.querySelector('title').textContent,
      description: parsedXml.querySelector('description').textContent,
      items: Array.from(parsedXml.querySelectorAll('item')).map(getPost),
    };
  } catch (err) {
    const error = new Error(err);
    error.isParseError = true;
    throw error;
  }
};
