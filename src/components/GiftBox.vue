<template lang='pug'>

#giftbox(v-if='$store.getters.inbox.length > 0')
  .row
    .two.grid
      img.gift(src='../assets/images/send.svg')
    .eight.grid
      hypercard(v-for='b in $store.getters.inbox'  :b='b'  :inId='$store.getters.member.memberId')
</template>

<script>

import Hypercard from "./Card"

export default {
  components:{
      Hypercard,
  },
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/grid'
@import '../styles/button'

#giftbox
    width: 100%

.fw
    width: 100%
    height: auto

.gift
    display: inline
    height: 5em
    clear: none

span
    font-size: 1.321em
    padding: .5em

</style>
