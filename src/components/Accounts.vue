<template lang='pug'>

#accounts
  h1 Accounts
  .container
    .row
        member-create.six.columns
        changer.six.columns
    members
</template>

<script>

import MemberCreate from './MemberCreate'
import Changer from './Changer'
import Members from './Members'

export default {
    components:{
        MemberCreate, Changer, Members,
    },
    mounted() {
        this.$store.commit('setMode' , 2)
        this.$store.commit('setDimension' , 2)
        this.$store.dispatch('loaded')
    },
    computed:{
        activeAccounts(){
            let a = 0
            this.$store.state.members.forEach(m => {
                if (m.active > 0) {
                    a ++
                }
            })
            return a
        }
    }
}
</script>

<style lang='stylus' scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/breakpoints'
@import '../styles/title'

</style>
