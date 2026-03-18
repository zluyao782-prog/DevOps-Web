<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>产品管理</span>
        <el-button type="primary" @click="openDialog(); loadUserOptions()">新增产品</el-button>
      </div>
    </template>
    <el-table :data="list" v-loading="loading" border>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="nameZh" label="中文名" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column prop="needShow" label="显示" width="80">
        <template #default="{ row }">
          <el-tag :type="row.needShow ? 'success' : 'info'">{{ row.needShow ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="members" label="成员" show-overflow-tooltip>
        <template #default="{ row }">{{ (row.members || []).join(', ') }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row); loadUserOptions()">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑产品' : '新增产品'" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="中文名" prop="nameZh"><el-input v-model="form.nameZh" /></el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="显示">
          <el-switch v-model="form.needShow" />
        </el-form-item>
        <el-form-item label="成员">
          <el-select v-model="form.members" multiple filterable allow-create style="width:100%">
            <el-option v-for="u in userOptions" :key="u" :label="u" :value="u" />
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
import { useCRUD } from '../composables/useCRUD'
import { getProducts, createProduct, updateProduct, deleteProduct, getUsers } from '../api'

const userOptions = ref([])
let userOptionsLoaded = false

async function loadUserOptions() {
  if (userOptionsLoaded) return
  try {
    const res = await getUsers({ page: 1, pageSize: 1000 })
    const users = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
    userOptions.value = users.map(u => u.userName)
    userOptionsLoaded = true
  } catch (e) {
    console.error('加载用户列表失败', e)
  }
}

const rules = {
  name: [{ required: true, message: '请输入名称' }],
  nameZh: [{ required: true, message: '请输入中文名' }]
}

const { list, loading, saving, dialogVisible, formRef, form, load, openDialog, handleSave, handleDelete } = useCRUD({
  fetchFn: getProducts,
  createFn: createProduct,
  updateFn: updateProduct,
  deleteFn: deleteProduct,
  defaultForm: { needShow: true, members: [] }
})

onMounted(load)
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
