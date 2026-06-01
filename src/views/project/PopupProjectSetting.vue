<template>
  <vs-popup id="popupProjectSetting" title="설정" :active.sync="showPopup">
    <vs-row class="mb-4">
      <h5><i class="dot"></i>차수관리</h5>
    </vs-row>
    <vs-row>
      <vs-col class="w-1/2 pr-4 mb-4 flex" vs-align="center">
        <vs-col class="w-3/12">현장명</vs-col>
        <vs-col class="w-9/12"><ml-input class="w-full" v-model="projectTittle" :readonly="true"/></vs-col>
      </vs-col>
      <vs-col class="w-1/2 mb-4 flex" vs-align="center">
        <vs-col class="w-3/12 ">차수간격</vs-col>
        <vs-col class="w-9/12 flex">
          <ml-input class="w-4/12" v-model="orderNum"/>
          <vs-radio class="ml-4 mr-auto" v-model="unit" vs-value="monthly">월</vs-radio>
          <vs-radio v-model="unit" vs-value="weekly">주</vs-radio>
          <vs-radio class="ml-auto" v-model="unit" vs-value="daily">일</vs-radio>
        </vs-col>
      </vs-col>
      <vs-col class="w-1/2 pr-4 mb-4 flex" vs-align="center">
        <vs-col class="w-3/12">시작</vs-col>
        <vs-col class="w-9/12"><date-selector class="w-full popup-fixed" v-model="sdate"/></vs-col>
      </vs-col>
      <vs-col class="w-1/2 pr-4 mb-4 flex" vs-align="center">
        <vs-col class="w-3/12">시작차수</vs-col>
        <vs-col class="w-9/12"><ml-input class="w-full " v-model="orderFirstNum"/></vs-col>
      </vs-col>
      <vs-col class="w-1/2 pr-4 mb-4 flex" vs-align="center">
        <vs-col class="w-3/12">종료</vs-col>
        <vs-col class="w-9/12"><date-selector class="w-full popup-fixed" v-model="edate"/></vs-col>
      </vs-col>
      <vs-col class="w-1/2 pr-4 mb-4 flex" vs-align="center">
      </vs-col>
      <vs-col class="w-1/2 pr-4 mb-4 flex" vs-align="center">
        <p><vs-icon class="mr-1" icon-pack="feather" icon="icon-alert-circle"/>참조문서가 있는 차수는 삭제 할 수 없습니다.</p>
      </vs-col>
      <vs-col class="w-1/2 pr-4 mb-4 flex" vs-align="center" vs-justify="flex-end">
        <vs-button class="mr-4" @click="handleClickRegister">차수생성</vs-button>
        <vs-button @click="handleClickRemove">선택삭제</vs-button>
      </vs-col>
    </vs-row>
    <vs-row class="mb-4">
      <vs-col class="border" style="max-height:500px; overflow-y: auto">
        <ul class="table table-6">
          <li class="tbody">
            <span class="title"></span>
            <span class="title">현장명</span>
            <span class="title">차수</span>
            <span class="title">시작일</span>
            <span class="title">종료일</span>
            <span class="title">참조문서</span>
          </li>

          <li v-for="(order, index) of this.orderList" :key="index"
            :class="(index%2 === 1) ? 'fff' : ''"
          >
            <span ><vs-checkbox v-model="order.is_checked"/></span>
            <span>{{projectTittle}}</span>
            <span>{{order.order_number}}</span>
            <span>{{order.begin_ymd}}</span>
            <span>{{order.end_ymd}}</span>
            <span>{{order.posts_count}}</span>
          </li>

        </ul>
      </vs-col>
    </vs-row>
  </vs-popup>
</template>

<script>
import DateSelector from '@/components/selector/DateSelector'
export default {
  name: 'PopupProjectSetting',
  components: {DateSelector},
  props:{
    value:Boolean
  },
  watch: {
    value (data) {
      this.showPopup = data
    },
    showPopup (data) {
      this.$emit('input', data)
    }
  },
  data () {
    return {
      showPopup:false,
      projectTittle:'',
      sdate:'',
      edate:'',
      orderFirstNum:1,
      orderNum:'1',
      unit:'monthly',
      orderList:[]
    }
  },

  mounted () {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
      if (this.showPopup) {
        this.showPopup = false
        next(false); return
      }
      next(true)
    })
    this.$once('hook:destroyed', () => {
      backButtonRouteGuard()
    })
  },

  created () {

    localStorage.removeItem('/api/v1/project/order')

    this.loadOrder()
  },

  methods:{
    async loadOrder () {
      const project_id = this.$route.params.proj_id
      await this.$store.dispatch('project/LOAD_PROJECT', {project_id})
      this.projectTittle = this.$store.state.project.projectInfo.field_name

      const page = 1
      const perPage = 10000
      const projectId = this.$route.params.proj_id
      await this.$store.dispatch('project/LOAD_PROJECT_ORDER', {page, perPage, projectId})

      this.orderList = []
      for (const order of this.$store.state.project.orderList) {
        this.orderList.push({
          begin_ymd: order.begin_ymd,
          created_by: order.created_by,
          creator: order.creator,
          end_ymd: order.end_ymd,
          id: order.id,
          order_number: order.order_number,
          posts_count: order.posts_count,
          is_checked: false
        })
      }

      let maxNum = 1
      this.sdate = new Date().format('yyyy-MM-dd')
      this.edate = new Date().format('yyyy-MM-dd')
      for (const order of this.orderList) {
        if (maxNum <= order.order_number) {
          this.sdate = new Date(order.end_ymd).addDays(1).format('yyyy-MM-dd')
          this.edate = new Date(order.end_ymd).addDays(1).format('yyyy-MM-dd')
          maxNum = order.order_number + 1
        }
      }
      this.orderFirstNum = maxNum
    },

    async register () {

      // 등록정보
      const project_id = this.$route.params.proj_id
      const begin_ymd = this.sdate
      const end_ymd = this.edate
      const start_order_number = this.orderFirstNum
      const order_period_unit = this.unit
      const order_period_number = this.orderNum

      localStorage.removeItem('/api/v1/project/order')
      await this.$store.dispatch('project/CREATE_PROJECT_ORDER', {
        project_id,
        begin_ymd,
        end_ymd,
        start_order_number,
        order_period_unit,
        order_period_number
      }).then(value => {
      }).catch(reason => {
      })

      alert('차수생성을 완료하였습니다.')
      await this.loadOrder()
    },

    async deleteOrder () {
      let text = ''
      for (const i in this.orderList) {
        if (this.orderList[i].is_checked) {
          const orderId = this.orderList[i].id
          const order_number = this.orderList[i].order_number
          const posts_count = this.orderList[i].posts_count

          if (posts_count <= 0) {
            localStorage.removeItem('/api/v1/project/order')
            await this.$store.dispatch('project/REMOVE_PROJECT_ORDER', {orderId})
          } else {
            if (text.length > 0) {
              text += ', '
            }
            text += order_number
          }

        }
      }

      if (text.length > 0) {
        alert(`다음 차수는 참조문서가 존재합니다. \n ${text}`)
      }
      await this.loadOrder()

    },

    handleClickRegister () {
      this.register()
    },

    handleClickRemove () {
      if (confirm('참조문서가 있는 차수는 제외하고 삭제됩니다. \n삭제하시겠습니까?')) {
        this.deleteOrder()
      }
    }
  }
}
</script>

<style scoped>
.fff {
  background-color: #fff;
}
</style>
<style>
#popupProjectSetting.con-vs-popup .vs-popup {
  width:860px !important;
}
</style>
