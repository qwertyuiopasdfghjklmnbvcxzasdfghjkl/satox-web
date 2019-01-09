import voteMiningIndex from '@/vote_mining/index'
import voteMiningProfit from '@/vote_mining/profit'

const routes = [
  {
    path: '/vote_mining',
    name: voteMiningIndex.name,
    component: voteMiningIndex
  },
  {
    path: '/vote_mining/profit',
    name: voteMiningProfit.name,
    component: voteMiningProfit,
    meta: {login: true}
  },
]

export default routes
