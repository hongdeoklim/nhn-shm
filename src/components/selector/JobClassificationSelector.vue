<template>
  <div>
    <label style="display: flex; position: relative; align-items: center">
      <ml-input class="w-full h-full" style="border-radius: 5px;" :value="selectedClass.name_5 ? `${selectedClass.name_5}(${selectedClass.no_5})` : ''" :readonly="readonly" @click="handleClickInput"/>
      <vs-icon icon-pack="feather"  icon="icon-user-check"
               style="padding-left:6px; padding-right:6px; position: absolute; top:auto; right:0; bottom:auto; font-size:24px; border-left: 1px solid #cdcdcd; margin-right: 1px; background-color: white;"
      ></vs-icon>
    </label>

    <popup-search-job-classification
      v-model="showPopup"
      :selectId="selectedClass.no_5"
      @handleClickSelect="handleClickSelect"
    />
  </div>
</template>

<script>
import PopupSearchField from '@/popup/PopupSearchField'
import PopupSearchJobClassification from "@/popup/PopupSearchJobClassification.vue";

export default {
  name: 'JobClassificationSelector',
  components: {PopupSearchJobClassification, PopupSearchField },
  props:{
    value:{},
    fieldName: String,
    readonly: Boolean,
    fieldLabel: {
      type: String,
      default: '현장명'
    }
  },
  watch: {
    fieldListInfo: {
      deep: true,
      handler (/*value*/) {}
    },
    value(value) {
      this.selectedClass = value;
    }
  },
  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
    },
  },
  data () {
    return {
      showPopup:false,
      lastField: {},
      selectedClass: {},
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

    handleClickSelect (classification) {
      this.selectedClass = classification
      this.$emit('input', classification.no_5)
      this.$emit('select', {
        no_5: classification.no_5,
        name_5: classification.name_5,
      })
    }
  }
}
</script>

<style scoped>

</style>
