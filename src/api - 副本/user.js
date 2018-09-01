import api from './api';
import qs from 'qs';

let user = {};

const login = function (data, success, error) {
    api.post('api/bm/login/jwt', qs.stringify(data), (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    })
};
user.login = login;

export default user;
