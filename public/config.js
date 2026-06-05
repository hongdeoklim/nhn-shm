const PROTOCOL = window.location.protocol
const HOST_NAME = window.location.hostname
const IS_LOCAL = HOST_NAME === 'localhost' || HOST_NAME === '192.168.0.198'
// 로컬: vue devServer 프록시(/api, /storage). 배포: 동일 origin + vercel.json /api 프록시
const BASE_URL = IS_LOCAL ? '' : `${PROTOCOL}//${HOST_NAME}`
const BASE_API_URL = BASE_URL

const config = { BASE_URL, BASE_API_URL, HOST_NAME }
export default config
