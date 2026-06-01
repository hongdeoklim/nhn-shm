<template>
  <div>
    <vs-row class="mb-6">
      <vs-col class="w-9/12 flex " vs-justify="flex-end">
        <vs-button v-if="board.savable" class="mr-4" color="secondary" type="border" @click="handleDeletePost">삭제</vs-button>
        <vs-button class="mr-4" color="secondary" type="border" @click="handlePrint">인쇄</vs-button>
        <vs-button class="mr-4" color="secondary" type="border" @click="handleClickClose">닫기</vs-button>
        <vs-button v-if="board.savable" class="" color="secondary" @click="handleClickUpdate">임시저장</vs-button>
        <vs-button v-if="board.collection" class="" color="secondary" @click="handleClickCollection">결재 문서 회수</vs-button>
        <vs-button v-if="board.resend" class="" color="secondary" @click="handleClickRegister">임시저장 후 재상신</vs-button>
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col class="w-9/12">

        <vx-card :title="'안전·보건예산 현황 '+form.project_date_year+'년 '+form.project_date_month+'월'">
          <!-- 기본정보 -->
          <vs-row>

            <vs-col class="w-4/12 mb-4">
              <vs-col class="w-4/12 h-full flex" vs-align="center">현장명</vs-col>
              <vs-col class="w-8/12">
                <ml-input class="w-full" :value="form.project_title" :readonly="true"/>
              </vs-col>
            </vs-col>

            <vs-col class="w-4/12 mb-4 pl-8">
              <vs-col class="w-4/12 h-full flex" vs-align="center">사업금액</vs-col>
              <vs-col class="w-8/12">
                <comma-input class="w-full" :value="form.work_money_amount | comma" :readonly="true"></comma-input>
              </vs-col>
            </vs-col>

            <vs-col class="w-4/12 mb-4 pl-8">
              <vs-col class="w-4/12 h-full flex" vs-align="center">대상기간</vs-col>
              <vs-col class="w-8/12">
                <ml-input class="w-full" :value="form.work_period" :readonly="true"/>
              </vs-col>
            </vs-col>

            <vs-col class="w-4/12 mb-4">
              <vs-col class="w-4/12 h-full flex" vs-align="center">안전보건부서장</vs-col>
              <vs-col class="w-8/12">
                <ml-input class="w-full" :value="form.field_general_id" :readonly="true"/>
              </vs-col>
            </vs-col>

            <vs-col class="w-4/12 mb-4 pl-8">
              <vs-col class="w-4/12 h-full flex" vs-align="center">안전보건담당자</vs-col>
              <vs-col class="w-8/12">
                <ml-input class="w-full" :value="form.safety_chief_id" :readonly="true"/>
              </vs-col>
            </vs-col>

            <vs-col class="w-4/12 mb-4 pl-8">
              <vs-col class="w-4/12 h-full flex" vs-align="center">환경책임자</vs-col>
              <vs-col class="w-8/12">
                <ml-input class="w-full" v-model="form.environment_chief_id" :readonly="board.readonly"/>
              </vs-col>
            </vs-col>

            <vs-col class="w-4/12 mb-4">
              <vs-col class="w-4/12 h-full flex" vs-align="center">공정률(실적/계획)</vs-col>
              <vs-col class="w-8/12">
                <ml-input class="w-full" v-model="form.progress_rate_result" :readonly="board.readonly"/>
              </vs-col>
            </vs-col>

            <vs-col class="w-4/12 mb-4 pl-8">
              <vs-col class="w-4/12 h-full flex" vs-align="center">무재해인시(누계)</vs-col>
              <vs-col class="w-8/12">
                <ml-input class="w-full" v-model="form.noaccident" :readonly="board.readonly"/>
              </vs-col>
            </vs-col>

            <vs-col class="w-4/12 mb-4 pl-8">
              <vs-col class="w-4/12 h-full flex" vs-align="center">일일평균 출역인원</vs-col>
              <vs-col class="w-8/12">
                <ml-input class="w-full" v-model="form.daily_attendance" :readonly="board.readonly"/>
              </vs-col>
            </vs-col>

            <vs-col class="w-full mb-4">
              <vs-col class="h-full flex" style="width:11.11%;" vs-align="center">주요 공정내용</vs-col>
              <vs-col class="" style="width:88.89%;">
                <ml-input class="w-full" v-model="form.progress_content" :readonly="board.readonly"/>
              </vs-col>
            </vs-col>
          </vs-row>

          <!-- 안전관리비 -->
          <vs-row class="my-4">
            <vs-col><h5><i class="dot"></i>안전관리비</h5></vs-col>
          </vs-row>
          <vs-row class="mb-8 border">
            <vs-col class="w-1/12 flex" style="font-weight: 500;" vs-justify="center" vs-align="center">
              안전관리비
            </vs-col>
            <vs-col class="w-11/12">
              <ul class="table table-5">
                <li>
                  <span class="border-left">법정안전관리비</span>
                  <span><ml-input v-model="form.safety_cost.legal_safety_cost" :readonly="board.readonly"/></span>
                  <span>계상안전관리비<br>(도급안전관리비)</span>
                  <span><ml-input v-model="form.safety_cost.contract_safety_cost" :readonly="board.readonly"/></span>
                  <span></span>
                </li>
                <li>
                  <span class="border-left">항목별</span>
                  <span>사용계획</span>
                  <span>당월사용금액</span>
                  <span>누계사용금액</span>
                  <span>집행률</span>
                </li>
                <li>
                  <span class="border-left">안전보건인건비</span>
                  <span><ml-input v-model="form.safety_cost.labor.plan" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.labor.current_used" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.labor.accum_used" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.labor.used_rate" :readonly="board.readonly"/></span>
                </li>
                <li>
                  <span class="border-left">안전보건시설비</span>
                  <span><ml-input v-model="form.safety_cost.facility.plan" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.facility.current_used" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.facility.accum_used" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.facility.used_rate" :readonly="board.readonly"/></span>
                </li>
                <li>
                  <span class="border-left">개인보호구 등</span>
                  <span><ml-input v-model="form.safety_cost.personal_protector.plan" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.personal_protector.current_used"
                                  :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.personal_protector.accum_used" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.personal_protector.used_rate"
                                  :readonly="board.readonly"/></span>
                </li>
                <li>
                  <span class="border-left">안전 진단비</span>
                  <span><ml-input v-model="form.safety_cost.diagnosis.plan" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.diagnosis.current_used" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.diagnosis.accum_used" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.diagnosis.used_rate" :readonly="board.readonly"/></span>
                </li>
                <li>
                  <span class="border-left">교육 및 행사비</span>
                  <span><ml-input v-model="form.safety_cost.training_event.plan" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.training_event.current_used"
                                  :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.training_event.accum_used"
                                  :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.training_event.used_rate"
                                  :readonly="board.readonly"/></span>
                </li>
                <li>
                  <span class="border-left">건강진단 등</span>
                  <span><ml-input v-model="form.safety_cost.medical_examination.plan"
                                  :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.medical_examination.current_used"
                                  :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.medical_examination.accum_used" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.medical_examination.used_rate" :readonly="board.readonly"/></span>
                </li>
                <li>
                  <span class="border-left">재해예방기술지도</span>
                  <span><ml-input v-model="form.safety_cost.skill_guidance.plan" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.skill_guidance.current_used"
                                  :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.skill_guidance.accum_used"
                                  :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.skill_guidance.used_rate"
                                  :readonly="board.readonly"/></span>
                </li>
                <li>
                  <span class="border-left">본사 사용비</span>
                  <span><ml-input v-model="form.safety_cost.head_office.plan" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.head_office.current_used"
                                  :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.head_office.accum_used" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.head_office.used_rate" :readonly="board.readonly"/></span>
                </li>
                <li>
                  <span class="border-left">누계</span>
                  <span><ml-input v-model="form.safety_cost.accum.plan" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.accum.current_used" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.accum.accum_used" :readonly="board.readonly"/></span>
                  <span><ml-input v-model="form.safety_cost.accum.used_rate" :readonly="board.readonly"/></span>
                </li>
              </ul>
            </vs-col>
          </vs-row>

          <!-- 안전사항 -->
          <vs-row class="my-4">
            <vs-col><h5><i class="dot"></i>안전사항</h5></vs-col>
          </vs-row>
          <vs-row class="border">
            <vs-col class="w-2/12 flex" style="font-weight: 500;" vs-justify="center" vs-align="center">
              월간안전활동
            </vs-col>
            <vs-col class="w-10/12">
              <ul class="table table-2">
                <li>
                  <span class="border-left">금월</span>
                  <span>익월</span>
                </li>
                <li>
                  <span class="border-left"><ml-textarea style="background-color: #fff; height:260px; margin:0;"
                                                         v-model="form.safety_monthly_activity.current_month"
                                                         :readonly="board.readonly"/></span>
                  <span><ml-textarea style="background-color: #fff; height:260px; margin:0;"
                                     v-model="form.safety_monthly_activity.next_month"
                                     :readonly="board.readonly"/></span>
                </li>
              </ul>
            </vs-col>
          </vs-row>
          <vs-row class="border mb-8" style="border-top:none;">
            <vs-col class="w-2/12 flex" style="font-weight: 500;" vs-justify="center" vs-align="center">
              One-Strike Out
            </vs-col>
            <vs-col class="w-10/12">
              <ul class="table table-3">
                <li>
                  <span class="border-left">전월까지</span>
                  <span>금월</span>
                  <span>누계</span>
                </li>
                <li>
                  <span class="border-left"><ml-input class="w-full" v-model="form.one_strike_out.current_month"
                                                      :readonly="board.readonly"/></span>
                  <span><ml-input class="w-full" v-model="form.one_strike_out.current_year" :readonly="board.readonly"/></span>
                  <span><ml-input class="w-full" v-model="form.one_strike_out.accum" :readonly="board.readonly"/></span>
                </li>
              </ul>
            </vs-col>
          </vs-row>

          <!-- 보건사항 -->
          <vs-row class="my-4">
            <vs-col><h5><i class="dot"></i>보건사항</h5></vs-col>
          </vs-row>
          <vs-row class="border mb-8">
            <vs-col class="w-full">
              <ul class="table table-3-title">
                <li>
                  <span></span>
                  <span>금월</span>
                  <span>익월</span>
                </li>
                <li>
                  <span>월간보건활동</span>
                  <span><ml-input class="w-full" v-model="form.health_monthly_activity.current_month"
                                  :readonly="board.readonly"/></span>
                  <span><ml-input class="w-full" v-model="form.health_monthly_activity.next_month"
                                  :readonly="board.readonly"/></span>
                </li>
              </ul>
            </vs-col>
          </vs-row>

          <!-- 사고발생현황 -->
          <vs-row class="my-4">
            <vs-col><h5><i class="dot"></i>사고발생현황</h5></vs-col>
          </vs-row>
          <vs-row class="border mb-8">
            <vs-col class="w-full">
              <ul class="table ">
                <li class="table-5-li">
                  <span>No.</span>
                  <span>내용</span>
                  <span class="text-left">전월까지</span>
                  <span class="text-center">금월</span>
                  <span class="text-right">누계</span>
                </li>
                <li class="table-5-li">
                  <span>1</span>
                  <span>중대재해</span>
                  <span class="bg-fff"><ml-input class="w-full" v-model="form.accident_status.serious.current_month"
                                                 :readonly="board.readonly"/></span>
                  <span class="bg-fff"><ml-input class="w-full" v-model="form.accident_status.serious.current_year"
                                                 :readonly="board.readonly"/></span>
                  <span class="bg-fff"><ml-input class="w-full" v-model="form.accident_status.serious.accum"
                                                 :readonly="board.readonly"/></span>
                </li>
                <li class="table-5-li">
                  <span>2</span>
                  <span>산업재해<br>(4일 이상)</span>
                  <span class="bg-fff"><ml-input class="w-full" v-model="form.accident_status.industrial.current_month"
                                                 :readonly="board.readonly"/></span>
                  <span class="bg-fff"><ml-input class="w-full" v-model="form.accident_status.industrial.current_year"
                                                 :readonly="board.readonly"/></span>
                  <span class="bg-fff"><ml-input class="w-full" v-model="form.accident_status.industrial.accum"
                                                 :readonly="board.readonly"/></span>
                </li>
                <li class="table-5-li">
                  <span>3</span>
                  <span>아차사고</span>
                  <span class="bg-fff"><ml-input class="w-full" v-model="form.accident_status.mistake.current_month"
                                                 :readonly="board.readonly"/></span>
                  <span class="bg-fff"><ml-input class="w-full" v-model="form.accident_status.mistake.current_year"
                                                 :readonly="board.readonly"/></span>
                  <span class="bg-fff"><ml-input class="w-full" v-model="form.accident_status.mistake.accum"
                                                 :readonly="board.readonly"/></span>
                </li>
                <li class="table-5-li">
                  <span>4</span>
                  <span>물적사고</span>
                  <span class="bg-fff"><ml-input class="w-full" v-model="form.accident_status.physical.current_month"
                                                 :readonly="board.readonly"/></span>
                  <span class="bg-fff"><ml-input class="w-full" v-model="form.accident_status.physical.current_year"
                                                 :readonly="board.readonly"/></span>
                  <span class="bg-fff"><ml-input class="w-full" v-model="form.accident_status.physical.accum"
                                                 :readonly="board.readonly"/></span>
                </li>
                <li class="table-1_5-title-li">
                  <span>본사 지원요청</span>
                  <span class="bg-fff" style="height:200px;"><ml-textarea class="m-0 w-full h-full"
                                                                          v-model="form.accident_status.comment"
                                                                          :readonly="board.readonly"/></span>
                </li>
              </ul>
            </vs-col>
          </vs-row>

          <!-- 첨부파일 -->
          <file-upload-module v-model="fileList" :readonly="board.readonly"/>

        </vx-card>
      </vs-col>
      <vs-col class="w-3/12 pl-6">
        <approval-process-module
          :board="board"
          :commentabled="!(board.isCompleteApproval || board.savable)"

          @handleClickUpload="handleClickUpload"
          @handleClickOk="handleClickOk"
          @handleClickNo="handleClickNo"
          @handleSendApprovalProcess="handleSendApprovalProcess"
        ></approval-process-module>
      </vs-col>
    </vs-row>


    <!-- 출력영역 -->

    <div v-if="isPrint" id="print-report">
      <div style="background: #fff;">
        <!-- 기본정보 -->
        <vs-row>

          <vs-col class="w-4/12 mb-4">
            <vs-col class="w-4/12 h-full flex" vs-align="center">현장명</vs-col>
            <vs-col class="w-8/12"><span
              style="width:100%; height:38px; display: flex; align-items: center;">{{ form.project_title }}</span>
            </vs-col>
          </vs-col>

          <vs-col class="w-4/12 mb-4 pl-8">
            <vs-col class="w-4/12 h-full flex" vs-align="center">사업금액</vs-col>
            <vs-col class="w-8/12"><span
              style="width:100%; height:38px; display: flex; align-items: center;">{{ form.work_money_amount }}</span>
            </vs-col>
          </vs-col>

          <vs-col class="w-4/12 mb-4 pl-8">
            <vs-col class="w-4/12 h-full flex" vs-align="center">대상기간</vs-col>
            <vs-col class="w-8/12"><span
              style="width:100%; height:38px; display: flex; align-items: center;">{{ form.work_period }}</span>
            </vs-col>
          </vs-col>

          <vs-col class="w-4/12 mb-4">
            <vs-col class="w-4/12 h-full flex" vs-align="center">안전보건부서장</vs-col>
            <vs-col class="w-8/12"><span
              style="width:100%; height:38px; display: flex; align-items: center;">{{ form.field_general_id }}</span>
            </vs-col>
          </vs-col>

          <vs-col class="w-4/12 mb-4 pl-8">
            <vs-col class="w-4/12 h-full flex" vs-align="center">안전보건담당자</vs-col>
            <vs-col class="w-8/12"><span
              style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_chief_id }}</span>
            </vs-col>
          </vs-col>

          <vs-col class="w-4/12 mb-4 pl-8">
            <vs-col class="w-4/12 h-full flex" vs-align="center">환경책임자</vs-col>
            <vs-col class="w-8/12"><span
              style="width:100%; height:38px; display: flex; align-items: center;">{{ form.environment_chief_id }}</span>
            </vs-col>
          </vs-col>

          <vs-col class="w-4/12 mb-4">
            <vs-col class="w-4/12 h-full flex" vs-align="center">공정률(실적/계획)</vs-col>
            <vs-col class="w-8/12"><span
              style="width:100%; height:38px; display: flex; align-items: center;">{{ form.progress_rate_result }}</span>
            </vs-col>
          </vs-col>

          <vs-col class="w-4/12 mb-4 pl-8">
            <vs-col class="w-4/12 h-full flex" vs-align="center">무재해인시(누계)</vs-col>
            <vs-col class="w-8/12"><span
              style="width:100%; height:38px; display: flex; align-items: center;">{{ form.noaccident }}</span></vs-col>
          </vs-col>

          <vs-col class="w-4/12 mb-4 pl-8">
            <vs-col class="w-4/12 h-full flex" vs-align="center">일일평균 출역인원</vs-col>
            <vs-col class="w-8/12"><span
              style="width:100%; height:38px; display: flex; align-items: center;">{{ form.daily_attendance }}</span>
            </vs-col>
          </vs-col>

          <vs-col class="w-full mb-4">
            <vs-col class="h-full flex" style="width:11.11%;" vs-align="center">주요 공정내용</vs-col>
            <vs-col class="w-8/12"><span
              style="width:100%; height:38px; display: flex; align-items: center;">{{ form.progress_content }}</span>
            </vs-col>
          </vs-col>
        </vs-row>

        <!-- 안전관리비 -->
        <vs-row class="my-4">
          <vs-col><h5><i class="dot"></i>안전관리비</h5></vs-col>
        </vs-row>
        <vs-row class="mb-8" style="border:1px solid #cdcdcd;">
          <vs-col class="w-1/12 flex" style="font-weight: 500;" vs-justify="center" vs-align="center">
            안전관리비
          </vs-col>
          <vs-col class="w-11/12">
            <ul class="table table-5">
              <li>
                <span class="border-left">법정안전관리비</span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.legal_safety_cost }}</span></span>
                <span>계상안전관리비<br>(도급안전관리비)</span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.contract_safety_cost }}</span></span>
                <span></span>
              </li>
              <li>
                <span class="border-left">항목별</span>
                <span>사용계획</span>
                <span>당월사용금액</span>
                <span>누계사용금액</span>
                <span>집행률</span>
              </li>
              <li>
                <span class="border-left">안전보건인건비</span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.labor.plan }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.labor.current_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.labor.accum_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.labor.used_rate }}</span></span>
              </li>
              <li>
                <span class="border-left">안전보건시설비</span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.facility.plan }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.facility.current_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.facility.accum_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.facility.used_rate }}</span></span>
              </li>
              <li>
                <span class="border-left">개인보호구 등</span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.personal_protector.plan }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.personal_protector.current_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.personal_protector.accum_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.personal_protector.used_rate }}</span></span>
              </li>
              <li>
                <span class="border-left">안전 진단비</span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.diagnosis.plan }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.diagnosis.current_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.diagnosis.accum_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.diagnosis.used_rate }}</span></span>
              </li>
              <li>
                <span class="border-left">교육 및 행사비</span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.training_event.plan }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.training_event.current_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.training_event.accum_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.training_event.used_rate }}</span></span>
              </li>
              <li>
                <span class="border-left">건강진단 등</span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.medical_examination.plan }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.medical_examination.current_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.medical_examination.accum_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.medical_examination.used_rate }}</span></span>
              </li>
              <li>
                <span class="border-left">재해예방기술지도</span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.skill_guidance.plan }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.skill_guidance.current_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.skill_guidance.accum_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.skill_guidance.used_rate }}</span></span>
              </li>
              <li>
                <span class="border-left">본사 사용비</span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.head_office.plan }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.head_office.current_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.head_office.accum_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.head_office.used_rate }}</span></span>
              </li>
              <li style="border-bottom: none;">
                <span class="border-left">누계</span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.accum.plan }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.accum.current_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.accum.accum_used }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.safety_cost.accum.used_rate }}</span></span>
              </li>
            </ul>
          </vs-col>
        </vs-row>

        <!-- 안전사항 -->
        <vs-row class="my-4">
          <vs-col><h5><i class="dot"></i>안전사항</h5></vs-col>
        </vs-row>
        <vs-row style="border:1px solid #cdcdcd;">
          <vs-col class="w-2/12 flex" style="font-weight: 500;" vs-justify="center" vs-align="center">
            월간안전활동
          </vs-col>
          <vs-col class="w-10/12">
            <ul class="table table-2">
              <li>
                <span class="border-left">금월</span>
                <span>익월</span>
              </li>
              <li>
                <span class="border-left">
                  <pre
                    style="width:100%; text-align: left; white-space: pre-wrap;">{{ form.safety_monthly_activity.current_month }}</pre>
                </span>
                <span>
                  <pre
                    style="width:100%; text-align: left; white-space: pre-wrap;">{{ form.safety_monthly_activity.next_month }}</pre>
                </span>
              </li>
            </ul>
          </vs-col>
        </vs-row>
        <vs-row class="border mb-8" style="border:1px solid #cdcdcd; border-top:none;">
          <vs-col class="w-2/12 flex" style="font-weight: 500;" vs-justify="center" vs-align="center">
            One-Strike Out
          </vs-col>
          <vs-col class="w-10/12">
            <ul class="table table-3">
              <li>
                <span class="border-left">전월까지</span>
                <span>금월</span>
                <span>누계</span>
              </li>
              <li>
                <span class="border-left"><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.one_strike_out.current_month }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.one_strike_out.current_year }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.one_strike_out.accum }}</span></span>
              </li>
            </ul>
          </vs-col>
        </vs-row>

        <!-- 보건사항 -->
        <vs-row class="my-4">
          <vs-col><h5><i class="dot"></i>보건사항</h5></vs-col>
        </vs-row>
        <vs-row class="mb-8" style="border:1px solid #cdcdcd;">
          <vs-col class="w-full">
            <ul class="table table-3-title">
              <li>
                <span></span>
                <span>금월</span>
                <span>익월</span>
              </li>
              <li>
                <span>월간보건활동</span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.health_monthly_activity.current_month }}</span></span>
                <span><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.health_monthly_activity.next_month }}</span></span>
              </li>
            </ul>
          </vs-col>
        </vs-row>

        <!-- 사고발생현황 -->
        <vs-row class="my-4">
          <vs-col><h5><i class="dot"></i>사고발생현황</h5></vs-col>
        </vs-row>
        <vs-row class="mb-8" style="border:1px solid #cdcdcd;">
          <vs-col class="w-full">
            <ul class="table ">
              <li class="table-5-li">
                <span>No.</span>
                <span>내용</span>
                <span class="text-left">전월까지</span>
                <span class="text-center">금월</span>
                <span class="text-right">누계</span>
              </li>
              <li class="table-5-li">
                <span>1</span>
                <span>중대재해</span>
                <span class="bg-fff"><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.accident_status.serious.current_month }}</span></span>
                <span class="bg-fff"><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.accident_status.serious.current_year }}</span></span>
                <span class="bg-fff"><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.accident_status.serious.accum }}</span></span>
              </li>
              <li class="table-5-li">
                <span>2</span>
                <span>산업재해<br>(4일 이상)</span>
                <span class="bg-fff"><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.accident_status.industrial.current_month }}</span></span>
                <span class="bg-fff"><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.accident_status.industrial.current_year }}</span></span>
                <span class="bg-fff"><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.accident_status.industrial.accum }}</span></span>
              </li>
              <li class="table-5-li">
                <span>3</span>
                <span>아차사고</span>
                <span class="bg-fff"><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.accident_status.mistake.current_month }}</span></span>
                <span class="bg-fff"><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.accident_status.mistake.current_year }}</span></span>
                <span class="bg-fff"><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.accident_status.mistake.accum }}</span></span>
              </li>
              <li class="table-5-li">
                <span>4</span>
                <span>물적사고</span>
                <span class="bg-fff"><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.accident_status.physical.current_month }}</span></span>
                <span class="bg-fff"><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.accident_status.physical.current_year }}</span></span>
                <span class="bg-fff"><span
                  style="width:100%; height:38px; display: flex; align-items: center;">{{ form.accident_status.physical.accum }}</span></span>
              </li>
              <li class="table-1_5-title-li">
                <span>본사 지원요청</span>
                <span class="bg-fff">
                  <pre
                    style="width:100%; text-align: left; white-space: pre-wrap;">{{ form.accident_status.comment }}</pre>
                </span>
              </li>
            </ul>
          </vs-col>
        </vs-row>
      </div>
    </div>

    <!-- TODO : 얼럿데이터 -->
    <popup-alert v-model="alert.show"
                 :is-confirm="alert.isConfirm"
                 :html="alert.html"
                 :message="alert.message"
                 :buttons="alert.buttons"

                 @ok="alertOk"
                 @no="alertNo"
                 @print="alertPrint"
    ></popup-alert>

  </div>
</template>

<script>
import PopupApprovalProcess from '@/views/approval/PopupApprovalProcess'
import ApprovalProcessModule from '@/views/modules/ApprovalProcessModule'
import FileUploadModule from '@/views/modules/FileUploadModule'
import PopupAlert from '@/popup/PopupAlert'

export default {
  name: 'ReportUpdate',
  components: {
    PopupAlert,
    FileUploadModule,
    ApprovalProcessModule,
    PopupApprovalProcess
  },
  data () {
    return {
      isPrint: false,
      boardSlug: 'project_monthly_report',

      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: 'project_monthly_report', //board slug
        statusCode: '', // 문서 상태코드
        writer: {}, //작성자 정보
        turnApprovalId: 0, // 결재자 ID
        readonly: false, // 읽기전용인가
        resend: false, // 재등록 가능한가
        isWriter: false, // 작성자인가
        savable: true, // 임시저장이 가능하나
        collection: true, // 문서 회수가 가능하나
        isCompleteApproval: false, // 결재완료된 문서인가
        isTurnApproval: false, // 결재할 차례인가
        approvalLine: [] // 결재라인, 모듈 표기용
      },
      approvalLine: [], // 현재 결재선, api 전송용
      fileList: [], // 파일 리스트

      // TODO : 얼럿데이터
      alert: {
        show: false,
        isConfirm: false,
        html: '',
        message: '결재하시겠습니까?',
        buttons: [
          {
            label: '승인',
            action: 'ok'
          },
          {
            label: '취소',
            action: 'cancel'
          }
        ]
      },

      form: {
        project_id: '',
        project_title: '', //현장명
        project_date_year: '', // 보고서 년도
        project_date_month: '', // 보고서 월
        work_money_amount: '', //사업금액
        work_period: '', //대상기간
        field_general_id: '', //안전보건부서장
        safety_chief_id: '', //안전보건담당자
        environment_chief_id: '', //환경책임자
        progress_rate_result: '', //공정율(실적)
        progress_rate_plan: '', //공정율(계획)
        noaccident: '', //무재해인시(누계)
        daily_attendance: '', //일일평균출역인원
        progress_content: '', //주요공정내용

        // 안전관리비
        safety_cost: {
          legal_safety_cost: '', //법정안전관리비
          contract_safety_cost: '', //계상안전관리비(도급안전관리비)

          //안전보건인건비
          labor: {
            plan: '', // 사용계획
            current_used: '', //당월사용금액
            accum_used: '', //누계사용금액
            used_rate: '' //집행률
          },

          //안전보건시설비
          facility: {
            plan: '',
            current_used: '',
            accum_used: '',
            used_rate: ''
          },

          //개인보호구
          personal_protector: {
            plan: '',
            current_used: '',
            accum_used: '',
            used_rate: ''
          },

          // 안전 진단비
          diagnosis: {
            plan: '',
            current_used: '',
            accum_used: '',
            used_rate: ''
          },

          // 교육 및 행사비
          training_event: {
            plan: '',
            current_used: '',
            accum_used: '',
            used_rate: ''
          },

          // 건강진단
          medical_examination: {
            plan: '',
            current_used: '',
            accum_used: '',
            used_rate: ''
          },

          //재해예방기술지도
          skill_guidance: {
            plan: '',
            current_used: '',
            accum_used: '',
            used_rate: ''
          },

          // 본사 사용비
          head_office: {
            plan: '',
            current_used: '',
            accum_used: '',
            used_rate: ''
          },

          // 누계
          accum: {
            plan: '',
            current_used: '',
            accum_used: '',
            used_rate: ''
          }
        },

        // 안전사항 / 월간안전활동
        safety_monthly_activity: {
          current_month: '',
          next_month: ''
        },

        // 안전사항 / one_strike_out
        one_strike_out: {
          current_month: '',
          current_year: '',
          accum: ''
        },

        // 월간보건활동
        health_monthly_activity: {
          current_month: '',
          next_month: ''
        },

        // 사고발생현황
        accident_status: {
          serious: {
            current_month: '',
            current_year: '',
            accum: ''
          },
          industrial: {
            current_month: '',
            current_year: '',
            accum: ''
          },
          mistake: {
            current_month: '',
            current_year: '',
            accum: ''
          },
          physical: {
            current_month: '',
            current_year: '',
            accum: ''
          },
          comment: ''
        },

        // preview
        preview: {
          title: '',
          attach: '',
          comment: '',
          work_money_amount: ''
        }

      },
      oldForm:{}
    }
  },

  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
    }
  },

  mounted () {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {

      if (JSON.stringify(this.oldForm) === JSON.stringify(this.form)) {
        next(true)
      } else if (confirm('저장하지 않은 데이터는 삭제됩니다. 닫으시겠습니까?')) {
        next(true)
      }

    })
    this.$once('hook:destroyed', () => {
      backButtonRouteGuard()
    })
  },

  created () {
    this.loadPost()
  },

  methods: {

    print () {
      this.isPrint = true

      setTimeout(() => {
        var g_oBeforeBody = document.getElementById('print-report').innerHTML
        // 프린트를 보이는 그대로 나오기위한 셋팅
        window.onbeforeprint = function (ev) {
          document.body.innerHTML = g_oBeforeBody
        }
        window.print()
        location.reload()
      }, 300)
    },

    back () {
      this.$router.back()
    },

    async loadPost () {
      const boardSlug = this.boardSlug
      const postId = this.$route.params.postId
      await this.$store.dispatch('approval/LOAD_POST', {
        boardSlug,
        postId
      })

      if (!this.$store.state.approval.postInfo) {
        alert('열람 권한이 없습니다.')
        this.oldForm = this.form
        this.$router.back()
        return
      }

      // 내용
      const post = JSON.parse(this.$store.state.approval.postInfo.post_content)
      this.form = post
      const files = this.$store.state.approval.postInfo.post_attachment
      if (files) {
        for (const file of files) {
          this.fileList.push({
            id: file.id,
            fileName: file.file_name,
            fileSize: file.file_size,
            path: file.path,
            thumb: file.thumb
          })
        }
      }

      // TODO : 결재프로세스
      await this.$store.dispatch('USER_INFO')
      const myId = this.$store.state.auth.userInfo.id
      const doc = this.$store.state.approval.document
      this.board.statusCode = doc.status.code
      this.board.writer = doc.writer
      this.board.turnApprovalId = doc.turn_approval_id
      this.board.isWriter = (this.board.writer.id === myId)
      this.board.isTurnApproval = (this.board.turnApprovalId === myId && (this.board.statusCode === 'registered' || this.board.statusCode === 'ongoing'))

      this.board.readonly = !(this.board.statusCode === 'temp' || this.board.statusCode === 'rejected')
      this.board.resend = (this.board.isWriter && this.board.statusCode === 'rejected')
      this.board.isCompleteApproval = (this.board.statusCode === 'approved' || this.board.statusCode === 'rejected')
      this.board.savable = this.board.isWriter && (this.board.statusCode === 'temp')
      this.board.collection = this.board.isWriter && (this.board.statusCode === 'registered')


      this.board.approvalLine = doc.line.slice() // 모듈 표기용
      this.approvalLine = doc.line.slice() // api 전송용

      this.oldForm = JSON.parse(JSON.stringify(this.form))

      if (!this.board.isWriter && this.board.statusCode === 'temp') {
        alert('열람 권한이 없습니다.')
        this.oldForm = this.form
        this.$router.back()
        return
      }
    },

    handleClickUpdate () {
      if (confirm('저장하시겠습니까?')) {
        this.register(false)

      }
    },

    handleClickCollection () {
      if (confirm('회수 후 임시저장 상태로 변경하시겠습니까?')) {
        this.register(false)

      }
    },

    handleClickRegister () {
      if (confirm('임시저장 하시겠습니까?')) {
        this.reRegister(false)
      }
    },

    handleClickClose () {
      this.back()
    },

    handlePrint () {
      this.alert.html = '<p>인쇄후 페이지가 새로고침됩니다. 저장하지 않은 데이터는 삭제 됩니다</p><p>인쇄하시겠습니까?</p>'
      this.alert.message = ''
      this.alert.isConfirm = false
      this.alert.buttons = [
        { label: '인쇄', action: 'print' },
        { label: '취소', action: 'cancel', type: 'border' }
      ]
      this.alert.show = true
    },

    // 글 삭제
    async handleDeletePost () {
      if (confirm('삭제하시겠습니까?')) {
        const boardSlug = this.boardSlug
        const postId = this.$route.params.postId
        await this.$store.dispatch('approval/DELETE_POST', {boardSlug, postId})
        this.oldForm = this.form
        this.$router.back()
      }
    },


    // TODO : 결재프로세스
    async register (isUploaded) {

      // 등록정보
      const projectId = this.$route.params.proj_id
      const boardSlug = this.boardSlug
      const postId = this.$route.params.postId
      const title = this.form.project_title
      const approvalLine = JSON.stringify(this.lineToSendLine(this.approvalLine))
      let uploads = ''
      const listUploads = []
      const uploadFileIds = []

      if (this.fileList.length > 0) {
        for (const file of this.fileList) {
          listUploads.push(file)
          uploadFileIds.push(file.id)
        }
        uploads = JSON.stringify(uploadFileIds)
      }

      // 리스트 노출 정보
      this.form.preview.title = title
      this.form.preview.attach = JSON.stringify(listUploads)
      this.form.preview.comment = ''
      this.form.preview.work_money_amount = this.form.work_money_amount
      const content = JSON.stringify(this.form)


      try {
        if (isUploaded) {
          // 바로 상신하기
          const unTemp = 'y'
          await this.$store.dispatch('approval/UPDATE_POST', {
            projectId,
            boardSlug,
            postId,
            title,
            content,
            approvalLine,
            uploads,
            unTemp
          })
          alert('상신되었습니다.')
          this.oldForm = JSON.parse(JSON.stringify(this.form))
          this.back()
        } else {
          // 임시 저장하기
          const unTemp = 'n'
          await this.$store.dispatch('approval/UPDATE_POST', {
            projectId,
            boardSlug,
            postId,
            title,
            content,
            approvalLine,
            uploads,
            unTemp
          })
          alert('임시저장되었습니다.')
          this.oldForm = JSON.parse(JSON.stringify(this.form))
          this.back()
        }

      } catch (e) {
        if (this.$store.state.approval.error_data.title) {
          alert('현장명이 없습니다')
        } else {
        }
      }
    },

    async reRegister (isUploaded) {
      if (isUploaded && (!this.approvalLine || this.approvalLine.length === 0)) {
        alert('결재선을 지정해주세요')
        return
      }

      // 등록정보
      const projectId = this.$route.params.proj_id
      const boardSlug = this.boardSlug
      const title = this.form.project_title
      const approvalLine = JSON.stringify(this.lineToSendLine(this.approvalLine))
      const security = 'normal' // 문서보안 등급 ['일반', 대외비 1급, 대외비 2급, 인비, 극비] [normal,confidential1,confidential2,personally,confidential0]
      const priority = 'medium' // 문서 중요도 [매우낮음, 낮음, 보통, 높음, 매우 높음] [lowest,low,medium,high,highest]
      let uploads = ''
      const listUploads = []
      const uploadFileIds = []

      if (this.fileList.length > 0) {
        for (const file of this.fileList) {
          listUploads.push(file)
          uploadFileIds.push(file.id)
        }
        uploads = JSON.stringify(uploadFileIds)
      }


      this.form.project_title = this.projectInfo.field_name //현장명
      this.form.work_period = (new Date(this.projectInfo.date_complete) - new Date(this.projectInfo.date_work_start)) / (1000 * 60 * 60 * 24) //대상기간
      this.form.work_money_amount = this.projectInfo.work_money_amount //사업금액
      this.form.field_general_id = this.projectInfo.field_chief.name //안전보건부서장 최역소
      this.form.safety_chief_id = this.projectInfo.safety_chief.name //안전보건담당자

      // 리스트 노출 정보
      this.form.preview.title = title
      this.form.preview.attach = JSON.stringify(listUploads)
      this.form.preview.comment = ''
      this.form.preview.work_money_amount = this.form.work_money_amount
      const content = JSON.stringify(this.form)


      try {
        if (isUploaded) {
          // 바로 상신하기
          await this.$store.dispatch('approval/CREATE_POST', {
            projectId,
            boardSlug,
            title,
            content,
            approvalLine,
            security,
            priority,
            uploads
          })
          alert('상신되었습니다.')
          this.back()
        } else {
          // 임시 저장하기
          const isTemp = 1
          await this.$store.dispatch('approval/CREATE_POST', {
            projectId,
            boardSlug,
            title,
            content,
            approvalLine,
            security,
            priority,
            uploads,
            isTemp
          })
          alert('임시저장되었습니다.')
          this.back()
        }

      } catch (e) {
        if (this.$store.state.approval.error_data.title) {
          alert('현장명이 없습니다')
        } else {
        }
      }

    },

    // ApprovalProcessModule 에서 사용하는 line 방식에서 전송용 line 으로 변경
    lineToSendLine (data) {
      const approvalList = []

      for (const member of data) {
        if (member.type_code !== 'register') {
          approvalList.push({
            id: member.user_id,
            name: member.user_name,
            elementType: member.type_code
          })
        }
      }
      return approvalList
    },
    handleSendApprovalProcess (approvalLine) {
      this.approvalLine = approvalLine
    },
    handleClickNo () {
      this.alert.html = '<p>반려하시겠습니까?</p><p>아래에 사유를 작성해주세요.</p>'
      this.alert.message = ''
      this.alert.isConfirm = true
      this.alert.buttons = [
        {
          label: '반려',
          action: 'no'
        },
        {
          label: '취소',
          action: 'cancel',
          type: 'border'
        }
      ]
      this.alert.show = true
    },
    async handleClickOk () {
      this.alert.html = ''
      this.alert.message = '승인하시겠습니까?'
      this.alert.isConfirm = false
      this.alert.buttons = [
        {
          label: '승인',
          action: 'ok'
        },
        {
          label: '취소',
          action: 'cancel',
          type: 'border'
        }
      ]
      this.alert.show = true

    },
    handleClickUpload () {
      if (confirm('상신하시겠습니까?')) {
        this.register(true)
      }
    },


    // TODO : 얼럿데이터
    async alertOk () {

      const postId = this.$route.params.postId
      await this.$store.dispatch('approval/APPROVE_OK', {
        postId
      })

      this.oldForm = JSON.parse(JSON.stringify(this.form))
      document.location.reload()
    },

    async alertNo (text) {
      const postId = this.$route.params.postId
      const comment = text
      await this.$store.dispatch('approval/APPROVE_NO', {
        postId,
        comment
      })

      this.oldForm = JSON.parse(JSON.stringify(this.form))
      document.location.reload()
    },

    alertUpload () {
      this.register(true)
    },

    alertPrint () {
      this.print()
    }
  }
}
</script>
<style scoped>

ul.table.table-3-title li {
  grid-template-columns: 16.67% repeat(2, minmax(0, 1fr));
}

ul.table li.table-1_5-title-li {
  grid-template-columns: 20% 80%;
}
</style>
