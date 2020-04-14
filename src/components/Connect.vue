<template lang='pug'>

.Connect
  .container
    h1.fw
        span(v-if='$store.state.cash.alias')
            span {{ $store.state.cash.alias }}
            br
            span @
            br
    .row
        .six.columns
            h1.fw
                span.letter(v-for='(l, i) in $store.state.cash.address')
                    br(v-if='i%8 === 0')
                    span {{ l }}
        .six.columns
            tag(:d='$store.state.cash.address', size='8')
    div(v-for='(r, i) in $store.state.ao')
        h6(@dblclick='goIn(r.address)' @click='showAddr(i)')
            span {{ r.address }}
            span(v-if='showAddress === i')
                tag(:d='r.address', size='4')
            span - 
            span.discon(@click='discon(r.address)') disconnect
    .row
        .six.columns
            h3 Connecter
            .input-container
                input.input-effect(v-model='ao.address' type='text'  :class='{"has-content":!!ao.address}')
                label address
            .input-container
                input.input-effect(v-model='ao.secret' type='text'  :class='{"has-content":!!ao.secret}')
                label.input-effect secret
            button(v-if='ao.address && ao.secret'  @click='connect') connect
        .six.columns
            h3 Namer
            .input-container
                input.input-effect(v-model='aoNamed.alias' type='text'  :class='{"has-content":!!aoNamed.alias}')
                label(for="aoAliasInput") change ao alias:
            button(v-if='aoNamed.alias.length > 0' @click='name') rename
    code.click(@click='showSecr') your secret:
        span(v-if='showSecret') {{ $store.state.loader.token }}
</template>

<script>
import Tag from './Tag'
export default {
    components: {Tag},
    mounted() {
        this.$store.commit('setMode' , 1)
        this.$store.commit('setDimension' , 2)
        this.$store.dispatch('loaded')
    },
    data() {
        return {
            showAddress: false,
            showSecret: false,
            aoNamed: {
                type: 'ao-named',
                alias: ''
            },
            ao: {
                type: "ao-outbound-connected",
                address: '',
                secret: '',
            },
        }
    },
    methods: {
        showSecr(){
            this.showSecret = true
            setTimeout(() => this.showSecret = false,25000)

        },
        showAddr(x){
            if (x === this.showAddress) return this.showAddress = false
            this.showAddress = x
        },
        goIn(taskId){
            this.$store.dispatch('goIn', {
                top: 0,
                panel: [taskId],
                parents: [this.$store.getters.member.memberId],
            })
            this.$router.push('/' + this.$store.state.upgrades.mode)
        },
        name(){
            this.$store.dispatch('makeEvent', this.aoNamed)
        },
        connect(){
            this.$store.dispatch('makeEvent', this.ao)
        },
        discon(address){
            console.log("try diconnection", address)
            this.$store.dispatch("makeEvent", {
                type: 'ao-disconnected',
                address,
            })
        },
    },
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/grid'
@import '../styles/button'
@import '../styles/title'
@import '../styles/input'

.fw
    width: 100%

.click
    cursor: pointer

.letter
    width: 1.7em

h1
    text-align: center
    content-align: center

h6
    text-align: center
    cursor: pointer

label
    color: blue

.count
    float: right

.activated
    border-style: solid
    border-width: thick
    border-color: white

.upgrade
    height: 3em

.task
    color: white
    margin:10px 0
    padding:20px

.btn
    width:100%
    margin-top: 2em
    max-height: 3em

select
    background-color: lightteal

select.form-control
    color: black

.curs
    cursor: pointer;

.birdy
    float: left
    height: .777em
    cursor: pointer

.faded
    opacity: 0.235654

.faded:hover
    opacity: 1

.conn, .discon
    font-size: 0.8em
    margin-left: 0.5em
    margin-right: 0.5em

.discon
    cursor: pointer
    color: red

.conn
    cursor: pointer
    color: green
    word-wrap: break-word
    word-break: break-word

.clearboth
    // width: 50%
    // margin-left: 50%
    // transform: translateX(-50%)
    // clear: both
    // margin-top: 1em
    // padding-top: 0.75em

code
    word-wrap: break-word
    word-break: break-word

.padleft
    margin-left: 1em

.topspace
    margin-top: 1em

.flex
    display: flex
    flex-wrap: wrap
    flex-basis: 50%
    justify-content: center

@media all and (max-width: 600px)
    .flex
        flex-basis: 100%

.ourinfo
    background: lightGrey
    color: main
    padding: 1em
    border-radius: 1em
    h4
        text-align: center
</style>
