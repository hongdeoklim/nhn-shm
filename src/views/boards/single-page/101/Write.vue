<template>
  <div>
    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint"/>

    <!-- 사업 또는 현장의 안전보건 목표와 경영방침 설정 -->
    <div class="mt-5">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 사업 또는 현장의 안전보건 목표와 경영방침 설정</h5>
        </vs-col>
      </vs-row>
      <div class="col-span-12 flex items-start mt-4">
        <div class="label-text mr-4">대상기간</div>
        <p v-if="isPrint" class="print-input">
          {{ form.inputB_1 }} ~ {{ form.inputB_2 }}
        </p>
        <div v-else class="flex items-center">
          <date-selector
            class="w-full flex-1"
            v-model="form.inputB_1"
            :readonly="board.readonly"
          />
          <p class="px-2">~</p>
          <date-selector
            class="w-full flex-1"
            v-model="form.inputB_2"
            :readonly="board.readonly"
          />
        </div>
      </div>
      <div class="col-span-12 flex items-start mt-4">
        <div class="label-text mr-4 mt-2">정책비전</div>
        <span v-if="isPrint" class="print-textarea"> {{ form.inputB_3 }} </span>
        <ml-textarea
          v-else
          class="flex-1 w-full"
          rows="5"
          v-model="form.inputB_3"
          :readonly="board.readonly"
        />
      </div>
      <div class="col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2">실천목표</div>
        <span v-if="isPrint" class="print-textarea"> {{ form.inputB_4 }} </span>
        <ml-textarea
          v-else
          class="flex-1 w-full"
          rows="5"
          v-model="form.inputB_4"
          :readonly="board.readonly"
        />
      </div>
    </div>

    <!-- 이미지 업로드 -->
    <photo-upload-grid-module
      :row-count="1"
      :grid-count="1"
      v-model="form.photoList"
      :is-print="isPrint"
      section-title="이미지 업로드"
      placeholder="경영방침"/>

    <!--    파일첨부-->
    <file-upload-module
      id="fileList"
      class="w-full mt-4"
      v-model="form.fileList"
      :is-print="isPrint"
      :readonly="board.readonly"
    ></file-upload-module>
  </div>
</template>

<script>
import PopupPlanProject from '@/views/project/popup/PopupPlanProject'
import DateSelector from '@/components/selector/DateSelector'
import PopupProjectSetting from '@/views/project/PopupProjectSetting'
import MemberSelector from '@/components/selector/MemberSelector'
import CompanySelector from '@/components/selector/CompanySelector'
import FileUploader from '@/components/FileUploader'
import FileUploadModule from '@/views/modules/FileUploadModule'
import FieldSelectModule from '@/views/modules/FieldSelectModule'
import PhotoUploadGridModule from '@/views/modules/PhotoUploadGridModule'

export default {
  components: {
    FileUploader,
    CompanySelector,
    MemberSelector,
    PopupProjectSetting,
    DateSelector,
    PopupPlanProject,
    FileUploadModule,
    FieldSelectModule,
    PhotoUploadGridModule
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  watch: {
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
        this.$emit('input', value)
      },
    },
  },
  data () {
    return {
      form: {
        stdInfo: {},

        inputB_1: '',
        inputB_2: '',
        inputB_3: '',
        inputB_4: '',

        photoList: [],
        fileList: [],
      },
    }
  },
}
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}

.mt-component-form {
  margin-top: 15px;
}

/* uploaded File */
.h-upload {
  height: 470px;
}

.upload-content {
  border: $border;

  &:last-child {
    border-left: none;
  }

  &__title {
    height: 54px;
    line-height: 54px;
    text-align: center;
    background: #fafafa;
    border-bottom: $border;
  }

  &__input {
    height: 54px;
    background: #f9f9f9;
    border-top: $border;
    padding: 5px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__file {
    height: calc(100% - 54px);
    width: 100%;
    padding: 14px;
  }
}
</style>
