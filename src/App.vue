<template lang='pug'>

.app
    div(:class='{sunbord: $store.state.upgrades.dimension === "sun", bullbord: $store.state.upgrades.dimension === "bull"}')
    contexts
    helm
    event-feed
    task-create
    auth(v-if='!$store.getters.isLoggedIn')
    router-view
    .breathingroom
    .agedbackground.translucent(:class='cardInputSty')
    .agedbackground.freshpaperbg(v-if='cardAge < 8')
    .agedbackground.weekoldpaperbg(v-else-if='cardAge < 30')
    .agedbackground.montholdpaperbg(v-else-if='cardAge < 90')
    .agedbackground.threemontholdpaperbg(v-else='cardAge >= 90')
</template>

<script>

import EventFeed from './components/EventFeed'
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
        EventFeed, Helm, TaskCreate, Contexts, Auth
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
    font-size: 1.41em

.sunbord
    position: fixed
    width: calc(100vw - 22px)
    height: calc(100vh - 22px)
    margin: 11px;
    box-shadow: 11px 11px 11px 11px softYellow;
.bullbord
    position: fixed
    width: calc(100vw - 22px)
    height: calc(100vh - 22px)
    margin: 11px;
    box-shadow: 11px 11px 11px 11px lightteal;

body
    background: main
    overflow-x: hidden

.agedbackground
    background-image: url('/paper.jpg')
    background-repeat: no-repeat
    background-position: center center
    background-size: cover
    top: 0
    left: 0
    bottom: 0
    right: 0
    position: fixed
    width: 100%
    height: 100%
    pointer-events: none
    z-index: -1
    opacity: 0.09

</style>
