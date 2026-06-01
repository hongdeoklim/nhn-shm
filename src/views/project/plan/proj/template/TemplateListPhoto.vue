<template>
  <div>
    <!--
      [Title Card] : 제목이 카드형태로 상단에 노출된다.
      props.title 에 데이터를 넣을 props.enableTitleCard 가 ture(default) 인 경우에 노출

      ex) title="공지사항"
    -->
    <vx-card class="p-6 mb-4" v-if="enableTitleCard && title && title.length > 0" >
      <div class="w-full flex" slot="no-body">
        <h5 class="mr-auto flex items-center"><b>{{ title }}</b></h5>
      </div>
    </vx-card>

    <vx-card>

      <vs-table
        class="gallery-table pb-wide"

        ref="table"
        :data="list"
        :sst="true"
        :max-items="perPage"
        color="success"
        noDataText="데이터가 없습니다"

        @selected="handleItemClickDetail">

        <template slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">

          <!--
            [Per Page] : 한 페이지에 보여지는 게시글 수를 설정하는 드롭다운
            드롭다운에 노출되는 아이템을 추가하려면, props.perPage 에 콤마(,)로 구분하여 넣으면 된다.

            ex) per-page="10,20,30"
          -->
          <vs-select
            v-if="enablePerPageDropDown"
            autocomplete
            v-model="boardPerPage"
            class="fix-perpage mb-2"
            @change="handleChangePerPage">
            <vs-select-item :key="index" :value="item.value" :text="item.text"
                            v-for="(item,index) in itemsPerPageOptions"/>
          </vs-select>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

            <div class="w-full text-center p-5">

              <div class="flex items-center justify-start div_crop th_thumb_image">
                <img class="div_img_crop" src="https://cdn.ownerclan.com/hNqVmZ7bcP8Rsr9vxa8xVyxf0nzEvNQHZsHlxWiKLjg/marketize/auto/as/v1.jpg" onerror="this.src='https://cdn.ownerclan.com/hNqVmZ7bcP8Rsr9vxa8xVyxf0nzEvNQHZsHlxWiKLjg/marketize/auto/as/v1.jpg '"/>
              </div>
              <div class="w-full text-left ">
                <h5>계약코드 : {{tr.contract_code}}</h5>
                <h5>현장명 : {{tr.post_title}}</h5>
                <h5>계약업체명 : {{tr.post_title}}</h5>
                <h5>대상기간 : {{tr.date_work_start.substring(0,10)}} ~ {{tr.date_complete.substring(0,10)}}</h5>
              </div>

            </div>
          </vs-tr>
        </template>
      </vs-table>

      <div class="w-full text-right">
        <vs-button class="w-2/12" color="secondary" @click="handleClickRegister">추가</vs-button>
      </div>

      <div class="vs-con-table">
        <div class="con-pagination-table vs-table--pagination">
          <k-pagination
            :total="(lastPage) ? lastPage : 1"
            v-model="boardCurrentPage" @change="handleChangePage"></k-pagination>
        </div>
      </div>

    </vx-card>
  </div>
</template>

<script>
import KPagination from '@/components/kPagination/kPagination'
export default {
  name: 'TemplateListPhoto',
  components: {KPagination },
  props: {
    // 제목
    title: String,

    // 페이지에 노출되는 게시글 수
    perPage: Number,

    // 페이지에 노출되는 게시글 수 드롭다운 메뉴 아이템 목록
    perPageOption: String,

    // perPage 드롭다운 아이템 앞 부분에 추가되는 문구
    perPagePrefix: { type: String, default: ''},

    // perPage 드롭다운 아이템 뒷 부분에 추가되는 문구
    perPageSuffix: { type: String, default: '개씩 보기'},

    // 현재 페이지 번호
    currentPage: Number,

    // 마지막 페이지 번호
    lastPage: Number,

    // board 리스트에 노출될 post
    list: Array,

    // 상단 제목 카드 노출 여부
    enableTitleCard: { type: Boolean, default: true },

    // 페이지 노출 개수 변경 드롭다운 노출 여부
    enablePerPageDropDown: { type: Boolean, default: true }
  },
  computed: {
    itemsPerPageOptions () {
      const options = []

      const perPageOption = this.perPageOption.split(',')
      for (const per of perPageOption) {
        const perPageItem = {
          text: `${this.perPagePrefix}${per}${this.perPageSuffix}`,
          value: per
        }

        options.push(perPageItem)
      }
      return options
    }
  },
  data () {
    return {
      boardPerPage: 10,
      boardCurrentPage: 1
    }
  },

  created () {
    this.boardPerPage = this.perPage
    this.boardCurrentPage = this.currentPage
  },

  methods : {

    // perPage 드롭다운 선택값 변경시 호출
    handleChangePerPage (_data) {
      this.$emit('handleChangePerPage', _data)
    },

    // 리스트 선택시 호출
    handleItemClickDetail (_data) {
      this.$emit('handleItemClickDetail', _data)
    },

    // 페이지 변경시 호출
    handleChangePage (_data) {
      this.$emit('handleChangePage', _data)
    },

    // 등록 버튼 클릭시 호출
    handleClickRegister () {
      this.$emit('handleClickRegister')
    },

    // 수정 버튼 클릭시 호출
    handleItemClickModify (event, _data) {
      this.$emit('handleItemClickModify', _data)
    },

    // 삭제 버튼 클릭시 호출
    handleItemClickDelete (event, _data) {
      this.$emit('handleItemClickDelete', _data)
    }
  }

}
</script>
<style>
/* table리스트 grid로 변경 */
.gallery-table thead { display: none; }
.gallery-table .vs-table{
  display: grid !important;
  grid-template-columns: repeat(4, 25%);
}
.gallery-table .vs-table h5 { margin-top:8px}


@media (max-width: 1660px) {
  .gallery-table .vs-table{
    grid-template-columns: repeat(2, 50%);
  }
}
</style>

<style scoped>
.pb-wide{ margin-bottom:1.5rem !important;}

.div_crop {
  overflow: hidden;
  margin: auto;
  position: relative;
}
.div_img_crop {
  position: absolute;
  left: -1000%;
  right: -1000%;
  top: -1000%;
  bottom: -1000%;
  margin: auto;
  min-height: 100%;
  min-width: 100%;
}

.th_thumb_image {
  width: 100%;
  height: 300px;
  border-radius: 10px;
}

.th_text_content {
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  height: 300px;
}

@media (max-width: 1024px) {
  .th_thumb_image {
    min-width: 250px;
    width: 250px;
    height: 250px;
  }

  .th_text_content {
    height: 250px;
  }
}

@media (max-width: 768px) {
  .th_thumb_image {
    min-width: 200px;
    width: 200px;
    height: 200px;
  }

  .th_text_content {
    height: 200px;
  }
}
</style>
