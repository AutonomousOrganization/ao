<template lang='pug'>

.priority.closedcard(ref='wholeCard')
  .row.agedwrapper(:class="cardInputSty")
      .agedbackground.freshpaper(v-if='cardAge < 8')
      .agedbackground.weekoldpaper(v-else-if='cardAge < 30')
      .agedbackground.montholdpaper(v-else-if='cardAge < 90')
      .agedbackground.threemontholdpaper(v-else='cardAge >= 90')
      img.front.nopad(v-if='card.guild'  src="../assets/images/badge.svg")
      span.front.nudge(v-if='card.guild')  {{ card.guild }}
      img.left.front(v-if='isMember' src="../assets/images/loggedIn.svg")
      img.checkmark.right.front(v-if='isCompleted' src='../assets/images/completed.svg' ref='checkbox')
      img.checkmark.right.front(v-else-if='!isCompleted' src='../assets/images/uncompleted.svg' ref='checkbox')
      tally.right.front.lesspadding(:b='card')
      linky.cardname.front(:x='card.name'  :key='name')
</template>

<script>
import Hammer from 'hammerjs'
import Propagating from 'propagating-hammerjs'

import Linky from './Linky'
import Hypercard from './Card'
import Tally from './Tally'


export default {
    props: ['taskId', 'inId', 'c'],
    components: { Hypercard, Linky, Tally },
    mounted() {
        let el = this.$refs.wholeCard
        if(!el) return
        let mc = Propagating(new Hammer.Manager(el))

        let doubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2, time: 400, interval: 400 })
        let longPress = new Hammer.Press({ time: 600 })

        mc.add([doubleTap, longPress])

        longPress.recognizeWith([doubleTap])
        longPress.requireFailure([doubleTap])

        mc.on('doubletap', (e) => {
            this.goIn(this.taskId)
            e.stopPropagation()
        })

        mc.on('press', (e) => {
            this.copyCardToClipboard()
            e.stopPropagation()
        })

        let checkel = this.$refs.checkbox
        if(!checkel) return
        let checkmc = Propagating(new Hammer.Manager(checkel))

        let Tap = new Hammer.Tap({ time: 400 })
        checkmc.add(Tap)
        checkmc.on('tap', (e) => {
            if(!this.isCompleted) {
                this.complete()
            } else {
                this.uncheck()
            }
            e.stopPropagation()
        })
    },
    methods: {
      goIn(taskId){

          let panel = [taskId]
          let parents = [  ]
          let top = 0

          if (this.$store.getters.contextCard.taskId){
              parents.push(this.$store.getters.contextCard.taskId)
          } else if (this.$store.getters.memberCard.taskId){
              parents.push(this.$store.getters.memberCard.taskId)
          }

          if(this.inId) {
              parents.push(this.inId)
          }

          this.$store.dispatch("goIn", {
              parents,
              top,
              panel
          })

          if(this.$store.state.upgrades.mode === 'doge' && this.$store.getters.contextCard.priorities.length > 0) {
              this.$store.commit("setMode", 1)
          }

          this.$store.commit("startLoading", 'unicorn')
          this.$router.push("/" + this.$store.state.upgrades.mode)
      },
      complete(){

          this.$store.dispatch("makeEvent", {
              type: 'task-claimed',
              inId: this.inId,
              taskId: this.taskId,
              memberId: this.$store.getters.member.memberId,
              notes: 'checked by ' + this.$store.getters.member.memberId
          })
      },
      uncheck(){
          this.$store.dispatch("makeEvent", {
              type: 'task-unclaimed',
              taskId: this.taskId,
              memberId:  this.$store.getters.member.memberId,
              notes: ''
          })
      },
      copyCardToClipboard(){
          navigator.clipboard.writeText(this.card.name).then(function() {

          }, function() {
              console.log("copy failed")
          })
      },
    },
    computed: {
        card(){
            return this.$store.getters.hashMap[this.taskId]
        },
        isMember(){
            let is = false
            this.$store.state.members.some(m => {
                if (m.memberId === this.taskId){
                    is = m.name
                    return true
                }
            })
            return is
        },
        isBounty(){
            return this.$store.getters.bounties.some( t => {
                return t.taskId === this.taskId
            })
        },
        cardStart(){
            // XXX recalc on nav
            if ( this.card.book.startTs ){
              let now = Date.now()
              let msTill = this.card.book.startTs - now
              // XXX TODO
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
        cardInputSty() {
          return {
              redwx : this.card.color == 'red',
              bluewx : this.card.color == 'blue',
              greenwx : this.card.color == 'green',
              yellowwx : this.card.color == 'yellow',
              purplewx : this.card.color == 'purple',
              blackwx : this.card.color == 'black',
          }
        },
        cardAge(){
          let now = Date.now()
          let msSince = now - this.c.timestamp
          let days = msSince / (1000 * 60 * 60 * 24)
          return days
        },
        isCompleted(){
          let now = Date.now()
          return this.card.claims.some(c => {
              if (this.$store.getters.member.memberId === c.memberId && now - c.timestamp < 30000) return true
          })
        },
    }
}

</script>

<style lang='stylus' scoped>

@import '../styles/colours'

.priority
    color: white
    clear: both

.singleship
    width: 3.3724em
    position: absolute
    margin-top: 1em
    float: right

.agedwrapper
    position: relative
    margin-top: 0.5em
    width: calc(100% - 2em)
    padding: 0.5em
    margin-right: 0.5em
    margin-left: 0.5em

.agedbackground
    background-image: url('/paper.jpg')
    background-repeat: no-repeat
    background-position: center center
    background-size: cover
    top: 0
    left: 0
    bottom: 0
    right: 0
    position: absolute
    width: 100%
    height: 100%
    pointer-events: none

.freshpaper
    background-image: url('/paper.jpg')
    opacity: 0.2

.weekoldpaper
    background-image: url('/paper_aged_1.png')
    opacity: 0.25

.montholdpaper
    background-image: url('/paper_aged_2.png')
    opacity: 0.3

.threemontholdpaper
    background-image: url('/paper_aged_3.png')
    opacity: 0.35

.allocated
    position: absolute
    padding-left: 0.25em
    width: 2em
    text-align: center
    font-size: 0.95em
    margin-top: 0.5em
    color: white
    text-shadow: 2px 2px 2px rgba(0.05, 0.05, 0.05, 0.5)
    font-size: 1.5em
    pointer-events: none

.cardname
    z-index: 15
    position: relative

img
    height: 1.1em
    padding-right: 0.5em

.left
    float: left

.right
    float: right

.nopad
    padding-right: 0.15em

.nudge
    top: -0.2em

.front
    position: relative
    z-index: 100
    max-width: 100%

.checkmark
    float: right
    opacity: 0.5
    cursor: pointer
    z-index: 105

img.checkmark
    height: 1.58em
    margin-top: -.15em
    margin-bottom: -0.25em
    margin-left: 0.25em

.tally.right.front.lesspadding
    padding-right: 0
</style>
