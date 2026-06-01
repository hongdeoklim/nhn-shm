<template>
  <div class="donut-chart-label">
    <i class="square mr-2" :style="{'background-color': `${color}`}"/><span class="label">{{ label }}</span><span class="value">{{ value }} {{unit}}</span>
  </div>
</template>

<script>
export default {
  name: 'DonutChartLabel',
  props: {
    label: String|Number,
    unit: String,
    value: String|Number,
    color: String
  },

  created () {
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.donut-chart-label {
  font-size: 1em;
  display: flex;
  align-items: center;

  .square {
    min-width: 0.85em;
    width: 0.85em;
    height: 0.85em;
    display: inline-block;
    border-radius: 2px;
  }

  .label {
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 1em;
  }
  .value {
    margin-left: auto;
    white-space: nowrap;
  }
}
</style>
