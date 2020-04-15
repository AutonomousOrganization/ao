<template lang='pug'>

.p.clearboth(v-if='card'  ref='wholeCard')
    .opencard(v-if='$store.getters.member.action === taskId')
        hypercard(:b="card", :c="parent.priorities",  :inId="inId")
    .closedcard.agedwrapper.dont-break-out(v-else  :class="cardInputSty")
        .agedbackground.freshpaper.middle(v-if='cardAge < 8')
        .agedbackground.weekoldpaper.middle(v-else-if='cardAge < 30')
        .agedbackground.montholdpaper.middle(v-else-if='cardAge < 90')
        .agedbackground.threemontholdpaper.middle(v-else='cardAge >= 90')
        img.front.nopad.cancel(v-if='card.guild'  src="../assets/images/badge.svg")
        span.front.nudge(v-if='card.guild')  {{ card.guild }}
        img.left.front.cancel(v-if='isMember' src="../assets/images/loggedIn.svg")
        checkbox(:b='card'  :inId='inId')
        tally.right.front.lesspadding.buffer(:b='card')
        linky.front(:x='name'  :key='name')
</template>

<script>

import Hammer from 'hammerjs'
import Propagating from 'propagating-hammerjs'
import Linky from './Linky'
import Hypercard from './Card'
import Checkbox from './Checkbox'
import Tally from './Tally'


export default {
    props: ['taskId', 'inId', 'inInId'],
    components: { Hypercard, Linky, Checkbox, Tally },
    mounted() {
        let el = this.$refs.wholeCard
        if(!el) return
        let mc = Propagating(new Hammer.Manager(el))

        let singleTap = new Hammer.Tap({ event: 'singletap', time: 400 })
        let doubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2, time: 400, interval: 400 })
        let longPress = new Hammer.Press({ time: 600 })
        let swipe = new Hammer.Swipe({ threshold: 20 })

        mc.add([doubleTap, singleTap, swipe, longPress])

        doubleTap.recognizeWith(singleTap)
        singleTap.requireFailure(doubleTap)

        mc.on('singletap', (e) => {
            console.log("tap on priority")
            if(this.$store.getters.member.action === this.taskId) {
                this.deaction()
            } else {
                this.setAction()
            }
            e.stopPropagation()
        })

        mc.on('doubletap', (e) => {
            this.goIn()
            e.stopPropagation()
        })

        mc.on('press', (e) => {
            this.seize()
            e.stopPropagation()
        })

        mc.on('swipeup', (e) => {
            this.allocate()
            e.stopPropagation()
        })

        mc.on('swipedown', (e) => {
            this.refocus()
            e.stopPropagation()
        })
        mc.on('swipeleft', e => {
            console.log()
            //unseize
            this.seize()
            e.stopPropagation()

        })

        mc.on('swiperight', e => {
            console.log()
            //seize
            this.seize()
            e.stopPropagation()
        })
    },
    computed: {
        card(){
          return this.$store.getters.hashMap[this.taskId]
        },
        parent(){
          return this.$store.getters.hashMap[this.inId]
        },
        name(){
            if (this.card){
                return this.card.name
            }
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
        cardAge(){
          if (this.card){
              let now = Date.now()
              let msSince = now - this.card.timestamp
              let days = msSince / (1000 * 60 * 60 * 24)
              return days
          }
        },
        cardStart(){
            // XXX recalc on nav
            if (this.card && this.card.book.startTs ){
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
          let color
          this.$store.state.tasks.some(t => {
              if (this.taskId === t.taskId){
                  color = t.color
                  return true
              }
          })
          return {
              redwx : color == 'red',
              bluewx : color == 'blue',
              greenwx : color == 'green',
              yellowwx : color == 'yellow',
              purplewx : color == 'purple',
              blackwx : color == 'black',
          }
        },
    },
    methods: {
        seize(){
            this.$store.dispatch('makeEvent', {
                type: 'task-seized',
                taskId: this.card.taskId,
                inId: this.inId
            })
        },
        deaction(){
            console.log('deaction called?')
            this.$store.dispatch("makeEvent", {
                type: 'member-field-updated',
                field: 'action',
                newfield: false,
                memberId: this.$store.getters.member.memberId,
            })
        },
        setAction(){
            this.$store.dispatch("makeEvent", {
                type: 'member-field-updated',
                field: 'action',
                newfield: this.taskId,
                memberId: this.$store.getters.member.memberId,
            })
        },
        goIn(){

            let panel = this.parent.priorities
            let parents = []
            let top = this.parent.priorities.indexOf(this.taskId)

            if (this.$store.getters.contextCard.taskId){
                parents.push(this.$store.getters.contextCard.taskId)
            } else if (this.$store.getters.memberCard.taskId){
                parents.push(this.$store.getters.memberCard.taskId)
            }

            if(this.inInId) {
                parents.push(this.inInId)
            }

            if(this.inId) {
                parents.push(this.inId)
            }

            this.$store.dispatch("goIn", {
                parents,
                top,
                panel,
            })

            if(this.$store.state.upgrades.mode === 'doge' && this.$store.getters.contextCard.priorities.length > 0) {
                this.$store.commit("setMode", 1)
            }

           

            this.$router.push("/" + this.$store.state.upgrades.mode)
        },
        copyCardToClipboard(){
            navigator.clipboard.writeText(this.name)
        },
        allocate(){
          this.$store.dispatch("makeEvent", {
            type: 'task-prioritized',
            taskId: this.taskId,
            inId: this.$store.getters.contextCard.taskId,
          })
        },
        refocus(){
            this.$store.dispatch("makeEvent", {
                type: 'task-refocused',
                inId: this.inId,
                taskId: this.taskId,
            })
        },
    }
}

</script>

<style lang='stylus' scoped>

@import '../styles/colours'

img
    height: 1.1em
    padding-right: 0.5em

.left
    float: left

.right
    float: right

.p
    color: white

.nopad
    padding-right: 0.15em

.nudge
    top: -0.2em

.clearboth
    clear: both

.cancel .priority .closedcard img
    margin-left: 0
    transform: none

.closedcard.agedwrapper
    position: relative
    margin-top: 0.5em
    padding: 0.5em
    margin-right: 0.5em
    cursor: pointer
    z-index: 5

.agedwrapper
    margin-top: 0.5em
    margin-right: 0.5em

.front
    position: relative
    z-index: 100

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
    z-index: 50

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

.dont-break-out
    overflow-wrap: break-word
    word-wrap: break-word
    word-break: break-word
    hyphens: auto

.buffer
    margin-right: 1.25em

.buffertwo
    margin-right: 1.75em
</style>
