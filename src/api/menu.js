import request from './request';

// 获取路由
export const getRouters = () => {
  return request({
    url: '/common/getRouters',
    method: 'get'
  });
};