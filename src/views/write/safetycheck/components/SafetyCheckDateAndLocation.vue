<template>
  <div>
    <vs-row class="my-4">
      <vs-col><h5><i class="dot"></i>점검일시 및 장소</h5></vs-col>
    </vs-row>
    <vs-row class="mb-8" style="border:1px solid #cdcdcd; ">
      <vs-col>
        <ul class="table table-4" style="border-bottom:none;">
          <li class="header header-bg grid-row">
            <span>구분</span>
            <span>일시</span>
            <span>장소</span>
            <span>점검자</span>
          </li>
          <li class="grid-row">
            <span class="header-bg">발주공사현장</span>
            <span>
              <span v-if="isPrint">{{form.orderConstructionSite.date}}</span>
              <ml-input v-else v-model="form.orderConstructionSite.date" class="w-full" placeholder="2020.06.14(월)"/>
            </span>
            <span>
              <span v-if="isPrint">{{form.orderConstructionSite.location}}</span>
              <ml-input v-else v-model="form.orderConstructionSite.location" class="w-full" placeholder="00센터 신축현장, 000화장실 보수현장"/>
            </span>
            <span>
              <span v-if="isPrint">{{form.orderConstructionSite.checker}}</span>
              <ml-input v-else v-model="form.orderConstructionSite.checker" class="w-full" placeholder="000 외 5명"/>
            </span>
          </li>
          <li class="grid-row">
            <span class="header-bg">(자체보유)장비점검</span>
            <span>
              <span v-if="isPrint">{{form.selfOwnedEquipmentInspection.date}}</span>
              <ml-input v-else v-model="form.selfOwnedEquipmentInspection.date" class="w-full" placeholder="2020.06.14(월)"/>
            </span>
            <span>
              <span v-if="isPrint">{{form.selfOwnedEquipmentInspection.location}}</span>
              <ml-input v-else v-model="form.selfOwnedEquipmentInspection.location" class="w-full" placeholder="영선작업장, 00분소 차고지"/>
            </span>
            <span>
              <span v-if="isPrint">{{form.selfOwnedEquipmentInspection.checker}}</span>
              <ml-input v-else v-model="form.selfOwnedEquipmentInspection.checker" class="w-full" placeholder="000 외 5명"/>
            </span>
          </li>
        </ul>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
export default {
  name: 'SafetyCheckDateAndLocation',
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
      //   orderConstructionSite: {date:'', location:'', checker:''},
      //   selfOwnedEquipmentInspection: {date:'', location:'', checker:''},
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
ul.table.table-4 > li {
  grid-template-columns: 192px 135px minmax(0, 1fr) 135px;
}
</style>
