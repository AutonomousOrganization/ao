<template lang='pug'>

#home
  .container
    h1.fw.center {{totalMembers + totalResources + totalGuilds + totalCards}} Points
    .center
        img.point(src='../assets/images/loggedIn.svg')
        span {{ totalMembers.toFixed(0) }} in accounts
        img.point(src='../assets/images/loader.svg')
        span {{ totalResources.toFixed(0) }} in resources
        img.point(src='../assets/images/orb.svg')
        span {{ totalCards + totalGuilds }} on cards
    .center
        h4.yellowtx backing: {{ satPoint }} &#12471;
    h3(v-for='n in funded.guilds.sort((a, b) => parseInt(a.boost) < parseInt(b.boost))') {{ n.boost.toFixed(0) }} - {{ n.guild }}
    .row.space
        .six.columns
          .input-container
              input#rentInput.input-effect(v-model='rentAmt' type='text'  :class='{"has-content": !!rentAmt}')
              label(for='rentInput') Monthly Rent
              span.focus-border
          button(v-if='rentAmt > 0'  @click='setRent') Set Rent
        .six.columns
          div.input-container
              input#capInput.input-effect(v-model='capAmt' type='text'  :class='{"has-content": !!capAmt}')
              label(for="capInput") Set Monthly Cap
              span.focus-borders
          button(v-if='capAmt > 0'  @click='setCap') Set Cap
    .row.center
        .seven.grid
            p.underline.padd {{ parseInt($store.state.cash.rent) }} Rent
            p {{ activeMembers }} Active
        .one.grid
            .equals =
        .four.grid.equals2
            p {{ parseInt(perMonth) }} each
            p.redtx [{{ $store.state.cash.cap }} max]
    div(v-for='n in funded.members.sort((a, b) => parseInt(a.boost) < parseInt(b.boost))')
        span {{ n.boost.toFixed(0) }}
        current(:memberId='n.taskId')
    template(v-for='n in funded.cards.sort((a, b) => parseInt(a.boost) < parseInt(b.boost))')
        p {{ n.boost }} - {{ n.name }}
            span(@click='burn(n.taskId)')
                img.burn(src='../assets/images/goodbye.svg')
    div(v-for='n in funded.resources.sort((a, b) => parseInt(a.boost) < parseInt(b.boost))')
        span {{ n.boost.toFixed(0) }}
        currentr(:resourceId='n.taskId')
</template>

<script>


export default {
    data(){
        return {
            capAmt: '',
            rentAmt: ''
        }
    },
    methods: {
        burn(taskId){
            this.$store.dispatch('makeEvent', {
                type: 'task-removed', taskId // xxx DON'T REMOVE CARD, REMOVE POINTS
            })
        },
        setCap(){
            this.$store.dispatch('makeEvent', {
                type: 'cap-set',
                amount: this.capAmt
            })
        },
        setRent(){
            this.$store.dispatch('makeEvent', {
                type: 'rent-set',
                amount: this.rentAmt
            })
        },
    },
    computed: {
        funded(){
            let members = []
            let guilds = []
            let resources = []
            let cards = []
            this.$store.state.tasks.forEach(t => {
                if( t.boost > 0 ){
                    if (this.$store.getters.memberIds.indexOf(t.taskId) > -1){
                      members.push(t)
                    } else if (this.$store.getters.resourceIds.indexOf(t.taskId) > -1) {
                      resources.push(t)
                    } else if (t.guild) {
                      guilds.push(t)
                    } else {
                      cards.push(t)
                    }
                }
            })
            return {members, guilds, resources, cards}
        },
        totalMembers(){
            let totalMembers = 0
            this.funded.members.forEach(t => {
                totalMembers += parseFloat( t.boost )
            })
            return totalMembers
        },
        totalGuilds(){
            let totalGuilds = 0
            this.funded.guilds.forEach(t => {
                totalGuilds += parseFloat( t.boost )
            })
            return totalGuilds
        },
        totalCards(){
            let totalCards = 0
            this.funded.cards.forEach(t => {
                totalCards += parseFloat( t.boost )
            })
            return totalCards
        },
        totalResources(){
            let totalResources = 0
            this.funded.resources.forEach(t => {
                totalResources += parseFloat( t.boost )
            })
            return totalResources
        },
        totalPointsSum(){
            return this.totalMembers + this.totalGuilds + this.totalResources + this.totalCards
        },
        satPoint(){
            let sp = this.$store.getters.totalWallet / this.totalPointsSum
            return sp ? sp : 0
        },
        activeMembers(){
            let a = 0
            this.$store.state.members.forEach(m => {
                if (m.active > 0){
                    a ++
                }
            })
            return a
        },
        perMonth(){
            return this.$store.state.cash.rent / this.activeMembers
        }
    },
    mounted() {
        this.$store.commit('setMode' , 2)
        this.$store.commit('setDimension' , 2)
        this.$store.dispatch('loaded')
    }
}

</script>

<style lang='stylus' scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/grid'
@import '../styles/breakpoints'
@import '../styles/title'
@import '../styles/input'
@import '../styles/button'

.space
    margin-top: 1.7em

.fw
    width: 100%

.btcspot , .satspot
    position: absolute
    top: 0
    z-index: 11
    padding: 1em

@media (max-width: breakpoint)
    .btcspot , .satspot
        display: none

.btcspot
    right: 111px

.satspot
    left: 111px

.center
    text-align: center

.intro
    padding: 5em 0;

p
    font-size:1.1em
    color:white
    font-family: 'Open Sans', light, sans-serif;

h1
    text-align: center

h3
    text-align: center
    color:accent1
    font-family: 'Open Sans', light, sans-serif;
    font-size:3em

a
    color: accent2
    text-decoration: none;

a:visited
    color: accent1

#whales
    width: 100%
    opacity: 0.234567


.evhis
  margin-top: 2em
  button
    background-color: purple
    background: purple

select
  color: white
  background: purple

.info
  color: accent2
  font-size: 1.2em
  text-align: center

.p
  color: purple

#sundogepurp
  width:100%
  max-height:auto

#burg
    float: right;
    margin-bottom: -9em

#addmember
    height: 5em
    float: right
    margin-bottom: -1em
    z-index: 1010

.open
    background: red

.number
    font-size: 1.1em
    color: green

.underline
    border-bottom-style: solid
    border-color: accent2
    padding-left: 1em

.equals
    margin-top: 1.3em
    font-size: 2em

.equals2
    margin-top: 1.1em
    font-size: 1.69em

.padd
    padding: 1em

.purplewx
    color: white
    transition: opacity 2s;

.slide-fade-enter-active {
  transition: all .6s ease;
}
.slide-fade-leave-active {
  transition: all .4s ease;
}
.slide-fade-enter {
  // transform: translateY(-400px);
  opacity: 0;
}
.slide-fade-leave-to {
 // transform: translateY(-400px);
  opacity: 0;
}

ul
    text-align: left

img.point
    height: 3em

.burn
    height: 1em
    transform: rotate(180deg)

.fr
    float: right

.center
    text-align: center



</style>
