<template lang='pug'>
#wrex
    .container
        div(v-for='a in $store.state.ao')
            h5 {{ a.address }}
            .row(v-for='tId in a.links')
                .two.grid
                    img.gift(src='../assets/images/send.svg'  @click='discon(tId, a.address)')
                .eight.grid
                    hypercard(:b='getCard(tId)'  :key='tId'  :c='[a.links]')
</template>

<script>
import Hypercard from "./Card"

export default {
  components:{
      Hypercard,
  },
  methods: {
      getCard(taskId){
          return this.$store.getters.hashMap[taskId]
      },
      discon(taskId, address){
          console.log('discon, ', {taskId, address})
          this.$store.dispatch('makeEvent', {
              type: 'ao-link-disconnected',
              taskId,
              address
          })
      }
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
@import '../styles/grid'
@import '../styles/skeleton'
@import '../styles/button'
@import '../styles/title'

h5
    text-align: center
    color: softYellow

.gift
    display: inline
    height: 4.1em
    clear: none
    opacity: 0.41
    cursor: pointer

h1
    color: yellow
p
    text-align: center

.topmission
    margin-left: 50%
    transform: translateX(-50%)
    margin-bottom: 1em
</style>
