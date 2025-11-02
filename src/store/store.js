import {createStore} from "vuex";
import {User} from "@/models/user.entity.js";
import {UserService} from "@/services/user.service.js";

const userService = new UserService();

export const store = createStore({

    state: {
        // recupramos la data de user que se seteo al inicia el loggin en este caso como 'user'
        user: JSON.parse(localStorage.getItem('user')) || User,
        form: {},
        selectedProject: null // Nuevo: para el proyecto seleccionado
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        setUser(state, userId) {
            console.log('Trying to get user with ID:', userId);
            userService.getUserById(userId).then((response)=>{
                state.user = response.data;
                localStorage.setItem('user', JSON.stringify(response.data));
                console.log('User data retrieved:', response.data);
            })
            // se llama al metodo cuando el usuario se logeo y manda la data al local storage
            // para que la data persista cuando se haga un reload
        },
        removeUser( state ) {
            state.user = User;
            localStorage.removeItem('user');
        },
        removeToken( state ) {
            state.token = null;
            localStorage.removeItem('token');
        },
        updateUserCompanyName(state, companyName) {
            state.user.companyName = companyName;
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        updateForm(state, form) {
            console.log(form);
            state.form = form;
        },
        clearForm(state) {
            state.form = {};
        },
        setSelectedProject(state, project) {
            state.selectedProject = project;
        },
        clearSelectedProject(state) {
            state.selectedProject = null;
        },
    },
    actions: {
        async updateUser({ commit }, updatedUser) {
            console.log('Updating user:', updatedUser);
            commit('setUser', updatedUser.id);
        }
    }
});