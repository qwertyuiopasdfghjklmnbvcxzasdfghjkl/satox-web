import Vue from 'vue'
import MessageBox from './messageTipBox'
import utils from '@/assets/js/utils'

Vue.$koallTipBox = function (opts) {
  opts = opts || {}
  if (!opts.id) {
    opts.id = 'message_tip_box'
  }
  if (opts.id && document.getElementById(opts.id)) {
    return
  }
  utils.setDialog(MessageBox, opts)
}

export default MessageBox
