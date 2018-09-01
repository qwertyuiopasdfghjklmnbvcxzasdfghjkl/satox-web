import Vue from 'vue';
import Dialog from './dialog';

const KoallDialog = Vue.extend(Dialog);

Vue.$koallDialog = function (opts) {
    opts = opts || {};
    var dialog = new KoallDialog({
        el: document.createElement('div'),
        propsData: opts
    });
    document.body.appendChild(dialog.$el);
    return dialog;
};

export default Dialog;
