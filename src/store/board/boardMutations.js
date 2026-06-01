export default {

  LOAD_BOARD (state, data) {
    state.boardData = data
  },

  LOAD_BOARD_LIST (state, data) {
    state.list = data
  },

  LOAD_BOARD_TYPE_LIST (state, data) {
    state.types = data
  },

  LOAD_POST (state, data) {
    state.postInfo = data
  },

  LOAD_POST_LIST (state, data) {
    state.postListInfo = data
    state.list = data.data
  },

  LOAD_COMMENT_LIST (state, data) {
    state.commentList = data
  },

  UPDATE_COMMENT (state) {
    state.deleteSuccess = true
  },

  DELETE_COMMENT (state) {
    state.deleteSuccess = true
  },

  LOAD_PHOTO_LIST (state, data) {
    state.photoList = data
  },

  DELETE_PHOTO (state, data) {
  },

  DELETE_PHOTO_LIST (state, data) {
  },

  UPLOAD_FILE_LIST (state, data) {
    state.fileList = data
  },

  DOWNLOAD_FILE (state, data) {
    state.downloadFile = data
  },

}
