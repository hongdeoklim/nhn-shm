export default {

  FILE_UPLOAD (state, data) {
    const file = data
    state.uploadedFile = {
      id:file.id,
      fileName:file.file_name,
      fileSize:file.file_size,
      path:file.path,
      thumb:file.thumb,
      contentType:file.contentType
    }
  }
}
