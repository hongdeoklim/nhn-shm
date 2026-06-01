export default {
  error_data:{},
  error_code:-1,

  list:[],
  types:[],
  postListInfo: {},
  postInfo: {},
  postAfters: [],
  commentList: [],
  line:[],
  lineInfo:{},
  status:{},
  disasterTypeList:[],

  alertReadInfo:{},
  alertReadList:[],
  alertUnReadInfo:{},
  alertUnReadList:[],
  mainAlertUnReadInfo:{},
  mainAlertUnReadList:[],

  document:{
    id: 0, //상신문서 번호

    // 문서상태 등록됨/진행중
    status: {
      id: 0,
      code: '',
      name: ''
    },

    // 문서작성자 정보, postInfo.actor와 동일한 정보
    writer:{
      id: 0,
      name:'',
      company_id:'',
      company_name:''
    },

    turn_approval_id:'',
    line:[
      /*
      {
        user_id:0,
        company_id:0,
        company_name:0,
        status:{
          id:0,
          code:'',
          name:''
        },
        type:{
          id:0,
          code:'',
          name:''
        }
      }
      */
    ]

  }

}
