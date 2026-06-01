<template>
  <vs-row>
    <!-- 그래프 1 -->
    <vs-col class="w-full pb-4">
      <monthly-chart-card :title="graph1.title" :year="graph1.year" :data1="graph1.data1" :data2="graph1.data2"
                          :sum1="graph1.sum1" :sum2="graph1.sum2"
                          title1="금년 금월" title2="전년 금월"
                          :show-sum="true"  :max-y="100" unit="%" @change="yearChangeForGraph1" />
    </vs-col>

    <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-4 mb-4">
      <!-- 그래프 2-->
      <vs-col>
        <monthly-comparison-card :title="graph2.title" :year="graph2.year" :month="graph2.month" :unit="graph2.unit" :heads="graph2.heads" :list="graph2.list" :getCol="getColForGraph2" @change="dateChangeForGraph2">
          <template v-if="projectId" slot="tools" :set="(lv = getLevel)">
            <vs-button v-for="(button, idx) in buttons" :key="idx" class="py-3 px-0 lg:px-8" type="border"
                       :color="button.dataType === graph2.dataType ? 'primary' : 'secondary'"
                       @click="dataTypeChangeForGraph2(button.dataType, button.label)">{{ button.label }}</vs-button>
          </template>
        </monthly-comparison-card>
      </vs-col>

      <!-- 그래프 3 -->
      <vs-col>
        <budget-execution-rate-card dateType="yyyy-mm" :title="graph3.title" :unit="graph3.unit" :year="graph3.year" :month="graph3.month" :list="graph3.list" @change="dateRangeChangeForGraph3">
          <template v-if="projectId" slot="tools" :set="(lv = getLevel)">
            <vs-button v-for="(button, idx) in buttons" :key="idx" class="py-3 px-0 lg:px-8" type="border"
                       :color="button.dataType === graph3.dataType ? 'primary' : 'secondary'"
                       @click="dataTypeChangeForGraph3(button.dataType, button.label)">{{ button.label }}</vs-button>
          </template>
        </budget-execution-rate-card>
      </vs-col>
    </div>
  </vs-row>
</template>

<script>
import MonthlyChartCard from "@/views/graph-detail/components/MonthlyChartCard";
import MonthlyComparisonCard from "@/views/graph-detail/components/MonthlyComparisonCard";
import DailyComparisonCard from "@/views/graph-detail/components/DailyComparisonCard";
import BudgetExecutionRateCard from "@/views/graph-detail/components/BudgetExecutionRateCard.vue";

export default {
  name: "GraphDetail15",
  components: {
    BudgetExecutionRateCard,
    DailyComparisonCard,
    MonthlyComparisonCard,
    MonthlyChartCard,
  },
  props: {
    comGroupList: Object,
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id) || 0;
    },
    graphId() {
      return Number(this.$route.params.graphId);
    },
    getLevel() {
      const projects = this.$store.state.member.memberInfo.projects;
      if (projects) {
        for (const proj of projects) {
          if (proj.id == this.projectId && proj.company.length > 0) {
            const path = proj.company[0].pivot.company_path;
            const lv = path.split("/").length - 1;
            return lv;
          }
        }
      }
    },
  },
  data() {
    return {
      buttons: [
        { label: '부서(업체)', dataType: 'company' },
        { label: '사업장', dataType: 'field' },
        // { label: '예산항목', dataType: 'detail' },
      ],
      boardIds: [250, 329],
      summaryKey: ["안전보건예산_항목명", "sum"],
      graphData1: {},
      graphData2: {},
      graphData3: {},

      graph1: {
        title: "전체 안전보건 예산 집행률 현황",
        year: new Date().getFullYear(),
        data1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 선택한 년도
        data2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 선택한 년도의 이전 년도
        sum1: "",
        sum2: "",
      },

      graph2: {
        title: "월별 안전보건 예산 집행률 현황",
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        unit: "%",
        heads: [{ name: "No." }, { name: "부서(업체)명" }, { name: "예산" }, { name: "당월 사용금액" }, { name: "집행률" }],
        list: [],
        dataType: this.$route.params.proj_id ? "company" : "project",
      },

      graph3: {
        title: "기간별 안전보건 예산 집행률 현황",
        unit: "",
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        list: [],
        dataType: this.$route.params.proj_id ? "company" : "project",
      },
    };
  },
  created() {},
  async mounted() {
    await this.$store.dispatch("member/LOAD_MEMBER_DETAIL");

    await this.loadGraph();

    this.updateGraph1().then();
    this.updateGraph2().then();
    this.updateGraph3().then();
  },
  methods: {
    getBoardIds() {
      return this.boardIds;
    },
    async loadGraph(targetYear) {
      const boardIds = this.getBoardIds();

      if (!targetYear) {
        targetYear = this.graph1.year;
      }
      const years = [targetYear - 1, targetYear];

      for (const year of years) {
        if (typeof this.graphData1[year] !== "undefined") {
          continue;
        }

        const values = {};
        for (const boardId of boardIds) {
          const response = await this.$store.dispatch("summary/LOAD_POST_EACH_FIELDS", {
            boardId,
            projectId: this.projectId === 0 ? 1 : this.projectId,
            year,
          });

          const value = JSON.parse(JSON.stringify(response));

          // 데이터들을 파싱한다
          const keys = Object.keys(value);
          for (const key of keys) {
            const items = value[key];

            if (items.length) {
              for (const item of items) {
                item.content = JSON.parse(item.post_content);
              }
            }

            Object.assign(values, { [key]: items });
          }
        }

        this.parseGraph1(year, values);
        this.parseGraph2(year, values);
      }
    },
    /**
     * 1번째 그래프에서는, 특정 년도에 대해서
     * 각 월별로 값을 추출한 길이 12의 배열이 사용된다
     * @param year
     * @param rawData
     */
    parseGraph1(year, rawData) {
      const data = [];

      for (let i = 0; i < 12; i++) {
        data.push({
          year, // for debug
          month: i + 1, // for debug
          budget: 0,
          budgetExe: 0,
          percent: 0,
        });
      }
      const fieldKeys = Object.keys(rawData);
      for (const fieldKey of fieldKeys) {
        const fieldDataGroups = rawData[fieldKey];

        // 데이터가 있는 경우에만 데이터를 추출한다
        if (fieldDataGroups.length > 0) {
          for (const fieldData of fieldDataGroups) {
            const header = fieldData.content.header;
            if (header.year && header.month) {
              const month = parseInt(header.month);
              data[month - 1].budget += this.parseNumber(fieldData.content.body.fieldInfo.amount_sumup);
              data[month - 1].budgetExe += this.parseNumber(fieldData.content.body.budgetTotal.total);
              data[month - 1].percent = this.percentage(data[header.month - 1].budgetExe, data[header.month - 1].budget);
            }
          }
        }
      }

      if (typeof this.graphData1[year] === "undefined") {
        this.graphData1[year] = data;
      }
    },
    /**
     * 두번째 그래프에서는, company, field, 예산 항목을 월별로 정리해야한다
     * @param year
     * @param rawData
     */
    parseGraph2(year, rawData) {
      const data = { projects: [], companies: [], fields: [], budgetItems: [] };
      const dataProjects = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
      const dataCompanies = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
      const dataFields = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
      const dataBudgetItems = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

      const fieldKeys = Object.keys(rawData);
      for (const fieldKey of fieldKeys) {
        const fieldDataGroups = rawData[fieldKey];

        // 데이터가 있는 경우에만 데이터를 추출한다
        // 데이터가 들어갈 수 있도록 빈 배열을 먼저 만든다
        if (fieldDataGroups.length > 0) {
          for (const fieldData of fieldDataGroups) {
            const header = fieldData.content.header;
            if (!header.year || !header.month) {
              continue;
            }
            const month = parseInt(header.month);
            const budget = this.parseNumber(fieldData.content.body.fieldInfo.amount_sumup);
            const budgetExe = this.parseNumber(fieldData.content.body.budgetTotal.now);
            const budgetExeCum = this.parseNumber(fieldData.content.body.budgetTotal.total);
            const budgetExeRate = this.parseNumber(fieldData.content.body.fieldInfo.percent);

            const projectName = fieldData.project.field_name;
            if (typeof dataProjects[month - 1][projectName] === "undefined") {
              dataProjects[month - 1][projectName] = {
                label: projectName,
                month,
                budget,
                budgetExe,
                budgetExeCum,
                budgetExeRate,
                percent: this.percentage(budgetExeCum, budget),
              };
            } else {
              dataProjects[month - 1][projectName].budget += budget;
              dataProjects[month - 1][projectName].budgetExe += budgetExe;
              dataProjects[month - 1][projectName].budgetExeCum += budgetExeCum;
              dataProjects[month - 1][projectName].budgetExeRate += budgetExeRate;
              dataProjects[month - 1][projectName].percent = this.percentage(dataProjects[month - 1][projectName].budgetExeCum, dataProjects[month - 1][projectName].budget);
            }

            const comName = fieldData.content.body.stdInfo.com_name;
            if (typeof dataCompanies[month - 1][comName] === "undefined") {
              dataCompanies[month - 1][comName] = {
                label: comName,
                month,
                budget,
                budgetExe,
                budgetExeCum,
                budgetExeRate,
                percent: this.percentage(budgetExeCum, budget),
              };
            } else {
              dataCompanies[month - 1][comName].budget += budget;
              dataCompanies[month - 1][comName].budgetExe += budgetExe;
              dataCompanies[month - 1][comName].budgetExeCum += budgetExeCum;
              dataCompanies[month - 1][comName].budgetExeRate += budgetExeRate;
              dataCompanies[month - 1][comName].percent = this.percentage(dataCompanies[month - 1][comName].budgetExeCum, dataCompanies[month - 1][comName].budget);
            }

            if (typeof dataFields[month - 1][fieldKey] === "undefined") {
              dataFields[month - 1][fieldKey] = {
                label: fieldKey,
                month,
                budget,
                budgetExe,
                budgetExeCum,
                budgetExeRate,
                percent: this.percentage(budgetExeCum, budget),
              };
            } else {
              dataFields[month - 1][fieldKey].budget += budget;
              dataFields[month - 1][fieldKey].budgetExe += budgetExe;
              dataFields[month - 1][fieldKey].budgetExeCum += budgetExeCum;
              dataFields[month - 1][fieldKey].budgetExeRate += budgetExeRate;
              dataFields[month - 1][fieldKey].percent = this.percentage(dataFields[month - 1][fieldKey].budgetExeCum, dataFields[month - 1][fieldKey].budget);
            }
            // if (fieldData.content.body.inputC) {
            //   fieldData.content.body.inputB.push(...fieldData.content.body.inputC);
            // }

            for (const budgetItem of fieldData.content.body.budget1) {
              const budgetItemName = budgetItem.label;
              const budget = this.parseNumber(budgetItem.prev); // 전월 누적
              const budgetExe = this.parseNumber(budgetItem.now); // 당월 사용
              const budgetExeCum = this.parseNumber(0);
              const budgetExeRate = this.parseNumber(0);

              if (typeof dataBudgetItems[month - 1][budgetItemName] === "undefined") {
                dataBudgetItems[month - 1][budgetItemName] = {
                  label: budgetItemName,
                  month,
                  budget,
                  budgetExe,
                  budgetExeCum,
                  budgetExeRate,
                  percent: this.percentage(budgetExeCum, budget),
                };
              } else {
                dataBudgetItems[month - 1][budgetItemName].budget += budget;
                dataBudgetItems[month - 1][budgetItemName].budgetExe += budgetExe;
                dataBudgetItems[month - 1][budgetItemName].budgetExeCum += budgetExeCum;
                dataBudgetItems[month - 1][budgetItemName].budgetExeRate += budgetExeRate;
                dataBudgetItems[month - 1][budgetItemName].percent = this.percentage(dataBudgetItems[month - 1][budgetItemName].budgetExeCum, dataBudgetItems[month - 1][budgetItemName].budget);
              }
            }
          }
        }


        data.projects = dataProjects;
        data.companies = dataCompanies;
        data.fields = dataFields;
        data.budgetItems = dataBudgetItems;
      }

      if (typeof this.graphData2[year] === "undefined") {
        this.graphData2[year] = data;
      }
    },
    async updateGraph1() {
      // 년도별 데이터는 캐싱된다
      await this.loadGraph(this.graph1.year);

      const nowYearData = this.graphData1[this.graph1.year];
      const lastYearData = this.graphData1[this.graph1.year - 1];

      const data1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const data2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      // 현재 몇 월인지 확인한다
      const currentMonth = new Date().getMonth() + 1;

      let sumBudget1 = 0;
      let sumBudgetExeCum1 = 0;
      console.log(nowYearData);
      for (const item of nowYearData) {
        data1[item.month - 1] = +item.percent;
        // 현재의 월에 대한 집행률을 계산하기 위해
        if (item.month === currentMonth) {
          sumBudget1 = item.budget;
          sumBudgetExeCum1 = item.budgetExe;
        }
      }
      let sumBudget2 = 0;
      let sumBudgetExeCum2 = 0;
      for (const item of lastYearData) {
        data2[item.month - 1] = +item.percent;
        sumBudget2 = item.budget;
        sumBudgetExeCum2 = item.budgetExe;
      }

      this.graph1.data1 = data1;
      this.graph1.data2 = data2;
      this.graph1.sum1 = `${this.percentage(sumBudgetExeCum1, sumBudget1)  }%`;
      this.graph1.sum2 = `${this.percentage(sumBudgetExeCum2, sumBudget2)  }%`;
    },

    async updateGraph2() {
      // 년도별 데이터는 캐싱된다
      await this.loadGraph(this.graph2.year);

      let index = 0;

      if (this.projectId === 0) {
        const dataProjects = this.graphData2[this.graph2.year].projects[this.graph2.month - 1];

        this.graph2.heads[1].name = "분야명";

        const resultList = [];
        if (dataProjects) {
          const projectKeys = Object.keys(dataProjects);

          for (const projectKey of projectKeys) {
            index += 1;
            const dataProject = dataProjects[projectKey];

            resultList.push({
              no: index,
              name: projectKey,
              budget: new Intl.NumberFormat().format(dataProject.budget),
              budgetExe: new Intl.NumberFormat().format(dataProject.budgetExe),
              budgetExeRate: `${dataProject.percent  }%`,
            });
          }
        }
        this.graph2.list.splice(0, this.graph2.list.length);
        for (const row of resultList) {
          this.graph2.list.push(row);
        }
      } else if (this.graph2.dataType === "company") {
        const dataCompanies = this.graphData2[this.graph2.year].companies[this.graph2.month - 1];
        // console.log(this.graph2.year, this.graph2.month, this.graphData2, dataCompanies);

        this.graph2.heads[1].name = "부서(업체)명";

        const resultList = [];
        if (dataCompanies) {
          const companyKeys = Object.keys(dataCompanies);

          for (const companyKey of companyKeys) {
            index += 1;
            const companyData = dataCompanies[companyKey];

            resultList.push({
              no: index,
              name: companyKey,
              budget: new Intl.NumberFormat().format(companyData.budget),
              budgetExe: new Intl.NumberFormat().format(companyData.budgetExe),
              budgetExeRate: `${companyData.percent  }%`,
              percent: companyData.percent * 1
            });
          }
        }
        // resultList 값을 budgetExeRate 값에 따라서 내림차순 정렬한다
        resultList.sort((a, b) => {
          if (a.percent > b.percent) {
            return -1;
          }
          if (a.percent < b.percent) {
            return 1;
          }
          return 0;
        });

        this.graph2.list.splice(0, this.graph2.list.length);
        for (const row of resultList) {
          this.graph2.list.push(row);
        }

      } else if (this.graph2.dataType === "field") {
        const dataFields = this.graphData2[this.graph2.year].fields[this.graph2.month - 1];
        // console.log(this.graph2.year, this.graph2.month, this.graphData2, dataCompanies);

        this.graph2.heads[1].name = "사업장";

        const resultList = [];
        if (dataFields) {
          const fieldKeys = Object.keys(dataFields);

          for (const fieldKey of fieldKeys) {
            index += 1;
            const fieldData = dataFields[fieldKey];

            resultList.push({
              no: index,
              name: fieldKey,
              budget: new Intl.NumberFormat().format(fieldData.budget),
              budgetExe: new Intl.NumberFormat().format(fieldData.budgetExe),
              budgetExeRate: `${fieldData.percent  }%`,
              percent: fieldData.percent * 1
            });
          }
        }
        resultList.sort((a, b) => {
          if (a.percent > b.percent) {
            return -1;
          }
          if (a.percent < b.percent) {
            return 1;
          }
          return 0;
        });

        this.graph2.list.splice(0, this.graph2.list.length);
        for (const row of resultList) {
          this.graph2.list.push(row);
        }
      } else if (this.graph2.dataType === "detail") {
        const dataBudgetItems = this.graphData2[this.graph2.year].budgetItems[this.graph2.month - 1];
        // console.log(this.graph2.year, this.graph2.month, this.graphData2, dataCompanies);

        this.graph2.heads[1].name = "예산항목";

        const resultList = [];
        if (dataBudgetItems) {
          const budgetItemKeys = Object.keys(dataBudgetItems);

          for (const budgetItemKey of budgetItemKeys) {
            index += 1;
            const fieldData = dataBudgetItems[budgetItemKey];

            resultList.push({
              no: index,
              name: budgetItemKey,
              budget: new Intl.NumberFormat().format(fieldData.budget),
              budgetExe: new Intl.NumberFormat().format(fieldData.budgetExe),
              budgetExeRate: `${fieldData.percent  }%`,
            });
          }
        }
        this.graph2.list.splice(0, this.graph2.list.length);
        for (const row of resultList) {
          this.graph2.list.push(row);
        }
      }
    },

    async updateGraph3() {
      // 년도별 데이터는 캐싱된다
      await this.loadGraph(this.graph3.year);

      let index = 0;

      if (this.projectId === 0) {
        const dataProjects = this.graphData2[this.graph3.year].projects[this.graph3.month - 1];

        const resultList = [];
        if (dataProjects) {
          const projectKeys = Object.keys(dataProjects);

          for (const projectKey of projectKeys) {
            index += 1;
            const dataProject = dataProjects[projectKey];

            resultList.push({
              no: index,
              name: projectKey,
              budget: new Intl.NumberFormat().format(dataProject.budget),
              budgetExe: new Intl.NumberFormat().format(dataProject.budgetExe),
              budgetExeRate: `${dataProject.percent  }%`,
            });
          }
        }
        this.graph3.list.splice(0, this.graph3.list.length);
        for (const row of resultList) {
          this.graph3.list.push(row);
        }
      }
      if (this.graph3.dataType === "company") {
        const dataCompanies = this.graphData2[this.graph3.year].companies[this.graph3.month - 1];
        // console.log(this.graph3.year, this.graph3.month, this.graphData2, dataCompanies);

        const resultList = [];
        if (dataCompanies) {
          const companyKeys = Object.keys(dataCompanies);

          for (const companyKey of companyKeys) {
            index += 1;
            const companyData = dataCompanies[companyKey];

            resultList.push({
              no: index,
              name: companyKey,
              budget: new Intl.NumberFormat().format(companyData.budget),
              budgetExe: new Intl.NumberFormat().format(companyData.budgetExe),
              budgetExeRate: `${companyData.percent  }%`,
              percent: companyData.percent * 1
            });
          }
        }
        resultList.sort((a, b) => {
          if (a.percent > b.percent) {
            return -1;
          }
          if (a.percent < b.percent) {
            return 1;
          }
          return 0;
        });
        this.graph3.list.splice(0, this.graph3.list.length);
        for (const row of resultList) {
          this.graph3.list.push(row);
        }
      } else if (this.graph3.dataType === "field") {
        const dataFields = this.graphData2[this.graph3.year].fields[this.graph3.month - 1];
        // console.log(this.graph3.year, this.graph3.month, this.graphData2, dataCompanies);

        const resultList = [];
        if (dataFields) {
          const fieldKeys = Object.keys(dataFields);

          for (const fieldKey of fieldKeys) {
            index += 1;
            const fieldData = dataFields[fieldKey];

            resultList.push({
              no: index,
              name: fieldKey,
              budget: new Intl.NumberFormat().format(fieldData.budget),
              budgetExe: new Intl.NumberFormat().format(fieldData.budgetExe),
              budgetExeRate: `${fieldData.percent  }%`,
              percent: fieldData.percent * 1
            });
          }
        }
        resultList.sort((a, b) => {
          if (a.percent > b.percent) {
            return -1;
          }
          if (a.percent < b.percent) {
            return 1;
          }
          return 0;
        });
        this.graph3.list.splice(0, this.graph3.list.length);
        for (const row of resultList) {
          this.graph3.list.push(row);
        }
      } else if (this.graph3.dataType === "detail") {
        const dataBudgetItems = this.graphData2[this.graph3.year].budgetItems[this.graph3.month - 1];
        // console.log(this.graph3.year, this.graph3.month, this.graphData2, dataCompanies);

        const resultList = [];
        if (dataBudgetItems) {
          const budgetItemKeys = Object.keys(dataBudgetItems);

          for (const budgetItemKey of budgetItemKeys) {
            index += 1;
            const fieldData = dataBudgetItems[budgetItemKey];

            resultList.push({
              no: index,
              name: budgetItemKey,
              budget: new Intl.NumberFormat().format(fieldData.budget),
              budgetExe: new Intl.NumberFormat().format(fieldData.budgetExe),
              budgetExeRate: `${fieldData.percent  }%`,
            });
          }
        }
        this.graph3.list.splice(0, this.graph3.list.length);
        for (const row of resultList) {
          this.graph3.list.push(row);
        }
      }
    },

    yearChangeForGraph1(year) {
      this.graph1.year = year;
      this.updateGraph1();
    },

    getColForGraph2(index, value) {
      if (index === 0) return value.no;
      if (index === 1) return value.name;
      if (index === 2) return value.budget;
      if (index === 3) return value.budgetExe;
      if (index === 4) return value.budgetExeRate;
      if (index === 5) {
        let updown = "default";
        if (value.gap > 0) updown = "up";
        else if (value.gap < 0) updown = "down";
        return { type: updown, value: value.gap };
      }
      return "";
    },
    dateChangeForGraph2(year, month) {
      this.graph2.year = year;
      this.graph2.month = month;
      this.updateGraph2();
    },
    dataTypeChangeForGraph2(dataType, label) {
      this.graph2.heads[1].name = label;
      if (this.projectId) {
        this.graph2.dataType = dataType;
        this.updateGraph2();
      }
    },

    dateRangeChangeForGraph3(year, month) {
      this.graph3.year = year;
      this.graph3.month = month;
      this.updateGraph3();
    },
    dataTypeChangeForGraph3(dataType) {
      if (this.projectId) {
        this.graph3.dataType = dataType;
      }
      this.updateGraph3();
    },
    parseNumber(str) {
      if (typeof str === "number") {
        return str;
      } else if (typeof str === 'undefined') {
        return 0;
      }
      // 쉼표를 제거합니다.
      str = str.replace(/,/g, "");
      // 문자열을 정수로 파싱합니다.
      return parseInt(str);
    },
    percentage(a, b) {
      // A를 B로 나눈 결과를 구합니다.
      const result = b !== 0 ? (a / b) * 100 : 0;
      // 소수점 2자리까지 반올림합니다.
      const roundedResult = Math.round(result * 100) / 100;
      // 문자열로 변환합니다.
      const resultString = roundedResult.toString();
      // 소수점이 없는 경우 '.00'을 덧붙입니다.
      if (!resultString.includes(".")) {
        return `${resultString  }.00`;
      }
      // 소수점이 하나만 있는 경우 '0'을 덧붙입니다.
      if (resultString.split(".")[1].length === 1) {
        return `${resultString  }0`;
      }
      // 소수점이 둘 이상인 경우 그대로 반환합니다.
      return resultString;
    },
  },
};
</script>

<style scoped></style>
