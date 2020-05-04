<template lang='pug'>

.tally(@click='setAction')
    span.adjtooltip
        span.faded
            span.points(v-if='b.completeValue > 0') {{ b.completeValue }}
            img.chest(v-if='b.completeValue > 0'  src='../assets/images/completed.svg')
        span(v-if='cardStart').points {{ cardStart.days.toFixed(1) }} days
        img.chest(v-if='cardStart'  src='../assets/images/timecube.svg')
        span.hide(v-if='b.claimed.length > 0') -
        img(v-for='n in clm.xmark'  src='../assets/images/xmark.svg')
        img(v-for='n in clm.mark'  src='../assets/images/mark.svg')
    .tooltiptext(v-if='b.claimed.length > 0 || actions.length > 0')
        p(v-if='$store.getters.member.tooltips  &&  actions.length > 0') counting on:
        current(v-for='n in actions'  :memberId='n')
        p(v-if='$store.getters.member.tooltips &&  b.claimed.length > 0') completed by:
        current.block(v-for='memberId in b.claimed', :memberId='memberId')
</template>

<script>

import Current from './Current'

export default {
    props: ['b'],
    components: { Current },
    methods:{
      setAction(){
          if (this.$store.getters.member.action === this.b.taskId){
              return this.$store.dispatch("makeEvent", {
                  type: 'member-field-updated',
                  field: 'action',
                  newfield: false,
                  memberId: this.$store.getters.member.memberId,
              })
          }

          this.$store.dispatch("makeEvent", {
              type: 'member-field-updated',
              field: 'action',
              newfield: this.b.taskId,
              memberId: this.$store.getters.member.memberId,
          })
      },
    },
    computed: {
      actions(){
          let a = []
          this.$store.state.members.forEach(m => {
              if (m.action ===this.b.taskId) a.push(m.memberId)
          })
          return a
      },
      clm(){
          let mark = 0
          let xmark = 0
          let m = this.b.claims.length
          while (m >= 10){
              xmark += 1
              m -= 10
          }
          mark = m
          return {
              mark,
              xmark,
          }
      },
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

.faded
    opacity: 0.235654

.faded:hover
    opacity: 1

.hide
    opacity: 0

.hide:hover
    opacity: 0.25654

.tally
    padding-right: 0.5em
    padding-left: 0.5em
    font-size: 1em
    min-height: 2em
    min-width: 7em
    cursor: pointer
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
