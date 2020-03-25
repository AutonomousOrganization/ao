<template lang='pug'>

.app
    contexts
    sun
    helm
    bull
    loader
    event-feed
    task-create
    auth(v-if='!$store.getters.isLoggedIn')
    router-view
    .breathingroom
</template>

<script>

import EventFeed from './components/EventFeed'
import Sun from './components/Sun'
import Bull from './components/Bull'
import Loader from './components/Loader'
import Helm from './components/Helm'
import Contexts from './components/Contexts'
import TaskCreate from './components/TaskCreate'
import Auth from './components/Auth'

export default {
    mounted() {
        let token = window.localStorage.token
        let session = window.localStorage.session
        if (token && session){
            this.$store.commit('setAuth', {token, session})
        }
        this.$store.dispatch("connectSocket")
        this.$store.dispatch('loadCurrent')
    },
    components: {
        EventFeed, Sun, Bull, Loader, Helm, TaskCreate, Contexts, Auth
    },
}

</script>

<style lang="stylus">

@import "./styles/normalize"
@import "./styles/colours"

.breathingroom
    margin-bottom: 7em

.app
    color: accent1
    font-weight: lighter

body
    background: main
    overflow-x: hidden

</style>
