import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/public'
import exchange from './exchange'
import otc from './otc'
import shop from './shop'
import ieo from './ieo'
import commodity from './commodity'
import voteMining from './vote_mining'
import login from '@/public/login'
import twoverify from '@/public/twoverify'
import register from '@/public/register'
import findpwd from '@/public/findpwd'
import ResetPwd from '@/public/resetpwd'
import Withdrawsuccess from '@/public/email/withdrawsuccess'
import Linkinvalid from '@/public/email/linkinvalid'
import mycenter from '@/public/mycenter'
import Activation from '@/public/email/activation'
import Activationsuccess from '@/public/email/activationsuccess'
import maintenance from '@/public/maintenance'
import Invite from '@/public/invite'
import Download from '@/public/download'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Index,
      redirect:'/exchange'
    },
    {
      path: '/invite',
      name: 'invite',
      component: Invite
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {noEntry: true}
    },
    {
      path: '/twoverify',
      name: 'twoverify',
      component: twoverify,
      meta: {noEntry: true}
    },
    {
      path: '/register',
      name: 'register',
      component: register,
      meta: {goHome: true, noEntry: true}
    },
    {
      path: '/findpwd',
      name: 'findpwd',
      component: findpwd,
      meta: {goHome: true, noEntry: true}
    },
    {
      path: '/resetpwd',
      name: 'resetpwd',
      component: ResetPwd,
      meta: {goHome: true, noEntry: true}
    },
    {
      path: '/sendemail/:email',
      name: 'sendemail',
      component: Activation,
      meta: {goHome: true, noEntry: true}
    },
    {
      path: '/activationsuccess',
      name: 'activationsuccess',
      component: Activationsuccess,
      meta: {goHome: true, noEntry: true}
    },
    {
      path: '/withdrawsuccess',
      name: 'withdrawsuccess',
      component: Withdrawsuccess,
      meta: {goHome: true}
    },
    {
      path: '/linkinvalid',
      name: 'linkinvalid',
      component: Linkinvalid,
      meta: {goHome: true}
    },
    {
      path: '/mycenter',
      name: 'mycenter',
      component: mycenter,
      meta: {login: true}
    },
    {
      path: '/mycenter/:menu',
      name: 'mycenter_menu',
      component: mycenter,
      meta: {login: true}
    },
    {
      path: '/maintenance',
      name: 'maintenance',
      component: maintenance
    },
    {
      path: '/download',
      name: 'download',
      component: Download
    },
    {
      path: '*',
      redirect: {
        name: 'home'
      }
    }
  ].concat(exchange, otc, voteMining, shop, ieo, commodity)
})
