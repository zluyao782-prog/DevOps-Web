import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * 通用 CRUD 组合式函数
 * @param {Object} options
 * @param {Function} options.fetchFn - 获取列表的 API 函数
 * @param {Function} options.createFn - 创建的 API 函数
 * @param {Function} options.updateFn - 更新的 API 函数
 * @param {Function} options.deleteFn - 删除的 API 函数
 * @param {Function} options.getDeleteId - 从 row 中获取删除参数，默认取 row.id
 * @param {Function} options.getDeleteLabel - 从 row 中获取删除确认文案
 * @param {Object} options.defaultForm - 新增时的默认表单值
 */
export function useCRUD({ fetchFn, createFn, updateFn, deleteFn, getDeleteId, getDeleteLabel, defaultForm = {} }) {
  const list = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const dialogVisible = ref(false)
  const formRef = ref()
  const form = ref({ ...defaultForm })

  async function load(params) {
    loading.value = true
    try {
      const res = await fetchFn(params)
      // 依次尝试常见的数组字段，最终兜底为空数组
      const data = Array.isArray(res) ? res
        : Array.isArray(res?.data) ? res.data
        : Array.isArray(res?.list) ? res.list
        : Array.isArray(res?.items) ? res.items
        : []
      list.value = data
    } catch (e) {
      console.error('加载数据失败', e)
      list.value = []
    } finally {
      loading.value = false
    }
  }

  function openDialog(row) {
    form.value = row ? { ...row } : { ...defaultForm }
    dialogVisible.value = true
    // nextTick 后重置，避免 formRef 未挂载
    setTimeout(() => formRef.value?.resetFields(), 0)
  }

  async function handleSave() {
    await formRef.value.validate()
    saving.value = true
    try {
      if (form.value.id) await updateFn(form.value)
      else await createFn(form.value)
      ElMessage.success('保存成功')
      dialogVisible.value = false
      await load()
    } finally {
      saving.value = false
    }
  }

  async function handleDelete(row) {
    const label = getDeleteLabel ? getDeleteLabel(row) : (row.name || row.id)
    await ElMessageBox.confirm(`确认删除 "${label}"？`, '提示', { type: 'warning' })
    const id = getDeleteId ? getDeleteId(row) : row.id
    await deleteFn(id)
    ElMessage.success('删除成功')
    await load()
  }

  return { list, loading, saving, dialogVisible, formRef, form, load, openDialog, handleSave, handleDelete }
}
