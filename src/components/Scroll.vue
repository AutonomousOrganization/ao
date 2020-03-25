<template lang='pug'>

.scroll(v-if='this.$store.state.upgrades.dimension === "unicorn"')
    img.scrolly(src='../assets/images/downboat.svg'  :id='uuid')
</template>

<script>

import calculations from '../calculations'
import uuidv1 from 'uuid/v1'
import Hammer from 'hammerjs'
import Propagating from 'propagating-hammerjs'

export default {
    props: ['b', 'inId'],
    data(){
        return {
            uuid: uuidv1(),
        }
    },
    mounted() {
        let el = document.getElementById(this.uuid)
        if(!el) return
        let mc = Propagating(new Hammer.Manager(el))

        let Tap = new Hammer.Tap({ time: 400 })
        let Press = new Hammer.Press({ time: 500 })
        mc.add([Tap, Press])
        mc.on('tap', (e) => {
            let parentId = this.$store.state.context.parent[this.$store.state.context.parent.length-1]
            if (this.$store.state.context.action === this.b.taskId){

                if (this.$store.getters.contextCard.priorities.length <= 1){
                    this.$store.commit('setMode', 0)
                    this.$router.push('/doge')
                }
                this.$store.dispatch("makeEvent", {
                    type: 'task-refocused',
                    inId: this.inId,
                    taskId: this.b.taskId,
                })
                this.$store.commit('setAction', false)
            } else if (this.inId){
                this.$store.dispatch("makeEvent", {
                  type: 'task-de-sub-tasked',
                  subTask: this.b.taskId,
                  taskId: this.inId,
                })
            } else if (parentId) {
              this.$store.dispatch("makeEvent", {
                type: 'task-de-sub-tasked',
                subTask: this.b.taskId,
                taskId: parentId,
              })
              let newPanel = _.filter(this.$store.state.context.panel, tId => tId !== this.b.taskId)
              let newTop = Math.min(this.$store.state.context.top, newPanel.length -1)
              if (newPanel.length > 0){
                  this.$store.commit('setPanel', newPanel)
                  this.$store.commit('setTop', newTop)
              } else {
                  this.$store.dispatch('goUp', {
                    target: parentId,
                    panel: [parentId],
                    top: 0
                  })
              }
            } else {
                this.$store.dispatch("makeEvent", {
                  type: 'task-de-sub-tasked',
                  subTask: this.b.taskId,
                  taskId: this.b.taskId,
                })
            }
            e.stopPropagation()
        })
        mc.on('press', (e) => {
            this.$store.dispatch("makeEvent", {
              type: 'task-popped',
              taskId: this.b.taskId,
              inId: this.$store.getters.contextCard.taskId,
            })
        })
    },
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours';
@import '../styles/skeleton';
@import '../styles/grid';
@import '../styles/button';

.count
    float: right

.activated
    border-style: solid
    border-width: thick
    border-color: white

.upgrade
    height: 3em

.task
    color: white
    margin:10px 0
    padding:20px

.row
    width: 100%
    .mainColumn
      width:calc(100% - 75px - 4%)
    .secondaryColumn
      width:75px
      button
        height:75px

.btn
    width:100%
    margin-top: 2em
    max-height: 3em

select
    background-color: lightteal

select.form-control
    color: black

.curs
    cursor: pointer;

label
    color: black
    text-align: center
    padding: 0
    margin-bottom: -50px

.scrolly
    position: absolute
    left: 0.5em
    bottom: 0.5em
    height: 1.3em
    cursor: pointer

</style>
