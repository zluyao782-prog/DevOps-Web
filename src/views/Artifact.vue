<template>
  <el-card>
    <template #header>
      <div class="card-header">
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
        <el-form-item label="类型" prop="type"><el-input v-model="form.type" /></el-form-item>
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
import { onMounted } from 'vue'
import { useCRUD } from '../composables/useCRUD'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api'

const rules = {
  type: [{ required: true, message: '请输入类型' }],
  wayToGetType: [{ required: true, message: '请输入获取方式' }]
}

const { list, loading, saving, dialogVisible, formRef, form, load, openDialog, handleSave, handleDelete } = useCRUD({
  fetchFn: getCategories,
  createFn: createCategory,
  updateFn: updateCategory,
  deleteFn: deleteCategory,
  getDeleteLabel: row => row.type
})

onMounted(load)
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
