<template lang='pug'>

.panel(:class='{ fullwidth : $store.getters.member.stacks === 1 || !requireFiveStacks }')
    div(v-if='$store.getters.all.length < 1')
        img.bdoge.adjtooltip(src='../assets/images/buddadoge.svg')
        .tooltiptext.correctspot(v-if='$store.getters.member.tooltips')
            p.suggest empty
    div(v-else-if='$store.getters.member.stacks === 5 && requireFiveStacks')
      .row
        .four.columns
            card-panel(v-if='$store.getters.red.length === 0'   :c='$store.getters.yellow', :taskId='$store.state.context.panel[$store.state.context.top]')
            card-panel(v-else  :c='$store.getters.red', :taskId='$store.state.context.panel[$store.state.context.top]')
        .four.columns
            card-panel(:c='$store.getters.green', :taskId='$store.state.context.panel[$store.state.context.top]')
        .four.columns
            card-panel(v-if='$store.getters.blue.length === 0'  :c='$store.getters.purple', :taskId='$store.state.context.panel[$store.state.context.top]')
            card-panel(v-else  :c='$store.getters.blue', :taskId='$store.state.context.panel[$store.state.context.top]')
      .row
        .two.columns
        .four.columns(v-if='$store.getters.yellow.length > 0  &&  $store.getters.red.length > 0')
            card-panel(:c='$store.getters.yellow', :taskId='$store.state.context.panel[$store.state.context.top]')
        .four.columns.stay(v-else)
        .four.columns(v-if='$store.getters.purple.length > 0 && $store.getters.blue.length > 0')
            card-panel(:c='$store.getters.purple', :taskId='$store.state.context.panel[$store.state.context.top]')
    .padonestack(v-else)
        card-panel(v-if='$store.getters.all.length > 0'  :c='$store.getters.all', :taskId='$store.state.context.panel[$store.state.context.top]')
</template>

<script>

import CardPanel from './CardPanel'

export default {
  components:{
      CardPanel,
  },
  computed: {
      requireFiveStacks(){
          return this.usedStacks > 1
      },
      usedStacks(){
          let usedStacks = 0
          if (this.$store.getters.green.length > 0) usedStacks++
          if (this.$store.getters.red.length > 0) usedStacks++
          if (this.$store.getters.blue.length > 0) usedStacks++
          if (this.$store.getters.purple.length > 0) usedStacks++
          if (this.$store.getters.yellow.length > 0) usedStacks++
          return usedStacks
      }
  }
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/button'
@import '../styles/tooltips'

.two.columns, .stay
    height: 1em

.tooltiptext.correctspot
    position: absolute
    top: 50%
    left: 50%

.bdoge
    width: 100%
    opacity: 0.77
    height: 5em
    margin-top: 1em

h5
    text-align: center
    color: lightGrey
    opacity: 0.77

.panel
    margin: 0 1em 1em 1em
    clear: both
    padding-bottom: 1.5em
    min-height: 5.9em
    background-image: url('../assets/images/table.svg')
    background-size: cover
    background-position: center center
    overflow: visible

.card
    padding: 2em
    color: white
    text-align: center
    font-size:1.3em
    color:white

#cyber
    width: 100%
    opacity: 0.5

.padonestack
    padding-top: 0.001em
    max-width: calc(100vw - 4em)

.fullwidth
    width: 100%

</style>
