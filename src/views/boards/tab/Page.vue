<template>
  <vx-card v-if="useCard" style="width:calc(100% - 40px)">
    <component :is="component"/>
  </vx-card>
  <div v-else>
    <component :is="component"/>
  </div>
</template>

<script>
import breadcrumb from '@/views/boards/tab/breadcrumb'
export default {
  name: 'Page',
  components:{
    'singlePage101': () => import('@/views/boards/single-page/101/Write'),
    'singlePage104': () => import('@/views/boards/single-page/104/Write'),
    'singlePage130': () => import('@/views/boards/single-page/130/Write'),
    'singlePage140': () => import('@/views/boards/single-page/140/Write'),
    'singlePage150': () => import('@/views/boards/single-page/150/Write'),
    'singlePage153': () => import('@/views/boards/single-page/153/Write'),
    'singlePage163': () => import('@/views/boards/single-page/163/Write'),
    'singlePage219': () => import('@/views/boards/single-page/219/Write'),
    'singlePage235': () => import('@/views/boards/single-page/235/Write'),
    'singlePage237': () => import('@/views/boards/single-page/237/Write'),
    'singlePage246': () => import('@/views/boards/single-page/246/Write'),
    'singlePage250': () => import('@/views/boards/single-page/250/Write'),
    'singlePage259': () => import('@/views/boards/single-page/259/Write'),
    'singlePage261': () => import('@/views/boards/single-page/261/Write'),
    'singlePage282': () => import('@/views/boards/single-page/282/Write'),
    'singlePage284': () => import('@/views/boards/single-page/284/Write'),
    'singlePage285': () => import('@/views/boards/single-page/285/Write'),
    'singlePage300': () => import('@/views/boards/single-page/300/Write'),
    'singlePage307': () => import('@/views/boards/single-page/307/Write'),
    'singlePage308': () => import('@/views/boards/single-page/308/Write'),
    'singlePage309': () => import('@/views/boards/single-page/309/Write'),
    'singlePage310': () => import('@/views/boards/single-page/310/Write'),
    'singlePage326': () => import('@/views/boards/single-page/326/Write'),
    'singlePage327': () => import('@/views/boards/single-page/327/Write'),
    'singlePage328': () => import('@/views/boards/single-page/328/Write'),
    'singlePage329': () => import('@/views/boards/single-page/329/Write'),
    'singlePage330': () => import('@/views/boards/single-page/330/Write'),
    'singlePage331': () => import('@/views/boards/single-page/331/Write'),
    'singlePage332': () => import('@/views/boards/single-page/332/Write'),
    'singlePage333': () => import('@/views/boards/single-page/333/Write'),
    'singlePage334': () => import('@/views/boards/single-page/334/Write'),
    'singlePage335': () => import('@/views/boards/single-page/335/Write'),
    'singlePage336': () => import('@/views/boards/single-page/336/Write'),
    'singlePage391': () => import('@/views/boards/single-page/391/Write'),
    'singlePage491': () => import('@/views/boards/single-page/491/Write'),
    'singlePage492': () => import('@/views/boards/single-page/492/Write'),
    'singlePage509': () => import('@/views/boards/single-page/509/Write'),
    'singlePage510': () => import('@/views/boards/single-page/510/Write'),
    'singlePage522': () => import('@/views/boards/single-page/522/Write'),
    'singlePage523': () => import('@/views/boards/single-page/523/Write'),
    'singlePage524': () => import('@/views/boards/single-page/524/Write'),
    'singlePage525': () => import('@/views/boards/single-page/525/Write'),
    'singlePage526': () => import('@/views/boards/single-page/526/Write'),
    'singlePage527': () => import('@/views/boards/single-page/527/Write'),
    'singlePage528': () => import('@/views/boards/single-page/528/Write'),
    'singlePage529': () => import('@/views/boards/single-page/529/Write'),
    'singlePage530': () => import('@/views/boards/single-page/530/Write'),
    'singlePage688': () => import('@/views/boards/single-page/688/Write'),
    'singlePage846': () => import('@/views/boards/single-page/846/Write'),
    'singlePage847': () => import('@/views/boards/single-page/847/Write'),
  },
  computed: {
    boardId () {
      return parseInt(this.$route.params.boardId)
    },
    component () {
      return `singlePage${this.boardId}`
    },
    useCard () {
      if (this.boardId === 132) {
        return false
      }
      return true
    }
  },
  data () {
    return {
      breadcrumb,
    }
  },
  beforeMount () {
    this.initBreadcrumb()
  },
  methods: {
    initBreadcrumb () {
      const breadcrumb = [{title: 'Home'}]
      let key = `${this.boardId}`;

      // 브래드크럼의 이름이 프로젝트 번호와 연결되어 있으면, 해당 정보를 가져온다
      if (this.breadcrumb[`${this.projectId}.${this.boardId}`]) {
        key = `${this.projectId}.${this.boardId}`;
      }
      breadcrumb.push(...this.breadcrumb[key])

      // if (Number(`${this.projectId}`) === 1) {
      //   if (this.boardId === 119) {
      //     breadcrumb = [{title: 'Home'}, {title: '현장 총괄 등록'}, {title: '안전보건총괄책임자 선임'}]
      //   } else if (this.boardId === 120) {
      //     breadcrumb = [{title: 'Home'}, {title: '현장 총괄 등록'}, {title: '안전보건책임자 선임'}]
      //   } else if (this.boardId === 121) {
      //     breadcrumb = [{title: 'Home'}, {title: '현장 총괄 등록'}, {title: '안전보건조정자 선임'}]
      //   } else if (this.boardId === 122) {
      //     breadcrumb = [{title: 'Home'}, {title: '현장 총괄 등록'}, {title: '안전보건관리자 및 산업보건의 선임'}]
      //   } else if (this.boardId === 123) {
      //     breadcrumb = [{title: 'Home'}, {title: '현장 총괄 등록'}, {title: '안전보건관리자 및 산업보건의(건설업) 선임'}]
      //   } else if (this.boardId === 124) {
      //     breadcrumb = [{title: 'Home'}, {title: '현장 총괄 등록'}, {title: '안전보건담당자 선임'}]
      //   } else if (this.boardId === 125) {
      //     breadcrumb = [{title: 'Home'}, {title: '현장 총괄 등록'}, {title: '관리감독자 선임'}]
      //   }
      // }

      if (breadcrumb.length > 0) breadcrumb[breadcrumb.length - 1].active = true
      this.$store.commit('menu/UPDATE_PAGE_LIST', breadcrumb)
    },
  }
}
</script>

<style scoped>

</style>
