<template>
  <h-bar-chart-card
    title="안전보건 예산 집행률 현황"
    :value="data"
    :total="total"
    unit="%"
    :isMoveWrite="isMoveWrite"
    @detail="onClickDetail"
    @write="onClickWrite"
  ></h-bar-chart-card>
</template>

<script>
import DonutChartCard from '@/components/DonutChartCard'
import HBarChartCard from "@/components/HBarChartCard.vue";

/**
 * 안전보건 예산 집행률 현황s
 */
export default {
  name: 'HeathSafetyBudgetExecutionRateChart',
  components: {HBarChartCard, DonutChartCard},
  props: {
    dataType: 'detail' | 'field' | 'address' | 'field_cat1' | 'company' | 'project',
  },
  computed: {
    projectId () {
      return parseInt(this.$route.params.proj_id) || 0
    },
    isMoveWrite () {
      // if (Number(`${this.projectId}`) === 1) return false
      // else return true
      return true
    }
  },
  watch: {
    dataType (/*value*/) {
      this.loadGraph()
    }
  },
  data () {
    return {
      graphId: 15,
      boardIds: [250, 329], //250, 329
      data: [{label: '데이터 없음', value: 0}],
      total: '0',
    }
  },
  async mounted () {
    await this.loadGraph()
  },
  methods: {
    async loadGraph () {
      const data = [];
      let budgetSum = 0;
      let budgetExeSum = 0;

      const boardIds = this.boardIds;

      for (const boardId of boardIds) {
        const response = await this.$store.dispatch('summary/LOAD_POST_EACH_FIELDS', {
          boardId,
          projectId: this.projectId === 0 ? 1 : this.projectId,
          // year: new Date().getFullYear()
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
        }

        for (const key of keys) {
          const items = value[key];

          // 데이터가 있는 경우에만 데이터를 추출한다
          if (items.length > 0) {
            // 0번째에서 최근 정보를 추출하기 위해 아이템을 날짜 내림차순 정렬한다
            const sortedItem = items.sort(function (a, b) {
              const x = new Date(a.content.header.full).getTime();
              const y = new Date(b.content.header.full).getTime();

              if (x < y) return 1;
              if (x > y) return -1;
              return 0;
            });

            const latestItem = sortedItem[0];
            const budget = this.parseNumber(latestItem.content.body.fieldInfo.amount_sumup);
            const budgetExe = this.parseNumber(latestItem.content.body.budgetTotal.total);
            budgetSum += budget;
            budgetExeSum += budgetExe;

            // percent 값을 소수점 2자리까지 계산한다
            const percent = this.percentage(budgetExe, budget);

            data.push({
              label: key,
              value: percent,
              budget,
              budgetExe,
              projectId: latestItem.project_id,
              projectName: latestItem.project.field_name
            });
          }
        }
      }

      // 전체 집행률을 계산해야 한다
      this.total = this.percentage(budgetExeSum, budgetSum);

      // 메인 대시보드일 경우, 분야별로 데이터를 모아야 한다
      const projectData = {};
      if (this.projectId <= 1) {
        for (const row of data) {
          if (typeof projectData[row.projectName] === 'undefined') {
            projectData[row.projectName] = {
              budget: 0,
              budgetExe: 0,
              percent: 0,
            };
          }

          projectData[row.projectName].budget += row.budget;
          projectData[row.projectName].budgetExe += row.budgetExe;
          projectData[row.projectName].percent = this.percentage(projectData[row.projectName].budgetExe, projectData[row.projectName].budget);
        }

        data.length = 0;
        const keys = Object.keys(projectData);
        for (const key of keys) {
          data.push({
            label: key,
            value: projectData[key].percent,
          })
        }
      }


      const sortedData = data.sort(function (a, b) {
        return b.value - a.value;
      })
      if (sortedData.length > 5) {
        sortedData.length = 5;
      }

      this.data = sortedData;
    },
    onClickDetail () {
      const projectId = this.$route.params.proj_id
      const graphId = this.graphId
      if (projectId) {
        this.$router.push(`/project/${projectId}/graph-detail/${graphId}`)
      } else {
        this.$router.push(`/graph-detail/${graphId}`)
      }
    },
    onClickWrite () {
      const proj_id = this.$route.params.proj_id
      const boardId = `${this.boardId}`
      this.$router.push({name: 'write|tab', params: {proj_id, boardId}})
    },
    parseNumber(str) {
      if (typeof str === 'number') {
        str = `${str}`;
      } else if (typeof str === 'undefined') {
        return 0;
      } else if (!str) {
        return 0;
      }
      // 쉼표를 제거합니다.
      str = str.replace(/,/g, '');
      // 문자열을 정수로 파싱합니다.
      return parseInt(str);
    },
    percentage(a, b) {
      if (b === 0) {
        return '0.00';
      }
      // A를 B로 나눈 결과를 구합니다.
      const result = (a / b) * 100;
      // 소수점 2자리까지 반올림합니다.
      const roundedResult = Math.round(result * 100) / 100;
      // 문자열로 변환합니다.
      const resultString = roundedResult.toString();
      // 소수점이 없는 경우 '.00'을 덧붙입니다.
      if (!resultString.includes('.')) {
        return `${resultString  }.00`;
      }
      // 소수점이 하나만 있는 경우 '0'을 덧붙입니다.
      if (resultString.split('.')[1].length === 1) {
        return `${resultString  }0`;
      }

      // 소수점이 둘 이상인 경우 그대로 반환합니다.
      return resultString;
    }
  },
}
</script>

<style scoped>

</style>
