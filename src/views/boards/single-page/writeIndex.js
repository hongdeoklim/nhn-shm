const files = require.context(".", true, /Write\.vue$/);

const modules = {};

files.keys().forEach((key) => {
  if (key === "./writeIndex.js") return;
  if (key === "./listIndex.js") return;
  modules[key.toLowerCase().replace(/(\.\/|\.vue)/g, "").replace("/", "_")] = files(key).default;
});

export default modules;
