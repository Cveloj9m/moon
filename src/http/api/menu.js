import vuex from "../store";
import http from "@/utils/http";

export const initMenu = (router, store) => {
    if (vuex.state.layout.routeMenu.length === 0) {
        http.get('/auth/submenu').then(response => {
            if (response && response.status == 200) {
                store.commit('setRouters', response.data);
            }
        })
    }
}


