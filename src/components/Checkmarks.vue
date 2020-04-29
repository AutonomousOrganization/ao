<template lang='pug'>

.upgrades
    div(v-if='$store.getters.contextMember')
        div(v-if='$store.getters.contextCard.deck < 1')
            img.bdoge(src='../assets/images/doge.svg')
            h5 no vouches
        div(v-else)
            member-row(v-for='n in $store.getters.contextCard.deck'  :m='getMemberCard(n)')
    div(v-else)
      div(v-for='n in $store.getters.contextRelevantMembers'   :key='n')
        current-checks(:memberId='n')
      guild-create(editing='1'  :b='$store.getters.contextCard')
      div
</template>

<script>
import CurrentChecks from './CurrentChecks'
import MemberRow from './MemberRow'
import GuildCreate from './GuildCreate'

export default {
    components:{
        CurrentChecks, MemberRow, GuildCreate
    },
    mounted() {
        this.$store.commit('setMode' , 4)
        this.$store.commit('setDimension' , 0)
        this.$store.dispatch('loaded')
    },
    methods: {
        getMemberCard(mId){
            let card
            this.$store.state.members.some(m => {
                if (m.memberId === mId) {
                    card = m
                    return true
                }
            })
            return card
        }
    }
}

</script>

<style lang='stylus' scoped>
h5
    text-align: center
    color: lightGrey
    opacity: 0.77

.bdoge
    width: 100%
    opacity: 0.77
    height: 5em
    margin-top: 1em
</style>
