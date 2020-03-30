<template lang='pug'>

.tally.tooltip
    img(v-for='n in b.claimed'  src='../assets/images/mark.svg')
    span.points(v-if='b.completeValue > 0') {{ b.completeValue }}
    img.chest(v-if='b.completeValue > 0'  src='../assets/images/chest.svg')
    span(v-if='cardStart').points {{ cardStart.days.toFixed(1) }} days
    img.chest(v-if='cardStart'  src='../assets/images/timecube.svg')
    .tooltiptext(v-if='b.claimed.length > 0')
        p(v-if='$store.getters.member.tooltips') completed by:
        current.block(v-for='memberId in b.claimed', :memberId='memberId')
</template>

<script>

import Current from './Current'

export default {
    props: ['b'],
    components: { Current },
    computed: {
      cardStart(){
          if ( this.b.book.startTs ){
            let now = Date.now()
            let msTill = this.b.book.startTs - now
            let days = msTill / (1000 * 60 * 60 * 24)
            let hours = 0
            let minutes = 0
            return {
                days,
                hours,
                minutes
            }
          }
      },
    }
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

img.chest
    display: inline

.points
    position: relative
    top: -0.25em
    margin-right: 0.25em


</style>
