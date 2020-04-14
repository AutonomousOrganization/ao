<template lang='pug'>
#createtask(ref="closeable")
  div(v-if='isCard')
      transition(name="slide-fade")
        .cc(v-show='showCreate')
            textarea#card(v-model='debouncedName' type='text'  :class='cardInputSty'  placeholder="textarea"  @keyup.enter.exact='createOrFindTask'  @keydown.enter.exact.prevent  @keyup.esc='closeCreate'  @input='exploring = false' row='10' col='20').paperwrapper
            .boatContainer
                img.boatAll.faded.adjtooltip(src='../assets/images/downboat.svg'  @click='resetCard')
                .tooltiptext.correctspotleft(v-if='$store.getters.member.tooltips')
                    p.suggest.label clear
                img.boatAll.boatR.faded.adjtooltip(src='../assets/images/upboat.svg'  @click='createOrFindTask')
                .tooltiptext.correctspot(v-if='$store.getters.member.tooltips')
                    p.suggest.label create card
      #btnpanel.btnpanel.adjtooltip
          div(:class='{ opaque : showCreate, btnwrapper : !showCreate }')
            button.lit(@click='switchColor("red")'  :class='{ currentColor : showCreate && task.color === "red" }').redwx.paperwrapper
              img(:class='{ down : showCreate && task.color === "red" }')
            button.lit(@click='switchColor("yellow")'  :class='{ currentColor : showCreate && task.color === "yellow" }').yellowwx.paperwrapper
              img(:class='{ down : showCreate && task.color === "yellow" }')
            button.lit(@click='switchColor("green")'  :class='{ currentColor : showCreate && task.color === "green" }').greenwx.paperwrapper
              img(:class='{ down : showCreate && task.color === "green" }')
            button.lit(@click='switchColor("purple")'  :class='{ currentColor : showCreate && task.color === "purple" }').purplewx.paperwrapper
              img(:class='{ down : showCreate && task.color === "purple" }')
            button.lit(@click='switchColor("blue")'  :class='{ currentColor : showCreate && task.color === "blue" }').bluewx.paperwrapper
              img(:class='{ down : showCreate && task.color === "blue" }')
      .tooltiptext.correctspot(v-if='$store.getters.member.tooltips')
          p.suggest.label create card
      .scrollbarwrapper(v-show='showCreate && task.search.length >= 2 && (matchCards.guilds.length + matchCards.doges.length + matchCards.cards.length) > 0'  v-model='task.search')
          .searchresults
              .boatContainer
                  img.boatAll.faded(src='../assets/images/downboat.svg'  @click='deBoatAll')
                  img.boatAll.boatR.faded(src='../assets/images/upboat.svg'  @click='boatAll')
              .result(v-for='t in matchCards.guilds'  @click.stop='debounce(loadResult, 500, [t])'  :class='resultInputSty(t)'  @dblclick.stop='goIn(t.taskId)')
                  img.smallguild(src='../assets/images/badge.svg')
                  span {{ t.guild }}
                  div {{ shortName(t.name) }}
              .result(v-for='t in matchCards.doges'  @click.stop='debounce(loadResult, 500, [t])'  :class='resultInputSty(t)'  @dblclick.stop='goIn(t.taskId)')
                  current(:memberId='t.taskId')
              .result(v-for='t in matchCards.cards'  @click.stop='debounce(loadResult, 500, [t])'  :class='resultInputSty(t)'  @dblclick.stop='goIn(t.taskId)') {{ shortName(t.name) }}
  div(v-else)
      img.uni(src="../assets/images/uni.svg"  @click='toCardMode')
</template>

<script>

import _ from 'lodash'
import request from "superagent"
import Current from './Current'
import calculations from '../calculations'

export default {
    data(){
        return {
            showCreate: false,
            task: {
                name: '',
                search: '',
                color: 'green',
            },
            swipeTimeout: 0,
            searchResults: [],
            exploring: false,
            inDebounce: false,
        }
    },
    components: {
        Current
    },
    mounted() {
        var el = document.getElementById('btnpanel')
        var mc = new Hammer.Manager(el)

        var Swipe = new Hammer.Swipe()
        let longPress = new Hammer.Press({ time: 400 })

        mc.add([Swipe, longPress])

        mc.on('press', (e) => {
            navigator.clipboard.readText().then(clippy => {
                console.log('press', clippy)
                this.openCreate()
                if (clippy){
                  this.task.name += clippy
                }
            })
        })

        mc.on('swipeleft', (e) => {
            if(Date.now() - this.swipeTimeout > 100) {
                this.previousColor()
                this.swipeTimeout = Date.now()
            }
        });

        mc.on('swiperight', (e) => {
            if(Date.now() - this.swipeTimeout > 100) {
                this.nextColor()
                this.swipeTimeout = Date.now()
            }
        });

        mc.on('swipedown', (e) => {
            if(Date.now() - this.swipeTimeout > 100) {
                this.closeCreate()
                this.swipeTimeout = Date.now()
            }
        });

        mc.on('swipeup', (e) => {
            if(Date.now() - this.swipeTimeout > 100) {
                this.openCreate()
                this.swipeTimeout = Date.now()
            }
        });
    },
    methods: {
        boatAll(){
            this.$store.dispatch("makeEvent", {
                type: 'pile-prioritized',
                tasks: this.matchIds,
                inId: this.$store.getters.contextCard.taskId,
            })
        },
        deBoatAll(){
            this.$store.dispatch("makeEvent", {
                type: 'pile-de-sub-tasked',
                tasks: this.matchIds,
                inId: this.$store.getters.contextCard.taskId,
            })
        },
        toCardMode(){
            this.$store.commit("setDimension", 0)
            this.$router.push('/' + this.$store.state.upgrades.mode)
        },
        goIn(taskId){
            clearTimeout(this.inDebounce)
            let panel = [taskId]
            let parents = [  ]
            let top = 0

            if (this.$store.getters.contextCard.taskId){
                parents.push(this.$store.getters.contextCard.taskId)
            } else if (this.$store.getters.memberCard.taskId){
                parents.push(this.$store.getters.memberCard.taskId)
            }
            this.$store.dispatch("goIn", {
                parents,
                top,
                panel
            })
            if(this.$store.state.upgrades.mode === 'doge' && this.$store.getters.contextCard.priorities.length > 0) {
                this.$store.commit("setMode", 1)
            }
            this.$router.push("/" + this.$store.state.upgrades.mode)
        },
        switchColor(color, refocus = true){
            if (this.task.color === color){
                this.showCreate = !this.showCreate
            } else if (this.showCreate) {
                // don't close, switch
            } else {
                this.showCreate = !this.showCreate
            }
            this.task.color = color
            if(refocus) {
                setTimeout(()=>{
                    document.getElementById('card').focus()
                }, 1)
            }
        },
        resetCard(){
            this.showCreate = false
            this.task.name = ''
            this.task.search = ''
        },
        subTaskTask(taskId) {
            this.$store.dispatch("makeEvent", {
                type: 'task-sub-tasked',
                taskId: this.taskId,
                subTask: taskId,
                memberId: this.$store.getters.member.memberId,
            })
        },
        createOrFindTask(){
            let foundId = this.matchCard
            let potentialCard = this.task.name.trim()
            this.resetCard()
            if(!foundId) {
                this.$store.dispatch("makeEvent", {
                    type: 'task-created',
                    name: potentialCard,
                    color: this.task.color,
                    deck: [this.$store.getters.member.memberId],
                    inId: this.taskId,
                })
            } else {
                this.subTaskTask(foundId)
            }
            // XXX searchbar finding created
            setTimeout( ()=> { this.resetCard() }, 7)
        },
        isGrabbed(taskId){
            return this.$store.getters.hashMap[taskId].deck.indexOf( this.$store.getters.member.memberId ) > -1
        },
        nextColor() {
            let colors = ['red', 'yellow', 'green', 'purple', 'blue']
            let color = colors.indexOf(this.task.color)
            color++
            this.switchColor(colors[color > 4 ? 0 : color], false)
        },
        previousColor() {
            let colors = ['red', 'yellow', 'green', 'purple', 'blue']
            let color = colors.indexOf(this.task.color)
            color--
            this.switchColor(colors[color < 0 ? 4 : color], false)
        },
        openCreate() {
            this.showCreate = true
        },
        closeCreate() {
            this.showCreate = false
        },
        resultInputSty(card) {
          return {
              redtx : card.color == 'red',
              bluetx : card.color == 'blue',
              greentx : card.color == 'green',
              yellowtx : card.color == 'yellow',
              purpletx : card.color == 'purple',
              blacktx : card.color == 'black',
          }
        },
        loadResult(t) {
            this.exploring = true
            this.task.name = t.name.trim()
            this.task.color = t.color
        },
        debounce(func, delay) {
            const context = this
            const args = arguments
            clearTimeout(this.inDebounce)
            this.inDebounce = setTimeout(() => func.apply(context, args[2]), delay)
        },
        shortName(theName) {
            return calculations.shortName(theName)
        },
    },
    computed: {
        isCard(){
            return this.$store.state.upgrades.dimension === 'unicorn'
        },
        taskId(){
            return this.$store.getters.contextCard.taskId
        },
        matchCard(){
            let foundId
            this.$store.state.tasks.filter(t => {
                if(t.name === this.task.name.trim()) {
                    foundId = t.taskId
                }
            })
            return foundId
        },
        matchCards() {
            if(this.task.search.length < 1) return []
            if(this.exploring) return this.searchResults
            let matches = []
            let guildmatches = []
            let dogematches = []
            try {
                let regex = new RegExp(this.task.search, 'i')
                this.$store.state.tasks.forEach(t => {
                    if(t.guild && regex.test(t.guild)) {
                        guildmatches.push(t)
                    } else if(regex.test(t.name)) {
                        matches.push(t)
                    }
                })
                this.$store.state.members.forEach(member => {
                    if(regex.test(member.name)) {
                        let result = this.$store.getters.hashMap[member.memberId]
                        result.name = member.name
                        dogematches.push(result)
                    }
                })
            } catch (err){
                console.log("regex search terminated in error: ", err)
            }
            this.searchResults = { guilds: guildmatches, doges: dogematches, cards: matches }
            return this.searchResults
        },
        matchIds(){
            return this.matchCards.guilds.concat(this.matchCards.doges).concat(this.matchCards.cards)
                .map(t => t.taskId)
        },
        colorWord(){
            switch (this.task.color) {
                case "blue": return 'info'
                case "red": return 'challenge'
                case "green": return 'do'
                case "purple": return 'dream'
                case "yellow": return 'align'
                case "black": return 'bark'
            }
        },
        cardInputSty() {
            return calculations.cardColorCSS(this.task.color)
        },
        debouncedName: {
            get() {
                return this.task.name
            },
            set(newValue) {
                this.task.name = newValue
                this.debounce(() => {
                    this.task.search = newValue
                }, 400)
            }
        },
    }
}

</script>

<style lang='stylus' scoped>

@import '../styles/colours'
@import '../styles/button'
@import '../styles/breakpoints'
@import '../styles/input'
@import '../styles/tooltips'

.tooltiptext.correctspot
    position: absolute
    top: -.6em
    right: -2em
    color: white

.tooltiptext.correctspotleft
    position: absolute
    top: -.6em
    left: -2em
    color: white

#createtask
  width: fit-content
  background-color: rgba(51, 51, 51, 0.3)
  color: accent1
  margin: 0 auto 0 auto
  text-align: center
  padding: 0.5em
  position: fixed
  left: 1em
  z-index: 149
  bottom: 0
  left: 50%
  transform: translateX(-50%)

button
    background: green
    border-color: rgba(0, 0, 0, 0.4)
    margin-bottom: 0.5em
    margin-top: 0.2em

.lit
    opacity: 0.69

.btnwrapper:hover > .lit
    opacity: 0.83

.btnwrapper:hover > .lit:hover
    opacity: 1

.opaque > button.lit
    opacity: 1

.onetime
    display: inline

.color
    height: 2.5em
    color: white
    padding: 1em

.colorlabel
    color: white
    align-content: center;
    text-align: center

@media (max-width: breakpoint)
    .colorlabel
        span
            display: none

#bark
    float: right
    height: 3em

.fwi
    text-align: center
    color: white

.tealbk
    background: green

.cc
    position: relative

p
    color: accent1

.upgradeimg
   height: 3em

.btnpanel
    button
        cursor: pointer
        min-height: 2.5em
        width: 4.045085em
        max-width: 20%
        margin: 0

.btnwrapper
    width: 100%
    display: block
    text-align: center

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

.label
    color: white
    font-weight: bolder

.textarea
    padding-top: 1em
    border-color: rgba(0, 0, 0, 0.4)
    height: 12.5em
    padding-top: 5.5em

.centr
    text-align: center

.paperwrapper
    position: relative

.agedbackground
    background-image: url('/paper.jpg')
    background-repeat: no-repeat
    background-position: center center
    background-size: cover
    top: 0
    left: 0
    bottom: 0
    right: 0
    position: absolute
    width: 100%
    height: 100%
    opacity: 0.2

.down
    background-image: url('../assets/images/down.svg')
    background-size: cover
    background-position: center center
    top: 0
    left: 0
    right: 0
    position: absolute
    width: 100%
    height: 100%
    opacity: 0.9

.currentColor
    opacity: 1

.closeit
    position: fixed
    width: 100%
    height: 90%
    background-color: rgba(22, 22, 22, 0.2)
    z-index: 148
    top: 0
    left: 0
    margin: 0
    padding: 0

.scrollbarwrapper
    width: 37vw
    height: calc(100% - 2em)
    position: absolute
    top: calc(-100% - 0.5em)
    left: 0
    background: rgba(22, 22, 22, 0.8)
    padding: 1em 0
    border-radius: 20px

@media only screen and (max-width: 68em)
    .scrollbarwrapper
        width: 100%

.searchresults
    overflow: auto
    color: white
    font-size: 1.1em
    height: 100%
    padding: 0 1em
    word-wrap: break-word

::-webkit-scrollbar
    background-color: rgba(22, 22, 22, 0.4)

::-webkit-scrollbar-thumb
    background-color: rgba(89, 89, 89, 0.4)

::-webkit-scrollbar-thumb:hover
    background-color: rgba(255, 255, 255, 0.75)

.result
    margin-bottom: 0.3em
    cursor: pointer

.smallguild
    height: 1em
    margin-right: 0.3em
    position: relative
    top: 0.16em

.guildname
    font-weight: bold

.current.result
    display: block

.uni
    position: fixed
    bottom: 0
    left: 50%
    transform: translateX(-50%)
    height: 5.5555555555em
    cursor: pointer
    z-index: 9002

.boatContainer
    display: flex;
    justify-content: space-between;
    width:100%
    height:45px

.boatAll
    margin: 0 1em 0 1em
    height: 20px;
    position: relative
    margin-top: 1em
    margin-bottom: 1em
    opacity: .3
    z-index:9999999999999
    cursor: pointer

.boatR
    position: absolute
    right: 0px
    height:20px

.faded
    opacity: 0.235654

</style>
