import request from '@/utils/request'

/**
 * 获取产品列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getProducts = (params) => request.get('/product', { params })

/**
 * 创建产品
 * @param {Object} data - 产品信息
 * @returns {Promise}
 */
export const createProduct = data => request.post('/product', data)

/**
 * 更新产品
 * @param {Object} data - 产品信息
 * @returns {Promise}
 */
export const updateProduct = data => request.put('/product', data)

/**
 * 删除产品
 * @param {number|string} id - 产品ID
 * @returns {Promise}
 */
export const deleteProduct = id => request.delete('/product', { params: { id } })
