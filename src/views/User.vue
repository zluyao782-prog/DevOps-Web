<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span>用户管理</span>
        <el-button type="primary" @click="openDialog()">新增用户</el-button>
      </div>
    </template>
    <el-table :data="list" v-loading="loading" border>
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="authType" label="权限" width="100">
        <template #default="{ row }">
          <el-tag :type="row.authType === 'admin' ? 'danger' : row.authType === 'user' ? 'primary' : 'info'">
            {{ authTypeLabel(row.authType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="form.username ? '编辑用户' : '新增用户'" width="480px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="!!editMode" />
        </el-form-item>
        <el-form-item label="密码" :prop="editMode ? '' : 'password'">
          <el-input v-model="form.password" type="password" show-password :placeholder="editMode ? '不修改请留空' : ''" />
        </el-form-item>
        <el-form-item label="权限" prop="authType">
          <el-select v-model="form.authType" style="width:100%">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
            <el-option label="访客" value="guest" />
          </el-select>
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
import { getUsers, createUser, updateUser, deleteUser, encryptPassword } from '../api'

const list = ref([])
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref()
const form = ref({})
const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
  authType: [{ required: true, message: '请选择权限' }]
}

function authTypeLabel(t) {
  return { admin: '管理员', user: '普通用户', guest: '访客' }[t] || t
}

async function load() {
  loading.value = true
  try {
    const res = await getUsers()
    list.value = res?.data || res || []
  } finally { loading.value = false }
}

function openDialog(row) {
  editMode.value = !!row
  form.value = row ? { ...row, password: '' } : { authType: 'user' }
  dialogVisible.value = true
  formRef.value?.resetFields()
}

async function handleSave() {
  await formRef.value.validate()
  saving.value = true
  try {
    const payload = { ...form.value }
    if (payload.password) payload.password = encryptPassword(payload.password)
    else delete payload.password
    if (editMode.value) await updateUser(payload)
    else await createUser(payload)
    ElMessage.success('保存成功')
    dialogVisible.value = false
    load()
  } finally { saving.value = false }
}

async function handleDelete(row) {
  await ElMessageBox.confirm(`确认删除用户 "${row.username}"？`, '提示', { type: 'warning' })
  await deleteUser(row.username)
  ElMessage.success('删除成功')
  load()
}

onMounted(load)
</script>
