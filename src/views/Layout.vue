<template>
  <el-container style="height:100vh">
    <el-aside width="200px" style="background:#001529">
      <div style="color:#fff;font-size:16px;font-weight:bold;padding:20px 16px;border-bottom:1px solid #1f3a5f">
        DevOps 平台
      </div>
      <el-menu
        :default-active="$route.path"
        router
        background-color="#001529"
        text-color="#a6adb4"
        active-text-color="#fff"
      >
        <el-menu-item index="/dashboard"><el-icon><Odometer /></el-icon>仪表盘</el-menu-item>
        <el-menu-item index="/product"><el-icon><Box /></el-icon>产品管理</el-menu-item>
        <el-menu-item index="/version"><el-icon><Collection /></el-icon>版本管理</el-menu-item>
        <el-menu-item index="/repository"><el-icon><FolderOpened /></el-icon>制品仓库</el-menu-item>
        <el-menu-item index="/artifact"><el-icon><Files /></el-icon>制品类别</el-menu-item>
        <el-menu-item index="/cicd"><el-icon><Connection /></el-icon>CI/CD</el-menu-item>
        <el-menu-item index="/user"><el-icon><User /></el-icon>用户管理</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="background:#fff;display:flex;align-items:center;justify-content:flex-end;border-bottom:1px solid #e8e8e8">
        <el-dropdown @command="handleCommand">
          <span style="cursor:pointer;display:flex;align-items:center;gap:6px">
            <el-icon><UserFilled /></el-icon> {{ auth.username || '用户' }}
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main style="background:#f0f2f5;overflow:auto">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

// 如果已登录但没有用户信息，尝试获取
if (auth.isLoggedIn && !auth.user) auth.fetchUser()

async function handleCommand(cmd) {
  if (cmd === 'logout') {
    await auth.logout()
    router.push('/login')
  }
}
</script>
