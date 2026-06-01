<template>
  <div>
    <span v-if="isPrint" class="print-input">{{projectName}}</span>
    <label v-else style="display: flex; position: relative; align-items: center">
      <ml-input class="project-selector-input w-full h-full member-selector"
                style="border-radius: 5px; background-color:#fff; "
                :value="projectName"
                @click="handleClickInput" :readonly="true" />
      <vs-icon icon-pack="feather" icon="icon-sidebar"
               style="padding-left:6px; padding-right:6px; position: absolute; top:auto; right:0; bottom:auto; font-size:24px; border-left: 1px solid #cdcdcd;"
      ></vs-icon>
    </label>
    <popup-search-project v-model="showPopup" :size="size" :selectId="(selectProjectId) ? selectProjectId : 0" @handleClickSelect="handleClickSelect"/>
  </div>
</template>

<script>
import PopupSearchMember from '@/popup/PopupSearchMember'
import PopupSearchProject from '@/popup/PopupSearchProject'

export default {
  name: 'ProjectSelector',
  components: {
    PopupSearchProject,
    PopupSearchMember},
  props: {
    value: [Number, String],
    readonly:Boolean,
    size: String,
    useName:Boolean,
    isPrint: Boolean,
  },
  computed: {
    projectName () {
      const projectListInfo = this.$store.state.project.projectListInfo
      if (projectListInfo.data) {
        for (const project of projectListInfo.data) {
          if (this.selectProjectId === project.id) {
            return project.field_name
          }
        }
      }
    },
  },
  watch: {
    value (data) {
      this.selectProjectId = this.value
    }
  },

  data () {
    return {
      showPopup: false,
      selectProjectId: this.value
    }
  },

  methods: {

    handleClickInput () {
      if (!this.readonly) {
        this.showPopup = true
      }
    },

    handleClickSelect (_project) {
      this.selectProjectId = _project.id
      if (this.useName) {
        this.$emit('input', _project.field_name)
      } else {
        this.$emit('input', _project.id)
      }
      this.$emit('select', _project)
    }
  }
}
</script>

<style>
.member-selector input[readonly='readonly'] {
  background-color: #fff;
}
.project-selector-input .vs-inputx{
  padding-right: 45px !important;
}
</style>
