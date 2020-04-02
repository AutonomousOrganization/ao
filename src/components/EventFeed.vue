<template lang="pug">

.eventfeed
  transition(name='fade' v-for='(e, i) in eventstream'  :key="i")
      .feed.wiggle(v-if='e.showEvent'  v-bind:style="{ left: e.randomX }"  @click='goTo(e)')
          img.bubble(src='../assets/images/down.svg')
          .float(:style='{ color: e.randomColors[0], left: e.randomXs[0], top: e.randomYs[0] }') {{ e.type.replace('-', ' ') }}
              br
              span(:style='{ color: e.randomColors[1], left: e.randomXs[1], top: e.randomYs[1] }') {{ e.meme }}
          .float(v-if='e.type==="task-created"') {{ e.name }}
      div(v-else) test
</template>

<script>

export default {
    computed:{
        eventstream(){
            return this.$store.state.eventstream
        },
    },
    methods: {
        goTo(ev){
            if (ev.inId){
                this.$store.dispatch('goIn', {
                    parents: [this.$store.getters.contextCard.taskId],
                    panel: [ev.inId],
                    top: 0
                })
                if (this.$store.state.upgrades.dimension !== 'unicorn'){
                    this.$router.push("/" + this.$store.state.upgrades.mode)
                }
            } else if (ev.taskId){
                this.$store.dispatch('goIn', {
                    parents: [this.$store.getters.contextCard.taskId],
                    panel: [ev.taskId],
                    top: 0
                })
                if (this.$store.state.upgrades.dimension !== 'unicorn'){
                    this.$router.push("/" + this.$store.state.upgrades.mode)
                }
            } else if (ev.memberId){
                this.$store.dispatch('goIn', {
                    parents: [this.$store.getters.contextCard.taskId],
                    panel: [ev.memberId],
                    top: 0
                })
                if (this.$store.state.upgrades.dimension !== 'unicorn'){
                    this.$router.push("/" + this.$store.state.upgrades.mode)
                }
            }
            // XXX should switch mode / location more specifically on events such as resource-booked
        }
    }
}
</script>

<style lang='stylus' scoped>
@import '../styles/grid'
@import '../styles/breakpoints'
@import '../styles/colours'

h4
    margin-bottom: -10px
    padding:.3em
    background: accent1

h5
    background: black
    padding:.4em


label
    font-size: 1.3em

.feed
    position: fixed
    color: white
    top: 100vh - 20em
    left: 45%
    height: 4em
    width: 4em
    z-index: 10000000

.feed img
    height: 4em
    width: 4em

img
    height: 170px
    position: absolute
    top: 0
    left: 0

.fade-enter-active
    transition: top 7s

.fade-leave-active
    transition: top 7s
    top: -11em

.fade-enter
    top: 99%

.fade-leave-to /* .fade-leave-active below version 2.1.8 */
    top: -10em

@keyframes wiggle {
    0%, 100% { transform: translate(-16px, 0) }
    25% { transform: translate(-8px, 0) }
    50% { transform: translate(16px, 0) }
    75% { transform: translate(8px, 0) }
}

.wiggle {
  animation: wiggle 1s infinite
  transition-timing-function: ease
}

.tooltip
    position: fixed
    background: rgba(0, 0, 0, 0.5)
    color: white
    left: 50%
    top: 50%
    padding: 0.5em 1em
    text-align: center

.float
    position: relative
    left: 30%
    top: 40%
    color: white
    font-family: "Comic Sans MS"
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5)

.doge
    opacity: 0.8

.bubble
    opacity: 0.5
</style>
