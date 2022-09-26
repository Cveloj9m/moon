import router from "@/router";

/**
 * 动态路由
 * @param menu
 */
function addRoutes(menu) {
    let routes = [];
    menu.forEach(({children, path, component, auth, name, authorities}) => {
        let hasChild = Array.isArray(children) && children.length > 0;
        if (!hasChild) {
            routes.push({
                path: path,
                meta: {
                    auth: auth,
                    title: name,
                    authorities: authorities
                },
                component: () => import(`@/views/${component}.vue`)
            });
            return;
        }
        children.forEach(({path, component, name, auth, authorities}) => {
            router.addRoute({
                path: path,
                meta: {
                    auth: auth,
                    title: name,
                    authorities: authorities
                },
                component: () => import(`@/views/${component}.vue`)
            });
        });
    });

    router.addRoute(...routes,
        {
            path: '/home',
            name: 'index',
            meta: {auth: true, title: '主页展示'},
            component: () => import('@/views/Index.vue')
        },
    );
}

/**
 * 获取路由
 * @type {string}
 */
let routeMenu = sessionStorage.getItem('SUBMENU');

/**
 * 动态路由
 */
try {
    routeMenu = JSON.parse(routeMenu);
    addRoutes(routeMenu);
} catch (e) {
    routeMenu = [];
}

export default {
    state: {
        title: {
            shrink: 'MOON',
            expand: "月亮来了"
        },
        routeMenu: routeMenu,
        crumbMenu: [],      // 面包导航路由
        navsMenus: [
            {
                path: '/',
                name: '主页',
                label: '主页',
                icon: 'el-icon-odometer'
            },
        ]
    },
    mutations: {
        // 选择路由
        choiceRoute(state, route) {
            if (route.path !== '/') {
                state.crumbMenu = []
                state.routeMenu.forEach(item => {
                    if (item.path === route.path) {
                        state.crumbMenu.push(item)
                        let index = state.navsMenus.findIndex(x => x.path === item.path)
                        index === -1 ? state.navsMenus.push(item) : ''
                    } else {
                        if (item.children.length) {
                            item.children.forEach(itm => {
                                if (itm.path === route.path) {
                                    state.crumbMenu.push(item)
                                    state.crumbMenu.push(itm)
                                    let index = state.navsMenus.findIndex(x => x.path === itm.path)
                                    index === -1 ? state.navsMenus.push(itm) : ''
                                }
                            })
                        }
                    }
                })
            } else state.crumbMenu = null
        },
        // 关闭路由
        spliceRoute(state, value) {
            let index = state.navsMenus.findIndex(x => x.name === value.name)
            state.navsMenus.splice(index, 1)
        },
        // 关闭路由
        closedRoute(state) {
            state.navsMenus =
                [
                    {
                        path: '/',
                        name: 'Dashboard',
                        label: 'Dashboard',
                        icon: 'el-icon-odometer'
                    },
                ]
        },
        // 动态路由
        setRouters(state, menus) {
            addRoutes(menus);
            sessionStorage.setItem('SUBMENU', JSON.stringify(menus));
            state.routeMenu = menus;
        },
    }
}