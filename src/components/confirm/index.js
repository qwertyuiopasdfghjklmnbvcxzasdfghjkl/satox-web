import Vue from 'vue'
import Confirm from './confirm'
import utils from '@/assets/js/utils'

let tempIds = {}

Vue.$confirmDialog = function (opts) {
  opts = opts || {}
  if (opts.id && tempIds[opts.id]) {
    return
  }
  opts.id && (tempIds[opts.id] = true)
  opts['tempIds'] = tempIds
  utils.setDialog(Confirm, opts)
}

export default Confirm
