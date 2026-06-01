<template>
  <div>
    <vs-row class="my-4">
      <vs-col><h5><i class="dot"></i>점검내용 및 조치결과</h5></vs-col>
    </vs-row>
    <vs-row class="mb-8" style="border:1px solid #cdcdcd; ">
      <vs-col>
        <ul class="table table-3" style="border-bottom:none;">
          <li class="header header-bg grid-row">
            <span>구분</span>
            <span>점검내용</span>
            <span>조치결과</span>
          </li>
          <li class="grid-row">
            <span class="header-bg">발주공사현장</span>
            <span>
              <span v-if="isPrint">{{form.orderConstructionSite.detail}}</span>
              <ml-textarea v-else v-model="form.orderConstructionSite.detail" class="w-full m-0" rows="5"
                        placeholder="00센터 신축현장: 안전난간 설치여부, 안전대 사용여부 등
000화장실 보수현장: 보호구 착용여부, 정리정돈 상태 등"/>
            </span>
            <span>
              <span v-if="isPrint">{{form.orderConstructionSite.result}}</span>
              <ml-textarea v-else v-model="form.orderConstructionSite.result" class="w-full m-0" rows="5"
                        placeholder="00센터 신축현장: 안전대 사용 준수 및 작업자 안전모 착용 실시
000화장실 보수현장: 작업장 내 정리정돈 실시"/>
            </span>
          </li>
          <li class="grid-row">
            <span class="header-bg">(자체보유)장비점검</span>
            <span>
              <span v-if="isPrint">{{form.selfOwnedEquipmentInspection.detail}}</span>
              <ml-textarea v-else v-model="form.selfOwnedEquipmentInspection.detail" class="w-full m-0" rows="5"
                        placeholder="다목적산불진화차량: 펌프작동상태, 작동법 교육
청소차량:구조부 상태 점검, 운전원 자격 및 면허 확인"/>
            </span>
            <span>
              <span v-if="isPrint">{{form.selfOwnedEquipmentInspection.result}}</span>
              <ml-textarea v-else v-model="form.selfOwnedEquipmentInspection.result" class="w-full m-0" rows="5"
                        placeholder="다목적산불진화차량:펌프 정비 계획 수립
작동시 유의사항 교육
청소차량:구조부 상태 양호, 운전원 면허 확인"/>
            </span>
          </li>
        </ul>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
export default {
  name: 'SafetyCheckDetailAndResults',
  props: {
    board: Object,
    isPrint: Boolean,
    readonly:Boolean,
    value:Object
  },
  watch: {
    value (value) {
      this.form = value
    }
  },
  created () {
  },
  data () {
    return {
      // form: {
      //   orderConstructionSite: {detail:'', result:''},
      //   selfOwnedEquipmentInspection: {detail:'', result:''},
      // }
      form: this.value
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.header-bg {
  background-color: #F9F9F9
}
.grid-row {
  span {
    border-right: 1px solid #CDCDCD;

    &:last-child { border-right:none; }
  }
}
[dir] ul.table > li:last-child{
  border-bottom: none !important;
}
ul.table.table-3 > li {
  grid-template-columns: 192px minmax(0, 1fr) minmax(0, 1fr);
}
</style>
<style>
  textarea::placeholder {
    color:#CDCDCD
  }
</style>
