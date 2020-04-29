<template lang='pug'>

#resource.container
    h1.fw.center {{resources.length}} resource
        span(v-if='resources.length > 1') s
    p.redtx(v-if='$store.getters.member.active <= 0')
        span inactive account
    .list(v-if='isLoggedIn  && resources.length > 0'  :class='{faded: $store.getters.member.active <= 0 }')
        row(v-for="r in resources", :r="r", :c='panel')
    .padding
        .input-container
            input.input-effect(v-model='name' type='text'  :class='{"has-content":!!name}')
            label resource name
            span.focus-border
        .input-container(v-if='name.length > 0' )
            input.input-effect(v-model='charged' type='text'  :class='{"has-content":!!charged}')
            label charged amount
            span.focus-border
        button(v-if='name.length > 0'  @click='createTest') create test resource
        h6 raspberry pi connected to lock, vending machine, ...
        h6 github.com/AutonomousOrganization/pi
</template>

<script>

import Row from "./ResourceRow"
import uuidV1 from 'uuid/v1'

export default {
    data(){
        return {
            name: '',
            charged: '0'
        }
    },
    mounted() {
        this.$store.commit('setMode' , 0)
        this.$store.commit('setDimension' , 2)
        this.$store.dispatch('loaded')
    },
    computed: {
        resources(){
            return this.$store.state.resources.slice().filter(r => !r.pubkey )
        },
        isLoggedIn(){
            return this.$store.getters.isLoggedIn
        },
        panel(){
            return this.resources.map(r => r.resourceId)
        }
    },
    components:{
        Row,
    },
    methods: {
        createTest(letter){
            let newEv = {
                type: 'resource-created',
                resourceId: uuidV1(),
                name: this.name,
                charged: parseInt(this.charged) || 0,
                secret: 'asd123',
                trackStock: true
            }
            console.log('new r', newEv)
            this.$store.dispatch("makeEvent", newEv)
        },
    }
}

</script>

<style lang='stylus' scoped>

@import '../styles/colours'
@import '../styles/button'
@import '../styles/skeleton'
@import '../styles/title'
@import '../styles/input'

p.redtx
  span
    background: lightGrey
    padding:.4321em
    border-radius:.4321em

.faded
    opacity: .231

.center
    text-align: center

.fw
    width: 100%

#resource
    width: 100%

.padding
    padding: 1.987654321em
li
    margin-left: 1em

h6
    text-align: center

</style>
