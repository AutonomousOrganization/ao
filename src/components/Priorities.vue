<template lang='pug'>

.priorities
    div(v-if='priorities.length < 1')
        img.bdoge(src='../assets/images/buddadoge.svg')
        h5 no present boats
    .clearboth(v-for='(t, i) of priorities'  :key='t')
      .row.priority
          .priorityContainer
              img.boatAll.faded(v-if='$store.getters.contextCard.priorities.length >= 1'  src='../assets/images/downboat.svg'  @click='refocused(t)')
              hyperpriority.closedcard(:taskId='t'  :inId='$store.getters.contextCard.taskId')
              img.boatAll.boatR.faded(v-if='$store.getters.contextCard.subTasks.length >= 2'  src='../assets/images/upboat.svg'  @click='prioritized(t)')
      .row.subpriority(v-for='(st, j) of getSubPriorities(t)'   :key='st')
          .clearboth.opensubcard
              hyperpriority.closedcard(:taskId='st'  :inId="t")
          .row.subsubpriority(v-for='(st2, k) of getSubPriorities(st)'  :key='st2')
              .clearboth.opensubcard
                  hyperpriority.closedcard(:taskId='st2'  :inId="st"  :inInId='t')
    div.clearboth
    .boatContainer
        img.boatAll.faded(v-if='$store.getters.contextCard.priorities.length >= 1'  src='../assets/images/downboat.svg'  @click='pileRefocused')
        img.boatAll.boatR.faded(v-if='$store.getters.contextCard.subTasks.length >= 2'  src='../assets/images/upboat.svg'  @click='pilePrioritized')
</template>

<script>

import Hypercard from './Card'
import Hyperpriority from './Priority'
import _ from 'lodash'

export default {
  mounted() {
      this.$store.commit('setMode' , 1)
      this.$store.commit('setDimension' , 0)
      this.$store.dispatch('loaded')
  },
  data(){
      return {
          action: false,
      }
  },
  methods:{
    getSubPriorities(taskId){
      let card = this.$store.getters.hashMap[taskId]
      if(card && card.priorities){
          return card.priorities.slice().reverse()
      }
    },
    refocused(taskId){
      this.$store.dispatch("makeEvent", {
        type: 'task-refocused',
        inId: this.$store.getters.contextCard.taskId,
        taskId,
      })
    },
    prioritized(taskId){
      this.$store.dispatch("makeEvent", {
        type: 'task-prioritized',
        inId: this.$store.getters.contextCard.taskId,
        taskId,
      })
    },
    getCard(taskId){
        return this.$store.getters.hashMap[taskId]
    },
    pilePrioritized() {
      this.$store.dispatch("makeEvent", {
        type: "pile-prioritized",
        inId: this.$store.getters.contextCard.taskId
      });
    },
    pileRefocused() {
      this.$store.dispatch("makeEvent", {
        type: "pile-refocused",
        inId: this.$store.getters.contextCard.taskId
      });
    }
  },
  computed:{
      priorities(){
          return this.$store.getters.contextCard.priorities.slice().reverse()
      },
  },
  components:{
      Hyperpriority,
      Hypercard,
  },
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/button'

h5
    text-align: center
    color: lightGrey

.priorities
    padding-bottom: 0.6em
    padding-top: 0.1em

button
    background: darkteal

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
    // display: inline

.allocated
    position: absolute
    left: -3.05em
    width: 3.3724em
    text-align: center
    color: white
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5)
    font-size: 1.5em
    pointer-events: none
    z-index: 7
    margin-top: 0.1em

.openallocated
    margin-top: 0.3em

.onelinecard
    width: 100%
    margin-left: 3em
    padding: 0.5em

.top
    z-index: 9001

.empty
    height: 3em
    padding-top: 0.6em
    padding-bottom: 0.2em

.bdoge
    width: 100%
    opacity: 0.77
    height: 7em
    margin-top: 1em

.priority
    margin-left: 0em
    width: 100%
    position: relative

.subpriority
    margin-left: calc(3.3724em * 2)
    width: calc(100% - (3.3724em* 2))

.subsubpriority
    margin-left: 3.3724em
    width: calc(100% - 3.3724em)

.singleship
    position: absolute
    width: 3.3724em
    margin-left: -4em
    cursor: pointer
    top: -0.3em

.openboat
    top: 50%
    transform: translateY(-50%)

.opencard
    width: calc(100% - 4.5em)
    margin-top: 0.5em

.opensubcard
    width: calc(100% - 0.5em)
    margin-top: 0.5em

.open
    top: 36%

.boatContainer
    display: flex;
    justify-content: space-between;
    width:100%
    height:45px

.priorityContainer
    display: flex;
    justify-content: space-between;
    width:100%

.boatAll
    margin: 0 1em 0 1em
    height: 20px;
    position: relative
    margin-top: 1em
    margin-bottom: 1em
    opacity: .3
    z-index:9999999999999
    cursor: pointer

.boatR
    position: absolute
    right: 0px
    height:20px

.faded
    opacity: 0.235654

.closedcard
    padding-right:3em
    width: 100%

</style>
