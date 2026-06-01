<template>
  <div>
    <vs-row>
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> {{ title }}</h5>
      </vs-col>
    </vs-row>
    <div class="mt-4 grid-check-list head-color">
      <div class="head-color" style="display: flex; justify-content: center; align-items: center;">구분</div>
      <div class="sub">
        <div >점검항목</div>
        <div class="check">양호</div>
        <div class="check">불량</div>
        <div class="check">N/A</div>
      </div>
    </div>
    <div class="grid-check-list"
      v-for="(option, o) of options"
    >
      <div class="head-color" style="display: flex; justify-content: center; align-items: center;">{{option.group}}</div>
      <div >
        <div class="sub" v-for="(item, i) of option.items">
          <div class="p-4"><span class="w-full">{{ item }} | {{list[`${o}_${i}`]}} | {{`${o}_${i}` }}</span></div>
          <div class="check"><vs-checkbox :checked="list[`${o}_${i}`] === '양호'" @change="list[`${o}_${i}`] = '양호'"/></div>
          <div class="check"><vs-checkbox :checked="list[`${o}_${i}`] === '불량'" @change="list[`${o}_${i}`] = '불량'"/></div>
          <div class="check"><vs-checkbox :checked="list[`${o}_${i}`] === 'N/A'" @change="list[`${o}_${i}`] = 'N/A'"/></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MaotCheckList',
  props: {
    title: String,
    groupType: "col" | "row" | "none",
    value: Object,
  },
  watch: {
    value (value) {
      this.list = value
    },

    list (list) {
      this.$emit('input', list)
    }
  },
  data () {
    return {
      list: {},
      options: [
        {
          group: '현장정리정돈',
          items: [
            '1. 작업장 및 주변 정리정돈 상태는?',
            '2. 작업용 공도구 정리정돈 상태는?',
            '3. 야적장 및 창고 정리정돈 상태는?',
          ]
        },
        {
          group: '개인보호구',
          items: [
            '1. 근로자 개인보호구 착용상태는?',
            '2. 작업별 개인보호구는 적정한가?',
            '3. 불량,파손된 개인보호구는 없는가?',
          ]
        },
        {
          group: '작업용 공도구',
          items: [
            '1. 작업전 공도구점검은 실시여부는?',
            '1. 작업전 공도구점검은 실시여부는?',
            '3. 전선 피복 및 플러그 상태는?',
          ]
        },
        {
          group: '안전시설',
          items: [
            '1. 작업장내 추락위험구간은 없는가?',
            '2. 방호조치 미실시 개구부는 없는가?',
            '3. 근로자 이동통로는 확보되었는가?',
            '4. 낙하물 위험구간 방호조치는?',
          ]
        },
        {
          group: '장비',
          items: [
            '1. 장비작업계획은 수립하였는가?',
            '2. 작업전 장비점검은 실시하였는가?',
            '3. 장비작업구간 신호수 배치하였는가?',
          ]
        },
        {
          group: '근로자',
          items: [
            '1. 작업자가 작업내용을 숙지하였는가?',
            '2. 작업자의 건강상태는 양호한가?',
            '3. 불안전한 행동을 하지는 않는가?',
          ]
        },
        {
          group: '기계설비',
          items: [
            '1. 기계설비 청소 및 정비상태는?',
            '2. 안전장치는 제거하지 않았는가?',
            '3. 작동상태에는 이상이 없는가?',
          ]
        },
        {
          group: '차량운행',
          items: [
            '1. 현장내 규정속도 준수하고 있는가?',
            '2. 차량과 근로자 동선은 구분되었는가?',
          ]
        },
        {
          group: '기타',
          items: [
            '1. 현장내 환경 저해요소는 없는가?',
            '2. 기타 잠재위험요인은 없는가?',
          ]
        },

      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.grid-check-list {
  display: grid;
  grid-template-columns: 240px 1fr;

  .sub {
    display: grid;
    grid-template-columns: 1fr 60px 60px 60px;

    div {
      height: 50px;

      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.grid-check-list {
  border-top:1px solid #cdcdcd;
  border-left:1px solid #cdcdcd;
  border-right:1px solid #cdcdcd;

  &:last-child {
    border-bottom:1px solid #cdcdcd;
  }

  .sub {
    border-bottom:1px solid #cdcdcd;
    border-left:1px solid #cdcdcd;

    &:last-child {
      border-bottom: none;
    }

    div.check {
      border-left:1px solid #cdcdcd;
    }
  }
}

.head-color {
  background-color: #f9f9f9;
}
</style>
