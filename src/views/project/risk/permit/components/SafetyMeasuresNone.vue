<template>
  <vs-row class="text-center safety-measures">
    <vs-col class="w-full safety-measures-item safety-measures-heavy-header">
      {{ message }}
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  name: 'SafetyMeasuresNone',
  data () {
    return {
      message: '작업을 선택해주세요.'
    }
  }
}
</script>

<style lang="scss" scoped>
.safety-measures {
  color: #3C3C3C;
  .safety-measures-item {
    height: 53px;
    padding: 16px;
    border-bottom:1px solid #CDCDCD;
    border-left:1px solid #CDCDCD;
    display: flex;
    align-items: center;
    justify-content: center;

    &.text-left {
      justify-content: left;
    }
  }

  .safety-measures-heavy-header {
    height: 212px;
    border-left: none;
  }
}

.small-dot {
  width: 4px;
  height: 4px;
  background-color: #3C3C3C;
  border-radius: 2px;
  margin-right: 8px;
}
</style>
