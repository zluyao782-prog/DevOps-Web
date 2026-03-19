import request from '@/utils/request'

/**
 * 获取 GitHub 分支
 * @param {string} owner - 仓库所有者
 * @param {string} repo - 仓库名
 * @returns {Promise}
 */
export const getBranches = (owner, repo) => request.get('/githubbranchs', { params: { owner, repo } })

/**
 * 获取 GitHub Workflows
 * @param {string} owner - 仓库所有者
 * @param {string} repo - 仓库名
 * @returns {Promise}
 */
export const getWorkflows = (owner, repo) => request.get('/githubworkflows', { params: { owner, repo } })

/**
 * 触发 Workflow
 * @param {Object} data - 触发参数
 * @returns {Promise}
 */
export const triggerWorkflow = data => request.post('/triggerworkflow', data)
