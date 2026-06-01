<template>
  <vs-row class="text-center safety-measures-header">
    <vs-col class="w-2/12 safety-measures-item safety-measures-header-header">구분</vs-col>
    <vs-col class="w-10/12">
      <vs-row>
        <vs-col class="w-1/2">
          <vs-col class="w-8/12 safety-measures-item"><i class="small-dot"/>안전조치 요구사항</vs-col>
          <vs-col class="w-2/12 safety-measures-item">조치필요</vs-col>
          <vs-col class="w-2/12 safety-measures-item">확인</vs-col>
        </vs-col>
        <vs-col class="w-1/2">
          <vs-col class="w-8/12 safety-measures-item"><i class="small-dot"/>안전조치 요구사항</vs-col>
          <vs-col class="w-2/12 safety-measures-item">조치필요</vs-col>
          <vs-col class="w-2/12 safety-measures-item">확인</vs-col>
        </vs-col>
      </vs-row>
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  name: 'SafetyMeasuresHeader'
}
</script>

<style lang="scss" scoped>
.mobile-check {
}
.safety-measures-header {
  color: #3C3C3C;
  background-color: #F9F9F9;

  .safety-measures-item {
    height: 53px;
    border-top:1px solid #CDCDCD;
    border-bottom:1px solid #CDCDCD;
    border-left:1px solid #CDCDCD;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .safety-measures-header-header {
    border-left: none;
  }
}
</style>
