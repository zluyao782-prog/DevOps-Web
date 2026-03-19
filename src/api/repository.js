import request from '@/utils/request'

// Artifact Repository

/**
 * 获取制品库列表
 * @returns {Promise}
 */
export const getRepositories = () => request.get('/artifact_repository')

/**
 * 创建制品库
 * @param {Object} data - 制品库信息
 * @returns {Promise}
 */
export const createRepository = data => request.post('/artifact_repository', data)

/**
 * 更新制品库
 * @param {Object} data - 制品库信息
 * @returns {Promise}
 */
export const updateRepository = data => request.put('/artifact_repository', data)

/**
 * 删除制品库
 * @param {number|string} id - 制品库ID
 * @returns {Promise}
 */
export const deleteRepository = id => request.delete('/artifact_repository', { params: { id } })

// Artifact Category

/**
 * 获取制品库分类列表
 * @returns {Promise}
 */
export const getCategories = () => request.get('/artifact_category')

/**
 * 创建制品库分类
 * @param {Object} data - 分类信息
 * @returns {Promise}
 */
export const createCategory = data => request.post('/artifact_category', data)

/**
 * 更新制品库分类
 * @param {Object} data - 分类信息
 * @returns {Promise}
 */
export const updateCategory = data => request.put('/artifact_category', data)

/**
 * 删除制品库分类
 * @param {number|string} id - 分类ID
 * @returns {Promise}
 */
export const deleteCategory = id => request.delete('/artifact_category', { params: { id } })
