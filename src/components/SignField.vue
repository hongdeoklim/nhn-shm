<template>
  <div style="display: flex; justify-content: center;">
    <div class="sign-field" :class="[bordered ? 'bordered': '']">
      <div v-if="image" class="sign-image" :style="{backgroundImage: image? `url(${image})`: ''}" @click="handleClickImage"></div>
<!--      <img v-if="image" :src="image" style="border: 0; height:80px;" @click="handleClickImage"/>-->
      <div v-else @click.stop="handleClick" style="width:100%; height: 100%; min-height:80px; min-width: 120px; display: flex; justify-content: center; align-items: center; color: #3c3c3c">클릭하여<br>서명하기</div>

      <popup-sign-field v-model="showPopup" :image="image" :readonly="readonly" @save="handleSave" @update="handleUpdate" @delete="handleDelete"/>
    </div>
  </div>
</template>

<script>
import PopupSignField from '@/popup/PopupSignField'
export default {
  name: 'SignField',
  components: {PopupSignField},
  props: {
    value: String,
    readonly: Boolean,
    // 테두리를 표시할지 여부
    bordered: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      image: this.value,
      showPopup: false
    }
  },
  watch: {
    value (value) {
      this.image = value
    },
    image (value) {
      this.$emit('input', value)
    }
  },
  methods: {
    handleSave (value) {
      this.image = value
    },
    handleDelete () {
      this.image = ''
    },
    handleClick () {
      this.showPopup = true
    },
    handleUpdate(imgSrc) {
      this.image = imgSrc;
    },
    handleClickImage () {
      this.showPopup = true
    }
  }
}
</script>

<style lang="scss" scoped>
.sign-field {
  display: grid;

  width: 100%;
  height: 100%;

  min-width: 120px;
  max-width:250px;
  min-height: 80px;


  img {
    width: 100%;
    height: 100%;

    display: inline-block;
    content: "";
    border-radius: 6px;
  }
  .sign-image {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }

  &.bordered {
    border: solid 1px #cdcdcd;
    border-radius: 6px;
  }
}
</style>
