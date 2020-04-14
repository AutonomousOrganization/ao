<template lang='pug'>
#wrex
  h1 Port
  hypercard.topmission(v-for='(t, i) in topten'  v-if='i < 11'  :b='t'  :key='t.taskId'  :c='[t.taskId]'  :inId='$store.getters.member.memberId')
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
  computed: {
    topten(){
        let guilds = []
        let uniqueG = []
        this.$store.state.tasks.forEach((c, i) => {
            if (c.guild){
                let l = uniqueG.indexOf(c.guild)
                if (guilds.indexOf(c.guild) === -1){
                  guilds.push(c)
                  uniqueG.push(c.guild)
                } else {
                  let o = guilds[l]
                  if (o.deck.length <= c.deck.length){
                      guilds[l] = c
                  }
                }
                if(this.alldoged && this.alldoged.length >= 1) {
                    let index = this.alldoged.indexOf(guilds[l])
                    if(index > -1) {
                        guilds[l].weight = this.alldoged[index].weight
                    }
                }
            }
        })
        guilds.sort( (a, b) => {
            let aHodls = a.deck.length
            let bHodls = b.deck.length
            if(b.weight && !a.weight) {
                return 1
            } else if(a.weight && !b.weight) {
                return -1
            } else if((b.weight && a.weight) && (b.weight !== a.weight)) {
                  return b.weight - a.weight
            } else {
                return bHodls - aHodls
            }
        })

        if (guilds.length > 11){
            guilds = guilds.slice(0, 11)
        }

        return guilds
    },
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
