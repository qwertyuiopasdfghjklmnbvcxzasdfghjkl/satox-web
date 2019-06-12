import api from './api';

let report = {
    // 报表文件列表
    getFileList (data, success, error) {
        api.get('api/bm/statistic/files', data, (res) => {
            if (res.rst === 1) {
                success && success(res.data, res.total);
            } else {
                error && error(res.msg);
            }
        }, error);
    }
};

export default report;
