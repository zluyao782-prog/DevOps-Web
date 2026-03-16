<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span>制品仓库</span>
        <el-button type="primary" @click="openDialog()">新增仓库</el-button>
      </div>
    </template>
    <el-table :data="list" v-loading="loading" border>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="地址" show-overflow-tooltip />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑仓库' : '新增仓库'" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" style="width:100%">
            <el-option label="Docker" value="docker" />
            <el-option label="APT" value="apt" />
            <el-option label="File" value="file" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="url">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" />
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
import { getRepositories, createRepository, updateRepository, deleteRepository } from '../api'

const list = ref([])
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const formRef = ref()
const form = ref({})
const rules = {
  name: [{ required: true, message: '请输入名称' }],
  type: [{ required: true, message: '请选择类型' }],
  url: [{ required: true, message: '请输入地址' }]
}

async function load() {
  loading.value = true
  try {
    const res = await getRepositories()
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
    if (form.value.id) await updateRepository(form.value)
    else await createRepository(form.value)
    ElMessage.success('保存成功')
    dialogVisible.value = false
    load()
  } finally { saving.value = false }
}

async function handleDelete(row) {
  await ElMessageBox.confirm(`确认删除仓库 "${row.name}"？`, '提示', { type: 'warning' })
  await deleteRepository(row.id)
  ElMessage.success('删除成功')
  load()
}

onMounted(load)
</script>
