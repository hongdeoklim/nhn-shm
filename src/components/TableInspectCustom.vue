<template>
  <div class="table-inspect-custom print-container">
    <slot name="title">
      <vs-row v-if="title">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5>
            <i class="dot"></i> {{title}}
          </h5>
        </vs-col>
      </vs-row>
    </slot>

    <div class="mt-4 ti-header" :style="{gridTemplateColumns: _mainGridStyle}">
      <div class="row-header">항목</div>
      <div class="row-header">세부항목</div>
      <div class="p-0 row-header" style="display: inline-block;">
        <div v-if="checkTitle" class="w-full py-2 border-bottom ">
          {{checkTitle}}
        </div>
        <div class="w-full p-0 grid" :style="{gridTemplateColumns: _checkGridStyle}">
          <span v-for="(ch, chIndex) in checkList" class="p-2" :class="chIndex < checkList.length -1 ? 'border-right' : '' " style="flex: 1 0 auto;">
            {{ typeof ch === 'object' ? ch.label : ch }}
          </span>
        </div>
      </div>
      <div class="row-header">비고</div>
    </div>

    <!-- 테이블 본문 영역 -->
    <div class="ti-body" :style="{gridTemplateColumns: _mainGridStyle}">
      <template v-for="(row, rIndex) in list" >

        <div v-if="groupSpanList[rIndex] > 0"
             class="row-header"
             style="white-space: pre-wrap;"
             :style="{gridRow:`span ${groupSpanList[rIndex]}`}">{{ row.title }}</div>
        <div style="white-space: pre-wrap;">{{ row.label }}</div>
        <div class="p-0">
          <div class="w-full h-full grid" :style="{gridTemplateColumns: _checkGridStyle}">
          <span v-for="(ch, chIndex) in checkList" class="w-full p-0 grid" :class="chIndex < checkList.length -1 ? 'border-right' : '' " >
            <div class="w-full h-full" style="display: grid; justify-content: center; align-items: center;">
              <template v-if="isPrint">
                <div v-if="typeof ch === 'object' ? row.is_checked === ch.value : row.is_checked === ch" style="text-align: center;  align-self: center;">
                  <vs-icon icon="check" size="small"  ></vs-icon>
                </div>
                <div v-else >
                </div>
              </template>
              <div v-else-if="typeof ch === 'object'" class="w-full" style="display:grid; justify-content: center;">
                <div v-if="ch.type === 'text'" class=" p-1">
                  <ml-input class="w-full" v-model="ch.value"></ml-input>
                </div>
                <vs-checkbox
                  v-else
                  :disabled="isReadonly"
                  :checked="typeof ch === 'object' ? row.is_checked === ch.value : row.is_checked === ch"
                  @change="checkForm(row, typeof ch === 'object' ? ch.value : ch)"
                ></vs-checkbox>
              </div>
              <vs-checkbox
                v-else
                :disabled="isReadonly"
                :checked="typeof ch === 'object' ? row.is_checked === ch.value : row.is_checked === ch"
                @change="checkForm(row, typeof ch === 'object' ? ch.value : ch)"
              ></vs-checkbox>
            </div>
          </span>
          </div>
        </div>
        <div>
          <span v-if="isPrint" class="print-input"> {{ row.note }} </span>
          <ml-textarea v-else v-model="row.note" :rows="2"/>
        </div>
      </template>
    </div>

    <!-- footer -->
    <div class="ti-body p-0" :style="{gridTemplateColumns: _mainGridStyle}">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableInspectCustom',
  props:{
    isPrint: Boolean,
    isReadonly: Boolean,
    /** 상단에 표기되는 제목 ( title 에 값이 없을 경우 상단 제목은 표기되지 않는다. )*/
    title: String,
    /** 실제 데이터가 들어간 list
     * [{
     *   id: 8,
     *   title: '5. 안전보건관리책임자 등에 권한 및 예산 부여·평가',
     *   label: '안전보건 예산 > 안전보건 관련 예산(승인자)',
     *   is_checked: '',
     *   note: [],
     * }, ... ]
     *  */
    list: Array,
    /** 체크 항목에 대해서 설명 할 수 있는 제목 ( checkTitle 값이 없을 경우 체크리스트는 그룹화 되지 않는다. */
    checkTitle: String,
    /** 체크 항목 */
    checkList: Array,
    /** 테이블 메인 컬럼 사이즈: 그룹, 항목이름, 체크리스트, 비고 */
    mainGridStyle: {
      type: String,
      default: () => "90px 1fr 324px 320px"
    },
    /** 테이블 체크리스트 컬럼 사이즈 */
    checkGridStyle: String,
  },
  computed: {
    _mainGridStyle () {
      return this.mainGridStyle
    },
    _checkGridStyle () {
      if (!this.checkGridStyle && this.checkList.length > 0) {
        let gridStyle = '';
        for (const check of this.checkList) {
          gridStyle += ' 1fr'
        }
        return gridStyle;
      }
      return this.checkGridStyle
    },

    groupSpanList () {
      const groupList = []
      if (this.list && this.list.length > 0) {
        let checkIndex = 0;
        let checkTitle = ''
        for (let i=0; i < this.list.length ; i++) {
          const row = this.list[i]
          if (checkTitle === row.title) {
            groupList[checkIndex]++;
            groupList.push(0)
          } else {
            checkIndex = i;
            checkTitle = row.title
            groupList.push(1)
          }
        }
      }
      return groupList
    }
  },
  methods: {
    checkForm (row, value) {
      if (row.is_checked === value) {
        row.is_checked = ''
      } else {
        row.is_checked = value;
      }
    },
  }
}
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
$bg: #f9f9f9;

/* 테두리 */
.ti-header { border-top: $border;}
.ti-header,
.ti-body {
  display: grid;
  border-left: $border;
  & > div {
    border-right: $border;
    border-bottom: $border;
  }
}

/* 정렬 */
.ti-header,
.ti-body {
  & > div { display: flex; align-items: center; }
}
.text-center,
.ti-header > div { justify-content: center; text-align: center; }

/* 여백 */
.ti-header,
.ti-body {
  & > div {
    padding: 0.5rem;
  }

  & .row-header {
    height: 100%;
    text-align: center;
    font-weight: bold;
    background-color: #f0f0f0;
    justify-content: center;
    align-items: center;
    display: flex;
  }
}
</style>

<style>
/*체크박스 중앙 정렬을 위함.. scope style 내에서는 적용이 안되서 외부로 뺐음*/
.ti-body .vs-checkbox {
  margin-right: 0;
}
</style>

