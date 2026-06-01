<template>
<div class="warning-view">
  <h5><feather-icon icon="AlertTriangleIcon" svgClasses="h-5 w-5" class="mr-1" />유의사항</h5>
  <div class="body">
    <p v-for="item in list"> <i class="dot"></i>{{ item }}</p>
  </div>
</div>
</template>

<script>
export default {
  name: 'WarningView',
  props: {
    list: Array,
  }
}
</script>

<style lang="scss" scoped>
.warning-view {
  border: 1px solid #CCDDCD;
  & > .body {
    padding: 10px;

    p {
      display: flex;
      align-items: center;
    }
    .dot {
      width: 3px;
      height: 3px;
      margin: 0 8px;
      border-radius: 3px;
      display: inline-block;
      background-color: #3C3C3C;
    }
  }
}
h5 {
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  padding: 10px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-bottom: 1px solid #CCDDCD;
  background: #F9F9F9;
  color: #3C3C3C;

}
</style>
