<template>
  <div>
    <div class="flex items-center justify-between">
      <p v-if="title" class="title ">{{ title }}</p>
      <div class="ml-auto" v-if="!isPrint">
        <search-nav-item-keyword size="large" placeholder="사용자 ID 검색" v-model="searchUserId"/>
      </div>
    </div>
    <vs-table
      v-if="type === 'info'"
      @selected="handleSelected"
      @sort="handleSort"
      @search="handleSearch"
      pagination
      :max-items="(realUsers && realUsers.length > 0) ? 5 : 1"
      :data="realUsers"
      class="mt-5"
    >
      <template slot="thead">
        <vs-th>No.</vs-th>
<!--        <vs-th>구분</vs-th>-->
<!--        <vs-th>소속업체</vs-th>-->
        <vs-th>사용자 ID</vs-th>
        <vs-th>사용자명</vs-th>
        <vs-th>휴대폰 번호</vs-th>
        <vs-th>이메일</vs-th>
      </template>

      <template slot-scope="{ data }">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
          <vs-td>{{ data[indextr].id }}</vs-td>
<!--          <vs-td></vs-td>-->
<!--          <vs-td>{{ data[indextr].department }}</vs-td>-->
          <vs-td>{{ data[indextr].username }}</vs-td>
          <vs-td>{{ data[indextr].name}}</vs-td>
          <vs-td>{{ data[indextr].phone }}</vs-td>
          <vs-td>{{ data[indextr].email }}</vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <vs-table
      v-else
      @selected="handleSelected"
      @sort="handleSort"
      @search="handleSearch"
      :data="getUsers"
      class="table-list mt-5"
      no-data-text="표시할 데이터가 없습니다"
    >
      <template slot="thead">
        <vs-th style="width:100px">No.</vs-th>
        <vs-th style="width:16.6%">구분</vs-th>
        <vs-th style="width:16.6%">업체명</vs-th>
        <vs-th style="width:16.6%">사용자명</vs-th>
        <vs-th style="width:16.6%">사용자 ID(등록번호)</vs-th>
        <vs-th style="width:16.6%">휴대폰번호</vs-th>
        <vs-th style="width:16.6%">권한설정</vs-th>
      </template>

      <template slot-scope="{ data }">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
          <vs-td>{{ indextr + 1 }}</vs-td>
          <vs-td>{{ data[indextr].company && data[indextr].company.com_type }}</vs-td>
          <vs-td>{{ data[indextr].company && data[indextr].company.com_name }}</vs-td>
          <vs-td>{{ data[indextr].name }}</vs-td>
          <vs-td>{{ data[indextr].username }}</vs-td>
          <vs-td>{{ data[indextr].phone }}</vs-td>
          <vs-td class="flex items-center justify-center">
            <span v-if="isPrint || !hasAdminPermission" >{{ tr.join_project ? '참여' : '미참여' }}</span>
            <vs-select v-else v-model="tr.join_project" autocomplete @change="onChangeJoinProject">
              <vs-select-item text="미참여" :value="false" />
              <vs-select-item text="참여" :value="true"  />
            </vs-select>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <vs-col>
      <div class="vs-con-table">
        <div class="con-pagination-table vs-table--pagination">
          <k-pagination
            :total="(page.lastPage) ? page.lastPage : 0"
            v-model="page.current" @change="handleChangePage"></k-pagination>
        </div>
      </div>
    </vs-col>
  </div>
</template>

<script>
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import KPagination from '@/components/kPagination/kPagination.vue'
export default {
  name: 'CompanyUserAuthModule',
  components: {
    KPagination,
    SearchNavItemKeyword},
  props: {
    value: Array,
    type: {
      type: String,
      default: () => {
        return ''
      }
    },
    users: Array,
    title: {
      type: String,
      default: () => {
        return '참여 인원 정보'
      }
    },
    isPrint: Boolean,
    hasAdminPermission: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      joinProjects: [],
      page: {
        lastPage: 1,
        current: 1,
        perPage: 5
      },
      searchUserId: ''
    }
  },
  computed: {
    realUsers () {
      const list = []
      if (this.users) {
        for (const user of this.users) {
          if (this.searchUserId) {
            if (user.username.indexOf(this.searchUserId) >= 0) {
              list.push(user)
            }
          } else {
            list.push(user)
          }
        }
      }
      return list
    },

    getUsers () {
      const first = (this.page.current - 1) * this.page.perPage
      return this.realUsers.slice(first, first + this.page.perPage)
    }
  },

  watch: {
    searchUserId () {
      this.page.current = 1
    },
    realUsers (list) {
      this.page.lastPage = Math.floor((list.length - 1) / this.page.perPage) + 1
    },
    value (data) {
      this.joinProjects = data
    }
  },
  mounted () {
    this.joinProjects = this.value
  },
  methods: {

    handleSelected () {

    },
    handleSort () {

    },
    handleSearch () {

    },
    onChangeJoinProject () {
      const list = []
      for (const user of this.users) {
        if (user.join_project) {
          list.push(user)
        }
      }
      this.$emit('input', list)
    },
    handleChangePage (page) {
      this.page.current = page
    }
  }
}
</script>

<style scoped lang="scss">
.table-list {
  .action-button {
    margin-left: auto;
  }
}
.title {
  font-weight: 500;
  font-size: 16px;
  height: 17px;
  line-height: 17px;
  position: relative;
  padding-left: 12px;
  &::before {
    content: "";
    width: 8px;
    height: 8px;
    background: #7e72f2;
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -8px;
    border-radius: 100%;
  }
}
.title-n {
  font-weight: 500;
  font-size: 16px;
  height: 17px;
  line-height: 17px;
}
.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}
.size-search{
  width: 200px;
}
.input-se {
  width: 100%;
  &::v-deep .start-end-title {
    width: 114px;
    font-weight: 500;
    font-size: 14px;
    justify-content: flex-start;
  }
  &::v-deep .mr-2 {
    flex: 1;
    margin-right: 10px !important;
  }
  &::v-deep .mr-2 + .mr-2 {
    margin-right: 0 !important;

    &::before {
      content: "~";
      margin-right: 10px;
    }
  }
  &::v-deep .inline-block {
    width: 100% !important;
  }
}
.vs-table-primary .is-selected {
  background: rgba(126, 114, 242, 0.6) !important;
  color: white;
}
.search-item {
  width: 100% !important;
  margin: 0 !important;
  &::v-deep > div:first-child {
    width: 114px !important;
    font-weight: 500;
    font-size: 14px;
  }
  &::v-deep > div:last-child {
    flex: 1 !important;
    .con-select {
      width: 100%;
    }
  }
}
.upload-img {
  width: 100%;
  height: 318px !important;
  margin-top: 22px;
}

.table-list::v-deep {
  .vs-con-tbody {
    border: none;
    border-top: solid 2px #f9f9f9;
    border-bottom: solid 2px #f9f9f9;
  }
  th .vs-table-text {
    justify-content: center;
  }
  td {
    text-align: center;
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
