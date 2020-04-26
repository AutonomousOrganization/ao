<template lang="pug">
.day
    .date {{ day }}
    router-link(to='/doge')
        img.today(v-if='isToday'  src='../assets/images/uni.svg')
    span(v-for='t in ev')
        .tooltip.upgrade(v-if='t.type !== "task-claimed"')
            img.upgrade(@click="goIn(t.taskId)"  src='../assets/images/timecube.svg'  :class='styl(t.color)')
            .tooltiptext
                .until {{ cardDate(t) }}
                span(v-if='checkIsMember(t.name)')
                    current(:memberId='t.name')
                linky(v-else  :x='t.name')
        span.tooltip.plain.completedcheckmark(v-else  @click='goIn(t.taskId)'  :class='styl(getCardColor(t.taskId))')
            img.completedcheckmark(:class='{smaller: ev.length > 15}'  src='../assets/images/completed.svg')
            .tooltiptext
                current(:memberId='t.memberId')
                span -
                linky.bigger(:x='getCardName(t.taskId)')
</template>

<script>
import _ from 'lodash'
import Linky from './Linky'
import Current from './Current'

function getDMY(ts){
    let d = new Date(ts)
    let day =  d.getDate()
    let month = d.getMonth()
    let year = d.getFullYear()
    let hour = d.getHours()
    let minute = d.getMinutes()
    return { day, month, year, hour, minute }
}

export default {
    components: { Linky, Current },
    props: ['day', 'month', 'year', 'inId', 'ev', 'isToday'],
    methods: {
        styl(color){
            if (!color) return
            return {
                redwx : color == 'red',
                bluewx : color == 'blue',
                greenwx : color == 'green',
                yellowwx : color == 'yellow',
                purplewx : color == 'purple',
                blackwx : color == 'black',
            }
        },
        goIn(taskId){
            let parents = []
            if (this.$store.getters.contextCard.taskId){
                parents.push(this.$store.getters.contextCard.taskId)
            } else if (this.$store.getters.memberCard.taskId){
                parents.push(this.$store.getters.memberCard.taskId)
            }
            this.$store.dispatch("goIn", {
                panel: [taskId],
                top: 0,
                parents
            })
            if(this.$store.state.upgrades.mode === 'doge' && this.$store.getters.contextCard.priorities.length > 0) {
                this.$store.commit("setMode", 1)
            }
            this.$router.push("/" + this.$store.state.upgrades.mode)
        },
        cardDate(b){
            if ( b.book && b.book.startTs ) {
               let DMY = getDMY(b.book.startTs)
               return DMY.hour + ":" + DMY.minute.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
            }
        },
        getCardName(tId){
            return this.$store.getters.hashMap[tId].name
        },
        getCardColor(tId){
            return this.$store.getters.hashMap[tId].color
        },
        checkIsMember(name){
            return this.$store.state.members.some(m => m.memberId === name)
        }
    },
}
</script>

<style lang='stylus' scoped>

@import '../styles/colours'
@import '../styles/tooltips'

.upgrade
    height: 1.6em

.checkmark
    display: inline
    min-height: 1.5em
    margin-right: 2px
    img
        height: 1.5em

.guild
    color: black
    font-size: 0.5em

.today
    width: 100%
    height: 100%
    cursor: pointer
    opacity: 0.6
    display: inline-block
    position: absolute
    top: 0

.type
    font-size: .5em
    float: left
    white-space: nowrap;

.day
    position: relative
    background-color: softGrey
    overflow: visible

.date
    text-align:right
    height: 1.7em
    margin-top: 0
    margin-bottom:-30px
    font-weight: bolder
    font-size: .4em
    padding: 2px 2px 2px 2px
    float: right
    z-index: 5
    position: relative
    pointer-events: none

.amount
    font-size: .49em
    position: absolute;
    bottom: 0;
    left: 0;

.inc
    color: accent2

.dec
    color: red

.b
		text-align: center
		border-radius: 8%
		color: main
		font-size: .8em

.p
		background-color: green
		border-right-style: solid
		border-color: green
.c
		background-color: green

.name
    color: white
    font-size: 1.2em
    margin-right: 1em
    padding-bottom: .321em
    position: relative
    user-select: none

.checkmark
    margin-right: 0.25em

img.checkmark
    height: 2em

img.completedcheckmark
    height: .99em

.clickable
    cursor: pointer
    color: white

.plain
    text-decoration: none
    margin-right: 0.13em

img.completedcheckmark.smaller
    height: 0.33em


</style>
