<template lang='pug'>

#frontcalendar.container
    h1 Upcoming
    calendar(inId='g')
</template>

<script>

import Calendar from './Calendar'

export default {
  mounted(){
      this.$store.commit('setMode' , 3)
      this.$store.commit('setDimension' , 1)
      this.$store.dispatch('loaded')
  },
  components:{
      Calendar,
  }
}

</script>

<style lang="stylus" scoped>

@import '../styles/title'
@import '../styles/skeleton'

h1
    color: yellow

</style>
