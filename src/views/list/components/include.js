const search = {};

// SearchColumnKeyword.vue --> key : search-column-keyword
const filesSearchVue = require.context(".", true, /Search.+\.vue$/);
filesSearchVue.keys().forEach((fileName) => {
  const key = fileName.replace(/(\.\/|\.vue)/g, "").replaceAll(/[A-Z]/g, '-$&').toLowerCase().substring(1)
  search[key] = filesSearchVue(fileName).default;
});


const fileEmpty = require.context(".", true, /EmptySpace\.vue$/);
fileEmpty.keys().forEach((fileName) => {
  const key = fileName.replace(/(\.\/|\.vue)/g, "").replaceAll(/[A-Z]/g, '-$&').toLowerCase().substring(1)
  search[key] = fileEmpty(fileName).default;
});


export default search;
