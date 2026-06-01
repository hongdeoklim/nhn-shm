<template>
  <div>
    <img class="fill-current" src="@/assets/images/temporary/104.svg" />
  </div>
</template>

<script>
import config from '/public/config'
import VueCookie from 'vue-cookie'
import PopupPlanProject from '@/views/project/popup/PopupPlanProject'
import DateSelector from '@/components/selector/DateSelector'
import PopupProjectSetting from '@/views/project/PopupProjectSetting'
import MemberSelector from '@/components/selector/MemberSelector'
import CompanySelector from '@/components/selector/CompanySelector'
import FileUploader from '@/components/FileUploader'

export default {
  components: {
    FileUploader,
    CompanySelector,
    MemberSelector,
    PopupProjectSetting,
    DateSelector,
    PopupPlanProject
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object
  },
  watch: {
    board: {
      immediate: true,
      deep: true,
      handler (value) {

      }
    },
    value: {
      important: true,
      deep: true,
      handler (value) {
        const keys = Object.keys(this.form)
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key]
          }
        }
      }
    },
    form: {
      immediate: true,
      deep: true,
      handler (value) {
        value.title = value.inputA_2
        this.$emit('input', value)
      }
    }
  },
  data () {
    return {
      form: {
      },
    }
  },
}
</script>

<style scoped>

</style>
