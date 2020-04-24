<template lang='pug'>

.upgrades
    .payreq(v-if='b.btcAddr')
        tag(:d='b.btcAddr')
        a(:href='"bitcoin:" + b.btcAddr')
            button Open Wallet
                img(src='../assets/images/bitcoin.svg')
    .payreq(v-if='$store.state.cash.info.alias && b.bolt11')
        tag(:d='b.bolt11')
        a(:href='"lightning:" + b.bolt11')
            button Open Wallet
                img(src='../assets/images/lightning.svg')
    div(v-else)
        h5(v-if='$store.state.cash.info.alias') no value
        h5(v-else) payment node disconnected
    points-set.fw(:b='$store.getters.contextCard')
</template>

<script>

import calcs from '../calculations'
import PointsSet from './PointsSet'
import Tag from './Tag'

export default {
    components:{
        PointsSet, Tag
    },
    mounted() {
        if (this.$router.currentRoute.path.split("/")[1] !== 'dash'){
            this.$store.commit('setMode' , 3)
            this.$store.commit('setDimension' , 0)
            this.$store.dispatch('loaded')
        }
    },
    data(){
        return {
            payreqAmount: 1,
        }
    },
    methods: {
    },
    computed: {
        b(){
            return this.$store.getters.contextCard
        },
    },
}

</script>

<style lang='stylus' scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/grid'
@import '../styles/button'
@import '../styles/tooltips'
@import '../styles/spinners'

.fw
    width: 100%

h5
    text-align: center

.thickborder
    background: main

.marg
    margin-right: 1.97em

.upgrades
    width: 100%

.smallbox
    width: 4em
    margin-bottom: 1em

.togglepayments
    margin: 0
    padding: 1em 0 1em 0
    text-align: center
    img
        margin: 0 3em 0 3em
        padding: .77em

.submode
    height: 6em
    width: 6em
    margin-bottom: 1em
    margin-top: 1em
    background-color: rgba(0, 0, 0, 0)

.max
    margin: 3em
    height: 5.3333em
    width: 5.333em

h5
    text-align: center
    color: lightGrey
    opacity: 0.77

.bdoge
    width: 100%
    opacity: 0.77
    height: 5em
    margin-top: 1em

button
    max-width: 232px

.payreq
    text-align: center
    background-color: rgba(0,0,0,0)
    border-radius: 0.5em
    padding: 1em
    margin-bottom: 1.654321em

a
    text-decoration: none
    color: main

.box
    word-wrap:break-word
    max-width: 500px
    z-index: 100001
    padding: 1em

.paid
    color: purple
    font-size: 5em

.small
    font-size: .892em
    word-wrap: break-word
    word-break: break-all
    background: lightGrey
    color: main
    padding: 1em
    border-radius: 1em

button
    img
        height: 1.3em

</style>
