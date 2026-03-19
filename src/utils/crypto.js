import CryptoJS from 'crypto-js'

// 从环境变量读取密钥，移除硬编码的回退值以提高安全性
const AES_KEY = import.meta.env.VITE_AES_KEY

if (!AES_KEY) {
  console.warn('VITE_AES_KEY need to be set in .env file')
}

/**
 * 加密密码
 * @param {string} password - 原始密码
 * @returns {{ password: string, iv: string }} - 加密结果，password 和 iv 均为 Base64 格式
 */
export function encryptPassword(password) {
  if (!AES_KEY) {
    throw new Error('Encryption key is missing')
  }

  // 确保 Key 长度符合要求 (16字节)
  const key = CryptoJS.enc.Utf8.parse(AES_KEY.padEnd(16, '0').slice(0, 16))

  // 生成随机 IV (16字节)
  const iv = CryptoJS.lib.WordArray.random(16)

  // 使用 AES-CBC 模式加密
  const encrypted = CryptoJS.AES.encrypt(password, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  // 后端期望格式：password(base64) 和 iv(base64) 分开传
  return {
    password: encrypted.toString(),           // Base64 密文
    iv: iv.toString(CryptoJS.enc.Base64)      // Base64 IV
  }
}
