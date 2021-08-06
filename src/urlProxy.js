export default (url) => {
  const link = new URL('https://hexlet-allorigins.herokuapp.com/get');
  link.searchParams.append('url', url);
  link.searchParams.append('disableCache', true);
  return link;
};
