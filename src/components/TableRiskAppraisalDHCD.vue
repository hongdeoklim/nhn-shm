<template>
  <div class="mt-component-form">
    <vs-row class="my-4 center-flex">
      <h5><i class="dot"></i>{{ getTableTitle }}</h5>
      <div class="ml-auto">
        <vs-button
          v-if="!isPrint && !isReadonly"
          class=""
          color="secondary"
          type="border"
          @click="handleAddRow"
        >항목추가
        </vs-button
        >
        <vs-button
          v-if="!isPrint && !isReadonly"
          class="ml-4"
          color="secondary"
          @click="handleRemoveRow"
        >선택삭제
        </vs-button
        >
      </div>
    </vs-row>

    <div class="form-group grid">
      <div class="overflow-x-auto">
        <!--        header-->
        <div class="row-header"
             style="display: grid;"
          :style="{gridTemplateColumns:isPrint || isReadonly?'145fr 145fr 145fr 145fr 280fr 145fr 145fr':'40px 145fr 145fr 145fr 145fr 280fr 145fr 145fr'}" >
          <div v-if="!isPrint && !isReadonly" class="row-header__item row-color-content">
            <vs-checkbox
              @change="handleCheckAll"
              v-model="allCheck"
            ></vs-checkbox>
          </div>
          <div class="row-header__item">작업내용</div>
          <div class="row-header__item">작업장소</div>
          <div class="row-header__item">유해·위험요인<br/>(세부공정)</div>
          <div class="row-header__item">재해형태</div>
          <div class="row-header__item row-w0 flex-col">
            <div class="flex h-full w-full">
              <div class="flex-1 center-flex">빈도</div>
              <div class="flex-1 center-flex">강도</div>
              <div class="flex-1 center-flex">
                <vx-tooltip
                  v-if="!isPrint"
                  title="위험도이란?"
                  :html="'자세한 정보를 보시려면<br>느낌표ⓘ 아이콘을 클릭하세요'"
                  style="
                    margin-left: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                  position="top"
                  delay=".1s"
                >
                  <feather-icon
                    icon="AlertCircleIcon"
                    style="
                      cursor: pointer;
                      width: 18px;
                      color: #7e72f2;
                      margin-right: 3px;
                    "
                    @click="onClickToolTip()"
                  />
                </vx-tooltip>
                위험도
              </div>
              <div class="flex-1 center-flex">중점관리등록</div>
            </div>
          </div>
          <div class="row-header__item ">개선대책</div>
          <div class="row-header__item">작업일정</div>
        </div>

        <!--        rows-->
        <div
          class="row-content"
          style="display: grid; "
          :style="{gridTemplateColumns:isPrint || isReadonly?'145fr 145fr 145fr 145fr 280fr 145fr 145fr':'40px 145fr 145fr 145fr 145fr 280fr 145fr 145fr'}"
          v-for="(row, indexRows) in list"
          :key="indexRows"
        >

          <div v-if="!isPrint && !isReadonly" class="none-border-center row-color-content">
            <vs-checkbox v-model="row.is_checked" :readonly="isReadonly"></vs-checkbox>
          </div>
          <div class="p-2">
            <p v-if="isPrint" class="print-textarea">
              {{ row.input_1 }}
            </p>
            <ml-textarea
              class="m-0"
              :readonly="isReadonly"
              v-else
              rows="3"
              v-model="row.input_1"
            />
          </div>

          <div class="flex-1 p-2">
            <p v-if="isPrint" class="print-input">
              {{ row.input_2 }}
            </p>
            <ml-input
              v-else
              :readonly="isReadonly"
              class="w-full"
              v-model="row.input_2"
            />
          </div>

          <div class="p-2">
            <p v-if="isPrint" class="print-textarea">
              {{ row.input_3 }}
            </p>
            <ml-textarea
              class="m-0"
              :readonly="isReadonly"
              v-else

              rows="3"
              v-model="row.input_3"
            />
          </div>


          <div class="p-2">
            <p v-if="isPrint" class="print-input">
              {{ row.input_4 }}
            </p>
            <disaster-class-selector
              v-else
              class="w-full"
              :readonly="isReadonly"
              v-model="row.input_4"
            />
          </div>

          <div class="row-w0 p-0 flex">
            <div class="flex-1 p-2 bx">
              <p v-if="isPrint" class="print-input">
                {{ row.input_5 }}
              </p>
              <ml-input
                v-else-if="isReadonly"
                readonly
                class="w-full"
                v-model="row.input_5"
              />
              <vs-select
                v-else
                class="w-full"
                v-model="row.input_5"
                :disabled="isReadonly"
                @change="handleChangeInput(indexRows, row.input_5, row.input_6, 'input_7')"
              >
                <vs-select-item
                  :key="index"
                  :value="item.value"
                  :text="item.label"
                  v-for="(item, index) in optionsNumber1"
                />
              </vs-select>
            </div>
            <div class="flex-1 p-2 br">
              <p v-if="isPrint" class="print-input">
                {{ row.input_6 }}
              </p>
              <ml-input
                v-else-if="isReadonly"
                readonly
                class="w-full"
                v-model="row.input_6"
              />
              <vs-select
                v-else
                class="w-full"
                autocomplete
                v-model="row.input_6"
                :disabled="isReadonly"
                @change="handleChangeInput(indexRows, row.input_5, row.input_6, 'input_7')"
              >
                <vs-select-item
                  :key="index"
                  :value="item.value"
                  :text="item.label"
                  v-for="(item, index) in optionsNumber2"
                />
              </vs-select>
            </div>
            <div class="flex-1 p-2">
              <p v-if="isPrint" class="print-input">
                {{ row.input_7 }}
              </p>
              <ml-input
                :readonly="true"
                class="w-full"
                v-model="row.input_7"
                v-else
                :style="{ color: row.input_7_color }"
              />
            </div>
            <div class="flex-1 p-2" style="display: flex; justify-content: center; align-items: center;">
              <div v-if="isPrint || isReadonly" class="flex">
                <div v-if="row.input_8" style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
                  <vs-icon icon="check" size="x-small"></vs-icon>
                </div>
                <div v-else style="border: 1px solid #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
                  <vs-icon icon="check" size="x-small"></vs-icon>
                </div>
              </div>
              <label v-else class="flex">
                <vs-checkbox v-model="row.input_8" />
              </label>
            </div>
          </div>

          <div class="p-2">
            <p v-if="isPrint" class="print-textarea">
              {{ row.input_9 }}
            </p>
            <ml-textarea
              class="m-0"
              :readonly="isReadonly"
              v-else

              rows="3"
              v-model="row.input_9"
            />
          </div>

          <div class="p-2">
            <date-selector v-model="row.input_10" :readonly="isReadonly || isPrint"/>
            <date-selector class="mt-3" v-model="row.input_11" :readonly="isReadonly || isPrint"/>
          </div>


        </div>

      </div>
    </div>
    <popup-risk-info v-model="showInfoPopup"></popup-risk-info>
  </div>
</template>

<script>
import CheckTypeASelector from '@/components/selector/CheckTypeASelector'
import DisasterClassSelector from '@/components/selector/DisasterClassSelector'
import PopupRiskInfo from '@/views/project/popup/PopupRiskInfo'
import DateSelector from '@/components/selector/DateSelector'

export default {
  name: 'TableRiskAppraisalDHCD',
  components: {
    DateSelector,
    PopupRiskInfo,
    DisasterClassSelector,
    CheckTypeASelector
  },
  props: {
    tableTitle: String,
    list: Array,
    isPrint: Boolean,
    isReadonly: Boolean,
  },
  watch: {
    list: {
      immediate: true,
      deep: true,
      handler (value) {
        this.riskList = value
      }
    },

  },
  computed: {
    getTableTitle () {
      if (this.tableTitle) return this.tableTitle
      return '위험성 평가표'
    },


  },
  methods: {
    onClickToolTip() {
      this.showInfoPopup = true;
    },
    handleAppraisalType (type) {
      if (type === '기계적 요인') {
        return [
          {text: '끼임(감김)', value: '끼임(감김)'},
          {text: '위험한 표면(절단, 베임, 긁힘)', value: '위험한 표면(절단, 베임, 긁힘)'},
          {text: '기계(설비)의 낙하, 비래, 전복, 붕괴, 전도 위험 부분', value: '기계(설비)의 낙하, 비래, 전복, 붕괴, 전도 위험 부분'},
          {text: '충돌위험 부분', value: '충돌위험 부분'},
          {text: '넘어짐(미끄러짐, 걸림, 헛디딤)', value: '넘어짐(미끄러짐, 걸림, 헛디딤)'},
          {text: '추락위험 부분(개구부 등)', value: '추락위험 부분(개구부 등)'},
        ]
      } else if (type === '전기적 요인') {
        return [
          {text: '감전(안전전압초과)', value: '감전(안전전압초과)'},
          {text: '아크', value: '아크'},
          {text: '정전기', value: '정전기'},
          {text: '화재 / 폭발 위험', value: '화재 / 폭발 위험'},
        ]
      } else if (type === '화학 물질적 요인') {
        return [
          {text: '가스', value: '가스'},
          {text: '증기', value: '증기'},
          {text: '에어로졸·흄', value: '에어로졸·흄'},
          {text: '액체·미스트', value: '액체·미스트'},
          {text: '고체(분진)', value: '고체(분진)'},
          {text: '반응성 물질', value: '반응성 물질'},
          {text: '방사선', value: '방사선'},
          {text: '화재 / 폭발 위험', value: '화재 / 폭발 위험'},
          {text: '복사열 / 폭발과압', value: '복사열 / 폭발과압'},
        ]
      } else if (type === '생물학적 요인') {
        return [
          {text: '병원성 미생물, 바이러스에 의한 감염', value: '병원성 미생물, 바이러스에 의한 감염'},
          {text: '유전자 변형물질(GMO)', value: '유전자 변형물질(GMO)'},
          {text: '알러지 및 미생물', value: '알러지 및 미생물'},
          {text: '동물', value: '동물'},
          {text: '식물', value: '식물'},
        ]
      } else if (type === '작업특성 요인') {
        return [
          {text: '소음', value: '소음'},
          {text: '초음파·초저주파음', value: '초음파·초저주파음'},
          {text: '진동', value: '진동'},
          {text: '근로자 실수(휴먼에러)', value: '근로자 실수(휴먼에러)'},
          {text: '저압 또는 고압상태', value: '저압 또는 고압상태'},
          {text: '질식위험·산소결핍', value: '질식위험·산소결핍'},
          {text: '중량물 취급작업', value: '중량물 취급작업'},
          {text: '반복작업', value: '반복작업'},
          {text: '불안정한 작업자세', value: '불안정한 작업자세'},
          {text: '작업(조작)도구', value: '작업(조작)도구'},
          {text: '기후 / 고온 / 한랭', value: '기후 / 고온 / 한랭'},
        ]
      } else if (type === '작업환경 요인') {
        return [
          {text: '기후 / 고온 / 한랭', value: '기후 / 고온 / 한랭'},
          {text: '조명', value: '조명'},
          {text: '공간 및 이동통로', value: '공간 및 이동통로'},
          {text: '주변 근로자', value: '주변 근로자'},
          {text: '작업시간', value: '작업시간'},
          {text: '조직 안전문화', value: '조직 안전문화'},
          {text: '화상', value: '화상'},
          {text: '작업(조작) 도구', value: '작업(조작) 도구'},
        ]
      }

    },

    // 항목추가
    handleAddRow () {
      this.riskList.push({
        is_checked: this.allCheck,
        input_1: '',
        input_2: '',
        input_3: '',
        input_4: '',
        input_5: '',
        input_6: '',
        input_7: '',
        input_7_color: '#28C76F',
        input_8: '',
        input_9: '',
        input_10: '',
        input_11: '',
      })
      this.updateList()
    },
    // 선택삭제
    handleRemoveRow () {
      for (let i = 0; i < this.riskList.length; i++) {
        if (this.riskList[i].is_checked) {
          this.riskList.remove(this.riskList[i])
          i = -1
        }
      }

      this.allCheck = false
      this.updateList()
    },
    // 전체 선택
    handleCheckAll (e) {
      const checked = e.target.checked
      this.riskList.forEach(e => {
        e.is_checked = checked
      })
    },
    // update
    updateList () {
      this.$emit('updateList', this.riskList)
    },
    // 테이블
    checkColor (value) {
      if (value >= 1 && value <= 3) {
        return '#28C76F'
      } else if (value >= 4 && value <= 6) {
        return '#FF8510'
      } else {
        return '#E42728'
      }
    },

    handleResult (result) {
      if (result >= 1 && result <= 3) return 'F'
      else if (result >= 4 && result <= 6) return 'E'
      else if (result === 8) return 'D'
      else if (result >= 9 && result <= 12) return 'C'
      else if (result === 15) return 'B'
      else if (result >= 16 && result <= 20) return 'A'
    },
    handleChangeInput (id, n1, n2, string) {
      // const f = 1
      // const e = 1
      // const d = 1
      // const c = 1
      // const b = 1
      // const a = 1
      const value = n1 * n2
      const color = `${string  }_color`
      const result = this.handleResult(value)
      this.list.forEach((i, index) => {
        for (const key in i) {
          if (key === string && index === id) {
            this.list[index][key] = result
            this.list[index][color] = this.checkColor(value)
          }
        }
      })
    },
  },
  data () {
    return {
      showInfoPopup: false,
      allCheck: false,
      riskList: [],

      optionsNumber1: [
        {value: 1, label: '1'},
        {value: 2, label: '2'},
        {value: 3, label: '3'},
        {value: 4, label: '4'},
        {value: 5, label: '5'}
      ],
      optionsNumber2: [
        {value: 1, label: '1'},
        {value: 2, label: '2'},
        {value: 3, label: '3'},
        {value: 4, label: '4'}
      ],
    }
  }
}
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
$bg: #f9f9f9;
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.label-text {
  width: 127px;
  font-weight: 500;
  font-size: 14px;
}

.mt-component-form {
  margin-top: 25px;
}

.vs-checkbox-default {
  margin: 0;
}

.ml-group-checkBox ~ .ml-group-checkBox {
  /*margin-left: 15px;*/
  margin: 0;
}

/* Table */
.row-header {
  background-color: $bg;
  text-align: center;

  &__checkbox-title {
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: $border;
    width: 100%;
  }

  &__checkboxs {
    display: flex;
    height: 50%;
    width: 100%;

    div {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    div:nth-child(2) {
      border-left: $border;
      border-right: $border;
    }
  }
}

.row-header__item {
  border-top: $border;
  border-bottom: $border;
  border-left: none;
  border-right: none;
  padding-top: 10px;
  padding-bottom: 10px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.row-header__item.item-col {
  flex-direction: column;
}

.row-header__item:last-child {
  border-right: none;
}

.none-border-center {
  padding-top: 10px;
  padding-bottom: 10px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* row data */
.row-content {
  border-bottom: $border;

  &__title {
    background-color: $bg;
    height: 100%;
  }

  &__body {
  }
}

.row-content__body-item ~ .row-content__body-item {
  border-top: $border;
}

.vs-component.vs-con-textarea.vs-textarea-primary {
  margin: 0;
}

.row-content-none-data {
  height: 120px;
  border-bottom: $border;
  display: flex;
  justify-content: center;
  align-items: center;
}

.row-color-content {
  background-color: $bg;
  border-right: $border;
}
</style>

