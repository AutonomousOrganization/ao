<template lang='pug'>

#resource.container
    h1.fw.center {{resources.length}} resource
        span(v-if='resources.length > 1') s
    .list(v-if='isLoggedIn  && resources.length > 0')
        row(v-for="r in resources", :r="r", :c='panel')
    .padding
        button(@click='createTest') create test resource
        h5 fobtap points
        ol
            li Raspberry pi running on Door, vending machine, ... many possibilities
</template>

<script>

import Row from "./ResourceRow"
import uuidV1 from 'uuid/v1'

export default {
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
                name: 'test2e',
                charged: 0,
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

</style>
