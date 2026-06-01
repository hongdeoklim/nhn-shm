<template>
  <div class="o-container">
    <div class="c-field">
      <div
        :class="{'has-file': showRemovedBtn}"
        class="c-file-input js-file-input">
        <div class="c-file-input__indicator">
          <span class="c-file-input__indicator__icon c-icon c-icon--attach material-icons" style="font-size: 20px"> attach_file </span>
        </div>
        <label class="c-file-input__label js-file-input__label" :for="fileIndex">
          <span>{{ theFileName }}</span>
          <input
            :id="fileIndex" multiple="multiple"
            type="file" @change="fileChangeHandler"
            :name="fileIndex" class="c-file-input__field js-file-input__field">
        </label>
        <div @click.stop="clearFileHandler" class="c-file-input__remove js-file-input__remove">
          <span class="c-file-input__remove__icon c-icon c-icon--remove-circle material-icons"> close </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileInput',
  props: {
    fileIndex: Number,
    files: Object
  },
  data () {
    return {
      value: '',
      showRemovedBtn: false,
      nonFileName:'No file choosen'
    }
  },
  computed: {
    theFileName () {
      if (this.files === undefined || this.files.file_name === undefined || this.files.file_name === '') {
        this.showRemovedBtn = false
        return this.nonFileName
      } else {
        this.showRemovedBtn = true
        return this.files.file_name
      }

      this.showRemovedBtn = false
      return this.nonFileName
    }
  },
  methods: {
    fileChangeHandler (e) {
      const file = Array.from(e.target.files)
      const path = e.target.value

      // this.showRemovedBtn = true;

      //if ((file.length > 0) && 'name' in file[0]) {
      this.$emit('addFile', file, this.fileIndex)
      //}

    },
    clearFileHandler () {
      const el = this.$el.querySelector('.js-file-input__field')
      const wrapper = document.createElement('form')
      this.wrapInputAndReset(el, wrapper)
    },
    wrapInputAndReset (el, wrapper) {
      // wrap input with form tag
      el.parentNode.insertBefore(wrapper, el)
      wrapper.appendChild(el)

      // reset input with form.reset()
      wrapper.reset()

      // place childNodes in document fragment
      const docFrag = document.createDocumentFragment()
      while (wrapper.firstChild) {
        const child = wrapper.removeChild(wrapper.firstChild)
        docFrag.appendChild(child)
      }

      // replace wrapper with document fragment
      wrapper.parentNode.replaceChild(docFrag, wrapper)

      this.files = {}

      this.$emit('delFile', this.fileIndex)
    }
  }
}
</script>

<style scoped>


  .o-container {
    padding-bottom: 0.5rem;
  }

  .c-field__error {
    font-size: 12px;
    color: #d71149;
  }

  .c-file-input {
    position: relative;
    display: block;
    height: 36px;
    border: 1px dashed #ddd;
    background-color: #fff;
  }

  /* line 24, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
  .c-file-input:invalid,
  .c-field--error .c-file-input {
    background-color: #ffe6e9;
    border-color: #ff566a;
  }

  /* line 28, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
  .c-file-input:invalid:focus,
  .c-field--error .c-file-input:focus {
    background-color: #ffe6e9;
    border-color: #ff566a;
  }

  /* line 34, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
  .c-file-input__label {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-left: 36px;
    padding-right: 36px;
    line-height: 36px;
    color: #999;
    font-size: 12px;
    overflow: hidden;
    word-wrap: break-word;
    z-index: 1;
  }

  /* line 50, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
  .c-file-input__field {
    position: absolute !important;
    height: 1px !important;
    width: 1px !important;
    padding: 0 !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    z-index: -1;
  }

  /* line 59, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
  .c-file-input__field:focus {
    outline: none;
  }

  /* line 64, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
  .c-file-input__indicator {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 36px;
    z-index: 2;
  }

  /* line 73, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
  .c-file-input__indicator__icon {
    color: #bbb;
    position: absolute;
    top: 50%;
    -webkit-transform: translate(0, -50%);
    -ms-transform: translate(0, -50%);
    -o-transform: translate(0, -50%);
    transform: translate(0, -50%);
    left: 4px;
    font-size: 20px;
  }

  /* line 81, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
  .has-file .c-file-input__indicator__icon {
    color: #d71149;
  }

  /* line 86, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
  .c-file-input__remove {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 36px;
    z-index: 2;
  }

  .has-file > .c-file-input__remove {
    display: block;
  }

  /* line 100, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
  .c-file-input__remove__icon {
    position: absolute;
    top: 50%;
    -webkit-transform: translate(0, -50%);
    -ms-transform: translate(0, -50%);
    -o-transform: translate(0, -50%);
    transform: translate(0, -50%);
    left: 4px;
    font-size: 20px;
    color: #ff566a;
  }

</style>
