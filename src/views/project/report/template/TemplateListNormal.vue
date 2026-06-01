<template>
  <div>

    <vx-card class="p-6 mb-4" v-if="enableTitleCard && title && title.length > 0" >
      <div class="w-full flex" slot="no-body">
        <h5 class="mr-auto flex items-center"><b>{{ title }}</b></h5>
      </div>
    </vx-card>


    <vx-card>
      <vs-table
        class="pb-wide"

        ref="table"
        stripe
        :data="list"
        :sst="true"
        :max-items="perPage"
        noDataText="데이터가 없습니다"
        color="success"
        @sort="handleSort"
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
            class="fix-perpage mb-4"
            @change="handleChangePerPage">
            <vs-select-item :key="index" :value="item.value" :text="item.text"
                            v-for="(item,index) in itemsPerPageOptions"/>
          </vs-select>
        </template>

        <template slot="thead">
          <vs-th sort-key="id" class="w-1/12" ><span class="w-full text-center">No.</span></vs-th>
          <vs-th sort-key="content$preview.title" class="w-2/12" ><span class="w-full text-center">현장명</span></vs-th>
          <vs-th class="w-2/12" ><span class="w-full text-center">작성자</span></vs-th>
          <vs-th sort-key="created_at" class="w-2/12" ><span class="w-full text-center">작성일</span></vs-th>
          <vs-th sort-key="status" class="w-1/12" ><span class="w-full text-center">결재상태</span></vs-th>
          <vs-th class="w-2/12" ><span class="w-full text-center">첨부문서</span></vs-th>
          <vs-th class="w-3/12" ><span class="w-full text-center">사업금액</span></vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

            <vs-td class="text-center">
              {{tr.post_id}}
            </vs-td>

            <vs-td class="">
              {{ tr.user.company.com_name }}
            </vs-td>

            <vs-td class="">
              {{ tr.user.name }}
            </vs-td>

            <vs-td class="text-center">
              {{ getContent(tr).created_at.substring(0,10) }}
            </vs-td>

            <vs-td class="text-center">
              {{ tr.document_status.name }}
            </vs-td>

            <vs-td class="text-center">
              <a download target="_blank" :href="img.path" v-for="(img, index) in getProjectAttachList(tr)" :key="index" @click.stop>
                <vs-icon icon-pack="feather" icon="icon-file" />
              </a>
            </vs-td>

            <vs-td class="">
              {{ getProjectWorkMoneyAmount(tr) }}
            </vs-td>

          </vs-tr>
        </template>
      </vs-table>

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
  name: 'TemplateListNormal',
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

    // 리스트에 노출될 post
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
          value: Number(per)
        }

        options.push(perPageItem)
      }
      return options
    }
  },
  data () {
    return {
      nav: {
        orderTarget:'created_at',
        orderDirection:'desc'
      },
      boardPerPage: 10,
      boardCurrentPage: 1
    }
  },

  created () {
    this.boardPerPage = this.perPage
    this.boardCurrentPage = this.currentPage

  },

  methods : {
    getProjectAttachList (data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        try {
          const attachList = JSON.parse(preview.attach)

          return attachList
        } catch (e) {
          return []
        }

      }

      return ''
    },
    getProjectTitle (data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        return preview.title
      }

      return ''
    },
    getProjectComment (data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        return preview.comment
      }

      return ''
    },
    getProjectWorkMoneyAmount (data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        return this.addComma(preview.work_money_amount)
      }

      return ''
    },

    getPreview (data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        return preview
      }
    },

    getContent (data) {
      if (data.post) {
        const content = data.post
        return content
      }
    },

    // perPage 드롭다운 선택값 변경시 호출
    handleChangePerPage (_data) {
      this.$emit('handleChangePerPage', _data)
    },

    // 리스트 선택시 호출
    handleItemClickDetail (_data) {
      this.$emit('handleItemClickDetail', _data)
    },

    handleSort (key, type) {
      if (key) {
        this.nav.orderTarget = key
        this.nav.orderDirection = type
        this.$emit('sort', {orderTarget:key, orderDirection:type})
      }
    },

    // 페이지 변경시 호출
    handleChangePage (_data) {
      this.$emit('handleChangePage', _data)
    },

    // 등록 버튼 클릭시 호출
    handleClickRegister () {
      this.$emit('handleClickRegister')
    },

    addComma (str) {
      if (str && str.length > 0) {
        return str.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ",")
      }
    },

    orderBy (type) {
      this.$emit('orderBy', type)
    }
  }

}
</script>

<style scoped>
.pb-wide{ margin-bottom:1.5rem !important;}

.fix-perpage { width:110px; }
.fix-no { width:100px; }
.fix-created_at { width:110px; }
.fix-actor { width:110px; }
.fix-management { width:214px; }

</style>
