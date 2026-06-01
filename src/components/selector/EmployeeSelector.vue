\<template>
  <div>
    <label style="display: flex; position: relative; align-items: center">
      <ml-input class="w-full h-full"
                style="border-radius: 5px;"
                :readonly="readonly"
                :value="selectCompany ? selectCompany.com_name : selectCompanyName" @click="handleClickInput"/>
      <vs-icon v-if="!readonly" icon-pack="feather" icon="icon-home"
               style="padding-left:6px; padding-right:6px; position: absolute; top:auto; right:0; bottom:auto; font-size:24px; border-left: 1px solid #cdcdcd;"
      ></vs-icon>
    </label>

    <popup-search-company v-model="showPopup"
                          :listOnly="listOnly"
                          :selectId="selectCompany ? selectCompany.id : selectCompanyId"
                          :field-id="fieldId"
                          @handleClickSelect="handleClickSelect"/>
  </div>
</template>

<script>
import PopupSearchCompany from '@/popup/PopupSearchCompany'

export default {
  name: 'EmployeeSelector',
  components: {PopupSearchCompany},
  props:{
    value:[Number, String],
    useName: Boolean,
    readonly: Boolean,
    listOnly: {
      type: Boolean,
      default: () => true
    },
    fieldId: Number,
  },
  watch: {
    value (data) {
      this.value = data
    }
  },
  computed: {
    selectCompany () {
      const list = this.$store.state.company.companyList
      for (const company of list) {
        if (company.id === this.value) {
          return company
        }
      }
      return {}
    }
  },
  data () {
    return {
      showPopup:false,
      selectCompanyName: '',
      selectCompanyId:''
    }
  },
  created () {
  },
  methods:{
    handleClickInput () {
      if (!this.readonly) {
        this.showPopup = true
      }
    },

    handleClickSelect (company) {
      if (this.readonly) {
        // 읽기 전용일 때에는 선택 동작으로 넘어가지 않게 핟나
        return;
      }
      this.selectCompanyName = company.com_name
      this.selectCompanyId = company.id
      if (this.useName) {
        this.$emit('input', company.com_name)
      } else {
        this.$emit('input', company.id)
      }
      this.$emit('select', company)
    }
  }
}
</script>

<style scoped>

</style>
