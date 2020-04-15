<template lang='pug'>

.zen()
    img.bdoge(v-if='$store.getters.inbox.length < 1'  @click='$router.push("/boat")'  src='../assets/images/doge.svg')
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

.bdoge
    width: 100%
    opacity: 0.77
    height: 5em
    margin-top: 1em
    cursor: pointer

</style>
