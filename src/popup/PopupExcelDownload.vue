<template>
  <vs-popup ref="popupExcelDownload" id="popupExcelDownload" title="Excel 다운로드" :active.sync="showPopup">
    <vs-row class="text-center" style="border-bottom:1px solid #e0e0e0">

      <vs-col>
        <div class="ul-table">
          <ul class="header" :style="getStyleColumns">
            <li v-for="(key,index) in getKeys" :key="index">{{ key }}</li>
          </ul>

          <div class="body">
            <ul
              v-for="(item, index) in list" :key="index"
              class="row" :style="getStyleColumns">
              <li v-for="(key,kIndex) in getKeys" :key="kIndex"
                  style="text-align: center;"
              >{{ item[key] }}
              </li>
            </ul>
          </div>

        </div>
      </vs-col>

      <vs-col class="mt-4 flex" vs-align="center" vs-justify="flex-end"
              style="position:absolute; bottom:24px; right:24px;">
        <div style="display: flex; padding-right:8px; align-items: center;">
          <span class="mr-3">파일이름</span>
          <ml-input v-model="fileName"/>
        </div>
        <vs-button class="" color="secondary" @click="excelDownFunc">다운로드</vs-button>
      </vs-col>

    </vs-row>
  </vs-popup>
</template>


<script>
import XLSX from 'xlsx'

export default {
  name: 'PopupExcelDownload',
  props: {
    value: Boolean,
    list: Array,
    title: String
  },
  watch: {
    value (data) {
      this.showPopup = data
    },
    showPopup(value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }
      this.$emit('input', value)
    },
  },
  data () {
    return {
      showPopup: false,
      fileName: ''
    }
  },
  computed: {
    getKeys () {
      if (this.list && this.list.length > 0) {
        const _keys = Object.keys(this.list[0])
        const keys = []
        for (const key of _keys) {
          if (key !== 'postId' && key !== 'projId' && key !== 'raw' && key !== '첨부문서') {
            keys.push(key)
          }
        }

        return keys
      }
      return []
    },
    getStyleColumns () {
      const num = 40
      return `grid-template-columns: repeat(${num},1fr);`
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
    this.showPopup = this.value

    if (this.title) {
      this.fileName = `${new Date().format('yyyy-MM-dd')}_${this.title}`
    } else {
      this.fileName = new Date().format('yyyy-MM-dd')
    }
  },

  methods: {
    excelDownFunc () {
      // 엑셀 워크시트로 json 내보내기
      // 배열만 가능
      const dataWS = XLSX.utils.json_to_sheet(this.list)
      // 엑셀의 workbook을 만든다
      // workbook은 엑셀파일에 지정된 이름이다.
      const wb = XLSX.utils.book_new()
      // workbook에 워크시트 추가
      // 시트명은 'nameData'
      XLSX.utils.book_append_sheet(wb, dataWS, 'nameData')
      // 엑셀 파일을 내보낸다.
      XLSX.writeFile(wb, `${this.fileName}.xlsx`)
    },

    onMouseDown (event) {

    }
  }
}

</script>


<style>

#popupExcelDownload > .vs-popup {
  width: 860px !important;
}

#popupExcelDownload > .vs-popup > .vs-popup--content {
  width: 100%;
  padding: 0;
  margin: 0;
}

#popupExcelDownload > .vs-popup > .vs-popup--content > .vs-row {
  padding: 24px;

}

</style>

<style scoped>
#popupExcelDownload .vs-row {
  position: relative;
}

#popupExcelDownload .ul-table {
  margin-bottom: 60px;
  height: 400px;
  overflow: auto;
}

.ul-table > ul.header,
.ul-table > div.body > ul.row {
  display: grid;
}

.ul-table > ul.header > li {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #cdcdcd;
}

.ul-table > div.body > ul.row > li {
  padding: 4px 8px;
  border: 1px solid #cdcdcd;
}


.ul-table > ul.header > li,
.ul-table > div.body > ul.row > li {
  min-width: 100px;
}
</style>
