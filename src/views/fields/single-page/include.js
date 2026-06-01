const write = {};
const list = {};
const search = {};
const info = {};
const excelUpload = {};
const options = {};

// Write.vue --> key : 폴더명_write
const filesWriteVue = require.context(".", true, /Write\.vue$/);
filesWriteVue.keys().forEach((key) => {
  write[key.toLowerCase().replace(/(\.\/|\.vue)/g, "").replace("/", "_")] = filesWriteVue(key).default;
});

// List.vue --> key : 폴더명_list
const filesListVue = require.context(".", true, /List\.vue$/);
filesListVue.keys().forEach((key) => {
  list[key.toLowerCase().replace(/(\.\/|\.vue)/g, "").replace("/", "_")] = filesListVue(key).default;
});

// Search.vue --> key : 폴더명_list
const filesSearchVue = require.context(".", true, /Search\.vue$/);
filesSearchVue.keys().forEach((key) => {
  search[key.toLowerCase().replace(/(\.\/|\.vue)/g, "").replace("/", "_")] = filesSearchVue(key).default;
});

// ExcelUpload.vue --> key : 폴더명_excelupload
const filesExcelUploadVue = require.context(".", true, /ExcelUpload\.vue$/);
filesExcelUploadVue.keys().forEach((key) => {
  excelUpload[key.toLowerCase().replace(/(\.\/|\.vue)/g, "").replace("/", "_")] = filesExcelUploadVue(key).default;
});

// Info.vue --> key : 폴더명_info
const filesInfoVue = require.context(".", true, /Info\.vue$/);
filesInfoVue.keys().forEach((key) => {
  info[key.toLowerCase().replace(/(\.\/|\.vue)/g, "").replace("/", "_")] = filesInfoVue(key).default;
});

// options.js --> key : 폴더명_options
const filesTableOptions = require.context(".", true, /options\.js$/);
filesTableOptions.keys().forEach((key) => {
  options[key.toLowerCase().replace(/(\.\/|\.js)/g, "").replace("/", "_")] = filesTableOptions(key).default;
});

export default {write, list, search, info, excelUpload, options};
