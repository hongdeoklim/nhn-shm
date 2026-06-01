<template>
  <li v-if="isPrint" class="tbody">
    <span>{{form.name}}</span>
    <span>{{form.size}}</span>
    <span>{{form.quantity}}</span>
    <span>{{form.unit_price}}</span>
    <span>{{form.price}}</span>
    <span>{{form.etc}}</span>
  </li>
  <li v-else class="tbody">
    <span><vs-checkbox v-model="form.is_checked" @change="handleChangeChecked" :disabled="readonly"> </vs-checkbox></span>
    <span><ml-textarea class="mb-0" row="5" v-model="form.name" @change="changeText" :readonly="readonly"/></span>
    <span><ml-textarea class="mb-0" row="5" v-model="form.size" @change="changeText" :readonly="readonly"/></span>
    <span><ml-textarea class="mb-0" row="5" v-model="form.quantity" @change="changeText" :readonly="readonly"/></span>
    <span><ml-textarea class="mb-0" row="5" v-model="form.unit_price" @change="changeText" :readonly="readonly"/></span>
    <span><ml-textarea class="mb-0" row="5" v-model="form.price" @change="changeText" :readonly="readonly"/></span>
    <span><ml-textarea class="mb-0" row="5" v-model="form.etc" @change="changeText" :readonly="readonly"/></span>
  </li>
</template>

<script>
export default {
  name: 'SafetySuppliesOrderTableList',
  components: {},
  props:{
    value:Object,
    readonly:Boolean,
    isPrint:Boolean
  },
  watch:{
    value (data) {
      this.form = data
    }
  },
  data () {
    return {
      form:{
        is_checked:false,
        name:'',
        size:'',
        quantity:'',
        unit_price:'',
        price:'',
        etc:''
      }
    }
  },
  created () {

    this.form = this.value
  },
  methods:{
    handleChangeChecked () {
      this.$emit('handleChangeChecked', this.form)
    },
    changeText () {
      this.$emit('input', this.form)
    },
    changeSelect () {
      this.$emit('input', this.form)
    }
  }
}
</script>

<style scoped>

</style>
