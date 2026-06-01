<template>
  <vs-row class="w-full xl:w-auto flex gap-2" vs-align="center" :class="size==='mobile' ? 'layout-mobile' : ''" >
    <vs-col class="title">{{ label }}</vs-col>
    <vs-col class="flex-1">
      <ml-input
        :class="size"
        icon-pack="feather"
        icon="icon-search"
        v-model="keyword"
        @change="changeText"
        @keyup="keyupEvent"
        class="w-full"
      />
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  name: 'SearchNavItemField',
  components: {},
  props: {
    label: String,
    value: {
      type:[String, Number],
      default:''
    },
    size: {
      type: String,
      default: 'normal'
    },
    useName: Boolean
  },
  watch: {
    value (value) {
      this.keyword = value
    }
  },
  data () {
    return {
      keyword: '',
      lastEmitKeyTime: 0
    }
  },
  methods: {
    changeText () {
      this.$emit('input', this.keyword)
    },
    keyupEvent (event) {
      if (event.code === 'NumpadEnter' || event.code === 'Enter') {
        const now = Date.now()
        if (now - this.lastEmitKeyTime > 100) {
          this.$emit('keyupEvent', event.target.value)
          this.lastEmitKeyTime = now
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.title {
  width: 114px !important;

  font-weight: 500;
  line-height: 38px;
  text-align: left;
  white-space: nowrap;
}
</style>
