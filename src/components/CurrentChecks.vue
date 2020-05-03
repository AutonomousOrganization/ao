<template lang='pug'>

.current(v-if='memberId'  :key='counter')
    img.checkmark.clickable(v-if='isCompleted'  src='../assets/images/completed.svg'   @click='uncheck')
    img.checkmark.clickable(v-else  src='../assets/images/uncompleted.svg'  @click='complete')
    span.completedmarks
        span.name(@dblclick='goIn(memberId)'   @click.exact.stop='toggleHighlight()'  @click.ctrl.exact.stop='toggleHighlight(true)'  :class='{ highlight : isHighlighted, lowdark : isLowdarked }') {{ name }}
            span -
            span(v-if='clockworkblue.days > 0') {{ clockworkblue.days }}d:
            span(v-if='clockworkblue.hours > 0') {{ clockworkblue.hours }}:
            span(v-if='clockworkblue.minutes > 0') {{ Number(clockworkblue.minutes) }}:
            span(v-if='clockworkblue.minutes > 0 && clockworkblue.seconds > 0 && clockworkblue.seconds < 10') 0
            span(v-if='clockworkblue.seconds > 0') {{ Number(clockworkblue.seconds.toFixed(0)) }}
        span(v-for='c in checkmarks'  :key='c.taskId')
            span.clickable(v-if='0 < c.completeValue') {{c.completeValue}}
            span.tooltip.plain.completedcheckmark(@click='goIn(c.taskId)'  :class='cardInputSty(c.color)')
                img.completedcheckmark(src='../assets/images/completed.svg')
                linky.tooltiptext.bigger(:x='c.name')
</template>

<script>

import Linky from './Linky'

export default {
  data(){
      let x = {
          counter: 0,
      }
      setInterval(()=>{ // total rerender not great
          x.counter ++
      }, 12345)
      return x
  },
  props: ['memberId'],
  components: { Linky },
  methods: {
    goIn(taskId){
        let parents = [this.memberId, this.$store.getters.contextCard.taskId]
        let panel = [taskId]
        let top = 0
        this.$store.dispatch("goIn", {panel, top, parents})
    },
    complete(){
        this.$store.dispatch("makeEvent", {
            type: 'task-claimed',
            taskId: this.$store.getters.contextCard.taskId,
            memberId: this.memberId,
            notes: 'checked by ' + this.$store.getters.member.memberId
        })
    },
    uncheck(){
        this.$store.dispatch("makeEvent", {
            type: 'task-unclaimed',
            taskId: this.$store.getters.contextCard.taskId,
            memberId: this.memberId,
            notes: ''
        })
    },
    cardInputSty(c){
        return {
            redwx : c === 'red',
            bluewx : c === 'blue',
            greenwx : c === 'green',
            yellowwx : c === 'yellow',
            purplewx : c === 'purple',
            blackwx : c === 'black',
        }
    },
    toggleHighlight(invert = false) {
        this.$store.dispatch("makeEvent", {
            type: 'highlighted',
            taskId: this.$store.getters.contextCard.taskId,
            memberId: this.memberId,
            valence: !invert
        })
    },
  },
  computed:{
    clockworkblue(){
        this.counter //
        let active = false
        let totalms = 0
        this.$store.getters.contextCard.actions.forEach(a => {
            if (a && this.memberId === a.memberId){
                totalms = a.total
                if (a.isActive){
                    active = a.timestamp
                    console.log('set active for ', {a})
                }
            }
        })

        if (active){
            totalms += (Date.now() - active)
        }

        let days = 0
        while (totalms > 1000 * 60 * 60 * 24){
            days ++
            totalms -= 1000 * 60 * 60 * 24
        }
        let hours = 0
        while (totalms > 1000 * 60 * 60){
            hours ++
            totalms -= 1000 * 60 * 60
        }

        let minutes = 0
        while (totalms > 1000 * 60){
            minutes ++
            totalms -= 1000 * 60
        }

        let seconds = totalms / 1000

        return {days, hours, minutes, seconds, active}
    },
    name(){
        let memberId = this.memberId
        let name = false
        this.$store.state.members.forEach(member => {
            if (member.memberId == memberId){
                name = member.name
            }
        })
        return name
    },
    isCompleted(){
        return this.$store.getters.contextCard.claimed.indexOf(this.memberId) > -1
    },

    isHighlighted() {
        return this.$store.getters.contextCard.highlights.some(h => {
            return (h.valence && h.memberId === this.memberId)
        })
    },
    isLowdarked() {
        return this.$store.getters.contextCard.highlights.some(h => {
            return (!h.valence && h.memberId === this.memberId)
        })
    },
    checkmarks() {
        return this.$store.getters.contextCompleted.filter(t => t.claimed.indexOf(this.memberId) > -1)
    },
  }
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours'
@import '../styles/tooltips'

img
    height: 0.7em
.name
    color: white
    font-size: 1.2em
    margin-right: 1em
    padding-bottom: .321em
    position: relative
    user-select: none

.checkmark
    margin-right: 0.25em

img.checkmark
    height: 2em

img.completedcheckmark
    height: 1.5em


.completedcheckmarks
    min-height: 1.5em

.clickable
    cursor: pointer
    color: white

.plain
    text-decoration: none
    margin-right: 0.13em
    height: 1.5em


.tooltiptext.bigger
    z-index: 153
    font-size: 1.2em

.highlight
    text-shadow: 0 0 20px yellow, 0 0 20px yellow, 0 0 20px yellow

.lowdark
    text-shadow: 0 0 20px red, 0 0 20px red, 0 0 20px red

.lilypad
    text-shadow: 0 0 20px green, 0 0 20px green, 0 0 20px green
</style>
