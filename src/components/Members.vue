<template lang='pug'>

#member
    .list
        h4.yellowtx ({{coreMembers.length}}) active
        row(v-for="m in coreMembers"  :m='m'  :key='m.memberId')
        h4.bluetx ({{pendingDeactivations.length}}) deactivating
        row(v-for="m in pendingDeactivations"  :m='m'  :key='m.memberId')
        h4.redtx ({{nonMembers.length}}) inactive
        row(v-for="m in nonMembers"  :m='m'  :key='m.memberId')
</template>

<script>

import _ from "lodash"
import Row from "./MemberRow"

export default {
    data(){
        return {
            showStart: 0
        }
    },
    methods: {
        showNext(){
            this.showStart = this.showStart + 5
            if (this.showStart > this.sortedMembers.length ){
                this.showStart = 0
            }
        },
        showBack(){
            this.showStart = this.showStart - 4
            if (this.showStart < 0 ){
                this.showStart = this.sortedMembers.length -1
            }
        },
    },
    computed: {
        nonMembers(){
            return this.sortedMembers
              .filter(m => m.active <= 0)
        },
        coreMembers(){
            return this.sortedMembers
              .filter(m => m.active > 0 && this.$store.getters.hashMap[m.memberId].boost > 0)
        },
        pendingDeactivations(){
            return this.sortedMembers
              .filter(m => m.active > 0 && this.$store.getters.hashMap[m.memberId].boost <= 0)
        },
        showingPanel(){
            return this.sortedMembers.slice(this.showStart, this.showStart + 5)
        },
        showTotal(){
            return this.sortedMembers.length
        },
        sortedMembers(){
          let sortedMembers = this.$store.state.members.slice()
          sortedMembers.sort((a, b) => {
              let cardA = this.$store.getters.hashMap[a.memberId]
              let cardB = this.$store.getters.hashMap[b.memberId]
              if(cardA.deck.length < cardB.deck.length) return 1
              if(cardA.deck.length === cardB.deck.length) return 0
              return -1
          })
          return sortedMembers
        },
    },
    components : {
        Row,
    },
}

</script>

<style lang='stylus' scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/button'

.activelabel
    font-size: 1.2em
    text-align: center
    margin-bottom: 1em
    clear: both

.fl
    float: left

.mt
    margin-top: -1em

.center
    text-align: center

.buttons
    width: 100%
    button
        width: 50%

h2
    text-align:center

#sunexper
    width: 130%

#member
    width: 100%

li
    margin-left: 1em

.padding
    padding: 1.987654321em

.cross
    text-decoration: line-through;


.inline
  display:inline-block
  margin:15px


.menu
    text-align: center
    color: softGrey
    font-size: 2em

img
    height: 2em
    cursor: pointer


</style>
