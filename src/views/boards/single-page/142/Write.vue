<template>
  <div>
    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint"/>

    <!--내부종사자 현황-->
    <div class="mt-5">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 내부종사자 현황</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">현장명</div>
          <p  v-if="isPrint" class="print-input">{{ form.inputA_1 }}</p>
          <field-selector
            v-else
            v-model="form.inputA_1"
            class="w-full flex-1"

            @select="onChangeField"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">소속명</div>
          <p  v-if="isPrint" class="print-input">
            {{ form.inputA_2 }}
          </p>
          <ml-input
            :readonly="board.readonly"
            v-else
            v-model="form.inputA_2"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">부서명</div>
          <p v-if="isPrint" class="print-input"> {{ form.inputA_3 }} </p>
          <ml-input
            :readonly="board.readonly"
            v-else
            v-model="form.inputA_3"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">직책</div>
          <p v-if="isPrint" class="print-input">{{ form.inputA_4 }}</p>
          <ml-input
            :readonly="board.readonly"
            v-else
            v-model="form.inputA_4"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">ID코드</div>
          <p  v-if="isPrint" class="print-input">{{ form.inputA_5 }}</p>
          <ml-input
            :readonly="board.readonly"
            v-else
            v-model="form.inputA_5"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">성명</div>
          <p  v-if="isPrint" class="print-input">{{ name }}</p>
          <ml-input
            :readonly="board.readonly"
            v-else
            v-model="name"
            @focus="onNameFocus"
            @blur="onNameBlur"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">성별</div>
          <p v-if="isPrint" class="print-input">{{ form.inputA_7 }}</p>
          <vs-select
            :readonly="board.readonly"
            v-else
            v-model="form.inputA_7"
            autocomplete
            class="w-full flex-1"
          >
            <vs-select-item text="남성" value="남성" />
            <vs-select-item text="여성" value="여성" />
          </vs-select>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">출생년도</div>
          <p v-if="isPrint" class="print-input">{{ form.inputA_8 }}</p>
          <date-selector
            v-else
            v-model="form.inputA_8"
            :readonly="board.readonly"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">근무기한</div>
          <p v-if="isPrint" class="print-input">{{ form.inputA_9 }}</p>
          <vs-select
            :readonly="board.readonly"
            v-else
            v-model="form.inputA_9"
            placeholder="기한있음, 기한없음"
            autocomplete
            class="w-full flex-1"
          >
            <vs-select-item text="기한있음" value="기한있음" />
            <vs-select-item text="기한없음" value="기한없음" />
          </vs-select>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">근무기한</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputA_10 }} ~ {{ form.inputA_11 }}
          </p>
          <div v-else class="flex-1 flex items-center">
            <date-selector
              class="w-full flex-1"
              v-model="form.inputA_10"
              :readonly="board.readonly"
            />
            <p class="px-2">~</p>
            <date-selector
              class="w-full flex-1"
              v-model="form.inputA_11"
              :readonly="board.readonly"
            />
          </div>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">입사일</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputA_12 }}
          </p>
          <date-selector
            v-else
            class="flex-1"
            v-model="form.inputA_12"
            :readonly="board.readonly"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">발령일</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputA_13 }}
          </p>
          <date-selector
            v-else
            class="flex-1"
            v-model="form.inputA_13"
            :readonly="board.readonly"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">퇴사일</div>
          <p v-if="isPrint" class="print-input">
            {{ form.inputA_14 }}
          </p>
          <date-selector
            v-else
            class="flex-1 w-full"
            v-model="form.inputA_14"
            :readonly="board.readonly"
          />
        </div>
        <div
          v-for="(item, index) in depthData.depth"
          :key="item.title"
          class="col-span-4 flex items-center"
        >
          <div class="label-text mr-4">{{ item.title }}</div>
          <p v-if="isPrint" class="print-input">
            {{ form.depth[item.title] }}
          </p>
          <vs-select
            v-else
            :placeholder="item.placeholder"
            autocomplete
            class="w-full flex-1"
            v-model="form[item.title]"
            @input="(data) => changeInput(index, data)"
          >
            <vs-select-item
              v-for="depthList in item.list"
              :key="depthList.id"
              :text="depthList.id"
              :value="depthList.id"
            />
          </vs-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FieldSelectModule from '@/views/modules/FieldSelectModule'
import CompanySelector from '@/components/selector/CompanySelector'
import DateSelector from '@/components/selector/DateSelector'
import SearchNavStartEnd from '../../../../components/nav/SearchNavStartEnd.vue'
import FieldSelector from '@/components/selector/FieldSelector'

export default {
  components: {
    FieldSelector,
    FieldSelectModule,
    CompanySelector,
    DateSelector,
    SearchNavStartEnd,
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

        if (this.form.inputA_6 !== null && this.form.inputA_6 !== '') {
          this.name = this.form.inputA_6
          this.onNameBlur()
        }
      }
    },
    form: {
      immediate: true,
      deep: true,
      handler (value) {

        value.summary = {
          내부종사자_현장명: [],
          내부종사자_구분: [],
          내부종사자_세부구분: [],
          내부종사자_직종: []
        }

        value.summary['내부종사자_현장명'].push({
          [this.form.stdInfo.field_name]: 1
        })

        value.summary['내부종사자_구분'].push({
          [this.form.구분]: 1
        })

        value.summary['내부종사자_세부구분'].push({
          [this.form.세부구분]: 1
        })

        value.summary['내부종사자_직종'].push({
          [this.form.직종]: 1
        })

        this.$emit('input', value)
      },
    },
  },
  data () {
    return {
      form: {
        stdInfo: {},

        현장명: '',
        inputA_1: '',
        inputA_2: '',
        inputA_3: '',
        inputA_4: '',
        inputA_5: '',
        inputA_6: '',
        inputA_7: '',
        inputA_8: '',
        inputA_9: '',
        inputA_10: '',
        inputA_11: '',
        inputA_12: '',
        inputA_13: '',
        inputA_14: '',
        inputA_15: '',

        구분: '',
        세부구분: '',
        직종: '',
      },
      name: '',
      depthData: {
        depth: [
          {
            title: '구분',
            placeholder: '사무직, 비사무직, 현업종사자, 기타',
            list: [],
          },
          {
            title: '세부구분',
            placeholder: '공무원, 공무직, 기간제 등',
            list: [],
          },
          { title: '직종', placeholder: '공무직, 기간제, 청소 등', list: [] },
        ],
        list: [
          {
            id: '사무직',
            child: [
              { id: '공무원', child: [{ id: '공무원' }] },
              { id: '공무직', child: [{ id: '공무직' }] },
              { id: '기간제', child: [{ id: '기간제' }] },
              {
                id: '기타',
                child: [
                  { id: '공공근로' },
                  { id: '노인 일자리' },
                  { id: '장애인 일자리' },
                  { id: '지역공동체' },
                  { id: '자활' },
                  { id: '기타' },
                ],
              },
            ],
          },
          {
            id: '비사무직',
            child: [
              { id: '공무원', child: [{ id: '공무원' }] },
              { id: '공무직', child: [{ id: '공무직' }] },
              { id: '기간제', child: [{ id: '기간제' }] },
              {
                id: '기타',
                child: [
                  { id: '공공근로' },
                  { id: '노인 일자리' },
                  { id: '장애인 일자리' },
                  { id: '지역공동체' },
                  { id: '자활' },
                  { id: '기타' },
                ],
              },
            ],
          },
          {
            id: '현업종사자',
            child: [
              { id: '기간제', child: [{ id: '기간제' }] },
              {
                id: '현업종사자',
                child: [
                  { id: '청소' },
                  { id: '시설관리' },
                  { id: '경비' },
                  { id: '운전' },
                  { id: '도로 유지보수' },
                  { id: '폐기물 수거처리' },
                  { id: '공원 녹지' },
                  { id: '급식실 운영' },
                  { id: '기타' },
                ],
              },
              {
                id: '기타',
                child: [
                  { id: '공공근로' },
                  { id: '노인 일자리' },
                  { id: '장애인 일자리' },
                  { id: '지역공동체' },
                  { id: '자활' },
                  { id: '기타' },
                ],
              },
            ],
          },
          {
            id: '기타',
            child: [
              {
                id: '기타',
                child: [
                  { id: '공공근로' },
                  { id: '노인 일자리' },
                  { id: '장애인 일자리' },
                  { id: '지역공동체' },
                  { id: '자활' },
                  { id: '기타' },
                ],
              },
            ],
          },
        ],
      },
    }
  },
  mounted () {
    this.depthData.depth[0].list = this.depthData.list
  },
  methods: {
    onNameFocus () {
      this.name = this.form.inputA_6
    },
    onNameBlur () {
      this.form.inputA_6 = this.name
      const length = this.name.length
      if (2 < length) {
        const first = this.name[0]
        const last = this.name[this.name.length - 1]
        let star = ''
        for (let index = 0; index < length - 2; index++) {
          star += '*'
        }
        this.name = first + star + last
      } else if (length === 2) {
        const first = this.name[0]
        this.name = `${first  }*`
      }
    },
    changeInput (depthIndex, data) {
      const findChild = this.depthData.depth[depthIndex].list.find(
        (child) => child.id === data
      )
      if (findChild.child) {
        for (
          let index = depthIndex + 1;
          index < this.depthData.depth.length;
          index++
        ) {
          const _title = this.depthData.depth[index].title
          this.form[_title] = ''
          this.depthData.depth[index].list = []
        }

        this.depthData.depth[depthIndex + 1].list = findChild.child
      }
    },

    onChangeField (field) {
      this.form.현장명 = field.field_name
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
  padding-right: 4px;
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

.table ::v-deep {
  .vs-con-tbody {
    background: none !important;
    border: 0 !important;
  }
  thead tr {
    background: #f9f9f9 !important;
    border-top: solid 1px #cdcdcd;
    border-bottom: solid 1px #cdcdcd;
  }
  tr {
    background: #fff !important;
    border-bottom: solid 1px #cdcdcd;
  }
}
</style>
