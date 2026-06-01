<template>
  <div>
    <div class="vx-card no-scroll-content p-5">
      <calendar-view
        ref="calendar"
        :items="items"
        :show-date="showDate"
        :time-format-options="{ hour: 'numeric', minute: '2-digit' }"
        :enable-drag-drop="true"
        :disable-past="false"
        :disable-future="false"
        :show-times="false"
        display-period-uom="month"
        :display-period-count="1"
        :starting-day-of-week="0"
        :class="themeClasses"
        :period-changed-callback="periodChanged"
        :current-period-label="useTodayIcons ? 'icons' : ''"
        :displayWeekNumbers="false"
        :enable-date-selection="true"
        :selection-start="selectionStart"
        :selection-end="selectionEnd"
        @date-selection-start="startSetSelection"
        @date-selection="setSelection"
        @date-selection-finish="finishSelection"
        @drop-on-date="onDrop"
        @click-date="onClickDay"
        @click-item="onClickItem"
      >
        <div slot="header" class="mb-4">

          <div class="vx-row no-gutter">

            <!-- Current Month -->
            <div class="vx-col w-full sm:my-0 my-3 flex justify-center order-last">
              <div class="flex items-center">
                <feather-icon
                  :icon="$vs.rtl ? 'ChevronRightIcon' : 'ChevronLeftIcon'"
                  @click="updateMonth(-1)"
                  svgClasses="w-5 h-5 m-1"
                  class="cursor-pointer bg-primary text-white rounded-full"/>

                <span class="mx-3 text-xl font-medium whitespace-no-wrap">{{ showDate | moment('YYYY MMMM') }}</span>

                <feather-icon
                  :icon="$vs.rtl ? 'ChevronLeftIcon' : 'ChevronRightIcon'"
                  @click="updateMonth(1)"
                  svgClasses="w-5 h-5 m-1"
                  class="cursor-pointer bg-primary text-white rounded-full"/>
              </div>
            </div>

          </div>
        </div>
      </calendar-view>
    </div>
  </div>
</template>

<script>
import {CalendarView, CalendarMathMixin} from 'vue-simple-calendar'
import Datepicker from 'vuejs-datepicker'

require('vue-simple-calendar/static/css/default.css')
require('vue-simple-calendar/static/css/holidays-us.css')

export default {
  name: 'SafetyEquipmentMonthly',
  components: {
    CalendarView,
    Datepicker
  },
  mixins: [CalendarMathMixin],
  data () {
    return {
      rootPath:'', // 프로젝트의 rootPath
      list:[],

      showDate: new Date(),
      id: 0,
      startDate: '',
      endDate: '',

      calendarView: 'month',

      useDefaultTheme: true,
      useHolidayTheme: false,
      useTodayIcons: false,
      selectionStart: null,
      selectionEnd: null,

      items: []
    }
  },
  computed: {

    themeClasses () {
      return {
        'theme-default': this.useDefaultTheme,
        'holiday-us-traditional': this.useHolidayTheme,
        'holiday-us-official': this.useHolidayTheme
      }
    },

    simpleCalendarEvents () {
      return this.$store.state.calendar.events
    },
    disabledDatesTo () {
      return {to: new Date(this.startDate)}
    },
    disabledDatesFrom () {
      return {from: new Date(this.endDate)}
    },
    calendarLabels () {
      // return this.$store.state.calendar.eventLabels
      return []
    },
    windowWidth () {
      return this.$store.state.windowWidth
    }
  },

  created () {
    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`
    this.loadPostList()
  },
  methods: {

    async loadPostList () {
      const projectId = ''
      const boardSlug = 'construction_equipment' // first_risk(id:6)
      const page = 1
      const perPage = 10000

      await this.$store.dispatch('approval/LOAD_POST_ALL', {projectId, boardSlug, page, perPage})

      this.list = this.$store.state.approval.list
      for (const item of this.list) {
        const count = await this.loadPostPlanCount(24, item.post_id)
        item.count = count
      }

      this.items = []
      for (const data of this.list) {
        this.items.push({
          id: data.post_id,
          projectId:(data.post) ? data.post.project_id : '',
          startDate: new Date(this.getPreview(data).check_date),
          endDate: new Date(this.getPreview(data).check_date),
          title: data.post.post_title,
          classes: (data.count > 0) ? 'success' : 'none'
        })
      }

    },


    async loadPostPlanCount (boardId, postId) {
      const projectId = ''
      const page = 1
      const perPage = 5
      let preview = []

      preview.push(['boardId', '=', boardId])
      preview.push(['postId', '=', postId])

      preview = JSON.stringify(preview)
      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId: 26, //construction_equipment_detail
        page,
        perPage,
        preview
      })

      const data = this.$store.state.board.postListInfo.data
      return data.length
    },


    getPreview (data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        return preview
      }
    },

    periodChanged () {
      // range, eventSource) {
      // Demo does nothing with this information, just including the method to demonstrate how
      // you can listen for changes to the displayed range and react to them (by loading items, etc.)
    },
    thisMonth (d, h, m) {
      const t = new Date()
      return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
    },
    onClickDay (d) {
      this.handleClickRegister(d)
    },
    onClickItem (e) {
      this.handleItemClickDetail(e)
    },
    onDrop (item, date) {
      const message = `You dropped ${item.id} on ${date.toLocaleDateString()}`
      // Determine the delta between the old start date and the date chosen,
      // and apply that delta to both the start and end date to move the item.
      const eLength = this.dayDiff(item.startDate, date)
      item.originalItem.startDate = this.addDays(item.startDate, eLength)
      item.originalItem.endDate = this.addDays(item.endDate, eLength)

      alert(message)
    },
    startSetSelection (dateRange) {
      this.selectionEnd = dateRange[1]
      this.selectionStart = dateRange[0]
      this.handleClickRegister(this.selectionStart)
    },
    setSelection (dateRange) {
      this.selectionEnd = dateRange[1]
      this.selectionStart = dateRange[0]
    },
    finishSelection (dateRange) {
      this.setSelection(dateRange)
      const message = `You selected: ${this.selectionStart.toLocaleDateString()} -${this.selectionEnd.toLocaleDateString()}`
    },
    updateMonth (val) {
      this.showDate = this.$refs.calendar.getIncrementedPeriod(val)
    },


    handleClickRegister (date) {
      this.$emit('handleSelectDay', date)
      this.$emit('handleClickRegister', 'plan')
    },

    handleItemClickDetail (data) {
      const routeData = this.$router.resolve(`/project/${data.originalItem.projectId}/safety/equipment/plan/${data.id}`)
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style>
.theme-default .cv-item.success {
  border-color: rgb(102, 112, 203);
  background-color: rgb(102, 112, 203);
  color: #fff;
}

.theme-default .cv-item.none {
  border-color: rgb(255, 159, 67);
  background-color: rgb(255, 159, 67);
  color: #fff;
}
.theme-default .cv-item.success {
  border-color: #6670CB;
  background-color: #6670CB;
  color: #fff;
}

.theme-default .cv-header-day {
  padding: 1rem;
}
</style>
