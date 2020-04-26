<template lang='pug'>
#frontbounties
    .row.pagemargins
        .three.columns
            div(v-for='(t, i) in row1'  :key='t.taskId'  @click='goInBounty(t)')
                hypercard.bounty(:b='t'  :key='t.taskId'  :c='pubGuildIds')
        .three.columns
            div(v-for='(t, i) in row2'  :key='t.taskId'  @click='goInBounty(t)')
                hypercard.bounty(:b='t'  :key='t.taskId'  :c='pubGuildIds')
        .three.columns
            div(v-for='(t, i) in row3'  :key='t.taskId'  @click='goInBounty(t)')
                hypercard.bounty(:b='t'  :key='t.taskId'  :c='pubGuildIds')
        .three.columns
            div(v-for='(t, i) in row4'  :key='t.taskId'  @click='goInBounty(t)')
                hypercard.bounty(:b='t'  :key='t.taskId'  :c='pubGuildIds')
</template>

<script>
import Vue from 'vue'
import calculations from '../calculations'
import Hypercard from "./Card"

export default {
    data(){
        let row1 = []
        let row2 = []
        let row3 = []
        let row4 = []
        this.$store.getters.bountyList.forEach( (a, i) => {
            let row = i % 4
            if (row === 0){
                row1.push(a)
            }
            if (row === 1){
                row2.push(a)
            }
            if (row === 2){
                row3.push(a)
            }
            if (row === 3){
                row4.push(a)
            }
        })
        return { row1, row2, row3, row4 }
    },
  components:{
      Hypercard,
  },
  mounted(){
      this.$store.commit('setMode' , 3)
      this.$store.commit('setDimension' , 1)
      this.$store.dispatch('loaded')
  },
  methods:{
      goInBounty(t){
          let panel = [t.taskId]
          let top = 0
          let parents = [this.$store.getters.member.memberId]
          this.$store.dispatch("goIn", {
              parents,
              top,
              panel
          })
          this.$store.commit('setMode', 3)
          this.$router.push("/" + this.$store.state.upgrades.mode)

          this.$store.dispatch("makeEvent", {
              type: 'task-valued',
              taskId: t.taskId,
              value: Number(t.completeValue),
          })
      },
      getGuild(taskId){
          return this.$store.getters.hashMap[taskId].guild
      },
  },
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/button'
@import '../styles/breakpoints'
@import '../styles/title'

.bounty:hover
    border-style: dashed
    border-width: 3px
    border-color: yellow

h1
    color: yellow

</style>
