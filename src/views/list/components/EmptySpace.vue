<template>
<div :class="label ? 'w-full' : 'empty-space'">
  <div v-if="label" class="w-full grid" style="font-size: 12px; grid-template-columns: 1fr auto 1fr">
    <div class="position: relative">
      <div class="border-bottom" style="position: absolute; top: 50%; left:0; right:0;"></div>
    </div>
    <span>{{ label }}</span>
    <div class="position: relative">
      <div class="border-bottom" style="position: absolute; top: 50%; left:0; right:0;"></div>
    </div>
  </div>
  <div v-else-if="line" class="position: relative">
    <div class="border-bottom" style="position: absolute; top: 50%; left:0; right:0;"></div>
  </div>
</div>
</template>

<script>
export default {
  name: "EmptySpace",
  props: {
    label: String,
    options: Object,
  },
  computed: {
    line () {
      return (this.options && this.options.line)
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-space {
  height: 0px;
  width: 100%;
}
</style>
