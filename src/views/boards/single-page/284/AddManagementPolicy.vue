<template>
  <div class="mb-6">
    <vs-row class="my-4">
      <vs-col class="flex" vs-align="center">
        <h5><i class="dot"></i>경영내용 방침</h5>
        <vs-col v-if="!readonly" class="w-auto ml-auto">
          <vs-button class="mr-4" color="secondary" type="border" @click="handleClickAdd">+ 항목추가
          </vs-button>
          <vs-button class="mr-4" color="secondary" type="border" @click="handleClickRemove">- 항목삭제
          </vs-button>
        </vs-col>
      </vs-col>
    </vs-row>

    <div class="data" >
      <vs-row class="head" >
        <vs-col class="flex justify-center items-center"><vs-checkbox class="m-0" :disabled="readonly"/></vs-col>
        <vs-col class="flex justify-center items-center">No.</vs-col>
        <vs-col class="flex justify-center items-center">내용</vs-col>
      </vs-row>

      <Vs-row class="item" v-for="(data, index) in list">
        <vs-col class="flex justify-center items-center"><vs-checkbox v-model="data.is_checked" :disabled="readonly"/></vs-col>
        <vs-col class="flex justify-center items-center">{{ index +1 }}</vs-col>
        <vs-col class="flex justify-center items-center"><ml-textarea :rows="4" class="w-full m-0" v-model="data.content" :readonly="readonly"/></vs-col>
      </Vs-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddManagementPolicy',
  props: {
    isPrint: Boolean,
    board: Object,
    value: {
      type: Array,
      default: () => [],
    },
    readonly: Boolean,
  },
  watch: {
    value (value) {
      this.list = value
    },
    list (value) {
      this.$emit('input', value)
    }
  },
  data () {
    return {
      list: this.value,
    }
  },
  methods: {
    handleClickAdd () {
      this.list.push({
        is_checked: false,
        content: '',
      })
    },

    handleClickRemove () {
      const list = this.list.filter(data => !data.is_checked)
      this.list = list
    }
  },
  mounted() {
    // 페이지가 열리면, 기본적으로 1개 항목은 출력되도록 한다
    this.handleClickAdd();
  }
}
</script>

<style lang="scss" scoped>

.data {
  .head,
  .item {
    display: grid !important;
    grid-template-columns: 60px 80px 1fr;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }

  .head {
    height: 50px;
    background: #f9f9f9;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
  }
  .item {
    padding-top: 4px;
    padding-bottom: 4px;
  }
}
</style>
