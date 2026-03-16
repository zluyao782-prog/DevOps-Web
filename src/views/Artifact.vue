<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span>制品类别</span>
        <el-button type="primary" @click="openDialog()">新增类别</el-button>
      </div>
    </template>
    <el-table :data="list" v-loading="loading" border>
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="wayToGetType" label="获取方式" show-overflow-tooltip />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑类别' : '新增类别'" width="480px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="90px">
        <el-form-item label="类型" prop="type">
          <el-input v-model="form.type" />
        </el-form-item>
        <el-form-item label="获取方式" prop="wayToGetType">
          <el-input v-model="form.wayToGetType" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api'

const list = ref([])
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const formRef = ref()
const form = ref({})
const rules = {
  type: [{ required: true, message: '请输入类型' }],
  wayToGetType: [{ required: true, message: '请输入获取方式' }]
}

async function load() {
  loading.value = true
  try {
    const res = await getCategories()
    list.value = res?.data || res || []
  } finally { loading.value = false }
}

function openDialog(row) {
  form.value = row ? { ...row } : {}
  dialogVisible.value = true
  formRef.value?.resetFields()
}

async function handleSave() {
  await formRef.value.validate()
  saving.value = true
  try {
    if (form.value.id) await updateCategory(form.value)
    else await createCategory(form.value)
    ElMessage.success('保存成功')
    dialogVisible.value = false
    load()
  } finally { saving.value = false }
}

async function handleDelete(row) {
  await ElMessageBox.confirm(`确认删除类别 "${row.type}"？`, '提示', { type: 'warning' })
  await deleteCategory(row.id)
  ElMessage.success('删除成功')
  load()
}

onMounted(load)
</script>
