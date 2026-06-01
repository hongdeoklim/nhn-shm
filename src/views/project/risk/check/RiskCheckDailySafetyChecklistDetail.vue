<template>
  <vx-card>
    <vs-row class="mb-4">
      <vs-col class="flex" vs-justify="flex-end">
        <vs-button class="mr-2" color="secondary">인쇄</vs-button>
        <vs-button color="secondary" type="border" @click="handleBackMenu">목록</vs-button>
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col class="">
        <h5 class="mb-4"><i class="dot"></i>기본정보</h5>
      </vs-col>
    </vs-row>
    <vs-row class="mb-4 flex">
      <vs-col class="w-4/12 flex ml-4 mb-4" vs-align="center"><span class="w-2/12">현장명</span><ml-input class="w-10/12" v-model="form.project_title" :readonly="true"/></vs-col>
      <vs-col class="w-4/12 flex ml-4 mb-4" vs-align="center"><span class="w-2/12">차수</span><ml-input class="w-10/12" v-model="form.orderNumber" :readonly="true"/></vs-col>
      <vs-col class="w-4/12 flex ml-4 mb-4" vs-align="center"><span class="w-2/12">대상기간</span><ml-input class="w-10/12" v-model="form.date" :readonly="true"/></vs-col>
    </vs-row>
    <vs-row>
      <vs-col class="">
        <h5 class="mb-4"><i class="dot"></i>중점 점검항목 - A등급</h5>
      </vs-col>
    </vs-row>
    <vs-row class="mb-8">
      <vs-col class="border">
        <ul class="table table-8">
          <li>
            <p>No.</p>
            <p>소속</p>
            <p>대상공종</p>
            <p>위치/장소</p>
            <p>위험요인</p>
            <p>재해형태</p>
            <p>안전보건대책</p>
            <p>점검결과 조치사항</p>
          </li>
          <li class="tbody" v-for="(item, index) in form.list1" :key="index">
            <p class="p-2">{{index}}</p>
            <p class="p-2">파트너사 </p>
            <p class="p-2">대상공종 {{item.work_unit}}  </p>
            <p class="p-2">위치/장소 </p>
            <p class="p-2">{{item.risk_factor}}</p>
            <p class="p-2">{{item.disaster_type}}</p>
            <p class="p-2">{{item.safety_measures}}</p>
            <p class="p-2"></p>
          </li>
        </ul>
      </vs-col>
    </vs-row>
  </vx-card>
</template>

<script>
export default {
  name: 'RiskCheckDailySafetyChecklistDetail',
  data () {
    return {
      form:{
        project_title:'', //현장명
        orderNumber:'', //차수
        company:'', //파트너사
        date:'', //대상기간
        list1:[], //중점관리 위험요인
        list2:[] //일상 위험관리
      }
    }
  },
  created () {
    this.loadPostDetail()
  },

  methods:{
    async loadPostDetail () {

      // 내용불러오기
      const projectId = this.$route.params.proj_id
      const boardId = 12 //일일안전점검표
      const postId = this.$route.params.postId

      await this.$store.dispatch('board/LOAD_POST', {projectId, boardId, postId})
      const postInfo = this.$store.state.board.postInfo
      const post = JSON.parse(postInfo.post_content)

      this.form.project_title = postInfo.project.field_name
      this.form.orderNumber = postInfo.project_order.order_number
      this.form.company = post.company
      this.form.date = post.date
      this.form.list1 = post.list1
      this.form.list2 = post.list2
    },

    handleBackMenu () {
      this.$emit('handleBackMenu', 'checklist')
    }
  }
}
</script>

<style scoped>
.vs-row .border {
  border-left:none;
  border-right:none;
}
ul.table.table-title-2 > li { grid-template-columns: 1fr 2fr 2fr;}
ul.table > li > p { height:100%; display:flex; align-items: center; justify-content: center; padding:6px; font-weight: 500; }
ul.table > li.tbody > p { font-weight: normal; }
</style>
