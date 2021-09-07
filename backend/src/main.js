import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import ElementPlus from 'element-plus'

import App from './App.vue';
import axios from 'axios';

import Registration from './Registration.vue';
import Login from './Login.vue';
import Events from './Events.vue';
import SingleEvent from "./SingleEvent";
import UserProfile from "./UserProfile";
import CreateEvent from "./CreateEvent";
import MyEvents from "./MyEvents";
import AttendanceControl from "./AttendanceControl";

const routes = [

    // users
    {
        path: "/users/register",
        name: "register",
        component: Registration
    },
    {
        path: "/users/login",
        name: "login",
        component: Login
    },
    {
        path:"/users/:userId",
        name: "user-profile",
        component: UserProfile
    },

    // events
    {
        path:"/events/:eventId",
        name: "event",
        component:SingleEvent
    },
    {
        path: "/events",
        name: "events",
        component: Events
    },
    {
        path: "/events/createEvent",
        name: "createEvent",
        component: CreateEvent
    },
    {
        path: "/events/myEvents/:userId",
        name: "myEvents",
        component: MyEvents
    },

    {
        path: "/events/:eventId/attendanceControl/:orgId",
        name: "attendanceControl",
        component: AttendanceControl
    },
];

const router = createRouter({
    routes,
    history: createWebHistory()
});

const app = createApp(App);

app.use(router);
app.use(ElementPlus);

app.config.globalProperties.axios = axios;
app.mount('#app');