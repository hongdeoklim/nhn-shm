<template>
  <div>
    <vs-tabs>
      <vs-tab :label="getCalenderTitle" @click="onClickTab(0)">
        <div class="vx-card no-scroll-content p-5">
          <calendar-view
            ref="calendar"
            :items="items"
            itemTop="1.6em"
            itemContentHeight="2em"
            itemBorderHeight="3px"
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
            @click.native="clickCalendar"
          >
            <div slot="header" class="mb-4">
              <div class="vx-row no-gutter">
                <!-- Current Month -->
                <div class="vx-col w-full sm:my-0 my-3 flex justify-center order-last">
                  <div class="flex items-center">
                    <feather-icon :icon="$vs.rtl ? 'ChevronRightIcon' : 'ChevronLeftIcon'" @click="updateMonth(-1)" svgClasses="w-5 h-5 m-1" class="cursor-pointer bg-primary text-white rounded-full" />

                    <span class="mx-3 text-xl font-medium whitespace-no-wrap">{{ showDate | moment("YYYY MMMM") }}</span>

                    <feather-icon :icon="$vs.rtl ? 'ChevronLeftIcon' : 'ChevronRightIcon'" @click="updateMonth(1)" svgClasses="w-5 h-5 m-1" class="cursor-pointer bg-primary text-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </calendar-view>
        </div>
      </vs-tab>
      <vs-tab :label="getListTitle" @click="onClickTab(1)">
        <table-list-page :board-id="137" route-c="write|tab" route-u="write|update|tab" :download="false" :create="false" :approval="false" :move-project="!(projectId > 0)" :nav="nav" :heads="heads" :getCol="getCol">
          <template #search>
            <normal-search-nav137 :value="nav.value" @input="onChangeSearch" />
          </template>
        </table-list-page>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import { CalendarView, CalendarMathMixin } from "vue-simple-calendar";
import Datepicker from "vuejs-datepicker";
import VueCookie from "vue-cookie";
import NormalSearchNav137 from "@/views/boards/components/NormalSearchNav137";
import TableListPage from "@/views/list/TableListPage";
import moment from "moment";

require("vue-simple-calendar/static/css/default.css");
require("vue-simple-calendar/static/css/holidays-us.css");

export default {
  name: "List137",
  components: {
    TableListPage,
    NormalSearchNav137,
    CalendarView,
    Datepicker,
  },
  mixins: [CalendarMathMixin],
  data() {
    return {
      create: true,
      rootPath: "", // 프로젝트의 rootPath
      list: [],

      showDate: new Date(),
      id: 0,
      startDate: "",
      endDate: "",

      calendarView: "month",

      useDefaultTheme: true,
      useHolidayTheme: false,
      useTodayIcons: false,
      selectionStart: null,
      selectionEnd: null,

      items: [],
      nav: {
        projectId: 0,
        orderTarget: "created_at",
        orderDirection: "desc",
        date: { year: new Date().getFullYear(), month: "" },
        value: {},
        page: {},
        keyword: [],
      },
    };
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
    useCreate() {
      return this.projectId > 0 && this.create;
    },

    themeClasses() {
      return {
        "theme-default": this.useDefaultTheme,
        "holiday-us-traditional": this.useHolidayTheme,
        "holiday-us-official": this.useHolidayTheme,
      };
    },

    simpleCalendarEvents() {
      return this.$store.state.calendar.events;
    },
    disabledDatesTo() {
      return { to: new Date(this.startDate) };
    },
    disabledDatesFrom() {
      return { from: new Date(this.endDate) };
    },
    calendarLabels() {
      // return this.$store.state.calendar.eventLabels
      return [];
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
    heads() {
      return [{ name: "시설물명" }, { name: "점검대상" }, { name: "소속명" }, { name: "부서명" }, { name: "작성자" }, { name: "계획일" }];
    },
    getCalenderTitle() {
      if (this.projectId === 5) {
        return "시설물 안전점검 계획";
      } else {
        return "안전보건 점검 계획";
      }
    },
    getListTitle() {
      if (this.projectId === 5) {
        return "시설물 안전점검 계획 목록";
      } else {
        return "안전보건 점검 계획 목록";
      }
    },
  },

  created() {
    const paths = this.$route.path.split("/");
    this.rootPath = `/${paths[1]}/${paths[2]}`;
    this.initBreadcrumb();
    this.loadPostList();
  },
  methods: {
    clickCalendar(e) {
      if (e.target.tagName === "svg" || e.target.tagName === "polyline" || e.target.tagName === "SPAN") {
        this.loadPostList();
      }
    },
    initBreadcrumb() {
      if (this.projectId === 5) {
        this.$store.commit("menu/UPDATE_PAGE_LIST", [{ title: "Home" }, { title: "안전보건 점검 계획" }, { title: "시설물 안전점검 계획", active: true }]);
      }
    },
    onClickTab(/*index*/) {},
    getContent(data) {
      if (data.post_content) {
        try {
          const content = JSON.parse(data.post_content);
          if (content.body) {
            return content.body;
          }
          return content;
        } catch (e) {
          return {};
        }
      }
    },
    getDate(date) {
      return new Date(date).format("yyyy-MM-dd");
    },
    getHeader(data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content);
        return content.header;
      }
    },
    async loadPostList() {
      await this.loadBoardPostList();
    },

    async loadApprovalPostList() {
      const projectId = this.$route.params.proj_id;
      const boardSlug = "board-137";
      const page = 1;
      const perPage = 10000;

      await this.$store.dispatch("approval/LOAD_POST_ALL", { projectId, boardSlug, page, perPage });

      this.list = this.$store.state.approval.list;
      this.items = [];
      for (const data of this.list) {
        const content = this.getContent(data);
        if (content && content.group1 && content.group1.length > 0) {
          for (const group of content.group1) {
            this.items.push({
              id: data.post_id,
              startDate: new Date(content.stdInfo.계획일),
              endDate: new Date(content.stdInfo.계획일),
              title: group.target,
              classes: "success",
              raw: data,
            });
          }
        }
      }
    },

    async loadBoardPostList() {
      const projectId = this.$route.params.proj_id;
      const boardId = 137;
      const page = 1;
      const perPage = 10000;
      const dateTarget = "body.stdInfo.계획일";
      let dateBegin = moment().startOf("month").format("YYYY-MM-DD");
      let dateEnd = moment().endOf("month").format("YYYY-MM-DD");

      if (this.$refs.calendar) {
        dateBegin = moment(this.$refs.calendar.periodStart).subtract(1, 'month').startOf("month").format("YYYY-MM-DD");
        dateEnd = moment(this.$refs.calendar.periodStart).add(1, 'month').endOf("month").format("YYYY-MM-DD");
      }

      const conditions = []
      conditions.push({key: dateTarget, operator: '>=', value: dateBegin})
      conditions.push({key: dateTarget, operator: '<', value: dateEnd})

      await this.$store.dispatch("board/LOAD_POST_LIST", { projectId, boardId, page, perPage, conditions });
      const postListInfo = this.$store.state.board.postListInfo;
      this.list = postListInfo.data;

      this.items = [];
      for (const data of this.list) {
        const content = this.getContent(data);
        if (content && content.group1 && content.group1.length > 0) {
          let _index = 0;
          for (const group of content.group1) {
            this.items.push({
              id: data.post_id ? `${++_index}_${data.post_id}` : `${++_index}_${data.id}`,
              startDate: new Date(content.stdInfo.계획일),
              endDate: new Date(content.stdInfo.계획일),
              title: `${group.target} - ${content.stdInfo.section}`,
              classes: "success",
              raw: data,
            });
          }
        }
      }
    },

    getCol(index, value) {
      try {
        switch (index) {
        case 0:
          return this.getContent(value).stdInfo.field_name; // 시설물명
        case 1:
          return this.getContentTargetList(this.getContent(value).group1); // 점검대상
        case 2:
          return this.getContent(value).stdInfo.department; // 소속명
        case 3:
          return this.getContent(value).stdInfo.section; // 부서명
        case 4:
          return func.getContent(value).stdInfo.writer_name; // 작성자
        case 5:
          return this.getContent(value).stdInfo.계획일; // 계획일
        // case 6:
        //   return this.getDate(value.created_at); // 작성일
        }
      } catch (e) {
        /*ignore*/
      }
      return "";
    },
    getPreview(data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.preview);
        return preview;
      }
    },

    periodChanged() {
      // range, eventSource) {
      // Demo does nothing with this information, just including the method to demonstrate how
      // you can listen for changes to the displayed range and react to them (by loading items, etc.)
      //console.log(eventSource)
      //console.log(range)
    },
    thisMonth(d, h, m) {
      const t = new Date();
      return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0);
    },
    onClickDay(d) {
      this.handleClickRegister(d);
    },
    onClickItem(e) {
      this.handleItemClickDetail(e);
    },
    onDrop(item, date) {
      const message = `You dropped ${item.id} on ${date.toLocaleDateString()}`;
      // Determine the delta between the old start date and the date chosen,
      // and apply that delta to both the start and end date to move the item.
      const eLength = this.dayDiff(item.startDate, date);
      item.originalItem.startDate = this.addDays(item.startDate, eLength);
      item.originalItem.endDate = this.addDays(item.endDate, eLength);

      alert(message);
    },
    startSetSelection(dateRange) {
      this.selectionEnd = dateRange[1];
      this.selectionStart = dateRange[0];
      this.handleClickRegister(this.selectionStart);
    },
    setSelection(dateRange) {
      this.selectionEnd = dateRange[1];
      this.selectionStart = dateRange[0];
    },
    finishSelection(dateRange) {
      this.setSelection(dateRange);
      const message = `You selected: ${this.selectionStart.toLocaleDateString()} -${this.selectionEnd.toLocaleDateString()}`;
    },
    updateMonth(val) {
      this.showDate = this.$refs.calendar.getIncrementedPeriod(val);
    },

    handleClickRegister(date) {
      this.selectDay = date;
      if (this.selectDay) {
        const d = new Date(this.selectDay).format("yyyy-MM-dd");
        VueCookie.set("list137_selectday", d);
        this.$router.push({
          name: "write|tab",
          params: { boardId: 137 },
        });
      }
    },

    handleItemClickDetail(data) {
      const raw = data.originalItem.raw;
      const boardId = raw.board_id;
      const postId = raw.id;
      this.$router.push({
        name: "write|update|tab",
        params: { boardId, postId },
      });
    },

    onChangeSearch(value) {
      this.nav.value = value;
      this.initSearchKeyValue();
    },

    initSearchKeyValue() {
      const keyValue = this.getSearchKeyValue137();
      let keyword = this.getSearchKeyword137();

      if (keyword) {
        keyword = keyword.map((_keyword) => {
          return _keyword.replace("default_skw", `nav.page.p${this.$route.params.boardId}.searchKeyword`).replace("default_disaster", `nav.page.p${this.$route.params.boardId}.disasterType`);
        });
      }

      this.nav.page[`p${this.boardId}`] = keyValue;
      this.nav.keyword = keyword;
    },
    getSearchKeyValue137() {
      if (this.nav.value.created_at) {
        this.nav.dateTarget = "created_at";
        this.nav.dateBegin = "nav.value.created_at.sDate";
        this.nav.dateEnd = "nav.value.created_at.eDate";
      }
      return { searchType: this.nav.value.searchType, searchKeyword: this.nav.value.searchKeyword };
    },
    getSearchKeyword137() {
      const returnData = [];

      switch (this.nav.value.searchType) {
      case "시설물명":
        returnData.push("content$body.stdInfo.field_name*%[:default_skw]%");
        break;
      case "소속명":
        returnData.push("content$body.stdInfo.department*%[:default_skw]%");
        break;
      case "부서명":
        returnData.push("content$body.stdInfo.section*%[:default_skw]%");
        break;
      case "작성자":
        returnData.push("content$body.stdInfo.writer_name*%[:default_skw]%");
        break;
      }

      return returnData;
    },
    getContentTargetList(list) {
      let result = "";
      for (const data of list) {
        if (!result.includes(data.target)) {
          result += `${data.target},`;
        }
      }
      return result.substring(0, result.length - 1);
    },
  },
};
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
  border-color: #988ef5;
  background-color: #988ef5;
  color: #fff;
  font-weight: 300;
  border-radius: 3px;
  display: inline-flex; /* 세로 정렬하기 위해 display 속성 변경 */
  align-items: center;
  height: 2em; /* itemContentHeight 값과 동일하게 설정해야 한다*/
}

/* 날짜 박스 내에서, 이벤트 박스의 가로 길이를 정한다. -xxem 만큼 여백이 생긴다.
offset 클래스와 조합해서 양쪽 여백을 생성해야 한다 */
.theme-default .cv-item.span1 {
  width: calc((100% / 7) - 0.6em);
}
/*이벤트 박스의 왼쪽 바깥 여백은 calc 내의 + xxem 값으로 조정된다*/
.theme-default .cv-item.offset1 {
  left: calc((100% / 7) + 0.3em);
}
.theme-default .cv-item.offset2 {
  left: calc((200% / 7) + 0.3em);
}
.theme-default .cv-item.offset3 {
  left: calc((300% / 7) + 0.3em);
}
.theme-default .cv-item.offset4 {
  left: calc((400% / 7) + 0.3em);
}
.theme-default .cv-item.offset5 {
  left: calc((500% / 7) + 0.3em);
}
.theme-default .cv-item.offset6 {
  left: calc((600% / 7) + 0.3em);
}

.theme-default .cv-header-day {
  padding: 1rem;
}
</style>
