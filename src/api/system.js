import request from '@/utils/request'

/**
 * 获取系统信息
 * @returns {Promise}
 */
export const getSystemInfo = () => request.get('/api/system/info')
