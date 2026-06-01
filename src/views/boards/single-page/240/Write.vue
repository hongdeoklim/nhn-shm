<template>
  <div>
    <!--    기본정보-->
    <field-select-module
      v-model="form.stdInfo"
      :board="this.board" :is-print="isPrint"/>

    <!--    비상대피 교육 개요-->
    <vs-row class="mt-6">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5>
          <i class="dot"></i> 비상대피 교육 개요
        </h5>
      </vs-col>
    </vs-row>

    <!-- 첫번째 줄-->
    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">훈련명</div>
        <p v-if="isPrint" class="print-input">{{ form.inputA_1 }}</p>
        <ml-input
          v-else
          v-model="form.inputA_1"
          class="w-full flex-1"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">구분</div>
        <p v-if="isPrint" class="print-input">{{ form.inputA_2 }}</p>
        <vs-select v-else class="w-full flex-1" v-model="form.inputA_2" autocomplete :disabled="board.readonly">
          <vs-select-item value="대상" text="대상"/>
          <vs-select-item value="이론" text="이론"/>
          <vs-select-item value="실습" text="실습"/>
        </vs-select>
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">종류</div>
        <p v-if="isPrint" class="print-input">{{ form.inputA_3 }}</p>
        <vs-select v-else class="w-full flex-1" v-model="form.inputA_3" autocomplete :disabled="board.readonly">
          <vs-select-item v-for="(item) in formA3Option[form.inputA_2]" :value="item" :text="item" :key="item"/>
        </vs-select>
      </div>
    </div>

    <!-- 두번째 줄 -->
    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">장소</div>
        <p v-if="isPrint" class="print-input">{{ form.inputA_4 }}</p>
        <ml-input
          v-else
          v-model="form.inputA_4"
          class="w-full flex-1"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">훈련일</div>
        <p v-if="isPrint" class="print-input"> {{ form.inputA_5 }} </p>
        <date-selector v-else class="w-full flex-1" v-model="form.inputA_5" :readonly="board.readonly"/>
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">훈련계획</div>
        <p v-if="isPrint" class="print-input">{{ form.inputA_6 }}</p>
        <ml-input
          v-else
          v-model="form.inputA_6"
          class="w-full flex-1"
        />
      </div>

      <!-- 세번째 줄 -->
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">훈련 내용에 반영한 재해형태</div>
        <p v-if="isPrint" class="print-input"> {{ form.inputA_7 }} </p>
        <disaster-class-selector
          v-else
          class="w-full flex-1"
          v-model="form.inputA_7"
          :readonly="board.readonly"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">훈련 내용</div>
        <p v-if="isPrint" class="print-input"> {{ form.inputA_8 }} </p>
        <ml-input
          v-else
          v-model="form.inputA_8"
          class="w-full flex-1"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">참여인원(명)</div>
        <p v-if="isPrint" class="print-input"> {{ form.inputA_9 }} </p>
        <ml-input
          v-else
          v-model="form.inputA_9"
          class="w-full flex-1"
          type="number"
        />
      </div>
    </div>

    <!-- *********************************************** -->
    <!--    사진대지-->
    <PhotoUploadGridModule
      v-model="form.photoList"
      :is-print="isPrint"
      :readonly="board.readonly"
      section-title="사진대지"
      placeholder="신축현장 점검"/>

    <!--    파일첨부-->
    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>
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
import DisasterClassSelector from '@/components/selector/DisasterClassSelector'
import PhotoUploadGridModule from '@/views/modules/PhotoUploadGridModule'
import FieldSelectModule from '@/views/modules/FieldSelectModule'

export default {
  components: {
    FileUploadModule,
    FileUploader,
    CompanySelector,
    MemberSelector,
    PopupProjectSetting,
    DateSelector,
    PopupPlanProject,
    DisasterClassSelector,
    FieldSelectModule,
    PhotoUploadGridModule
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object
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
        // 훈련 구분이 변경됐을 때, 종류가 존재하는지 확인한다
        const options = this.formA3Option[value.inputA_2]

        // 훈련 종류가 존재하지 않으면 빈 값으로 변경한다
        if (typeof options !== 'undefined') {
          if (!options.includes(value.inputA_3)) {
            value.inputA_3 = ''
          }
        }

        this.$emit('input', value)
      }
    }
  },
  data () {
    return {
      form: {
        inputA_1: '',
        inputA_2: '',
        inputA_3: '',
        inputA_4: '',
        inputA_5: '',
        inputA_6: '',
        inputA_7: '',
        inputA_8: '',
        inputA_9: '',

        stdInfo: { },
        photoList: [],
        fileList: [],
      },
      formA3Option : {
        '대상': ['초기대응대', '재실자, 거주자'],
        '이론': ['강의식', '세미나'],
        '실습': ['도상훈련', '종합훈련', '부분(기능)훈련'],
      }
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
  &:last-child {
    border-left: none;
  }
  &__title {
    height: 54px;
    line-height: 54px;
    text-align: center;
    border-bottom: $border;
  }
  &__input {
    height: 54px;
    padding: 5px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__file {
    height: calc(100% - 54px);
    width: 100%;
    padding: 14px 14px 4px;
  }
}
</style>
