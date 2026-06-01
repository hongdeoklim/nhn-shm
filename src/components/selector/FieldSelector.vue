<template>
  <div>
    <label style="display: flex; position: relative; align-items: center" :title="selectField.field_name">
      <vs-input class="w-full h-full" style="border-radius: 5px;" :value="selectField.field_name" :readonly="readonly" @click="handleClickInput"/>
      <vs-icon icon-pack="feather" icon="icon-home"
               style="padding-left:6px; padding-right:6px; position: absolute; top:auto; right:0; bottom:auto; font-size:24px; border-left: 1px solid #cdcdcd; margin-right: 1px; background-color: white;"
      ></vs-icon>
    </label>

    <popup-search-field
      v-model="showPopup"
      :use-types="useTypes"
      :selectId="selectField.id"
      :field-label="fieldLabel"
      @handleClickSelect="handleClickSelect"
    />
  </div>
</template>

<script>
import PopupSearchField from '@/popup/PopupSearchField'

export default {
  name: 'FieldSelector',
  components: { PopupSearchField },
  props:{
    value:[Number, String],
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
    }
  },
  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
    },
    fieldListInfo () {
      return this.$store.state.project.fieldListInfo
    },
    type () {
      if (this.projectInfo.project_type === '총괄관리') { //ProjectId = 1
        return ['현장(직접수행)', '현장(용역위탁)', '현장(도급발주)', '시설물']
      } else if (this.projectInfo.project_type === '내부종사자') { //ProjectId = 2
        return ['현장(직접수행)']
      } else if (this.projectInfo.project_type === '용역위탁') { //ProjectId = 3
        return ['현장(용역위탁)']
      } else if (this.projectInfo.project_type === '도급') { //ProjectId = 4
        return ['현장(도급발주)']
      } else if (this.projectInfo.project_type === '중대시민재해') { //ProjectId = 5
        return ['시설물']
      }
    },
    useTypes () {
      if (typeof this.type === 'string') {
        return [this.type]
      } else {
        return this.type
      }
    },
    selectField () {
      const info = this.fieldListInfo

      if (info.data) {
        const list = this.$store.state.project.fieldListInfo.data

        let isExist = false;
        for (const field of list) {
          if (Number(`${field.id}`) === Number(`${this.value}`)) {
            this.lastField = field;
            isExist = true;
            return field
          }
        }

        if (!isExist && typeof this.lastField.id !== "undefined") {
          return this.lastField;
        }
      }

      return {
        field_name: this.fieldName ? this.fieldName : '',
        id: 0
      }
    }
  },
  data () {
    return {
      showPopup:false,
      lastField: {}
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

    handleClickSelect (field) {
      this.$emit('input', field.id)
      this.$emit('select', {
        address: field.address,
        amount_sumup: field.amount_sumup,
        be_completed_at: field.be_completed_at,
        contract_code: field.contract_code,
        created_at: field.created_at,
        deleted_at: field.deleted_at,
        deposit_amount: field.deposit_amount,
        director_name: field.director_name,
        facility_category_id: field.facility_category_id,
        field_code: field.field_code,
        field_map: field.field_map,
        field_name: field.field_name,
        field_photo: field.field_photo,
        field_type: field.field_type,
        format: field.format,
        id: field.id,
        manager_name: field.manager_name,
        meta: field.meta,
        phone: field.phone,
        project: field.project,
        project_id: field.project_id,
        safety_grade: field.safety_grade,
        safety_manager_name: field.safety_manager_name,
        scale1: field.scale1,
        scale2: field.scale2,
        scale3: field.scale3,
        start_work_at: field.start_work_at,
        updated_at: field.updated_at,
        work_begin_at: field.work_begin_at,
        work_end_at: field.work_end_at,
        signatures: field.signatures ? (typeof field.signatures === 'string' ? JSON.parse(field.signatures) : field.signatures) : [],
      })
    }
  }
}
</script>

<style scoped>

</style>
