import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // 进度条
import 'nprogress/nprogress.css'; // 进度条样式
import { getToken } from '@/utils/auth'; // 读取token
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({ showSpinner: false });
// 白名单
const whiteList = ['/login'];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  document.title = getPageTitle(to.meta.title);
  const hasToken = getToken();
  // 存在 token 说明已经登录
  if (hasToken) {
    // 登录过就不用再访问登录界面，去往主页即可
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      // 保存在store中路由不为空则放行 (如果执行了刷新操作，则 store 里的路由为空，此时需要重新添加路由)
      // 判断当前用户是否已拉取完user_info信息
      if (store.getters.permission_routes.length) {
        //放行
        next();
      } else {
        store.dispatch('user/getInfo').then(res => {
          // 拉取userInfo
          const roles = res.roles;
          store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            router.addRoutes(accessRoutes); // 动态添加可访问路由表
            next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
          });
        })
          .catch(err => {
            store.dispatch('user/logout').then(() => {
              Message.error(err);
              next({ path: '/' });
            });
          });
      }
    }
  } else {
    // 不存在Token，查看是否在白名单里存在，存在则直接进入页面，不存在重定向到login
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
