<template lang='pug'>

#newmember
		h1
				current(:memberId='$store.getters.member.memberId')
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
import cryptoUtils from '../crypto'
import Current from './Current'

export default {
	components:{Current},
  data() {
    return {
      member: {
        name: '',
        pass: '',
        fob: '',
      }
    }
  },
	computed: {
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
		}
	},
	methods: {
		newMember() {
				this.$store.dispatch('makeEvent', this.memberReq)
		}
	},
}
</script>

<style lang='stylus' scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/input'
@import '../styles/button'

#projects
    color:accent1
    font-family: 'Open Sans', light, sans-serif;

h1
		margin-bottom: 1em

li
  color:white
  font-size:18px
  font-family: 'Open Sans', light, sans-serif;


h3
  font-family: 'Open Sans', light, sans-serif;
  font-size:1.6em

a, input
		margin-top: .5em


</style>
