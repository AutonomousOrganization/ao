<template lang='pug'>

.changer
    h2 Update {{$store.getters.member.name}}:
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
    button(@click='update') update account
    .check(@click='toggleMuted')
        img.checkmark(v-if='$store.getters.member.muted', src='../assets/images/completed.svg')
        img.checkmark(v-else, src='../assets/images/uncompleted.svg')
        span ~ muted
    .check(@click='toggleTooltips')
        img.checkmark(v-if='$store.getters.member.tooltips', src='../assets/images/completed.svg')
        img.checkmark(v-else, src='../assets/images/uncompleted.svg')
        span ~ tooltips
</template>

<script>

import cryptoUtils from '../crypto'

export default {
    computed: {
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
        secure(){
            let secure = false
            if ( this.$store.getters.member.badges ) {
                secure = this.$store.getters.member.badges.some(b => b === 'secure')
            }
            return secure
        },
        inputType(){
            if (this.change.field === 'secret'){
                return 'password'
            } else if (this.change.field === 'muted') {
                return 'boolean'
            } else {
                return 'text'
            }
        }
    },
    data(){
        return {
            change: {
                field: 'name',
                newfield: '',
                confirmNewfield: ''
            }
        }
    },
    methods: {
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
        }
    }
}
</script>

<style lang='stylus' scoped>

@import '../styles/colours'
@import '../styles/button'
@import '../styles/skeleton'
@import '../styles/input'

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

</style>
