import axios from "@/axios.js";
import VueCookie from "vue-cookie";
import config from "../../public/config";
const resourceHost = config.BASE_API_URL;

class HttpRequest {
  static isErrorAlert = false;

  static sendRequest(type, url, param, hideErrorAlert) {
    switch (type) {
      case "get":
        return this.get(url, param, hideErrorAlert);
      case "put":
        return this.put(url, param, hideErrorAlert);
      case "post":
        return this.post(url, param, hideErrorAlert);
      case "delete":
        return this.delete(url, param, hideErrorAlert);
      // case 'patch': return this.patch(url, param);
      default: {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve) => false);
      }
    }
  }

  static get(url, param, hideErrorAlert) {
    this.verifyAccessToken();
    url = `${resourceHost}${url}`;
    return new Promise((resolve, reject) => {
      axios
      .get(url, param)
      .then((response) => {
        response = this.combineKeyValueList(response);
        resolve(response);
      })
      .catch((err) => {
        this.tooManyRequest(err, hideErrorAlert);
        reject(err);
      });
    });
  }

  static put(url, param, hideErrorAlert) {
    this.verifyAccessToken();
    url = `${resourceHost}${url}`;
    return new Promise((resolve, reject) => {
      axios
        .put(url, param)
        .then((response) => {
          response = this.combineKeyValueList(response);
          resolve(response);
        })
        .catch((err) => {
          this.tooManyRequest(err, hideErrorAlert);
          reject(err);
        });
    });
  }

  static none_token_put(url, param, hideErrorAlert) {
    url = `${resourceHost}${url}`;
    return new Promise((resolve, reject) => {
      axios
        .put(url, param)
        .then((response) => {
          response = this.combineKeyValueList(response);
          resolve(response);
        })
        .catch((err) => {
          this.tooManyRequest(err, hideErrorAlert);
          reject(err);
        });
    });
  }

  static post(url, param, hideErrorAlert) {
    this.verifyAccessToken();
    url = `${resourceHost}${url}`;
    return new Promise((resolve, reject) => {
      axios
        .post(url, param)
        .then((response) => {
          response = this.combineKeyValueList(response);
          resolve(response);
        })
        .catch((err) => {
          this.tooManyRequest(err, hideErrorAlert);
          reject(err);
        });
    });
  }

  static none_token_post(url, param, hideErrorAlert) {
    url = `${resourceHost}${url}`;
    return new Promise((resolve, reject) => {
      axios
        .post(url, param)
        .then((response) => {
          response = this.combineKeyValueList(response);
          resolve(response);
        })
        .catch((err) => {
          this.tooManyRequest(err, hideErrorAlert);
          reject(err);
        });
    });
  }

  static delete(url, param, hideErrorAlert) {
    this.verifyAccessToken();
    url = `${resourceHost}${url}`;
    return new Promise((resolve, reject) => {
      axios
        .delete(url, param)
        .then((response) => {
          response = this.combineKeyValueList(response);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * 서버에서 전송되는 데이터 양을 줄이기 위해서 key 값과 value 값을 분리해서
   * 2개의 배열로 나눠서 전송할 수 있다.
   * 이 경우 분리된 key, value 값을 하나의 오브젝트로 결합하는 역할을 수행한다.
   * @param response
   * @returns {*}
   */
  static combineKeyValueList(response) {
    // 데이터가 존재하지 않으면 처리하지 않는다
    if (typeof response.data === "undefined") {
      return response;
    } else return response.data;

    // eslint-disable-next-line no-unreachable
    const data = response.data;

    // 반환된 데이터가 key, data 두 개의 키를 가진 object 일 경우에만 변환하도록 한다.
    if (
      Object.keys(data).length === 2 &&
      data.hasOwnProperty("key") &&
      data.hasOwnProperty("data")
    ) {
      const oldKey = data.key;
      const oldData = data.data;
      const newData = [];

      // 한 줄 한 줄 변경한다..
      // 이로 인해서 클라이언트 쪽의 연산량은 늘어났지만 서버와 통신량이 줄어든다
      for (const oldDataRow of oldData) {
        const newDataRow = {};
        const keySize = oldKey.length;
        for (let i = 0; i < keySize; i++) {
          const key = oldKey[i];
          newDataRow[key] = oldDataRow[i];
        }
        newData.push(newDataRow);
      }

      // 변환된 데이터로 교체한다
      response.data = newData;
    }

    return response;
  }

  static verifyAccessToken() {
    try {
      const token = VueCookie.get("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (err) {
      axios.defaults.headers.common["Authorization"] = "";
    }
  }

  static getErrorMessage(response) {
    const data = response && response.data;
    if (typeof data === "string") return data;
    if (data && data.error && data.error.message) return data.error.message;
    return "오류가 발생했습니다";
  }

  static async tooManyRequest(err, hideErrorAlert) {
    if (this.isErrorAlert) return;
    this.isErrorAlert = true;

    const response = err && err.response;
    if (!response) {
      if (!hideErrorAlert) {
        const customAlert = new CustomEvent("customAlert", {
          detail: {
            title: "오류가 발생했습니다",
            message:
              (err && err.message) ||
              "네트워크 오류가 발생했습니다. 연결 상태를 확인해주세요.",
          },
        });
        window.dispatchEvent(customAlert);
      }
      this.isErrorAlert = false;
      return;
    }

    if (response.status === 401) {
      const isProfileDropDown = document.getElementById("ProfileDropDown");
      if (!isProfileDropDown) this.isErrorAlert = false;
      else {
        const logout = new CustomEvent("logout");
        window.dispatchEvent(logout);

        setTimeout(() => (this.isErrorAlert = false), 1000);
      }
    } else if (response.status === 429) {
      alert("짧은 시간동안 서버에 너무 많은 요청을 하였습니다. \n1분 뒤 다시 시도해주세요.");
      this.isErrorAlert = false;
    } else {
      if (hideErrorAlert) {
        this.isErrorAlert = false;
        return;
      }

      const isCheckAlertDialog = document.getElementById("checkAlertDialog");
      if (isCheckAlertDialog) return;

      const errMessage = this.getErrorMessage(response);

      if (response.status === 422) {
        // 토큰 정보가 일치하지 않을 때
      } else if (errMessage === 'This user is not included in the project'
        || errMessage === '대상 프로젝트를 찾을 수 없습니다'
        || errMessage === '프로젝트 권한이 없습니다') {
        // 프로젝트에 참여하지 않았을 경우,
        const customAlert = new CustomEvent("customAlert", {
          detail: {
            title: "오류가 발생했습니다",
            message: "프로젝트 권한이 없습니다",
            cancelFunction: () => {
              window.location.href = "/";
            },
          },
        });
        window.dispatchEvent(customAlert);
        this.isErrorAlert = false;
      } else {
        const customAlert = new CustomEvent("customAlert", {
          detail: {
            title: '오류가 발생했습니다',
            message: this.getErrorMessage(response),
          },
        });
        window.dispatchEvent(customAlert);
        this.isErrorAlert = false;
      }
    }
  }
}

export default HttpRequest;
