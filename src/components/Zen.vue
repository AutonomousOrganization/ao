<template lang='pug'>

.zen(@click='$router.push("/boat")')
    img.bdoge(src='../assets/images/doge.svg')
</template>

<script>

export default {
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
