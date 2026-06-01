<template>
  <div style="position: relative;">
    <ml-input class="w-full auto-completion-input" :class="label ? 'plus-label' : ''" v-model="text" :readonly="readonly" @input="filterList"/>
    <div style="position: absolute; top:0; left:10px; bottom:0; display:flex; justify-content: center; align-items: center;">
      <span>{{label}}@</span>
    </div>
    <ul v-if="list && list.length > 0 && isActive" style="overflow-y: auto; position: absolute; z-index: 1000; top:42px; left:0; width:100%; max-height:120px; background-color: #fff; border-radius: 4px; border:1px solid #cdcdcd;">
      <li class="autocomp-item" v-for="(item, index) in searchList" :key="index" @click="()=>{select(item)}">{{item.text}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AutoCompletionTextField',
  props:{
    value:[String, Number],
    list:Array,
    readonly:Boolean,
    label:String
  },
  watch:{
    value (value) {
      this.text = value
    },
    text (text) {
      this.$emit('input', text)
    }
  },
  data () {
    return {
      text:'',
      searchList:[],
      isActive:false
    }
  },
  created () {
    this.text = this.value
  },
  methods:{
    select (value) {
      this.text = value.text
      this.isActive = false
      this.$emit('select', value)
    },
    filterList () {
      const str = this.text
      const reg = /[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9|\s]/.test(str)
      if (reg === false && str !== '' && str !== ' ') {
        this.isActive = true
        this.searchList =  this.list.filter((el) => {
          return el.text.match(str)
        })
      } else {
        this.isActive = false
      }
    }
  }

}
</script>

<style scoped>
.autocomp-item {
  padding:0.6rem;
  font-weight: normal;
}
.autocomp-item:hover{
  background-color: #fafafa;
  font-weight: bold;
  cursor: pointer;
}
</style>
<style>

.auto-completion-input > div > input.vs-input--input.normal {
  padding-left:28px !important;
}
.auto-completion-input.plus-label > div > input.vs-input--input.normal {
  padding-left:38px !important;
}
</style>
