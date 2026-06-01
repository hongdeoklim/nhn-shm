<template>
  <div class="simple-spinner" :style="getStyle">
    <div class="icon"></div>
  </div>
</template>

<script>
export default {
  name: "SimpleSpinner",
  props: {

    // 아이콘 크기
    size: {
      type: String,
      default: '100px',
    },

    // 아이콘의 두께
    width: {
      type: String,
      default: '10px',
    },
  },
  computed: {
    getStyle() {
      const style = {};
      if (this.size) style['--icon-size'] = this.size;
      if (this.width) style['--icon-width'] = this.width;
      return style
    },
  },
}
</script>

<style lang="scss" scoped>
.simple-spinner {
  margin: 0 auto;
  padding: 30px;
  max-width: 1170px;

  position: relative;
}
.icon {
  margin: 0 auto;
  width: var(--icon-size);
  height: var(--icon-size);
  border-color: rgba(163, 151, 198, 0.2) !important;
  border-style: solid;
  border-width: var(--icon-width);
  border-top-color: rgba(var(--vs-secondary),1) !important;
  border-top-width: var(--icon-width);
  border-radius: 50%;

  position: absolute;
  top: calc(50% - 50px);
  left: calc(50% - 50px);
}

//@keyframes spin {
//  0% { transform: rotate(0deg); }
//  100% { transform: rotate(360deg); }
//}
.icon {
  animation: spin 1s linear infinite;
}
</style>
