<template>
  <div>
    <table-list-page
      :board-id="62"
      :create="false"
      :download="false"
      :approval="false"
      :move-project="false"

      :nav="nav"
      :heads="[{name: '공종'}, {name: '발생원인'}, {name: '재해형태'}, {name: '방지대책'}, {name: '이미지'}]"
      :getCol="getCol"
    >
      <template #search>
        <search-nav-item-select label="재해형태" v-model="nav.inputB_8" :list="nav.disasterClassList" />
        <search-nav-item-select label="공종명" v-model="nav.inputB_2" :list="nav.list2" />
      </template>
    </table-list-page>
  </div>
</template>

<script>
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import TableListPage from '@/views/list/TableListPage'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
export default {
  name: 'Exception01',
  components: {
    SearchNavItemKeyword,
    TableListPage,
    SearchNavItemSelect
  },
  data() {
    return {
      nav: {
        inputB_2: '',
        inputB_8: '',
        disasterClassList: [
          { text: '전체선택', value: '' },
          { text: '감염', value: '감염' },
          { text: '교통사고', value: '교통사고' },
          { text: '깔림', value: '깔림' },
          { text: '끼임', value: '끼임' },
          { text: '낙하', value: '낙하' },
          { text: '넘어짐', value: '넘어짐' },
          { text: '뒤집힘', value: '뒤집힘' },
          { text: '떨어짐', value: '떨어짐' },
          { text: '맞음', value: '맞음' },
          { text: '무너짐', value: '무너짐' },
          { text: '근골격계질환', value: '근골격계질환' },
          { text: '베임', value: '베임' },
          { text: '붕괴', value: '붕괴' },
          { text: '빠짐', value: '빠짐' },
          { text: '(산소)결핍', value: '(산소)결핍' },
          { text: '소음노출', value: '소음노출' },
          { text: '아차사고', value: '아차사고' },
          { text: '이상기압 노출, 접촉', value: '이상기압 노출, 접촉' },
          { text: '익사', value: '익사' },
          { text: '유해광선 노출', value: '유해광선 노출' },
          { text: '절단', value: '절단' },
          { text: '중독', value: '중독' },
          { text: '질식', value: '질식' },
          { text: '질환', value: '질환' },
          { text: '찔림', value: '찔림' },
          { text: '충돌', value: '충돌' },
          { text: '탈락', value: '탈락' },
          { text: '파열', value: '파열' },
          { text: '폭발', value: '폭발' },
          { text: '화재', value: '화재' },
          { text: '화학물질 누출 접촉', value: '화학물질 누출 접촉' },
          { text: '기타', value: '기타' },
        ],
        list2: [
          { text: '전체선택', value: '' },
          { text: '잠수작업', value: '잠수작업' },
          { text: '인공어초 제작 및 시설 작업', value: '인공어초 제작 및 시설 작업' },
          { text: '자연석 시설 작업', value: '자연석 시설 작업' },
          { text: '갯벌작업', value: '갯벌작업' },
          { text: '선박작업(해상작업)', value: '선박작업(해상작업)' },
          { text: '분석작업', value: '분석작업' },
        ],
        textB_7: '',
        textB_10: '',
        keyword: [
          'content$body.inputB_8*%[:nav.inputB_8]%',
          'content$body.inputB_2*%[:nav.inputB_2]%',
        ]
      }
    }
  },
  methods: {
    onClickSearch () {

    },

    getCol (index, value) {
      try {
        switch (index) {
        case 0: return this.getContent(value).inputB_2
        case 1: return {
          type: 'pre',
          value: this.getContent(value).inputB_7
        }
        case 2: return this.getContent(value).inputB_8
        case 3: return {
          type: 'pre',
          value: this.getContent(value).inputB_10
        }
        case 4: return {
          type: 'image-center',
          url: this.getContent(value).img1.path,
        }
        }
      } catch (e) {}
      return ''
    },

    getContent (data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content)
        return content.body
      }
    },
  }
}
</script>

<style scoped>

</style>
