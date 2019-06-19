import Index from '@/shop/index'
import Pay from '@/shop/pay'
import Clause from '@/shop/clause'

const routes = [
  {
    path: '/shop',
    name: 'shop_index',
    component: Index,
    meta: {login: true}
  },
  {
    path: '/shop/pay',
    name: 'shop_pay',
    component: Pay,
    meta: {login: true}
  },
  {
    path: '/shop/clause',
    name: 'shop_clause',
    component: Clause,
    meta: {login: true}
  }
]

export default routes
