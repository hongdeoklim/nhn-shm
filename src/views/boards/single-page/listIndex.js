const files = require.context(".", true, /List\.js$/);
const modules = {};

files.keys().forEach((key) => {
  if (key === "./writeIndex.js") return;
  if (key === "./listIndex.js") return;
  modules[
    key
      .toLowerCase()
      .replace(/(\.\/|\.js)/g, "")
      .replace("/", "_")
  ] = files(key).default;
});

export default modules;
