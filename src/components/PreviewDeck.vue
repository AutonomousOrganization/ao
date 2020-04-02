<template lang='pug'>

.preview(v-if='deck.length > 0 || topPriorities.length > 0')
    .row
        .four.grid
            .bead.yellowwx.tooltip(v-if='red.length === 0'  v-for="(b,i) in yellow", @click='goto(b.taskId)')
                linky.tooltiptext(:x='b? shortName(b.name) : "unknown card"')
            .bead.redwx.tooltip(v-for="(b,i) in red"  :b="b", @click='goto(b.taskId)')
                linky.tooltiptext(:x='b? shortName(b.name) : "unknown card"')
        .four.grid
            .bead.greenwx.tooltip(v-for="(b,i) in green", @click='goto(b.taskId)')
                linky.tooltiptext(:x='b? shortName(b.name) : "unknown card"')
        .four.grid
            .bead.purplewx.tooltip(v-if='blue.length === 0'  v-for="(b,i) in purple", @click='goto(b.taskId)')
                linky.tooltiptext(:x='b? shortName(b.name) : "unknown card"')
            .bead.bluewx.tooltip(v-for="(b,i) in blue", @click='goto(b.taskId)')
                linky.tooltiptext(:x='b? shortName(b.name) : "unknown card"')
    .row
        .two.grid
            span &nbsp;
        .four.grid
            .bead.yellowwx.tooltip(v-if='red.length > 0'   v-for="(b,i) in yellow", @click='goto(b.taskId)')
                linky.tooltiptext(:x='b? shortName(b.name) : "unknown card"')
        .four.grid
            .bead.purplewx.tooltip(v-if='blue.length > 0' v-for="(b,i) in purple", @click='goto(b.taskId)')
                linky.tooltiptext(:x='b? shortName(b.name) : "unknown card"')
</template>

<script>


import Linky from './Linky'
import calculations from '../calculations'

export default {
  props: ['memberId', 'taskId', 'task'],
  methods:{
      getTask(taskId){
          return this.$store.getters.hashMap[taskId]
      },
      goto(taskId){
          let panel = [taskId]
          let top = 0
          let t = this.$store.getters.hashMap[taskId]
          let panelColor = this.task.subTasks.filter( p => {
              return this.card(p).color === t.color
          })
          let topColor = panelColor.indexOf(taskId)

          if (topColor > -1){
            panel = panelColor
            top = topColor
          }
          let parents =  [this.$store.getters.contextCard.taskId, this.task.taskId]
          this.$store.dispatch("goIn", {parents, panel, top})

          if(this.$store.state.upgrades.mode === 'doge' && this.$store.getters.contextCard.priorities.length > 0) {
              this.$store.commit("setMode", 1)
          }

          if (this.$store.state.upgrades.dimension !== 'unicorn'){
              this.$router.push("/" + this.$store.state.upgrades.mode)
          }
      },
      card(tId) {
          return this.$store.getters.hashMap[tId]
      },
      shortName(name) {
          return calculations.shortName(name)
      }
  },
  computed: {
      deck(){
          let tasks = []
          if (this.memberId) {
              tasks = this.$store.state.tasks.filter( t => t.deck.indexOf(this.memberId) !== -1 )
          } else if (this.taskId) {
              let subTasks = []
              let t = this.$store.getters.hashMap[this.taskId]
              t.subTasks.forEach(t => tasks.push( this.getTask(t)))
          } else if (this.task && this.task.subTasks) {
              this.task.subTasks.forEach( tId => {
                  let task = this.getTask(tId)
                  if(task) {
                      tasks.push(task)
                  }
              })
          }
          return tasks
      },
      red(){
          return this.deck.filter( c => { if(!c) { return false } return c.color === 'red' } ).reverse().slice(0, 5)
      },
      yellow(){
          return this.deck.filter( c => { if(!c) { return false } return c.color === 'yellow' } ).reverse().slice(0, 5)
      },
      blue(){
          return this.deck.filter( c => { if(!c) { return false } return c.color === 'blue' } ).reverse().slice(0, 5)
      },
      purple(){
          return this.deck.filter( c => { if(!c) { return false } return c.color === 'purple' } ).reverse().slice(0, 5)
      },
      green(){
          return this.deck.filter( c => { if(!c) { return false } return c.color === 'green' } ).reverse().slice(0, 5)
      },
      topPriorities(){
          return this.task.priorities.slice(0, 5).reverse()
      },
  },
  components:{

      Linky,
  },
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours'
@import '../styles/grid'
@import '../styles/tooltips'

.preview
    width: 100%
    margin-top: 0.5em
    //opacity: 0.5

.tinyboat
    height: 15px
    width: 100%
    display: inline-block;
    cursor: pointer

.bead
    padding: 0
    margin:0
    height:.77em
    min-height: 6px
    width: 100%
    border-radius: 50%;
    display: inline-block;
    border-width: 2px
    border-color: rgba(255, 255, 255, 0.11)
    opacity: 0.77
    border-style: solid
    cursor: pointer
    z-index: 98

.tooltip
    position: relative

.tooltip .tooltiptext
    font-size: 1em
    z-index: 152
    width: max-content
    max-width: 24em
</style>
