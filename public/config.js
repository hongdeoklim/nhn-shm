
const PROTOCOL = window.location.protocol
const HOST_NAME = window.location.hostname
const BASE_URL = (HOST_NAME !== 'localhost' && HOST_NAME !== '192.168.0.198') ? `${PROTOCOL}//${HOST_NAME}` : 'https://nhsafe-dev.maot.kr'
const BASE_API_URL = `${BASE_URL}:8080`

const config = { BASE_URL, BASE_API_URL, HOST_NAME }
export  default config
