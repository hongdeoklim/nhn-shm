<template>
  <vs-select autocomplete v-model="select" @change="handleChange" :disabled="readonly" >
    <vs-select-item  v-for="(data, index) in option" :key="index" :text="data.order_number+'차'" :value="data.order_number"/>
  </vs-select>
</template>

<script>
export default {
  name: 'OrderNumberSelectModule',
  props:{
    value:[Number, String],
    useZero:Boolean,
    readonly:Boolean,
    disabled:Boolean
  },
  watch:{
    value (value) {
      this.select = value

    }
  },
  data () {
    return {
      select:'',
      option:[]
    }
  },

  created () {
    this.select = this.value
    if (!this.select) {
      this.select = -1
    }

    this.loadOrderNumber()
  },

  methods:{

    async loadOrderNumber () {
      const page = 1
      const perPage = 10000
      const projectId = this.$route.params.proj_id
      await this.$store.dispatch('project/LOAD_PROJECT_ORDER', {page, perPage, projectId})

      if (this.useZero) {
        this.option = [{id:0, order_number:0}]
      } else {
        this.option = []
      }
      for (const order of this.$store.state.project.orderList) {
        this.option.push({
          begin_ymd: order.begin_ymd,
          created_by: order.created_by,
          creator: order.creator,
          end_ymd: order.end_ymd,
          id: order.id,
          order_number: order.order_number,
          is_checked: false
        })
      }

    },

    handleChange () {
      this.$emit('input', this.select.toString())
      for (const orderNum of this.option) {
        if (Number(orderNum.order_number) === Number(this.select)) {
          this.$emit('handleChange', orderNum)
          break
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
