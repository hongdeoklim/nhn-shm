<template>
  <vs-row class="text-center safety-measures-heavy-equipment">
    <vs-col class="w-2/12 safety-measures-item safety-measures-heavy-header">{{ title }}</vs-col>
    <vs-col class="w-10/12">
      <vs-row>
        <vs-col v-for="(item, index) in list" :key="`${title}_${index}`"
                class="w-1/2">
          <vs-col class="w-8/12 safety-measures-item text-left"><i class="small-dot"/>{{ item.text }}</vs-col>
          <vs-col class="w-2/12 safety-measures-item">
            <span v-if="isPrint">
              <feather-icon v-if="item.isAction" icon="CheckIcon" />
            </span>
            <vs-checkbox v-else v-model="item.isAction" :disabled="readonly"></vs-checkbox>
          </vs-col>
          <vs-col class="w-2/12 safety-measures-item">

            <span v-if="isPrint">
              <feather-icon v-if="item.isCheck" icon="CheckIcon" />
            </span>
            <vs-checkbox v-else v-model="item.isCheck" :disabled="readonly"></vs-checkbox>
          </vs-col>
        </vs-col>
      </vs-row>
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  name: 'SafetyMeasuresItem',
  props: {
    value: Array,
    isPrint: Boolean,
    readonly: Boolean,
    title: {
      type: String,
      default: '일반작업'
    }
  },
  data () {
    return {
      list: this.value
    }
  }
}
</script>

<style lang="scss" scoped>
.safety-measures-heavy-equipment {
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
    height: auto;
    border-left: none;
    background-color: #F9F9F9;
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
