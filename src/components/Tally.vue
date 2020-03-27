<template lang='pug'>

.tally.tooltip
    img(v-for='n in b.claimed'  src='../assets/images/mark.svg')
    .tooltiptext
        p(v-if='$store.getters.member.tooltips') completed by:
        current.block(v-for='memberId in b.claimed', :memberId='memberId')
</template>

<script>

import Current from './Current'

export default {
    props: ['b'],
    components: { Current },
}

</script>

<style lang='stylus' scoped>

@import '../styles/tooltips'

.tally
    padding-right: 0.5em
    padding-left: 0.5em
    min-height: 0.1em
    font-size: 1em

img
    height: 1em
    position: relative
    bottom: 0
    right: 0

.block
    display: block
    clear: both
</style>
