<template lang='pug'>

#frontrecent
  h1 Recent
  .container(v-if='recentMembers.length > 0')
    row(v-for="(m, i) in recentMembers", :m="m"  v-if="showTotal > i")
    img.andThen(@click='andThen'  src='../assets/images/loader.svg')
  .container
    missions
</template>

<script>

import Row from './MemberRow'
import Missions from './Missions'

export default {
  components:{
      Row, Missions
  },
  data(){
      return {showTotal: 11}
  },
  mounted(){
      this.$store.commit('setMode' , 4)
      this.$store.commit('setDimension' , 1)
      this.$store.dispatch('loaded')
  },
  methods: {
      andThen(){
          this.showTotal ++
      }
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

</style>
