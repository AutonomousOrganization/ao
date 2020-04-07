<template lang='pug'>

.panel(:class='{ fullwidth : $store.getters.member.stacks === 1 || !requireFiveStacks }')
    div(v-if='$store.getters.all.length < 1')
        img.bdoge.adjtooltip(@dblclick='getArchive'  @click='getOracle'  src='../assets/images/buddadoge.svg')
        .tooltiptext.correctspot(v-if='$store.getters.member.tooltips')
            p.suggest none
        h5 no cards
    div(v-else-if='$store.getters.member.stacks === 5 && requireFiveStacks')
      .row
        .four.columns
            card-panel(v-if='$store.getters.red.length === 0'   stack='yellow',  :position='$store.getters.contextCard.stackView["yellow"]', :taskId='$store.getters.contextCard.taskId')
            card-panel(v-else  stack='red', :position='$store.getters.contextCard.stackView["red"]',  :taskId='$store.getters.contextCard.taskId')
        .four.columns
            card-panel(stack='green', :position='$store.getters.contextCard.stackView["green"]',  :taskId='$store.getters.contextCard.taskId')
            projects
        .four.columns
            card-panel(v-if='$store.getters.blue.length === 0'  stack='purple',  :position='$store.getters.contextCard.stackView["purple"]', :taskId='$store.getters.contextCard.taskId')
            card-panel(v-else  stack='blue', :position='$store.getters.contextCard.stackView["blue"]',  :taskId='$store.getters.contextCard.taskId')
      .row
        .two.columns
        .four.columns(v-if='$store.getters.yellow.length > 0  &&  $store.getters.red.length > 0')
            card-panel(stack='yellow', :position='$store.getters.contextCard.stackView["yellow"]',  :taskId='$store.getters.contextCard.taskId')
        .four.columns.stay(v-else)
        .four.columns(v-if='$store.getters.purple.length > 0 && $store.getters.blue.length > 0')
            card-panel(stack='purple', :position='$store.getters.contextCard.stackView["purple"]',  :taskId='$store.getters.contextCard.taskId')
    .padonestack(v-else)
        card-panel(v-if='$store.getters.all.length > 0'  stack='all', :position='$store.getters.contextCard.stackView["all"]',  :taskId='$store.getters.contextCard.taskId')
</template>

<script>
import Projects from './Projects'
import CardPanel from './CardPanel'

export default {
  components:{
      CardPanel,Projects
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
  },
  methods: {
      getOracle(){

      },
      getArchive(){
        let hodld = []
        this.$store.state.tasks.forEach( t => {
            if(t.deck.indexOf(this.$store.getters.member.memberId) > -1){
              hodld.push(t)
            }
        })
        let crawler = [this.$store.getters.memberCard.taskId].concat(this.$store.getters.myGuilds.map(t => t.taskId))
        let deck = []
        let history = []
        let newCards = []
        do {
          newCards = []
          crawler = _.filter(crawler, t => {
            if(deck.concat(history).indexOf(t) > -1) return false
            let task = this.$store.getters.hashMap[t]
            if(task === undefined || task.subTasks === undefined || task.priorities === undefined || task.completed === undefined) return false

            if(task.deck.indexOf(this.$store.getters.member.memberId) > -1) {
                deck.push(t)
            } else {
                history.push(t)
            }
            newCards = newCards.concat(task.subTasks).concat(task.priorities).concat(task.completed)
            return true
          })
          crawler = newCards
        } while(crawler.length > 0)
        let archive = _.filter(hodld, st => deck.indexOf(st.taskId) === -1)
        archive = _.filter(archive, st => !archive.some(t => t.subTasks.concat(t.priorities).concat(t.completed).indexOf(st.taskId) > -1))

        let tasks = archive.map(a => a.taskId)
        this.$store.dispatch("makeEvent", {
            type: 'pile-prioritized',
            tasks,
            inId: this.$store.getters.contextCard.taskId,
        })
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
