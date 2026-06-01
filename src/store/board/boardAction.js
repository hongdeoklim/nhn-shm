import HttpRequest from "@/util/HttpRequest";
import constant from "@/constant/constant";
import { dedupeRequest } from "@/util/requestCache";

export default {
  async LOAD_BOARD({ commit, state }, params) {
    const boardId = params.boardId;

    if (!state.boardData || state.boardData.board_slug !== boardId) {
      return new Promise((resolve, reject) => {
        dedupeRequest(
          () => HttpRequest.get(`/api/v1/board/${boardId}`),
          `/api/v1/board/${boardId}`,
          {},
          'GET'
        )
          .then((response) => {
            commit("LOAD_BOARD", response);
            resolve(response);
          })
          .catch((err) => reject(err));
      });
    }
  },

  /**
   * 게시판 목록
   * @params {page, perPage}
   */
  async LOAD_BOARD_LIST({ commit }) {
    return new Promise((resolve, reject) => {
      dedupeRequest(
        () => HttpRequest.get("/api/v1/board"),
        "/api/v1/board",
        {},
        'GET'
      )
        .then((response) => {
          // mutations 메소드 호출
          commit("LOAD_BOARD_LIST", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  /**
   * 게시판 종류 불러오기
   * @params {page, perPage}
   */
  async LOAD_BOARD_TYPE_LIST({ commit }) {
    return new Promise((resolve, reject) => {
      dedupeRequest(
        () => HttpRequest.get("/api/v1/info/board/type"),
        "/api/v1/info/board/type",
        {},
        'GET'
      )
        .then((response) => {
          // mutations 메소드 호출
          commit("LOAD_BOARD_TYPE_LIST", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  // 공지사항 게시글 불러오기
  async LOAD_POST_LIST({ commit }, params) {
    const boardId = params.boardId;
    const option = {
      params: {
        projectId: params.projectId,
        page: params.page,
        perPage: params.perPage,
        keyword: params.keyword,
        preview: params.preview,
        dateTarget: params.dateTarget,
        dateBegin: params.dateBegin,
        dateEnd: params.dateEnd,
        orderTarget: params.orderTarget,
        orderDirection: params.orderDirection,
        fieldId: params.fieldId,
        companyIds: params.companyIds,
      },
    };

    if (params.conditions && params.conditions.length > 0) {

      let index = 0;
      for (let i = 0, condition; (condition = params.conditions[i]); i++) {
        const sub1Conditions = condition.conditions;
        const key = condition.key && condition.key.trim();
        if (key) {
          // 기본 연산자는 '=', 그 외에는 전달된 연산자 사용
          let operator = '=';
          if (condition.operator) {
            operator = `${condition.operator}`.trim()
          }

          let value = "";
          if (typeof condition.value === 'string') {
            value = condition.value && condition.value.trim();
          } else if (typeof condition.value === 'number') {
            value = condition.value;
          }
          if ((typeof value === 'string' && value) || (typeof value === 'number')) {
            option.params[`conditions[${index}][key]`] = key;
            option.params[`conditions[${index}][operator]`] = operator;
            option.params[`conditions[${index}][value]`] = value;
            if (condition.boolean) option.params[`conditions[${index}][boolean]`] = condition.boolean;
            index++;
          }
        } else if (sub1Conditions) {
          const boolean = condition.boolean;
          let subIndex = 0;

          if (boolean) {
            option.params[`conditions[${index}][boolean]`] = boolean;

            for (let j = 0, sub1Condition; (sub1Condition = sub1Conditions[j]); j++) {
              const sub2Conditions = sub1Condition.conditions;
              const key = sub1Condition.key && sub1Condition.key.trim();
              const operator = sub1Condition.operator && `${sub1Condition.operator}`.trim();
              const value = sub1Condition.value && `${sub1Condition.value}`.trim();
              const subBoolean = sub1Condition.boolean;
              if (operator && value) {
                option.params[`conditions[${index}][conditions][${subIndex}][key]`] = key;
                option.params[`conditions[${index}][conditions][${subIndex}][operator]`] = operator;
                option.params[`conditions[${index}][conditions][${subIndex}][value]`] = value;
                if (subBoolean) option.params[`conditions[${index}][conditions][${subIndex}][boolean]`] = subBoolean;
                subIndex++;
              } else if (sub2Conditions) {
                const boolean = sub1Condition.boolean;
                for (let k = 0, sub2Condition; (sub2Condition = sub2Conditions[k]); k++) {
                  const key = sub2Condition.key && sub2Condition.key.trim();
                  const operator = sub2Condition.operator && `${sub2Condition.operator}`.trim();
                  const value = sub2Condition.value && `${sub2Condition.value}`.trim();
                  const sub2Boolean = sub2Condition.boolean;
                  if (boolean === "OR") option.params[`conditions[${index}][conditions][${subIndex}][boolean]`] = boolean;
                  option.params[`conditions[${index}][conditions][${subIndex}][key]`] = key;
                  option.params[`conditions[${index}][conditions][${subIndex}][operator]`] = operator;
                  option.params[`conditions[${index}][conditions][${subIndex}][value]`] = value;
                  if (sub2Boolean) option.params[`conditions[${index}][conditions][${subIndex}][boolean]`] = sub2Boolean;
                }
                subIndex++;
              }
            }
          }

          index++;
        }
      }
    }

    return new Promise((resolve, reject) => {
      dedupeRequest(
        () => HttpRequest.get(`/api/v1/board/post/${boardId}`, option),
        `/api/v1/board/post/${boardId}`,
        option.params,
        'GET'
      )
        .then((response) => {
          commit("LOAD_POST_LIST", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async LOAD_POST({ commit }, params) {
    const boardId = params.boardId;
    const postId = params.postId;
    return new Promise((resolve, reject) => {
      dedupeRequest(
        () => HttpRequest.get(`/api/v1/board/post/${boardId}/${postId}`),
        `/api/v1/board/post/${boardId}/${postId}`,
        {},
        'GET'
      )
        .then((response) => {
          commit("LOAD_POST", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  /**
   * 361 Viewer.vue 페이지에서 사용한다
   * @param commit
   * @param params
   * @returns {Promise<unknown>}
   * @constructor
   */
  // eslint-disable-next-line no-unused-vars
  async LOAD_361_SUMMARY({ commit }, params) {
    const option = {
      params: {
        projectId: params.projectId,
        targetYear: params.targetYear,
        targetMonth: params.targetMonth,
        fieldId: params.fieldId,
        companyIds: params.companyIds,
      },
    };

    return new Promise((resolve, reject) => {
      dedupeRequest(
        () => HttpRequest.get(`/api/v1/summary/post/361`, option),
        `/api/v1/summary/post/361`,
        option.params,
        'GET'
      )
        .then((response) => {
          // commit("LOAD_361_SUMMARY", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async LOAD_COMMENT_LIST({ commit }, params) {
    const boardSlug = params.boardSlug;
    const postId = params.postId;
    return new Promise((resolve, reject) => {
      dedupeRequest(
        () => HttpRequest.get(`/api/v1/board/comment/${boardSlug}/${postId}`),
        `/api/v1/board/comment/${boardSlug}/${postId}`,
        {},
        'GET'
      )
        .then((response) => {
          commit("LOAD_COMMENT_LIST", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async DELETE_POST({ commit }, params) {
    const boardId = params.boardId;
    const postId = params.postId;

    return new Promise((resolve, reject) => {
      HttpRequest.delete(`/api/v1/board/post/${boardId}/${postId}`)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async CREATE_POST({ commit }, params) {
    const option = {
      title: params.title,
      content: params.content,
      parentId: params.parentId,
      uploads: params.uploads,
      projectId: params.projectId,
      projectOrderId: params.projectOrderId, //orderId를 전송할 경우 반드시 projectId도 같이 보내야 한다.
    };

    const boardId = params.boardId;
    return new Promise((resolve, reject) => {
      HttpRequest.put(`/api/v1/board/post/${boardId}/`, option)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async UPDATE_POST({ commit }, params) {
    const option = {
      title: params.title,
      content: params.content,
      uploads: params.uploads,
      projectId: params.projectId,
      projectOrderId: params.projectOrderId, //orderId를 전송할 경우 반드시 projectId도 같이 보내야 한다.
    };

    const boardId = params.boardId;
    const postId = params.postId;

    return new Promise((resolve, reject) => {
      HttpRequest.post(`/api/v1/board/post/${boardId}/${postId}`, option)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async ADD_COMMENT({ commit }, params) {
    const option = {
      parentId: params.parentId,
      content: params.comment,
    };

    // 부모 댓글 ID가 없을 경우 변수 삭제
    if (!option.parentId || option.parentId === 0 || option.parentId === "0") {
      delete option.parentId;
    }

    const boardSlug = params.boardSlug;
    const postId = params.postId;

    return new Promise((resolve, reject) => {
      HttpRequest.put(`/api/v1/board/comment/${boardSlug}/${postId}`, option)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async UPDATE_COMMENT({ commit }, params) {
    const option = {
      content: params.comment,
    };

    const boardSlug = params.boardSlug;
    const postId = params.postId;
    const commentId = params.commentId;

    return new Promise((resolve, reject) => {
      HttpRequest.post(`/api/v1/board/comment/${boardSlug}/${postId}/${commentId}`, option)
        .then((response) => {
          commit("UPDATE_COMMENT", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async DELETE_COMMENT({ commit }, params) {
    const boardSlug = params.boardSlug;
    const postId = params.postId;
    const commentId = params.commentId;

    return new Promise((resolve, reject) => {
      HttpRequest.delete(`/api/v1/board/comment/${boardSlug}/${postId}/${commentId}`)
        .then((response) => {
          commit("DELETE_COMMENT", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async LOAD_PHOTO_LIST({ commit }, params) {
    const boardId = params.boardId;
    return new Promise((resolve, reject) => {
      dedupeRequest(
        () => HttpRequest.get(`/api/v1/photo`),
        `/api/v1/photo`,
        {},
        'GET'
      )
        .then((response) => {
          commit("LOAD_PHOTO_LIST", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async DELETE_PHOTO({ commit }, params) {
    const fileId = params.fileId;

    return new Promise((resolve, reject) => {
      HttpRequest.delete(`/api/v1/photo/${fileId}`)
        .then((response) => {
          commit("DELETE_PHOTO", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  async DELETE_PHOTO_LIST({ commit }, params) {
    const option = {
      fileIds: params.fileIds,
    };

    return new Promise((resolve, reject) => {
      HttpRequest.post("/api/v1/photo/delete", option)
        .then((response) => {
          commit("DELETE_PHOTO_LIST", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  /** 게시판 관련 첨부파일 목록 조회 */
  async LOAD_FILE_LIST({ commit }, params) {
    const boardSlug = params.boardSlug;

    const option = {
      boardSlug,
      params,
    };

    return new Promise((resolve, reject) => {
      dedupeRequest(
        () => HttpRequest.get(`/api/v1/board/${boardSlug}/attachment`, option),
        `/api/v1/board/${boardSlug}/attachment`,
        params,
        'GET'
      )
        .then((response) => {
          commit("LOAD_FILE_LIST", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  /** 게시판 관련 첨부파일 추가 */
  async UPLOAD_FILE_LIST({ commit }, params) {
    const boardSlug = params.boardSlug;

    const option = {
      uploads: JSON.stringify(params.uploads),
    };

    return new Promise((resolve, reject) => {
      HttpRequest.post(`/api/v1/board/${boardSlug}/upload`, option)
        .then((response) => {
          commit("UPLOAD_FILE_LIST", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  /** 게시판 관련 첨부파일 제거 */
  async REMOVE_FILE_LIST({ commit }, params) {
    const boardSlug = params.boardSlug;

    const option = {
      fileIds: JSON.stringify(params.fileIds),
    };

    return new Promise((resolve, reject) => {
      HttpRequest.put(`/api/v1/board/${boardSlug}/remove-attachment`, option)
        .then((response) => {
          // commit('UPLOAD_FILE_LIST', response)
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },

  /** 게시판 관련 첨부파일 다운로드 */
  async DOWNLOAD_FILE({ commit }, params) {
    const boardSlug = params.boardSlug;
    const option = {
      fileId: params.fileId,
    };

    return new Promise((resolve, reject) => {
      dedupeRequest(
        () => HttpRequest.get(`/api/v1/board/${boardSlug}/download`, option),
        `/api/v1/board/${boardSlug}/download`,
        { fileId: params.fileId },
        'GET'
      )
        .then((response) => {
          commit("DOWNLOAD_FILE", response);
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  },
};
