<template lang='pug'>

#points
    .center
        img(src='../assets/images/loggedIn.svg')
        span {{ totalMembers.toFixed(0) }} in accounts
        img(src='../assets/images/loader.svg')
        span {{ totalResources.toFixed(0) }} in resources
        img(src='../assets/images/badge.svg')
        span {{ totalGuilds.toFixed(0) }} on missions
        img(src='../assets/images/coin.svg')
        span {{ totalCards.toFixed(0) }} on cards
    div(v-for='n in funded.members.sort((a, b) => parseInt(a.boost) < parseInt(b.boost))')
        span {{ n.boost.toFixed(0) }}
        current(:memberId='n.taskId')
    template(v-for='n in funded.cards.sort((a, b) => parseInt(a.boost) < parseInt(b.boost))')
        p {{ n.boost }} - {{ n.name }}
            span(@click='burn(n.taskId)')
                img.burn(src='../assets/images/goodbye.svg')
    div(v-for='n in funded.resources.sort((a, b) => parseInt(a.boost) < parseInt(b.boost))')
        span {{ n.boost.toFixed(0) }}
        currentr(:resourceId='n.taskId')
    h3(v-for='n in funded.guilds.sort((a, b) => parseInt(a.boost) < parseInt(b.boost))') {{ n.boost.toFixed(0) }} - {{ n.guild }}
    .center
      h4.yellowtx backing: {{ satPoint }} &#12471;
</template>

<script>

import Current from './Current'
import Currentr from './Currentr'

export default {
    components: { Current, Currentr },
    methods: {
        burn(taskId){
            this.$store.dispatch('makeEvent', {
                type: 'task-removed', taskId // xxx DON'T REMOVE CARD, REMOVE POINTS
            })
        }
    },
    computed: {
        funded(){
            let members = []
            let guilds = []
            let resources = []
            let cards = []
            this.$store.state.tasks.forEach(t => {
                if( t.boost > 0 ){
                    if (this.$store.getters.memberIds.indexOf(t.taskId) > -1){
                      members.push(t)
                    } else if (this.$store.getters.resourceIds.indexOf(t.taskId) > -1) {
                      resources.push(t)
                    } else if (t.guild) {
                      guilds.push(t)
                    } else {
                      cards.push(t)
                    }
                }
            })
            return {members, guilds, resources, cards}
        },
        totalMembers(){
            let totalMembers = 0
            this.funded.members.forEach(t => {
                totalMembers += parseFloat( t.boost )
            })
            return totalMembers
        },
        totalGuilds(){
            let totalGuilds = 0
            this.funded.guilds.forEach(t => {
                totalGuilds += parseFloat( t.boost )
            })
            return totalGuilds
        },
        totalCards(){
            let totalCards = 0
            this.funded.cards.forEach(t => {
                totalCards += parseFloat( t.boost )
            })
            return totalCards
        },
        totalResources(){
            let totalResources = 0
            this.funded.resources.forEach(t => {
                totalResources += parseFloat( t.boost )
            })
            return totalResources
        },
        totalPointsSum(){
            return this.totalMembers + this.totalGuilds + this.totalResources + this.totalCards
        },
        satPoint(){
            let sp = this.$store.getters.totalWallet / this.totalPointsSum
            return sp ? sp : 0
        }
    }
}

</script>

<style lang='stylus' scoped>

@import '../styles/colours'
@import '../styles/grid'

img
    height: 3em

.burn
    height: 1em
    transform: rotate(180deg)

.fr
    float: right

.center
    text-align: center


</style>
