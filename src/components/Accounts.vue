<template lang='pug'>

#accounts
  h1 Accounts
  .container
    .row
        .six.columns
            h1
                current(:memberId='$store.getters.member.memberId')
            h2 Update info:
                select(v-model='change.field', @change='empty')
                    option(value='name') name
                    option(value='secret') password
                    option(value='fob') fob
            .input-container
                input.input-effect(:type='inputType' v-model='change.newfield'  :class='{"has-content":!!change.newfield}')
                label {{"new " + change.field}}
                span.focus-border
            br
            .input-container(v-if='inputType === "password"')
                input.input-effect(:type='inputType', v-model='change.confirmNewfield'  :class='{"has-content":!!change.confirmNewfield}')
                label repeat
                span.focus-border
            .check(v-if='inputType === "password"')
                img.checkmark(v-if='matched', src='../assets/images/completed.svg')
                img.checkmark(v-else, src='../assets/images/uncompleted.svg')
                span - repeat correctly
            button(@click='update') update info
        .six.columns
            h2 Preferences
            .check.click(@click='toggleTooltips')
                img.checkmark(v-if='$store.getters.member.tooltips', src='../assets/images/completed.svg')
                img.checkmark(v-else, src='../assets/images/uncompleted.svg')
                span.space tips
            .check.click(@click='toggleTooltips')
                img.checkmark(v-if='$store.getters.member.tooltips', src='../assets/images/completed.svg')
                img.checkmark(v-else, src='../assets/images/uncompleted.svg')
                span.space pro tips
            .check.click(@click='toggleMuted')
                img.checkmark(v-if='!$store.getters.member.muted', src='../assets/images/completed.svg')
                img.checkmark(v-else, src='../assets/images/uncompleted.svg')
                span.space sounds
            .check.click(@click='toggleStacks')
                img.checkmark(v-if='$store.getters.member.stacks === 5', src='../assets/images/completed.svg')
                img.checkmark(v-else, src='../assets/images/uncompleted.svg')
                span.space split stacks
            .check.click
                img.checkmark(src='../assets/images/uncompleted.svg')
                span.space show boats
    .list
        h4.yellowtx ({{coreMembers.length}}) active
        member-row(v-for="m in coreMembers"  :m='m'  :key='m.memberId')
        h4.bluetx ({{pendingDeactivations.length}}) deactivating
        member-row(v-for="m in pendingDeactivations"  :m='m'  :key='m.memberId')
        h4.redtx ({{nonMembers.length}}) inactive
        member-row(v-for="m in nonMembers"  :m='m'  :key='m.memberId')
    .input-container
        input.input-effect(v-model='member.name' type='text'  :class='{"has-content":!!member.name}')
        label new account
        span.focus-border
    .input-container
        input.input-effect(v-model='member.fob' type='text'  :class='{"has-content":!!member.fob}')
        label fob
        span.focus-border
    ul
        li initial password is chosen name
        li tell them the important stuff
    button(@click='newMember') create account
</template>

<script>
import _ from "lodash"
import cryptoUtils from '../crypto'
import Current from './Current'
import MemberRow from './MemberRow'
export default {
    components: {Current, MemberRow},
    data() {
      return {
        change: {
            field: 'name',
            newfield: '',
            confirmNewfield: ''
        },
        member: {
          name: '',
          pass: '',
          fob: '',
        },
      }
    },
    mounted() {
        this.$store.commit('setMode' , 2)
        this.$store.commit('setDimension' , 2)
        this.$store.dispatch('loaded')
    },
    methods: {
        toggleStacks(){
            let newfield = 5
            if (this.$store.getters.member.stacks === 5){
                newfield = 1
            }
            this.$store.dispatch('makeEvent', {
                type: "member-field-updated",
                field: 'stacks',
                newfield,
                memberId: this.$store.getters.member.memberId
            })
        },
        toggleMuted(){
            this.$store.dispatch('makeEvent', {
                type: "member-field-updated",
                field: 'muted',
                newfield: !this.$store.getters.member.muted,
                memberId: this.$store.getters.member.memberId
            })
        },
        toggleTooltips(){
            this.$store.dispatch('makeEvent', {
                type: "member-field-updated",
                field: 'tooltips',
                newfield: !this.$store.getters.member.tooltips,
                memberId: this.$store.getters.member.memberId
            })
        },
        empty(){
            this.change.newfield = ''
            this.change.confirmNewfield = ''
        },
        update(){
            this.$store.dispatch('makeEvent', this.changeReq)
        },
        newMember() {
            this.$store.dispatch('makeEvent', this.memberReq)
        },
    },
    computed:{
      matched(){
          let x = this.change.newfield
          let y = this.change.confirmNewfield
          return x === y
      },
      changeReq(){
          if (this.change.field === 'secret'){
                return {
                    type: "member-field-updated",
                    field: this.change.field,
                    newfield: cryptoUtils.createHash( this.change.newfield),
                    memberId: this.$store.getters.member.memberId
                }
          }
          return {
              type: "member-field-updated",
              field: this.change.field,
              newfield: this.change.newfield,
              memberId: this.$store.getters.member.memberId
          }
      },
      inputType(){
          if (this.change.field === 'secret'){
              return 'password'
          } else if (this.change.field === 'muted') {
              return 'boolean'
          } else {
              return 'text'
          }
      },
      memberReq(){
  			let name, secret
  			name = this.member.name
  			if (name){
  					secret = cryptoUtils.createHash(name)
  			}
  			return {
  					type: "member-created",
  					name,
  					secret,
  					fob: this.member.fob,
  			}
  		},
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
@import '../styles/button'
@import '../styles/input'

.padding
    padding: 1.987654321em
.cross
    text-decoration: line-through
.inline
    display:inline-block
    margin:15px
.menu
    color: softGrey
    font-size: 2em
h1
		margin-bottom: 1em
li
    color:white
    font-size:18px
    font-family: 'Open Sans', light, sans-serif
h3
    font-family: 'Open Sans', light, sans-serif
    font-size:1.6em
a, input
		margin-top: .5em
.space
    padding-left: .654321em
.click
    cursor: pointer
img
    float: left
    height: 3em
    position: relative
    right: 0
.checkmark
    height: 1.58em
.check
    padding: 0.5em
input, select
    z-index:123123
.activelabel
    font-size: 1.2em
    margin-bottom: 1em
    clear: both
.fl
    float: left
.mt
    margin-top: -1em
li
    margin-left: 1em

</style>
