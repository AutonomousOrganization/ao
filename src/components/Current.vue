<template lang='pug'>

span.current
    img.onlineicon(v-if='isPresent', src='../assets/images/loggedIn.svg')
    img.onlineicon(v-else src='../assets/images/loggedOut.svg')
    span.clickable(v-if='memberId && name'  @click='goIn') {{ name }}
    img.onlineicon(v-if='!memberId', src='../assets/images/lightning.svg')
</template>

<script>

export default {
  props: ['memberId'],
  methods:{
      goIn(){
          this.$store.dispatch('goIn', {
              top: 0,
              panel: [this.memberId],
              parents: [this.$store.getters.contextCard.taskId]
          })
      }
  },
  computed:{
    isPresent(){
        let isP = this.$store.getters.presentIds.indexOf(this.memberId) > -1
        return isP
    },
    m(){
        let m = false
        this.$store.state.members.forEach(member => {
            if (member.memberId == this.memberId){
                m = member
            }
        })
        return m
    },
    name(){
        if (this.m) return this.m.name
    },
    isLoggedIn(){
        let isLoggedIn
        this.$store.state.sessions.forEach( s => {
            if ( s.ownerId === this.memberId ){
                isLoggedIn = true
            }
        })
        return isLoggedIn
    }
  }
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours'

.current
    font-size: 1em
    margin-left: 1em
    margin-right: 1em
    white-space: nowrap

a
    color: accent2
    text-decoration: none

.onlineicon
    margin-right: 0.5em
    height: 1.5em
    position: relative
    top: 0.25em

.result .onlineicon
    top: 0.1em
    height: 1em

.clickable
    cursor: pointer
</style>
