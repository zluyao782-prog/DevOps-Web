import request from '@/utils/request'

/**
 * 获取版本列表
 * @param {number|string} productId - 产品ID
 * @returns {Promise}
 */
export const getVersions = (productId) => request.get('/version', { params: { productId } })

/**
 * 创建版本
 * @param {Object} data - 版本信息
 * @returns {Promise}
 */
export const createVersion = data => request.post('/version', data)

/**
 * 更新版本
 * @param {Object} data - 版本信息
 * @returns {Promise}
 */
export const updateVersion = data => request.put('/version', data)

/**
 * 删除版本
 * @param {number|string} id - 版本ID
 * @returns {Promise}
 */
export const deleteVersion = id => request.delete('/version', { params: { id } })
