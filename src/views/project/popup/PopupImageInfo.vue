<template>
  <vs-popup id="popupImageInfo"  :active.sync="popupActiveSync">
    <div style="display: flex; align-content: center; justify-content: center;" @click="onClickDetail">


      <img v-if="imageName === '빈도'" :src="imageUrl1"
                style="max-width:765px"/>
      <img v-if="imageName === '강도'" :src="imageUrl2"
                style="max-width:765px"/>
      <img v-if="imageName === '위험도'" :src="imageUrl3"
                style="max-width:765px"/>
    </div>

  </vs-popup>
</template>

<script>
import DateSelector from '../../../components/selector/DateSelector'
import FileUploader from '../../../components/FileUploader'

export default {
  name: 'PopupImageInfo',
  props: {
    value: Boolean,
    imageName: String,
  },
  components: {
  },
  data () {
    return {
      imageUrl1: require('@/assets/images/빈도_팝업.png'),
      imageUrl2: require('@/assets/images/강도_팝업.png'),
      imageUrl3: require('@/assets/images/위험도_팝업.png')
    }
  },
  watch: {
    popupActiveSync(value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }
    },
  },
  computed: {
    popupActiveSync: {
      get () {
        return this.value
      },
      set () {
        this.handleCloseSelf()
      }
    }
  },
  created () {
  },
  methods: {

    handleCloseSelf () {
      this.$emit('input', false)
    },

    onClickDetail () {
      let url = ''
      if (this.imageName === '빈도') {
        url = this.imageUrl1
      }
      else if (this.imageName === '강도') {
        url = this.imageUrl2
      }
      else if (this.imageName === '위험도') {
        url = this.imageUrl3
      }
      if (url) {
        window.open(url, '_blank')
      }
    }
  }
}

</script>

<style>

#popupRegAdmin > .vs-popup {
  width: 1024px !important;
}

#popupRegAdmin > .vs-popup > .vs-popup--content {
  width: 100%;
  padding: 0;
  margin: 0;
}

#popupRegAdmin > .vs-popup > .vs-popup--content > .vs-row {
  padding: 24px;

}

</style>
