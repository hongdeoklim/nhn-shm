/**
 * IndexedDB 기반 API 캐시 관리
 * 페이지 새로고침 후에도 캐시가 유지됩니다.
 */

const DB_NAME = 'MAOT_API_Cache'
const DB_VERSION = 1
const STORE_NAME = 'api_responses'

class CacheDB {
  constructor() {
    this.db = null
    this.initPromise = this.init()
  }

  /**
   * IndexedDB 초기화
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        console.error('[CacheDB] 초기화 실패:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // 기존 store가 있으면 삭제
        if (db.objectStoreNames.contains(STORE_NAME)) {
          db.deleteObjectStore(STORE_NAME)
        }

        // 새 object store 생성
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'cacheKey' })
        
        // timestamp 인덱스 생성 (만료된 항목 정리용)
        objectStore.createIndex('timestamp', 'timestamp', { unique: false })
      }
    })
  }

  /**
   * DB가 준비될 때까지 대기
   */
  async ensureDB() {
    if (!this.db) {
      await this.initPromise
    }
    return this.db
  }

  /**
   * 캐시 저장
   * @param {string} cacheKey - 캐시 키
   * @param {any} data - 저장할 데이터
   * @param {number} timestamp - 저장 시간
   */
  async set(cacheKey, data, timestamp) {
    try {
      await this.ensureDB()

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite')
        const objectStore = transaction.objectStore(STORE_NAME)

        const request = objectStore.put({
          cacheKey,
          data,
          timestamp
        })

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('[CacheDB] 저장 실패:', error)
    }
  }

  /**
   * 캐시 조회
   * @param {string} cacheKey - 캐시 키
   * @returns {Promise<{data: any, timestamp: number}|null>}
   */
  async get(cacheKey) {
    try {
      await this.ensureDB()

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readonly')
        const objectStore = transaction.objectStore(STORE_NAME)
        const request = objectStore.get(cacheKey)

        request.onsuccess = () => {
          const result = request.result
          if (result) {
            resolve({ data: result.data, timestamp: result.timestamp })
          } else {
            resolve(null)
          }
        }

        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('[CacheDB] 조회 실패:', error)
      return null
    }
  }

  /**
   * 캐시 삭제
   * @param {string} cacheKey - 캐시 키
   */
  async delete(cacheKey) {
    try {
      await this.ensureDB()

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite')
        const objectStore = transaction.objectStore(STORE_NAME)
        const request = objectStore.delete(cacheKey)

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('[CacheDB] 삭제 실패:', error)
    }
  }

  /**
   * 만료된 캐시 정리
   * @param {number} ttl - TTL (밀리초)
   */
  async cleanExpired(ttl) {
    try {
      await this.ensureDB()

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite')
        const objectStore = transaction.objectStore(STORE_NAME)
        const index = objectStore.index('timestamp')
        
        const now = Date.now()
        const expireTime = now - ttl

        const request = index.openCursor()
        let deletedCount = 0

        request.onsuccess = (event) => {
          const cursor = event.target.result
          if (cursor) {
            if (cursor.value.timestamp < expireTime) {
              cursor.delete()
              deletedCount++
            }
            cursor.continue()
          } else {
            resolve(deletedCount)
          }
        }

        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('[CacheDB] 만료 캐시 정리 실패:', error)
      return 0
    }
  }

  /**
   * 모든 캐시 삭제
   */
  async clear() {
    try {
      await this.ensureDB()

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite')
        const objectStore = transaction.objectStore(STORE_NAME)
        const request = objectStore.clear()

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('[CacheDB] 전체 삭제 실패:', error)
    }
  }

  /**
   * 캐시 개수 조회
   */
  async count() {
    try {
      await this.ensureDB()

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readonly')
        const objectStore = transaction.objectStore(STORE_NAME)
        const request = objectStore.count()

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('[CacheDB] 개수 조회 실패:', error)
      return 0
    }
  }
}

// 싱글톤 인스턴스
const cacheDB = new CacheDB()

export default cacheDB

