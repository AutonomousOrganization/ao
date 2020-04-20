import Vue from 'vue'
import VueRouter from 'vue-router'

import Deck from './components/Deck'

import Access from './components/Access'
import Connect from './components/Connect'
import Accounts from './components/Accounts'
import Lightning from './components/Lightning'
import Reserve from './components/Reserve'


import Oracle from './components/Oracle'
import Port from './components/Port'
import Bounties from './components/Bounties'
import Upcoming from './components/Upcoming'

import Checkmarks from './components/Checkmarks'
import Payments from './components/Payments'
import Planning from './components/Planning'
import Zen from './components/Zen'
import Priorities from './components/Priorities'

Vue.use(VueRouter)

const routes =[{
  path: '/',
  component: Deck,
  meta: { title: "Autonomous Organization" },
  children: [
    {
      path: 'doge',
      component: Zen
    },
    {
      path: 'boat',
      component: Priorities,
      meta: { title: "priorities" },
    },
    {
      path: 'badge',
      component: Checkmarks,
      meta: { title: "checkmarks" },
    },
    {
      path: 'chest',
      component: Payments,
      meta: { title: "checkmarks" },
    },
    {
      path: 'timecube',
      component: Planning,
      meta: { title: "planning" },
    },
  ]
},{
  path: '/front',
  component: Oracle,
  meta: { title: "DCTRL" }
},{
  path: '/front/doge',
  component: Oracle,
  meta: { title: "newspaper" }
},{
  path: '/front/boat',
  component: Port,
  meta: { title: "Port cards" }
},{
  path: '/front/badge',
  component: Port,
  meta: { title: "recent" }
},{
  path: '/front/chest',
  component: Bounties,
  meta: { title: "bounties" }
},{
  path: '/front/timecube',
  component: Upcoming,
  meta: { title: "calendar" }
},{
  path: '/dash',
  component: Access,
  meta: { title: "dashboard" }
},{
  path: '/dash/doge',
  component: Access,
  meta: { title: "resources" }
},{
  path: '/dash/boat',
  component: Connect,
  meta: { title: "networking" }
},{
  path: '/dash/badge',
  component: Accounts ,
  meta: { title: "manage accounts" }
},{
  path: '/dash/chest',
  component: Lightning,
  meta: { title: "lightning wallet" }
},{
  path: '/dash/timecube',
  component: Reserve,
  meta: { title: "central reserve" }
},{
  path: '/dash/slayer',
  component: Accounts,
  meta: { title: "dashboard" }
},
]

const router = new VueRouter({
  routes,
  scrollBehavior: (to, from, savedPosition) => {
      return { x: 0, y: 0 }
  }
})

export default router
