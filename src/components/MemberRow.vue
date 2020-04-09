<template lang='pug'>

.memberrow(v-if='m.memberId'  @dblclick='goIn(m.memberId)'  :key='m.memberId')
    .row(v-if='b')
        .three.grid.ptr(@click='goIn(m.memberId)')
            current(:memberId='m.memberId')
        .two.grid.tooltip(v-if='isVulnerable')
            img.btn.goldengun(src='../assets/images/goodbye.svg' @click='purgeAccount')
            .tooltiptext.correctspot(v-if='$store.getters.member.tooltips')
                p.suggest delete
        .one.grid
            coin(:b='b')
        .grid(:class='{ eight: !isVulnerable, six: isVulnerable }')
            simple-priorities(:taskId='m.memberId')
</template>

<script>

import PreviewDeck from './PreviewDeck'
import SimplePriorities from './SimplePriorities'
import Coin from './Coin'
import Current from './Current'


export default {
    props: ['m'],
    components: {PreviewDeck, SimplePriorities, Coin, Current},
    methods:{
        isBull(){
            let mainroute = this.$router.currentRoute.path.split('/')[1]
            let isBull = mainroute === "dash"
            return isBull
        },
        goIn(taskId){

            let panel = [taskId]
            let parents = [  ]
            let top = 0

            if (this.$store.getters.contextCard.taskId){
                parents.push(this.$store.getters.contextCard.taskId)
            } else if (this.$store.getters.memberCard.taskId){
                parents.push(this.$store.getters.memberCard.taskId)
            }

            this.$store.dispatch("goIn", {
                parents,
                top,
                panel
            })

            this.$store.commit("startLoading", 'unicorn')

            if(this.$store.state.upgrades.mode === 'doge' && this.$store.getters.contextCard.priorities.length > 0) {
                this.$store.commit("setMode", 1)
            }

            this.$router.push("/" + this.$store.state.upgrades.mode)
        },
        toggleGrab(){
            if (this.isVouched) {
                this.$store.dispatch("makeEvent", {
                    type: 'task-dropped',
                    taskId: this.b.taskId,
                    memberId: this.$store.getters.member.memberId,
                })
            } else {
                this.$store.dispatch("makeEvent", {
                    type: 'task-grabbed',
                    taskId: this.b.taskId,
                    memberId: this.$store.getters.member.memberId,
                    })
            }
        },
        purgeAccount(){
            this.$store.dispatch("makeEvent", {
                type: 'member-purged',
                memberId: this.m.memberId,
            })
       }
    },
    computed:{
        isVulnerable(){
            let v = !this.hasAnyVouches && this.$store.state.members.length > 1
            return v || this.$router.currentRoute.path === "/dash/slayer"
        },
        isLoggedIn(){
            let isLoggedIn
            this.$store.state.sessions.forEach( s => {
                if ( s.ownerId === this.m.memberId ){
                    isLoggedIn = true
                }
            })
            return isLoggedIn
        },
        rowsGuilds(){
            let g = []
            // this.$store.getters.pubguilds.forEach(t => {
            //     if (t.deck.indexOf(this.m.memberId) > -1){
            //         g.push(t)
            //     }
            // })
            return g
        },
        b(){
            return this.$store.getters.hashMap[this.m.memberId]
        },
        isVouched(){
            return this.b.deck.indexOf( this.$store.getters.member.memberId ) > -1
        },
        hasAnyVouches(){
            return this.b.deck.length > 0
        },
        vouchCount(){
            let vouchCount = this.$store.getters.membersVouches.find(c => c.memberId === this.m.memberId)
            if(!vouchCount) return 0
            return vouchCount.count
        },
        vouchRatio(){
            let ratio = this.vouchCount / this.b.deck.length
            if(this.b.deck.length <= 0 && this.vouchCount > 0) return '-∞'
            else if(this.vouchCount === 0) return '0'
            else return ratio.toFixed(2)
        }
    },
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/grid'
@import '../styles/tooltips'
@import '../styles/spinners'

img
    height: 4em

label
    font-size: 1.246em
    font-weight: normal;
    margin: 1em

.memberrow
    box-shadow: 3px 1px 7px 1px lightGrey
    margin-bottom: 8px
    background: #1c4eb069
    min-height: 37px

.fw
    width: 100%

.viney
    float: right
    height: 1.3em

.faded
    opacity: 0.235654

.faded:hover
    opacity: 1

.yellowtx
    text-decoration: none

.dogepepecoin {
  width: 35px
  height: 35px
  cursor: pointer
  top: 1em
  position: relative
}

.hodlcount {
    position: relative
    top: calc(-1em + -15.5px)
    text-align: center
    width: 35px
    padding-bottom: 0
    margin-bottom: 0
    font-weight: bold
    color: rgba(255, 255, 255, 0.75)
    pointer-events: none
}

.grabbedhodlcount {
    color: white
}

.ungrabbedcoin {
    opacity: 0.3
}

.ptr
    cursor: pointer

.goldengun
    cursor: pointer
    height: 2em
    margin-top: 1em

.nopointer
    cursor: auto

.counts {
    position:relative
    top: 0
}

.iceblue
    color: #6ff
    text-align: center
    font-weight: bold
    margin-right: 2em
</style>
