<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>用户管理</span>
        <el-button type="primary" @click="openDialog()">新增用户</el-button>
      </div>
    </template>
    <el-table :data="list" v-loading="loading" border>
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="authType" label="权限" width="120">
        <template #default="{ row }">
          <el-tag :type="row.authType === 'superadmin' ? 'danger' : row.authType === 'admin' ? 'warning' : row.authType === 'user' ? 'primary' : 'info'">
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

    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑用户' : '新增用户'" width="480px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" :disabled="editMode" />
        </el-form-item>
        <el-form-item label="密码" :prop="editMode ? '' : 'password'">
          <el-input v-model="form.password" type="password" show-password :placeholder="editMode ? '不修改请留空' : ''" />
        </el-form-item>
        <el-form-item label="权限" prop="authType">
          <el-select v-model="form.authType" style="width:100%">
            <el-option label="超级管理员" value="superadmin" />
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
import { computed, onMounted } from 'vue'
import { useCRUD } from '../composables/useCRUD'
import { getUsers, createUser, updateUser, deleteUser } from '../api'

const AUTH_LABELS = { superadmin: '超级管理员', admin: '管理员', user: '普通用户', guest: '访客' }
const authTypeLabel = type => AUTH_LABELS[type] || type

const rules = {
  userName: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
  authType: [{ required: true, message: '请选择权限' }]
}

const { list, loading, saving, dialogVisible, formRef, form, load, openDialog, handleSave, handleDelete } = useCRUD({
  fetchFn: getUsers,
  createFn: createUser,
  updateFn: updateUser,
  deleteFn: deleteUser,
  getDeleteId: row => row.userName,
  getDeleteLabel: row => row.userName,
  defaultForm: { authType: 'user' }
})

const editMode = computed(() => !!form.value.userName && list.value.some(u => u.userName === form.value.userName))

onMounted(load)
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
