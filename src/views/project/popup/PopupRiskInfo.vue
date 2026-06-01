<template>
  <vs-popup id="popupRiskInfo" title="위험성평가 기준표" :active.sync="popupActiveSync">
    <div class="p-4">
      <div class="risk-info-header">
        <span style="grid-area: A; border-right: none; border-bottom: none; ">위험도 수준</span>
        <span style="grid-area: D; border-right: none; ">등급</span>
        <span style="grid-area: E; border-right: none; ">점수</span>
        <span style="grid-area: F; border-right: none; ">수준</span>
        <span style="grid-area: B; border-right: none; ">관리기준</span>
        <span style="grid-area: C;">비고</span>
      </div>
      <div>
        <div class="risk-info-body">
          <div>
            <div><span style="border-top: none; border-right: none; font-weight: bold; color: #E42728">A</span></div>
            <div><span style="border-top: none; border-right: none; font-weight: bold; color: #E42728">B</span></div>
          </div>
          <div>
            <div><span style="border-top: none; border-right: none; justify-content: right;">16~20 점</span></div>
            <div><span style="border-top: none; border-right: none; justify-content: right;">15 점</span></div>
          </div>
          <span style="border-top: none; border-right: none; font-weight: bold;">허용 불가</span>
          <span class="left" style="border-top: none;">위험요인에 대한 개선조치가 이행되지 않으면 관련 공정 및 활동을 즉시 중단</span>
          <div style="display: flex; justify-content: center; align-items: center; text-align: center; border-right: 1px solid #DEDEDE; border-bottom: 1px solid #DEDEDE;">
            <div>
              <label style="font-weight: bold; text-decoration: underline;">위험작업 불허</label><br>
              관련공정 및 활동 즉시 중지
            </div>
          </div>
        </div>

        <div class="risk-info-body">
          <span style="border-top: none; border-right: none; font-weight: bold; color: #E42728">C</span>
          <span style="border-top: none; border-right: none; justify-content: right;">9~12 점</span>
          <span style="border-top: none; border-right: none; font-weight: bold;">중대한 위험</span>
          <span class="left" style="border-top: none;">
            즉시 중지에 따르는 악영향이 우려되는 공정 및 활동에 한정하여 적용<br>
            긴급히 안전조치를 취한 후, 작업을 계속하되, 계획된 보수 기간 중에 근원적인 개선조치
          </span>
          <div style="display: flex; justify-content: center; align-items: center; text-align: center; border-right: 1px solid #DEDEDE; border-bottom: 1px solid #DEDEDE;">
            <div class="p-4">
              <label style="font-weight: bold; text-decoration: underline;">조건부 허용 위험</label><br>
              현재 위험이 없으면  작업을 계속하되, 위험감소 활동을 실시
            </div>
          </div>
        </div>

        <div class="risk-info-body">
          <span style="border-top: none; border-right: none; font-weight: bold; color: #E42728">D</span>
          <span style="border-top: none; border-right: none; justify-content: right;">8 점</span>
          <span style="border-top: none; border-right: none; font-weight: bold;">통제</span>
          <span class="left" style="border-top: none;">
            위험요인에 대한 안전표지판 부착 등<br>
            안전작업절차 및 안전기준 준수
          </span>
          <div style="display: flex; justify-content: center; align-items: center; text-align: center; border-right: 1px solid #DEDEDE; border-bottom: 1px solid #DEDEDE;">
            <div>
              <label style="font-weight: bold; text-decoration: underline;">위험작업 수용</label><br>
              관리적 대책 필요
            </div>
          </div>
        </div>

        <div class="risk-info-body">
          <div>
            <div><span style="border-top: none; border-right: none; height: 75px; font-weight: bold; color: #FF8510">E</span></div>
            <div><span style="border-top: none; border-right: none; font-weight: bold; color: #28C76F">F</span></div>
          </div>
          <div>
            <div><span style="border-top: none; border-right: none; height: 75px; justify-content: right;">4~6 점</span></div>
            <div><span style="border-top: none; border-right: none; justify-content: right;">1~3 점</span></div>
          </div>
          <div>
            <div><span style="border-top: none; border-right: none; height: 75px; font-weight: bold;">경미</span></div>
            <div><span style="border-top: none; border-right: none; font-weight: bold;">무시</span></div>
          </div>
          <div>
            <div>
              <span class="left" style="border-top: none;">
                안전기준(KOSHA Code) 숙지<br>
                표준안전작업 등에 관한 교육
              </span>
            </div>
            <div>
              <span class="left" style="border-top: none; ">현재 안전조치 유지관리</span>
            </div>
          </div>

          <div style="display: flex; justify-content: center; align-items: center; text-align: center; border-right: 1px solid #DEDEDE; border-bottom: 1px solid #DEDEDE;">
            <div>
              <label style="font-weight: bold; text-decoration: underline;" >허용 가능한 위험</label><br>
              현 상태로 계속 작업 가능
            </div>
          </div>
        </div>
      </div>
    </div>
  </vs-popup>
</template>

<script>
export default {
  name: 'PopupRiskInfo',
  props: {
    value: Boolean,
  },
  components: {
  },
  watch: {
    popupActiveSync(value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }
    },
  },
  computed: {
    popupActiveSync: {
      get () {
        return this.value
      },
      set () {
        this.handleCloseSelf()
      }
    }
  },
  methods: {
    handleCloseSelf () {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.risk-info-body {
  display: grid;
  grid-template-columns: 109px 109px 109px 572px 236px;
  span {
    padding: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #DEDEDE;

    &.left {
      justify-content: flex-start;
    }
  }
}
.risk-info-header {
  display: grid;
  grid-template-columns: 109px 109px 109px 572px 236px;
  grid-template-areas: "A A A B C" "D E F B C";
  grid-template-rows: 40px 40px;
  background-color: #F9F9F9;
  span {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    border: 1px solid #DEDEDE;
  }
}
</style>
<style>

#popupRiskInfo > .vs-popup {
  width: 1167px !important;
}

#popupRiskInfo > .vs-popup > .vs-popup--content {
  width: 100%;
  padding: 0;
  margin: 0;
}

#popupRiskInfo > .vs-popup > .vs-popup--content > .vs-row {
  padding: 24px;

}

</style>
