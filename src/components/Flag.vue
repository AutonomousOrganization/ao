<template lang='pug'>
.flag(v-if="$store.getters.memberCard")
    .flaggy(:id='uuid'  :class='flagClass')
        img(v-if='$store.state.upgrades.mode === "badge"'  src='../assets/images/badge.svg'  :class='{hidden:!$store.getters.member.guides}')
        img(v-else-if='$store.state.upgrades.mode === "chest"'  src='../assets/images/chest.svg'  :class='{hidden:!$store.getters.member.guides}')
        img(v-else-if='$store.state.upgrades.mode === "timecube"' src='../assets/images/timecube.svg'  :class='{hidden:!$store.getters.member.guides}')
        img.svgwhite.faded(v-else, src='../assets/images/upboat.svg'  :class='{hidden:!$store.getters.member.guides}')
    .opened
        resource-book(v-if='isCubeOpen'  :tId='b.taskId'  :showSet='true')
        guild-create(:editing='isPayOpen'  :b='b')
        points-set(v-if='isChestOpen'  :b='b')
</template>

<script>

import Hammer from 'hammerjs'
import Propagating from 'propagating-hammerjs'
import uuidv1 from 'uuid/v1'
import ResourceBook from './ResourceBook'
import GuildCreate from './GuildCreate'
import PointsSet from './PointsSet'

export default {
    components: { ResourceBook, GuildCreate , PointsSet},
    data(){
        return {
            isPayOpen: false,
            isCubeOpen: false,
            isChestOpen:false,
            uuid: uuidv1(),
        }
    },
    props: ['b', 'inId'],
    mounted() {
        let el = document.getElementById(this.uuid)
        if(!el) return
        let mc = Propagating(new Hammer.Manager(el))

        let Tap = new Hammer.Tap({ time: 400 })
        mc.add(Tap)
        mc.on('tap', (e) => {
            let mode = this.$store.state.upgrades.mode
            switch(mode) {
                case 'doge':
                case 'boat':
                    if (this.isTop){
                        this.dogeIt()
                    } else {
                        this.flagIt()
                    }
                    break
                case 'chest':
                    this.toggleChest()
                    break
                case 'badge':
                    this.togglePay()
                    break
                case 'timecube':
                    this.toggleCube()
                    break
            }
            e.stopPropagation()
        })

        let Press = new Hammer.Press({ time: 400 })
        mc.add(Press)
        mc.on('press', (e) => {
            switch(this.$store.state.upgrades.mode) {
                case 'doge':
                case 'boat':
                    this.pilePrioritized()
                    break
                case 'badge':
                case 'chest':
                case 'timecube':
                    this.flagIt()
                    return
            }

            e.stopPropagation()
        })

        let Swipe = new Hammer.Swipe()
        mc.add(Swipe)
        mc.on('swipeleft', (e) => {
            this.$store.dispatch('previousUpgradeMode')
            e.stopPropagation()
        })

        mc.on('swiperight', (e) => {
            this.$store.dispatch('nextUpgradeMode', this.$router)
            e.stopPropagation()
        })
    },
    methods: {
        complete(){
            this.$store.dispatch("makeEvent", {
                type: 'task-claimed',
                inId: this.inId,
                taskId: this.b.taskId,
                memberId: this.$store.getters.member.memberId,
                notes: 'checked by ' + this.$store.getters.member.memberId
            })
        },
        uncheck(){
            this.$store.dispatch("makeEvent", {
                type: 'task-unclaimed',
                taskId: this.b.taskId,
                memberId:  this.$store.getters.member.memberId,
                notes: ''
            })
        },
        pilePrioritized(){
            let colorIds = this.$store.getters[this.b.color].map(t => t.taskId)
            let isOneOf = colorIds.indexOf(this.b.taskId) > -1
            if (this.$store.getters.member.stacks === 5 && isOneOf){
                this.$store.dispatch("makeEvent", {
                  type: 'pile-prioritized',
                  tasks: colorIds,
                  inId: this.$store.getters.contextCard.taskId,
                })
            }
        },
        togglePay(){
            this.isPayOpen = !this.isPayOpen
            this.isChestOpen = false
            this.isCubeOpen = false
        },
        toggleChest(){
            this.isChestOpen = !this.isChestOpen
            this.isPayOpen = false
            this.isCubeOpen = false
        },
        toggleCube(){
            this.isCubeOpen = !this.isCubeOpen
            this.isChestOpen = false
            this.isPayOpen = false
        },
        deckIt(){
            this.$store.dispatch("makeEvent", {
                type: 'task-sub-tasked',
                subTask: this.b.taskId,
                taskId: this.$store.getters.memberCard.taskId,
            })
        },
        flagIt(){
                let parentId = this.$store.state.context.parent[this.$store.state.context.parent.length-1]

                if (this.inId){
                    this.$store.dispatch("makeEvent", {
                      type: 'task-prioritized',
                      taskId: this.b.taskId,
                      inId: this.inId,
                    })
                } else if (parentId) {
                    this.$store.dispatch("makeEvent", {
                      type: 'task-prioritized',
                      taskId: this.b.taskId,
                      inId: parentId,
                    })

                    let p = _.filter(this.$store.state.context.panel,(p)=> p !==  this.b.taskId)

                    if (p.length < 1){
                        this.$store.dispatch('goUp', {
                          target: parentId,
                          panel: [parentId],
                          top: 0
                        })
                    } else {
                        this.$store.commit('setPanel', p)
                        this.$store.commit('setTop', this.$store.state.context.top % p.length)
                    }
                }
                if(this.$store.state.upgrades.mode === 'doge') {
                    this.$store.commit("setMode", 1)
                    this.$router.push("/boat")
                }
        },
        dogeIt(){
            if(!this.isDoged) {
                this.$store.dispatch("makeEvent", {
                  type: 'task-prioritized',
                  taskId: this.b.taskId,
                  inId: this.$store.getters.memberCard.taskId,
                })
            } else {
                this.$store.dispatch("makeEvent", {
                  type: 'task-refocused',
                  taskId: this.b.taskId,
                  inId: this.$store.getters.memberCard.taskId,
                })
            }
        }
    },
    computed: {
        isOracle() {
          return this.$store.state.upgrades.dimension === 'sun' && this.$store.state.upgrades.mode === 'doge'
        },
        isTop() {
          return this.$store.state.upgrades.dimension === 'sun' && this.$store.state.upgrades.mode === 'boat'
        },
        flagClass(){
            return {
                boat : (this.$store.state.upgrades.mode === "boat" || this.$store.state.upgrades.mode === "doge") && !this.isDoged,
                doge : (this.$store.state.upgrades.mode === "boat" || this.$store.state.upgrades.mode === "doge") && this.isDoged,
                chest : this.$store.state.upgrades.mode === "chest",
                timecube : this.$store.state.upgrades.mode === "timecube"
            }
        },
        isFlagged(){
            if(!this.inId) {
                return false
            }
            return this.$store.getters.hashMap[this.inId].priorities.indexOf(this.b.taskId) > -1
        },
        isCompleted(){
            return this.b.claimed.indexOf(this.$store.getters.member.memberId) > -1
        },
        isDoged() {
            return this.$store.getters.memberCard.priorities.indexOf(this.b.taskId) > -1
        },
    },
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours';
@import '../styles/skeleton';
@import '../styles/grid';
@import '../styles/button';

.flag, .opened
    width: 100%

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

.flaggy
    position: absolute
    right: 1em
    top: 1em
    height: 1em
    cursor: pointer
    z-index: 99

.flaggy img
    pointer-events: none
    height: 100%

.doge
    height: 1.3em
    margin-top: -0.1em
    margin-right: -0.1em

.chest, .timecube
    height: 1.1em
    margin-top: -0.2em
    margin-right: -0.2em

.boat
    height: 1em
    margin-top: -0.2em
    margin-right: -0.4em

.faded
    opacity: 0.235654

.faded:hover
    opacity: 1

.svgwhite
    fill: white

.svgwhite:hover
    transform: rotate(-30deg)

.opened
    float: left

.hidden
    opacity: 0

.hidden:hover
    opacity: 0.25654
</style>
