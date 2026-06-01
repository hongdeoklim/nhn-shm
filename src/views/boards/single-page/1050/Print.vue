<template>
  <div>
    <table>
      <colgroup>
        <col width="180px" />
        <col width="115px" />
        <col width="115px" />
        <col />
        <col width="115px" />
        <col width="115px" />
        <col width="115px" />
        <col width="115px" />
      </colgroup>
      <tr>
        <th>업체명(원청, 협력)</th>
        <th rowspan="3">작성일자</th>
        <th rowspan="3">관리기간</th>
        <th rowspan="6">
          <div class="w-full" style="font-weight: 700;">
            <p class="text-center" style="font-size: 32px;">
              <span style="text-decoration: underline;">{{ `( ${header.month} 월)`}}
                <span style="color: #0029FF; text-decoration: underline;"> 위험성평가표</span>
              </span>
            </p>
            <div class="grid" style="grid-template-columns: 1fr 15px 1fr 15px 1fr 15px 1fr; font-size: 18px;">
              <span>[위험성평가</span>
              <span>→</span>
              <span>위험성평가회의</span>
              <span>→</span>
              <span>이행확인</span>
              <span>→</span>
              <span>교육·TBM 전파]</span>
            </div>
            <div class="grid" style="grid-template-columns: 1fr 15px 1fr 15px 1fr 15px 1fr; font-size: 10px; color: #6D6D6D">
              <span>(유해·위험요인 파악)</span>
              <span></span>
              <span>(위험성 결정, 감소대책 수립)</span>
              <span></span>
              <span>(감소대책 실행)    </span>
              <span></span>
              <span>(위험성평가의 공유)</span>
            </div>
          </div>
        </th>
        <th rowspan="2" colspan="4">
          <div style="padding: 10px;">➆ 위험성 결정, 감소대책 수립 및 실행계획 확인</div>
        </th>
      </tr>

      <tr>
        <td rowspan="2">{{ form.업체명 }}</td>
      </tr>

      <tr>
        <td rowspan="2">담당자<br/>(협력회사)</td>
        <td rowspan="2">검토자<br/>(관리감독자)</td>
        <td rowspan="2">검토자<br/>(안전관리자)</td>
        <td rowspan="2">승인자<br/>(관리책임자)</td>
      </tr>

      <tr>
        <th>현장명</th>
        <td rowspan="3">{{ form.stdInfo.date }}</td>
        <td rowspan="3">{{ form.관리기간시작 }} ~ {{ form.관리기간종료 }}</td>
      </tr>

      <tr>
        <td rowspan="2">{{ form.stdInfo.field_name }}</td>
        <td rowspan="2">
          <div class="w-full flex-1 p-1">
            <img v-if="form.managerList[0].sign" :src="form.managerList[0].sign" width="115px" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </td>
        <td rowspan="2">
          <div class="w-full flex-1 p-1">
            <img v-if="form.managerList[1].sign" :src="form.managerList[1].sign" width="115px" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </td>
        <td rowspan="2">
          <div class="w-full flex-1 p-1">
            <img v-if="form.managerList[2].sign" :src="form.managerList[2].sign" width="115px" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </td>
        <td rowspan="2">
          <div class="w-full flex-1 p-1">
            <img v-if="form.managerList[3].sign" :src="form.managerList[3].sign" width="115px" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </td>
      </tr>

      <tr></tr>
      <tr>
        <td style="background-color: #FFDEB2; border-bottom: none; font-weight: 500;">예정공정 현황</td>
        <td class="text-left" colspan="7" style="background-color: #FFEED8; padding: 15px; border-bottom: none;">
          지하2층, 지상 15층 주상복합 신축현장, 작성일 현재 공정률 약 40%이며, 5월 한 달간 지상 8층~10층 구조물 공사, 지하1층 ∼ 지상 3층 내외부 마감공사가 진행 예정임
        </td>
      </tr>
    </table>

    <!-- 위험성 평가 본문표 -->
    <table>
      <colgroup>
        <col width="90px" />
        <col width="90px" />
        <col />
        <col width="150px" />
        <col width="40px" />
        <col width="40px" />
        <col width="40px" />
        <col />
        <col width="200px" />
        <col width="90px" />
        <col width="90px" />
      </colgroup>

      <tr>
        <th rowspan="6" style="background-color: #FFEED8">①공종분류</th>
        <th rowspan="6" style="background-color: #FFEED8">②단위작업</th>
        <th rowspan="6" style="background-color: #FFFFCC">③위험요인</th>
        <th rowspan="6" style="background-color: #FFFFCC">재해형태</th>
        <th rowspan="2" colspan="3" style="background-color: #FFFFCC">④위험성 결정</th>
        <th rowspan="3" style="background-color: #CCFFCC">⑤위험방지대책</th>
        <th rowspan="6" style="background-color: #FFD8FF">⑥개선조치 담당자</th>
        <th rowspan="5" colspan="2" style="background-color: #DFDEF7">➉이행확인</th>
      </tr>

      <tr></tr>

      <tr>
        <th rowspan="2" colspan="3" style="background-color: #FFFFCC">위험도 등급</th>
      </tr>

      <tr>
        <th rowspan="3" style="background-color: #CCFFCC">
          상 등급 : 대책 우선 순위 : 공법변경→작업변경→안전시설물→개인보호구 순<br/>
          중 등급 : 대책 우선 순위 : 관리자 배치(신호수 등) → 위험저감 교육 등
        </th>
      </tr>

      <tr>
        <th rowspan="2" style="background-color: #FFFFCC">상</th>
        <th rowspan="2" style="background-color: #FFFFCC">중</th>
        <th rowspan="2" style="background-color: #FFFFCC">하</th>
      </tr>

      <tr>
        <th style="background-color: #DFDEF7">협력회사</th>
        <th style="background-color: #DFDEF7">안전관리자</th>
      </tr>

      <!-- 내용 -->
      <tr v-for="(item, index) in form.riskList" :key="index">
        <td>{{ item.input1 }}</td>
        <td>{{ item.input2 }}</td>
        <td class="text-left" style="padding: 6px;">{{ item.input3 }}</td>
        <td>{{ item.input4 && item.input4.length > 0 ? item.input4.join(', ') : '' }}</td>
        <td>
          <PrintRadio :value="item.input5 === '상'" class="justify-center" />
        </td>
        <td>
          <PrintRadio :value="item.input5 === '중'" class="justify-center" />
        </td>
        <td>
          <PrintRadio :value="item.input5 === '하'" class="justify-center" />
        </td>
        <td class="text-left" style="padding: 6px;">{{ item.input6 }}</td>
        <td>{{ `${item.input7} (${item.input8})`}}</td>
        <td style="background-color: #EEEDFA">
          <div class="w-full flex-1 p-1">
            <img v-if="item.input9" :src="item.input9" width="90px" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </td>
        <td style="background-color: #EEEDFA">
          <div class="w-full flex-1 p-1">
            <img v-if="item.input10" :src="item.input10" width="90px" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </td>
      </tr>

    </table>
  </div>
</template>

<script>
import PrintCheckbox from "@/components/print/PrintCheckbox.vue";
import PrintRadio from "@/components/print/PrintRadio.vue";
export default {
  name: "Print152",
  components: {PrintRadio, PrintCheckbox },
  props: {
    form: Object,
    board: Object,
    header: Object,
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
$border-color: #cdcdcd;
table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  th,
  td {
    border: 1px solid #757575;
    text-align: center;
    font-size: 15px;
    padding: 0;
  }

  th {
    background-color: #ececec;
    font-weight: 500;
    word-break: keep-all;
  }
}

.print-break {
  break-inside: avoid;
}
.print-break-page {
  page-break-before: always;
}
</style>
