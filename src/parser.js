const getPost = (post) => ({
  id: post.querySelector('guid').textContent,
  title: post.querySelector('title').textContent,
  description: post.querySelector('description').textContent,
  link: post.querySelector('link').textContent,
});

export default (stringXml) => {
  try {
    const parserDom = new DOMParser();
    const parsedXml = parserDom.parseFromString(stringXml, 'application/xml');
    return {
      id: parsedXml.querySelector('guid').textContent,
      title: parsedXml.querySelector('title').textContent,
      description: parsedXml.querySelector('description').textContent,
      items: Array.from(parsedXml.querySelectorAll('item')).map(getPost),
    };
  } catch (error) {
    console.error(error);
    throw new Error('parse Error');
  }
};
