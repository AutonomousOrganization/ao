<template lang='pug'>

.priorities
    div.clearboth(v-for='(t, i) of priorities.slice(0, 5)'  :key='priorities')
        simple-hyperpriority.front(:taskId='t'  :c='priorities'  :inId='taskId')
        .centerer
            .more(v-if='i === 4 && priorities.length > 5') +{{ priorities.length - 5 }}
</template>

<script>

import Hypercard from './Card'
import SimpleHyperpriority from './SimplePriority'

export default {
  props: ['taskId'],
  computed: {
      card() {
          return this.$store.getters.hashMap[this.taskId]
      },
      priorities() {
          let p = []
          if ( this.card && this.card.priorities.length > 0){
              p = this.card.priorities.slice().reverse()
          }
          return p
      },
      isSun() {
          return this.$store.state.upgrades.dimension === 'sun'
      },
      isUni() {
          return this.$store.state.upgrades.dimension === 'unicorn'
      }
  },
  components:{
      SimpleHyperpriority, Hypercard,
  },
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/button'

.priorities
    padding-bottom: 0.5em
    clear: both
    overflow: hidden

button
    background: darkteal

.deck
    width: 100%

tr
    border-color: accent4
    border-top-style: solid
    border-bottom-style: solid
    border-width: 3px
    vertical-align:middle

thead
    tr
        text-align: center

td
    vertical-align: middle
    color: accent2
    font-size: 1.34em
    text-align: center

li
    text-align: left

img
    height: 3.9em

table
    text-align:center
    width: 100%
th
    font-family: sans-serif
    font-weight: lighter
    font-size: 1.1em
    color: accent1
    border-color: accent1

td
    color: accent3

.padding
    padding: 1.987654321em

li
    margin-left: 1em

.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

img
    height: 3em

.ptr
    cursor: pointer

.fr
    float: right

.fl
    float: left

.clearboth
    clear: both

.shipcontainer
    // position: absolute
    display: inline
    height: 4em
    clear: both

.singleship
    position: absolute
    width: 3.3724em
    cursor: pointer

.allocated
    position: absolute
    padding-left: 0.25em
    width: 2em
    text-align: center
    font-size: 0.95em
    margin-top: 0.5em
    color: white
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5)
    font-size: 1.5em
    pointer-events: none

.onelinecard
    width: 100%
    padding: 0.5em

.top
    z-index: 9001

.empty
    padding-top: 0.6em
    padding-bottom: 0.2em

.bdoge
    width: 100%
    opacity: 0.6

.subpriority
    margin-left: 2em
    width: calc(100% - 2em)

.more
    text-align: center
    background-color: #F8685F
    border-radius: 50%;
    display: inline-block;
    border-width: 2px
    border-color: rgba(255, 255, 255, 0.68)
    border-style: solid
    padding: 0.5em
    margin: 0.5em auto 0 auto
    font-size: 0.8em
    opacity: 0.3
    color: white

.centerer
    text-align: center
    width: 100%

.front
    z-index: 98
</style>
