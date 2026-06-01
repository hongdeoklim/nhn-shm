class DateUtil {
  /**
   * timestamp를 yyyy-MM-dd 형태로 변환한다.
   * @param unix_timestamp
   * @returns {string} 변환된 날짜 데이터 (yyyy-MM-dd)
   */
  static convertTimestampToYYYYMMDD (unix_timestamp) {
    unix_timestamp = Number(unix_timestamp)
    const dateTime = new Date(unix_timestamp * 1000)
    const currentTime = new Date()

    const yyyy = dateTime.getFullYear()
    let MM = (dateTime.getMonth() + 1)
    let dd = dateTime.getDate()

    MM = (MM > 9) ? MM : `0${MM}`
    dd = (dd > 9) ? dd : `0${dd}`

    if (dateTime.getFullYear() === currentTime.getFullYear()
      && dateTime.getMonth() === currentTime.getMonth()
      && dateTime.getDate() === currentTime.getDate()) {
      return `${dateTime.getHours()  } : ${  dateTime.getMinutes()}`
    } else {
      return `${yyyy  }-${  MM  }-${  dd}`
    }
  }
}

export default DateUtil
