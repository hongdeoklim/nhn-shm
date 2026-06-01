/**
 * API 요청 중복 방지 유틸리티
 * 동일한 요청이 진행 중일 때 기존 Promise를 재사용합니다.
 * (영구 캐싱 없음, 요청 완료 시 즉시 제거)
 */

const pendingRequests = new Map()

/**
 * 요청 파라미터를 정렬하여 캐시 키 생성
 * @param {string} url - API 엔드포인트
 * @param {object} params - 요청 파라미터 (body 또는 query params)
 * @param {string} method - HTTP 메서드 (GET, POST 등)
 * @returns {string} 캐시 키
 */
function createRequestKey(url, params = {}, method = 'GET') {
  // 파라미터를 키 기준으로 정렬하여 일관된 키 생성
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key]
      return acc
    }, {})

  return `${method}::${url}::${JSON.stringify(sortedParams)}`
}

/**
 * 중복 요청 방지를 적용한 HTTP 요청 래퍼
 * @param {Function} requestFn - 실제 HTTP 요청 함수 (Promise 반환)
 * @param {string} url - API 엔드포인트
 * @param {object} params - 요청 파라미터
 * @param {string} method - HTTP 메서드
 * @returns {Promise} API 응답 Promise
 */
export function dedupeRequest(requestFn, url, params = {}, method = 'GET') {
  const requestKey = createRequestKey(url, params, method)

  // 진행 중인 요청이 있으면 해당 Promise 반환
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey)
  }

  // 새로운 요청 생성
  const promise = requestFn()
    .then(response => {
      // 성공 시 진행 중인 요청 목록에서 제거
      pendingRequests.delete(requestKey)
      return response
    })
    .catch(error => {
      // 실패 시 진행 중인 요청 목록에서 제거
      pendingRequests.delete(requestKey)
      throw error
    })

  // 진행 중인 요청으로 등록
  pendingRequests.set(requestKey, promise)

  return promise
}

/**
 * 특정 요청 키의 캐시 삭제
 * @param {string} url - API 엔드포인트
 * @param {object} params - 요청 파라미터
 * @param {string} method - HTTP 메서드
 */
export function clearRequest(url, params = {}, method = 'GET') {
  const requestKey = createRequestKey(url, params, method)
  pendingRequests.delete(requestKey)
}

/**
 * 모든 진행 중인 요청 캐시 삭제
 */
export function clearAllRequests() {
  pendingRequests.clear()
}

/**
 * 현재 진행 중인 요청 개수 반환
 */
export function getPendingCount() {
  return pendingRequests.size
}

export default {
  dedupeRequest,
  clearRequest,
  clearAllRequests,
  getPendingCount
}

