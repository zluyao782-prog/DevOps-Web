import request from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码（已加密）
 * @returns {Promise}
 */
export const login = data => request.post('/login', data)

/**
 * 用户登出
 * @returns {Promise}
 */
export const logout = () => request.post('/logout')

/**
 * 获取用户信息
 * @returns {Promise}
 */
export const getUserInfo = () => request.get('/user_info')

/**
 * 校验 Token 有效性
 * @returns {Promise}
 */
export const checkToken = () => request.get('/check_token')
