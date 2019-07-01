const routes = [
  {
    path: '/ieo',
    name: 'ieo_index',
    component: () => import('@/ieo/')
  },
  {
    path: '/ieo/detail/:id',
    name: 'ieo_detail',
    component: () => import('@/ieo/detail')
  },
  {
    path: '/ieo/agreement',
    name: 'ieo_agreement',
    component: () => import('@/ieo/agreement')
  },
]

export default routes
