<template>
  <vs-popup id="popupImageClipper" title="이미지 등록하기" :active.sync="showPopup">
    <div class="popup-image-clipper">
      <div class="grid-crop">
        <h5 class="mb-2">원본 이미지</h5>
        <clipper-fixed
          class="image-clipper"
          ref="clipper"
          :src="imgPath"
          :ratio="ratio"
          preview="preview">
        </clipper-fixed>
      </div>

      <div class="grid-preview">
        <h5 class="mb-2">미리보기</h5>
        <clipper-preview class="preview" name="preview">
          <div class="placeholder" slot="placeholder">preview area</div>
        </clipper-preview>

        <div class="hint mt-4">
          <p>※ 이미지를 드래그하여 위치를 조정할 수 있습니다.</p>
          <p>※ 마우스 휠을 이용하여 이미지를 확대/축소할 수 있습니다.</p>
        </div>
      </div>

      <div class="grid-button">
        <vs-button class="w-full" color="secondary" @click="getResult">사용하기</vs-button>
      </div>
    </div>
  </vs-popup>
</template>

<script>
export default {
  name: "PopupImageClipper",
  props: {
    value: Boolean,
    imgPath: String,
  },
  computed: {
    showPopup: {
      get() {
        return this.value
      },
      set(value) {
        if (!value) {
          this.printDatas = [];
        }
        this.$emit("input", value)
      }
    },
  },
  watch: {
    showPopup(value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }
    },
  },
  data () {
    return {
      resultURL: '',
      ratio: 510/288,
    }
  },
  methods: {
    getResult: function () {
      const canvas = this.$refs.clipper.clip();//call component's clip method
      this.resultURL = canvas.toDataURL("image/jpeg", 1);//canvas->image
      this.$emit("result", this.resultURL)
      this.showPopup = false;
    }
  }
};
</script>

<style scoped lang="scss">
.my-clipper {
  width: 100%;
}

.popup-image-clipper {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr 400px;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    "crop preview"
    "crop button";

  .preview {
    border: 1px solid #cdcdcd;
    height: calc(400px * 288 / 510 - 2px);
  }

  .grid-crop {
    grid-area: crop;
  }
  .grid-preview {
    grid-area: preview;
  }
  .grid-button {
    grid-area: button;
  }

  .hint {
    color: #999;
  }
}
</style>

<style lang="scss">
#popupImageClipper.con-vs-popup {
  z-index: 53000;

  .vs-popup {
    width: 1120px !important;
    height: auto;

    position: relative;
  }
  .vs-popup--content {
    width: auto !important;
    padding: 1rem;
    font-size: 1rem;
  }
}
</style>
