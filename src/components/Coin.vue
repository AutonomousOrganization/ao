<template lang='pug'>
.dogepepecoin(ref='hodlcoin')
    img.dogepepecoin.spinslow.adjtooltip(:class="{ ungrabbedcoin : !isGrabbed, highlight: inHand }" src='../assets/images/coin.svg'  draggable='false')
    .tooltiptext.correctspot(v-if='b.deck.length > 0')
        current.block(v-for='memberId in b.deck'  :memberId='memberId')
    p.hodlcount(:class="{ grabbedhodlcount: isGrabbed }") {{ (b.deck.length > 1) ? b.deck.length : '' }}
</template>

<script>

import Hammer from 'hammerjs'
import Propagating from 'propagating-hammerjs'

import Current from './Current'

export default {
    props: ['b'],
    components: { Current },
    mounted() {
        let el = this.$refs.hodlcoin
        if(!el) return
        let mc = Propagating(new Hammer.Manager(el))

        let singleTap = new Hammer.Tap({ event: 'singletap', time: 400 })
        let longPress = new Hammer.Press({ time: 600 })
        let swipe = new Hammer.Swipe()

        mc.add([singleTap, longPress, swipe])

        longPress.recognizeWith([singleTap])
        longPress.requireFailure([singleTap])
        swipe.recognizeWith([singleTap])
        swipe.requireFailure([singleTap])

        mc.on('singletap', (e) => {
            this.toggleGrab()
            e.stopPropagation()
        })

        mc.on('press', (e) => {
            this.grabOrDropPile()
            e.stopPropagation()
        })

        mc.on('swipeup', (e) => {
            console.log("swipeup")
            this.upHand()
            e.stopPropagation()
        })

        mc.on('swipedown', (e) => {
            console.log("swipedown")
            this.downHand()
            e.stopPropagation()
        })

    },
    computed: {
        isGrabbed(){
          return this.b.deck.indexOf(this.$store.getters.member.memberId) >= 0
        },
        inHand() {
            return this.$store.getters.memberCard.subTasks.concat(this.$store.getters.memberCard.priorities, this.$store.getters.memberCard.completed).indexOf(this.b.taskId) >= 0
        }
    },
    methods: {
        toggleGrab(){
            if(this.isGrabbed) {

                this.$store.dispatch("makeEvent", {
                    type: 'task-dropped',
                    taskId: this.b.taskId,
                    memberId: this.$store.getters.member.memberId,
                })
            } else {

                this.$store.dispatch("makeEvent", {
                    type: 'task-grabbed',
                    taskId: this.b.taskId,
                    memberId: this.$store.getters.member.memberId,
                })
            }
        },
        grabOrDropPile() {
            if(!this.isGrabbed) {

                this.$store.dispatch("makeEvent", {
                    type: 'pile-grabbed',
                    taskId: this.b.taskId,
                    memberId: this.$store.getters.member.memberId,
                })
            } else {

                this.$store.dispatch("makeEvent", {
                    type: 'pile-dropped',
                    taskId: this.b.taskId,
                    memberId: this.$store.getters.member.memberId,
                })
            }
        },
        upHand() {
            if(!this.inHand) {

                this.$store.dispatch("makeEvent", {
                    type: 'task-sub-tasked',
                    subTask: this.b.taskId,
                    taskId: this.$store.getters.memberCard.taskId,
                })
            }
        },
        downHand() {
            if(this.inHand) {

                this.$store.dispatch("makeEvent", {
                    type: 'task-de-sub-tasked',
                    subTask: this.b.taskId,
                    taskId: this.$store.getters.memberCard.taskId,
                })
            }
        }
    },
}

</script>

<style lang="stylus" scoped>

@import '../styles/tooltips'
@import '../styles/spinners'

.tooltiptext.correctspot
    position: absolute
    top: calc(100% - 1.75em)
    right: 2em
    z-index: 9000

.dogepepecoin
  width: 35px
  height: 35px
  position: absolute
  bottom: 3px
  right: 3px
  cursor: pointer

.hodlcount
    position: absolute
    text-align: center
    width: 35px
    bottom: 9px
    right: 3px
    padding-bottom: 0
    margin-bottom: 0
    font-weight: bold
    color: rgba(255, 255, 255, 1)
    pointer-events: none

.grabbedhodlcount
    opacity: 1

.ungrabbedcoin
    opacity: 0.3

.suggest
    font-style: italic
    margin-top: 1em

.block
    display: block
    clear: both

.highlight
    box-shadow: 0 0 20px white
    border-radius: 50%
</style>
