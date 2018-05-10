import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import login from '@/components/login'
import myFriend from '@/components/contacts/myFriend'
import myGroups from '@/components/contacts/myGroups'
import personal from '@/components/setting/personal'
import myMessage from '@/components/myMessage/myMessage'

Vue.use(Router);

export default new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      name: 'login',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      children:[{
        path:'/home/myFriend',
        name:'myFriend',
        component:myFriend
      },{
        path:'/home/personal',
        name:'personal',
        component:personal
      },{
        path:'/home/myMessage',
        name:'myMessage',
        component:myMessage
      },{
        path:'/home/myGroups',
        name:'myGroups',
        component:myGroups
      }]
    }
  ]
})
