<template>
  <div>
    <search-nav @handleSearch="onSubmitSearch">
      <search-nav-start-end v-model="nav.value.inputA_4"/>
    </search-nav>
    <vx-card class="mb-4">
      <h4 class="mb-4"><i class="dot"></i> 안전</h4>
      <div style="overflow: auto">
        <table class="mb-4" style="border-spacing: 0; border-top: 1px solid #cdcdcd; border-left: 1px solid #cdcdcd">
          <tr>
            <th v-for="head of heads" :key="head"
                class="p-4"
                style="white-space: nowrap; border-right: 1px solid #cdcdcd; border-bottom: 1px solid #cdcdcd"
            >{{ head }}</th>
          </tr>
          <tr v-for="(data, index) of data76List" :key="`list_${index}`">
            <td v-for="head of heads" :key="head"
                class="p-4"
                style="text-align: center; white-space: nowrap; border-right: 1px solid #cdcdcd; border-bottom: 1px solid #cdcdcd"
            >{{ data[head] ? data[head] : 0 }}</td>
          </tr>
        </table>
      </div>
    </vx-card>
    <vx-card class="mb-4">
      <h4 class="mb-4"><i class="dot"></i> 보건</h4>
      <div style="overflow: auto">
        <table class="mb-4" style="border-spacing: 0; border-top: 1px solid #cdcdcd; border-left: 1px solid #cdcdcd">
          <tr>
            <th v-for="head of heads" :key="head"
                class="p-4"
                style="white-space: nowrap; border-right: 1px solid #cdcdcd; border-bottom: 1px solid #cdcdcd"
            >{{ head }}</th>
          </tr>
          <tr v-for="(data, index) of data77List" :key="`list_${index}`">
            <td v-for="head of heads" :key="head"
                class="p-4"
                style="text-align: center; white-space: nowrap; border-right: 1px solid #cdcdcd; border-bottom: 1px solid #cdcdcd"
            >{{ data[head] ? data[head] : 0 }}</td>
          </tr>
        </table>
      </div>
    </vx-card>
  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavStartEnd from '@/components/nav/SearchNavStartEnd.vue'

export default {
  name: 'Exception02',
  components: {
    SearchNavStartEnd,
    SearchNav
  },
  computed: {
    projectId () {
      return this.$route.params.proj_id
    },
    heads () {
      return ['현장명', '합계', '감염', '감전', '교통사고', '깔림', '끼임', '낙하', '넘어짐', '뒤집힘', '떨어짐', '맞음', '무너짐', '근골격계질환', '베임', '붕괴', '빠짐', '(산소)결핍', '소음노출', '아차사고', '이상기압 노출, 접촉', '익사', '유해광선 노출', '절단', '중독', '질식', '질환', '찔림', '충돌', '탈락', '파열', '폭발', '화재', '화학물질 누출 접촉', '기타']
    }
  },
  data () {
    return {
      nav: {
        value:{
          inputA_4: {}
        }
      },
      data76List: [],
      data77List: []
    }
  },
  mounted () {
    this.loadList76()
    this.loadList77()
  },
  methods: {
    async loadList76 () {
      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        boardSlug: 'nonconformities-and-corrective-actions-safety',
        //nonconformities-and-corrective-actions-health
        projectId: this.projectId > 0 ? this.projectId : undefined,
        page: 1,
        perPage: 10000,
        dateTarget: ['content$body.inputA_4'],
        dateBegin: [this.nav.value.inputA_4.sDate],
        dateEnd: [this.nav.value.inputA_4.eDate],
      })
      const listAll = [...JSON.parse(JSON.stringify(this.$store.state.approval.list))]

      const row = { '합계': 0 }
      for (const data of listAll) {
        const key = this.getContent(data).inputE_2

        if (!row[key]) {
          row['현장명'] = data.post.project.field_name
        }
        if (!row[key]) { row[key] = 0 }
        row[key] += 1
        row['합계'] += 1
      }
      this.data76List.push(row)
    },
    async loadList77 () {
      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        boardSlug: 'nonconformities-and-corrective-actions-health',
        //nonconformities-and-corrective-actions-safety
        projectId: this.projectId > 0 ? this.projectId : undefined,
        page: 1,
        perPage: 10000,
        dateTarget: ['content$body.inputA_4'],
        dateBegin: [this.nav.value.inputA_4.sDate],
        dateEnd: [this.nav.value.inputA_4.eDate],
      })
      const listAll = [...JSON.parse(JSON.stringify(this.$store.state.approval.list))]

      const row = { '합계': 0 }
      for (const data of listAll) {
        const key = this.getContent(data).inputE_2

        if (!row[key]) {
          row['현장명'] = data.post.project.field_name
        }
        if (!row[key]) { row[key] = 0 }
        row[key] += 1
        row['합계'] += 1
      }
      this.data77List.push(row)
    },

    getContent (data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content)
        return content.body
      }
    },

    onSubmitSearch () {
      this.loadList76()
      this.loadList77()
    }
  }
}
</script>

<style scoped>

</style>
