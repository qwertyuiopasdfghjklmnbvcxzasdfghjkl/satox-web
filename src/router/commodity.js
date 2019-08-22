import Commodity from '@/commodity/home'
const routes = [
  {
    path: '/commodity/:symbol',
    name: 'commodity_index',
    component: Commodity
  },
  {
    path: '/commodity',
    name: 'commodity_index2',
    component: Commodity
  },
]

export default routes
