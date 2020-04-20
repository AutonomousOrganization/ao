<template lang='pug'>
#wrex
  h1 Port
  hypercard.topmission(v-for='(t, i) in $store.getters.topGuilds'  v-if='i < 11'  :b='t'  :key='t.taskId'  :c='[t.taskId]'  :inId='$store.getters.member.memberId')
</template>

<script>
import Hypercard from "./Card"

export default {
  components:{
      Hypercard,
  },
  mounted(){
      this.$store.commit('setMode' , 1)
      this.$store.commit('setDimension' , 1)
      this.$store.dispatch('loaded')
  },
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/button'
@import '../styles/title'

h1
    color: yellow
p
    text-align: center

.topmission
    max-width: 30em
    margin-left: 50%
    transform: translateX(-50%)
    margin-bottom: 1em
</style>
