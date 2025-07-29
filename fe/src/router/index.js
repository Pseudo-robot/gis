import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '../components/Login.vue'
import MapApp from '../components/MapApp.vue'
import Home from '../components/Home.vue'
import TestLogin from '../components/TestLogin.vue'
import Register from '../components/Register.vue'
import ExampleAuthUsage from '../components/ExampleAuthUsage.vue'
import EndpointTester from '../components/EndpointTester.vue'
import DetailedEndpointTester from '../components/DetailedEndpointTester.vue'
import NetworkDebugger from '../components/NetworkDebugger.vue'
import TokenStatus from '../components/TokenStatus.vue'
import LoginTester from '../components/LoginTester.vue'
import LoginEndpointTester from '../components/LoginEndpointTester.vue'
import ResponseStructureTester from '../components/ResponseStructureTester.vue'
import DeepLoginTester from '../components/DeepLoginTester.vue'
import NativeFetchTester from '../components/NativeFetchTester.vue'
import PostmanTester from '../components/PostmanTester.vue'
import AlternativeLoginTester from '../components/AlternativeLoginTester.vue'
import CurlCommandTester from '../components/CurlCommandTester.vue'
import TokenDiscoveryTester from '../components/TokenDiscoveryTester.vue'
import CookieDebugger from '../components/CookieDebugger.vue'
import DomainTester from '../components/DomainTester.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/test',
    name: 'TestLogin',
    component: TestLogin
  },
  {
    path: '/endpoint-tester',
    name: 'EndpointTester',
    component: EndpointTester
  },
  {
    path: '/detailed-tester',
    name: 'DetailedEndpointTester',
    component: DetailedEndpointTester
  },
  {
    path: '/network-debugger',
    name: 'NetworkDebugger',
    component: NetworkDebugger
  },
  {
    path: '/token-status',
    name: 'TokenStatus',
    component: TokenStatus
  },
  {
    path: '/login-tester',
    name: 'LoginTester',
    component: LoginTester
  },
  {
    path: '/login-endpoint-tester',
    name: 'LoginEndpointTester',
    component: LoginEndpointTester
  },
  {
    path: '/response-structure-tester',
    name: 'ResponseStructureTester',
    component: ResponseStructureTester
  },
  {
    path: '/deep-login-tester',
    name: 'DeepLoginTester',
    component: DeepLoginTester
  },
  {
    path: '/native-fetch-tester',
    name: 'NativeFetchTester',
    component: NativeFetchTester
  },
  {
    path: '/postman-tester',
    name: 'PostmanTester',
    component: PostmanTester
  },
  {
    path: '/alternative-login-tester',
    name: 'AlternativeLoginTester',
    component: AlternativeLoginTester
  },
  {
    path: '/curl-command-tester',
    name: 'CurlCommandTester',
    component: CurlCommandTester
  },
  {
    path: '/token-discovery-tester',
    name: 'TokenDiscoveryTester',
    component: TokenDiscoveryTester
  },
  {
    path: '/cookie-debugger',
    name: 'CookieDebugger',
    component: CookieDebugger
  },
  {
    path: '/domain-tester',
    name: 'DomainTester',
    component: DomainTester
  },
  {
    path: '/example',
    name: 'ExampleAuth',
    component: ExampleAuthUsage,
    meta: { requiresAuth: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/map',
    name: 'MapApp',
    component: MapApp,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    name: 'Root',
    redirect: '/home'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory('/peta'),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Use authStore to check authentication
  const authStore = useAuthStore()
  const isAuthenticated = await authStore.checkAuth()

  console.log('Route guard - to:', to.path, 'isAuthenticated:', isAuthenticated)

  // Route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Redirecting to login')
    next('/login')
    return
  }

  // Route requires guest (not authenticated)
  if (to.meta.requiresGuest && isAuthenticated) {
    console.log('Redirecting to home')
    next('/home')
    return
  }
  
  // If authenticated and trying to access root path, redirect to home
  if (isAuthenticated && to.path === '/') {
    console.log('Authenticated user accessing root, redirecting to home')
    next('/home')
    return
  }

  // Special handling for register page - allow access regardless of auth status
  if (to.path === '/register') {
    console.log('Allowing access to register page')
    next()
    return
  }

  next()
})

export default router 