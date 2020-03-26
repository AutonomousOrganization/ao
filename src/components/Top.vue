<template lang='pug'>
#wrex
  h1 Top
  p todo summary ao 2 ao communications
</template>

<script>
import CardPanel from './CardPanel'
import Hypercard from "./Card"

export default {
  components:{
      CardPanel,
      Hypercard,
  },
  mounted(){
      this.$store.commit('setMode' , 1)
      this.$store.commit('setDimension' , 1)
      this.$store.dispatch('loaded')
  },
  computed: {

  }
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
