import list from '../public/note/list'
import detail from '../public/note/detail'

export default [
  {
    path: '/note/list',
    name: 'note_list',
    component: list
  },
  {
    path: '/note/detail',
    name: 'note_detail',
    component: detail
  }
]
