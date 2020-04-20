<template lang='pug'>

.zen()
    .tooltip.fw(v-if='$store.getters.inbox.length < 1'  @click='$router.push("/boat")')
        img.bdoge(src='../assets/images/doge.svg')
        .tooltiptext(v-if='$store.getters.member.tooltips')
            p.suggest no mode active
    gift-box(v-else)
</template>

<script>
import GiftBox from './GiftBox'

export default {
    components:{
        GiftBox
    },
    mounted() {
        this.$store.commit('setMode' , 0)
        this.$store.commit('setDimension' , 0)
        this.$store.dispatch('loaded')
    },
}
</script>

<style lang='stylus' scoped>

@import '../styles/tooltips'

.fw
    width: 100%
    cursor: pointer


.tooltiptext
    position: absolute
    left: 50%

.bdoge
    width: 100%
    opacity: 0.77
    height: 5em
    margin-top: 1em
    cursor: pointer

</style>
