<template lang='pug'>

#theoracle
    h1 Oracle
    hypercard.topmission(v-if='$store.getters.topcard'  :b='$store.getters.topcard'  :c='[$store.getters.topcard.taskId]'  :inId='$store.getters.member.memberId'  @click.capture.stop='goInNews($store.getters.topcard.taskId)')
</template>

<script>
import Hypercard from "./Card"

export default {
  components:{
      Hypercard
  },
  mounted(){
      this.$store.commit('setMode' , 0)
      this.$store.commit('setDimension' , 1)
      this.$store.dispatch('loaded')
  },
  methods:{
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
      alldoged(){
          let news = []
          this.$store.getters.memberIds.forEach(mId => {
              let member = this.$store.getters.hashMap[mId]
              let lastUsed
              this.$store.state.members.forEach( m => {
                  if(m.memberId === mId){
                      lastUsed = m.lastUsed
                  }
              })
              if(member && lastUsed) {
                  let presence = (Date.now() - lastUsed) <= (3600000 * 4)
                  if(presence && member.priorities) {
                      member.priorities.forEach(p => {
                          let priority = this.$store.getters.hashMap[p]
                          if(!priority.dogers) {
                              priority.dogers = []
                          }
                          priority.dogers.push(member.name)
                          if(!news.some((sp, i) => {
                              if(sp.taskId === p) {
                                  news[i].weight += 1 / member.priorities.length
                                  return true
                              }
                              return false
                          })) {
                              priority.weight = 1 / member.priorities.length
                              news.push(priority)
                          }
                      })
                  }
              }
          })
          // news.sort((a, b) => {
          //     return b.weight - a.weight
          // })
          if(news.length < 1) return
          return news
      },
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

.bounty
    margin-bottom: 2em
    max-width: 30em
    position: relative
    left: 50%
    transform: translateX(-50%)
    margin-top: 2.5em

.thegoldendoge
    position: absolute
    left: 50%
    transform: translateX(-50%)
    top: 7em
    height: 8em
    z-index: -1

.topmission
    max-width: 30em
    margin-left: 50%
    transform: translateX(-50%)
    margin-bottom: 1em
</style>
