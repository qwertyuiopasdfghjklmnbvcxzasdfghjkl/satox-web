import list from '../public/notice/list'
import detail from '../public/notice/detail'

export default [
  {
    path: '/notice/list',
    name: 'note_list',
    component: list
  },
  {
    path: '/notice/detail',
    name: 'note_detail',
    component: detail
  }
]
