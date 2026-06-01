<template>
  <div class="table-list">
    <search-nav v-if="showNav" @handleSearch="onClickSearch">
      <slot name="search" />
    </search-nav>

    <!-- stripe
        :sst="true"-->
    <vx-card :class="cardClass">
      <div class="w-full flex mb-4">
        <vs-select autocomplete  v-model="perPage">
              <vs-select-item text="10개씩 보기" value="10"/>
              <vs-select-item text="20개씩 보기" value="20"/>
              <vs-select-item text="50개씩 보기" value="50"/>
        </vs-select>
        <div class="action-button">
          <vs-button
            v-if="print"
            class="mr-4"
            color="secondary"
            type="border"
            @click="onClickDownload"
            >{{ createBtnPrint }}
          </vs-button>
          <vs-button
            v-if="download"
            class="mr-4"
            color="secondary"
            @click="onClickDownload"
            >{{ $t("button.Excel 다운로드") }}
          </vs-button>

          <vs-button
            v-if="create"
            class=""
            color="secondary"
            @click="onClickNew"
            >{{ createBtnLabel }}
          </vs-button>
        </div>
      </div>
      <vs-table
        class="pb-wide"
        color="success"
        ref="table"
        :sst="true"
        :data="realList"
        @sort="onClickSort"
        @selected="onClickDetail"
      >
        <template slot="thead">
          <vs-th
            sort-key="No"
            style="width: 60px; min-width: 60px; text-align: center;"
            ><span class="w-full text-center">No.</span></vs-th
          >
          <vs-th
            v-for="head in heads"
            :key="`table_header_${head.name}`"
            class="page-head"
            :class="head.class"
            :style="head.style"
            style="text-align: center;"
            :sort-key="head.name"
          >
            <span class="w-full">{{ head.name }}</span>
          </vs-th>
        </template>

        <template slot-scope="{ data }">
          <vs-tr
            :data="tr"
            v-for="(tr, ri) in data"
            :key="ri"
            :style="fontSize ? { fontSize } : {}"
          >
            <vs-td class="text-center">
              {{ getNo(ri) }}
            </vs-td>

            <vs-td
              v-for="(head, ci) in heads"
              :key="`table_list_${ri}_${head.name}`"
              class="text-center"
            >
              <div v-if="typeof tr[head.name] === 'object'">
                <div v-if="tr[head.name] && tr[head.name].type === 'file'">
                  <a
                    download
                    target="_blank"
                    :href="img.path"
                    v-for="(img, index) in tr[head.name].files"
                    :key="index"
                    @click.stop
                  >
                    <vs-icon icon-pack="feather" icon="icon-file" />
                  </a>
                </div>
                <div
                  v-else-if="tr[head.name] && tr[head.name].type === 'image'"
                >
                  <a
                    download
                    target="_blank"
                    :href="tr[head.name].url"
                    @click.stop
                  >
                    <vs-image
                      style="width: 120px; height: 120px;"
                      :src="tr[head.name].url"
                    />
                  </a>
                </div>
                <div
                  v-else-if="
                    tr[head.name] && tr[head.name].type === 'image-center'
                  "
                >
                  <a
                    download
                    target="_blank"
                    :href="tr[head.name].url"
                    style="display: flex; align-items: center; justify-content: center;"
                    @click.stop
                  >
                    <vs-image
                      style="width: 120px; height: 120px;"
                      :src="tr[head.name].url"
                    />
                  </a>
                </div>
                <div v-else-if="tr[head.name] && tr[head.name].type === 'pre'">
                  <div style="white-space: pre-line; text-align: left;">
                    {{ tr[head.name].value }}
                  </div>
                </div>
                <div
                  v-else-if="
                    tr[head.name] && tr[head.name].type === 'pre-center'
                  "
                >
                  <div style="white-space: pre-line; text-align: center;">
                    {{ tr[head.name].value }}
                  </div>
                </div>
                <div
                  v-else-if="tr[head.name] && tr[head.name].type === 'member'"
                >
                  <div class="w-full" style="text-align: center;">
                    {{ getMemberName(tr[head.name].memberId) }}
                  </div>
                </div>
                <div v-else-if="tr[head.name]">
                  <span :class="tr[head.name].type">{{
                    tr[head.name].value
                  }}</span>
                  <span
                    v-if="
                      tr[head.name].type === 'up' ||
                        tr[head.name].type === 'down'
                    "
                    style="display: inline-flex; padding-top:2px; width:20px; height:20px; max-height:20px;"
                  >
                    <vs-image
                      class="w-full"
                      :src="
                        require(`@/assets/images/icon/Icon-arrow_${
                          tr[head.name].type
                        }.png`)
                      "
                    />
                  </span>
                </div>
              </div>
              <div v-else>
                {{ tr[head.name] }}
              </div>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>

      <div class="vs-con-table">
        <div class="con-pagination-table vs-table--pagination">
          <k-pagination
            :total="
              listAll.length > 0
                ? Math.floor((listAll.length - 1) / perPage) + 1
                : 1
            "
            :max-items="5"
            v-model="page"
            @change="onChangePage"
          ></k-pagination>
        </div>
      </div>
    </vx-card>

    <popup-excel-download
      v-if="download"
      v-model="popup.excel"
      :list="excelList"
      :title="title"
    />
  </div>
</template>

<script>
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import SearchNav from '@/components/nav/SearchNav'
import KPagination from '@/components/kPagination/kPagination'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'

export default {
  name: 'TableList',
  components: {
    KPagination,
    SearchNav,
    PopupExcelDownload,
    SearchNavItemSelect
  },
  props: {
    list: {
      required: false,
      type: Array
    },
    useList: Boolean,
    bodyStyle: {
      type: String,
      default: 'card'
    },
    showNav: {
      type: Boolean,
      default: true
    },
    download: {
      type: Boolean | String,
      default: true
    },
    print: {
      type: Boolean,
      default: true
    },
    create: {
      type: Boolean,
      default: true
    },
    createBtnPrint: {
      type: String,
      default: '인쇄'
    },
    createBtnLabel: {
      type: String,
      default: '신규작성'
    },
    moveProject: {
      type: Boolean,
      default: false
    },
    moveDetail: {
      type: Boolean,
      default: true
    },
    moveNew: {
      type: Boolean,
      default: true
    },
    boardId: Number | String,
    routeC: String,
    routeU: String,

    fontSize: String,
    nav: Object,
    heads: Array,
    getCol: Function,
    perPage: {
      type: Number,
      default: () => {
        return 10
      }
    }
  },
  data () {
    return {
      popup: {
        excel: false
      },
      page: 1,
      total: 0,
      sortKey: '',
      asc: null,
      listAll: []
    }
  },
  watch: {
    list () {
      this.listAll = this.list
    }
  },
  computed: {
    cardClass () {
      if (this.bodyStyle === 'none') {
        return 'none-card'
      }
      return ''
    },
    title () {
      if (typeof this.download === 'string') {
        return this.download
      }
      return 'unknown'
    },
    excelList () {
      const list = []

      return list
    },

    realList () {
      const list = JSON.parse(JSON.stringify(this.excelList))
      return list
    }
  },
  mounted () {
    if (!this.useList) {
      this.loadList()
    }
  },
  methods: {
    getNo (index) {
      return this.total - ((this.page - 1) * this.perPage + index)
    },

    getMemberName (memberId) {
      const list = this.$store.state.member.listAll
      for (const member of list) {
        if (Number(`${member.id}`) === Number(`${memberId}`)) {
          return member.name
        }
      }

      return ''
    },

    async loadList () {
      const projectId = this.$route.params.proj_id
    },

    onClickSearch () {
      this.loadList()
    },
    onClickSort (sortKey, asc) {
      this.sortKey = sortKey
      this.asc = asc
    },
    onChangePage (page) {
      this.page = page
    },
    onClickDownload () {
      this.popup.excel = true
    },
    onClickNew () {
      if (this.moveNew) {

        this.$router.push({
          name: this.routeC
        })
      } else {
        this.$emit('new')
      }
    },
    onClickClose () {
      const keys = Object.keys(this.popup)
      keys.map(key => {
        this.popup[key] = false
      })
    },
    onClickDetail (value, target) {
    }
  }
}
</script>

<style lang="scss" scoped>
.table-list {
  .action-button {
    margin-left: auto;
  }
}
</style>
<style lang="scss">
.none-card {
  box-shadow: none;
  border-radius: 0px;
  display: inline-block;

  .vx-card__body {
    padding: 0px !important;
  }
}

span.up {
  color: #28c76f;
}
span.down {
  color: #ea5455;
}
.vs-table--tbody-table tr:nth-child(2n) {
  background-color: #f9f9f9;
}
</style>
