<template>
  <vs-popup id="popupSignField" title="서명" :active.sync="showPopup">
    <div>
      <div v-if="!image && !readonly" class="flex justify-end gap-2 mb-2">
        <vs-button color="secondary" @click.prevent="handleClickLoad" >이미지업로드</vs-button>
        <vs-button color="secondary" type="border" @click.prevent="$refs.VueCanvasDrawing.undo()">실행취소</vs-button>
        <vs-button color="secondary" type="border" @click.prevent="$refs.VueCanvasDrawing.redo()">다시실행</vs-button>
        <vs-button color="secondary" @click.prevent="$refs.VueCanvasDrawing.reset()">초기화</vs-button>
      </div>
      <div v-if="image" style="text-align: center;">
        <div class="sign-img" :style="{backgroundImage: `url(${image})`}"></div>
<!--        <img v-if="image" height="270" :src="image" style="display: inline-block; content: ''; border: 1px solid #cdcdcd;"/>-->
      </div>
      <vue-drawing-canvas
        v-else-if="this.showPopup"
        ref="VueCanvasDrawing"
        :image.sync="useImage"
        :width="570"
        :height="270"
        :lineWidth="8"
        stroke-type="dash"
        line-cap="round"
        line-join="round"
        :fill-shape="false"
        :eraser="false"
        color="#000000"
        background-color="transparent"
        saveAs="png"
        :styles="{ border: 'solid 1px #cdcdcd' }"
        :lock="readonly"
      />
      <div v-if="!readonly" class="flex justify-end gap-2">
        <vs-button color="secondary" v-if="image" @click="handleDelete">삭제</vs-button>
        <vs-button v-if="image" @click="handleClickClose">닫기</vs-button>
        <template v-else>
          <vs-button @click="handleSave">적용</vs-button>
        </template>
      </div>
      <input type="file" style="display: none;" ref="fileUpload" @change="readFile" />
<!--      <img ref="resizeImg" style="display: none;" height="270" @load="" />-->
    </div>
  </vs-popup>
</template>

<script>
import VueDrawingCanvas from "vue-drawing-canvas";

export default {
  name: 'PopupSignField',
  components: {
    VueDrawingCanvas,
  },
  props: {
    value: Boolean,
    image: String,
    selectId: [String, Number],
    readonly: Boolean,
  },
  watch: {
    value (data) {
      this.showPopup = data
    },
    showPopup(value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }
      this.$emit('input', value)
    },
  },
  data () {
    return {
      showPopup: false,

      useImage: '',
    }
  },


  mounted () {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
      if (this.showPopup) {
        this.showPopup = false
        next(false); return
      }
      next(true)
    })
    this.$once('hook:destroyed', () => {
      backButtonRouteGuard()
    })
  },

  created () {
    this.showPopup = this.value
    this.oldSelectCompanyId = this.selectId
  },

  methods: {

    async loadCompanyList () {
      const page = this.page.current
      const perPage = this.page.perPage
      const keyword = this.search.keyword
      const projectId = this.projectId
      await this.$store.dispatch('company/LOAD_COMPANY_LIST', {
        page,
        perPage,
        keyword,
        projectId
      })

    },

    handleClickClose () {
      this.$emit('input', false)
      this.$emit('handleClickClose')
    },

    handleSave () {
      this.$emit("save", this.useImage)
      this.showPopup = false
    },

    handleDelete () {
      this.$emit("delete")
      this.showPopup = false
    },

    handleClickLoad() {
      this.$refs['fileUpload'].click();
    },
    // 파일이 불려진 이후 실행
    readFile(data) {
      const file = data.target.files[0];

      if(file.type.includes('image')) {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          img.onload = () => {
            const targetWidth = 570;
            const targetHeight = 270;
            let newWidth;
            let newHeight;
            const imgRatio = img.width / img.height;
            const targetRatio = targetWidth / targetHeight;
            if(imgRatio > targetRatio) {
              newWidth = targetWidth;
              newHeight = (targetWidth * img.height / img.width);
            } else {
              newWidth = (targetHeight * img.width / img.height);
              newHeight = targetHeight;
            }
            canvas.width = newWidth;
            canvas.height = newHeight;

            console.log({newWidth, newHeight});

            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            const resized = canvas.toDataURL();

            this.$emit('update', resized);
          }
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        // 이미지가 업로드 되지 않았으므로 무시한다
      }
    }
  }
}

</script>


<style>

#popupSignField > .vs-popup {
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none
}

</style>

<style scoped>
.sign-img {
  width: 570px;
  height: 270px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  border: 1px solid #cdcdcd;
  margin-bottom: 10px;
}
</style>
