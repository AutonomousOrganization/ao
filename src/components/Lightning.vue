<template lang='pug'>

#nodes
  .container(v-if='$store.state.cash.info && $store.state.cash.info.blockheight')
      .row
          .six.columns.container
              .row
                  p.fl {{ $store.state.cash.info.alias }} Wallet
                  p.fr block {{ $store.state.cash.info.blockheight.toLocaleString() }}
              p.chain
                  span mainnet &#12471; {{ $store.getters.confirmedBalance.toLocaleString() }}
                  .lim(v-if='$store.getters.limbo > 0') limbo &#12471; {{ $store.getters.limbo.toLocaleString() }}
              .row
                  h4(v-if='unchanneled.length > 0') select peer to open channel
                  div(v-for='p in unchanneled' @click='selectPeer(p.id)'  :class='{bluetx: p.id === selectedPeer}') {{ p.id }}
                  button(v-if='selectedPeer'   @click='requestChannel') Request Channel
          .six.columns.container
              p {{ $store.state.cash.info.num_active_channels }} Lightning Channels
              local-remote-bar(v-for='n in $store.state.cash.channels', :c='n')
              hr
              .row
                .six.grid
                  p.local local &#12471; {{ $store.getters.totalLocal.toLocaleString() }}
                .six.grid
                  p.remote remote  &#12471; {{ $store.getters.totalRemote.toLocaleString() }}
      .row
            h3 Connection Info
            template(v-for='a in $store.getters.connectionUris')
                .row.container
                    .six.columns
                        tag(:d='a')
                    .six.columns
                        label {{a}}
      payments
  .row(v-else)
      img.bdoge(src='../assets/images/doge.svg')
      h5 no lightning node
</template>

<script>
import calculations from '../calculations'

import Tag from './Tag'
import LocalRemoteBar from './LocalRemoteBar'
import Payments from './Payments'
import PointsSet from './PointsSet'
import request from 'superagent'

export default {
    mounted(){
        this.$store.commit('setMode' , 4)
        this.$store.commit('setDimension' , 2)
        this.$store.dispatch('loaded')
    },
    data(){
        return {
            selectedPeer: false
        }
    },
    components:{
         Tag, LocalRemoteBar, Payments, PointsSet
    },
    computed: {
        unchanneled(){
            return this.$store.state.cash.info.peers.filter(p => !p.channels)
        }
    },
    methods:{
        selectPeer(pId){
            if (pId === this.selectedPeer){
                return this.selectedPeer = false
            }
            this.selectedPeer = pId
        },
        requestChannel(){
            request
                .post('/lightning/channel')
                .send({id : this.selectedPeer})
                .set("Authorization", this.$store.state.loader.token)
                .end((err, res)=>{
                    console.log("response from channel", res.body)
                })
        }
    }
}

</script>

<style lang='stylus' scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/grid'
@import '../styles/button'

.fw
    width: 100%

.container
    content-align: center

h3
    text-align: center

option
    color: white

a
    color: purple

h1
    text-align: center

.h
    height: 2em

.j
    color: accent1
    font-size: 1.5em
    margin-bottom: 1.123em
    background-color: main

label
    word-break: break-all


#nodes
    color:paleYellow
    width: 100%

.break
    overflow-wrap: break-word;

#worf
    height: 23em

#palm
    width:110%

.setupyourown
    margin-top: 2.2345em
    padding: 2em
    color: purple
    font-size: 1.12em

.small
    font-size: .68em
    word-break: break-all

p
    text-align: center

.fl
    float: left
.fr
    float: right


.local
    margin: 0
    background: wrexpurple
    color: white
    padding: 1em

.remote
    margin: 0
    background: wrexgreen
    color: white
    text-align: right
    padding: 1em

.chain
    margin: 0
    background: wrexyellow
    color: white
    padding: 1em
    text-align: center
    position: relative


.break
    overflow-wrap: break-word;

#worf
    float: right

.lim
  color: black

.block
    float: right
    font-size: .77em

h5
    text-align: center
    color: lightGrey
    opacity: 0.77

.bdoge
    width: 100%
    opacity: 0.77
    height: 5em
    margin-top: 1em
</style>
