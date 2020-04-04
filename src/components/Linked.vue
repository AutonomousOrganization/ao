
<template lang='pug'>

div.totop(v-if='links.length > 0')
    div(@click='toggleBird')
        .singlebird(v-if='!$store.state.upgrades.bird')
            .row.pad.centered
                img.send(src='../assets/images/ao.svg')
                span {{ links.length}}
        template(v-else  v-for='n in links')
            .row.pad.centered
                h6 {{n}}
</template>

<script>

import request from 'superagent'
import Current from './Current'

export default {
    props: ['b'],
    components: { Current },
    methods:{
        toggleBird(){
            this.$store.commit('toggleBird')
        },
    },
    computed: {
        links(){
            let links = []
            this.$store.state.ao.forEach(a => {
              if (a.links.indexOf(this.b.taskId) > -1) {
                links.push(a.address)
              }
            })
            return links
        },
        toMe(){
            let m = []
            if (this.b && this.b.passed.length > 0){
                m = this.b.passed.filter(p => p[1] === this.$store.getters.member.memberId)
            }
            return m
        }
    }
}

</script>

<style lang='stylus' scoped>

@import '../styles/grid';
@import '../styles/colours';
@import '../styles/tooltips';

.row
    width: 100%

.send
    height: 1.5em

.accept, .dontaccept
    width: 100%
    background: accent5
    padding: .789em
    border-style: none
    img
        background: white
        padding: .1em
        border-radius: 3px

.arrow
    height: 3.35em

.fl
    float: left
.fr
    float: right

.totop
    z-index: 1000

.pad
    margin-top: 1em
    margin-bottom: 1em

.centered
    text-align: center
</style>
