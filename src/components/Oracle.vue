<template lang='pug'>

#frontrecent
  hypercard.topmission(v-if='$store.getters.topcard'  :b='$store.getters.topcard'  :c='[$store.getters.topcard.taskId]'  :inId='$store.getters.member.memberId'  @click.capture.stop='goInNews($store.getters.topcard.taskId)')
  .container(v-if='recentMembers.length > 0')
    row(v-for="(m, i) in recentMembers", :m="m"  v-if="showTotal > i")
    img.andThen(@click='andThen'  src='../assets/images/loader.svg')
  .container
    missions
  status
</template>

<script>

import Row from './MemberRow'
import Missions from './Missions'
import Status from './Status'
import Hypercard from './Card'

export default {
  components:{
      Row, Missions, Hypercard, Status
  },
  data(){
      return {showTotal: 11}
  },
  mounted(){
      this.$store.commit('setMode' , 0)
      this.$store.commit('setDimension' , 1)
      this.$store.dispatch('loaded')
  },
  methods: {
      andThen(){
          this.showTotal ++
      },
      goInNews(t){
          let taskId = t
          let panel = [ taskId ]
          let top = panel.indexOf(t)
          let parents = [ this.$store.getters.member.memberId ]

          this.$store.dispatch("goIn", {
              parents,
              top,
              panel
          })


          if(this.$store.state.upgrades.mode === 'doge' && this.$store.getters.contextCard.priorities.length > 0) {
              this.$store.commit("setMode", 1)
          }
          this.$router.push("/" + this.$store.state.upgrades.mode)
      },
  },
  computed: {
      recentMembers(){
          let recentMembers = []
          try {
            recentMembers = this.$store.state.members.slice()
            recentMembers.sort((a, b) => {
                return b.lastUsed - a.lastUsed
            })
          } catch (err){
              console.log("ddnn wrrk: ", err)
          }
          return recentMembers
      }
  }
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/button'
@import '../styles/breakpoints'
@import '../styles/title'

h1
    color: yellow

.andThen
    height: 3em
    position: relative
    left: 50%
    transform: translateX(-50%)
    cursor: pointer

.topmission
    max-width: 30em
    margin-left: 50%
    transform: translateX(-50%)
    margin-bottom: 4em
    margin-top: 4em

</style>
