<template lang="pug">

#calendar(:key='inId')
    .row.menu
        .inline(@click='prevMonth')
            img(src='../assets/images/back.svg')
        .inline
            .soft {{ monthName }} - {{year}}
                span(v-if='chosenDay') - {{ chosenDay }}
        .inline(@click='nextMonth')
            img(src='../assets/images/forward.svg')
    .calmonth(v-if='areEvs  &&  !chosenDay')
        .weekday(v-for='day in DAYS_OF_WEEK') {{ day }}
        .placeholder(v-for='placeholder in firstDay')
        div(v-for='day in days'  @click='chooseDay(day)')
            day(:day="day", :month='month', :year='year'  :inId='inId'  :ev="eventsByDay[day]"  :isToday='checkToday(day, month, year)')
    div(v-else)
        h5
            span(v-if='!areEvs') none
            span  {{monthName}}
            span(v-if='chosenDay')  {{chosenDay}}
        div(v-for='n in selectedDaysEvs')
            .tooltip(v-if='n.type === "task-claimed"')
                current(:memberId='n.memberId')
                span {{ new Date(n.timestamp).toString().slice(15,21) }} - {{ getFromMap(n.taskId).name }}
            .tooltip(v-if='n.type === "task-booked"')
                span {{ new Date(n.timestamp).toString().slice(15,21) }} - {{ getFromMap(n.taskId).name }}
        img.bdoge(src='../assets/images/doge.svg'  @click='chooseDay(false)')
    .buffer
</template>

<script>
import Day from './Day.vue'
import Current from './Current.vue'

function getDMY(ts){
    let d = new Date(ts)
    let day =  d.getDate()
    let month = d.getMonth()
    let year = d.getFullYear()
    return { day, month, year }
}

export default {
  props: ['inId'],
  components: {
    Day, Current
  },
  methods: {
      getFromMap(taskId){
          return this.$store.getters.hashMap[taskId]
      },
      chooseDay(x){
          this.chosenDay = x
      },
      nextMonth(){
          if (this.chosenDay){
              return this.chosenDay ++
          }
          if (this.month == 11){
            this.year++
            this.month = 0
          }
          else {
            this.month++
          }
      },
      prevMonth(){
          if (this.chosenDay){
              return this.chosenDay --
          }
          if (this.month == 0){
              this.year--
              this.month = 11
          }
          else {
              this.month--
          }
      },
      nextYear(){
          this.year++
      },
      prevYear(){
          this.year--
      },
      checkToday(day, month, year){
          let isToday = day === this.today.day && month === this.today.month && year === this.today.year
          return isToday
      }
  },
  computed: {
    selectedDaysEvs(){
        return _.uniqBy(this.eventsByDay[this.chosenDay], u => u.timestamp).sort((a, b) => a.timestamp - b.timestamp)
    },
    today(){
        return getDMY(Date.now())
    },
    areEvs(){
        return Object.keys(this.eventsByDay).length > 0
    },
    eventsByDay(){
        let evs = {}
        if (this.inId){
            this.todaysEvents.forEach(t => {
                t.claims.forEach(cl => {
                    let date = getDMY(cl.timestamp)
                    if (date.month === this.month && date.year === this.year){
                        if (!evs[date.day]){
                            evs[date.day] = []
                        }
                        evs[date.day].push(cl)
                    }
                })

                if (t && t.book && t.book.startTs){
                    let date = getDMY(t.book.startTs)
                    if (date.month === this.month && date.year === this.year){
                        if (!evs[date.day]){
                            evs[date.day] = []
                        }
                        if(evs[date.day].indexOf(t) === -1) {
                            evs[date.day].push(t)
                        }
                    }
                }
            })
        }

        return evs
    },
    card(){
        return this.$store.getters.hashMap[this.inId]
    },
    todaysEvents(){
        let allTasks
        if (this.inId && this.card){
            allTasks = this.card.subTasks.concat(this.card.priorities).concat(this.card.completed)
        } else {
            allTasks = []
        }
        allTasks.push(this.inId)

        let sunTasks = []
        if (this.$store.state.upgrades.dimension === 'sun'){
            this.$store.state.members.forEach(m => {
                sunTasks.push( m.memberId )
                let sun = this.$store.getters.hashMap[m.memberId]
                allTasks = allTasks.concat(sun.subTasks).concat(sun.priorities).concat(sun.completed)
            })
        }

        allTasks = _.uniq(allTasks.concat(sunTasks))
        return allTasks
            .map(tId => {
                return this.$store.getters.hashMap[tId]
            })
    },
    firstDay(){
      let date = new Date(this.year, this.month, 1)
      let firstDay = date.getDay()
      return firstDay
    },
    days(){
      return  new Date(this.year, this.month + 1, 0).getDate()
    },
    monthName(){
        var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return mL[this.month]
    }
  },
  data () {
    let current = new Date
    let year = current.getFullYear()
    let month = current.getMonth()
    return {
      DAYS_OF_WEEK:['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      month,
      year,
      chosenDay: false,
    }
  },
}
</script>

<style lang='stylus' scoped>
@import '../styles/colours';
@import '../styles/skeleton';
@import '../styles/tooltips';

.tooltip
    color: lightGrey

h5
    text-align: center
    color: lightGrey
    opacity: 0.77

.bdoge
    width: 100%
    opacity: 0.77
    height: 5em
    margin-top: 1em

.soft
    color: softGrey

.inline
  display:inline-block
  margin:15px
  img
      height: 1.6em
      cursor: pointer

#calendar
    color: main

.menu
    text-align: center
    color: lightGrey

.calendar-column
    float: left
    box-sizing: border-box
    width: (100/7)%
    height: 100px
    border-style:solid
    border-width: 1px
    border-color: #ffffff1c
.placeholder
    @extends .calendar-column
.day
    @extends .calendar-column
.weekday
    @extends .calendar-column
    height: 40px
    text-align: center
    font-weight:lighter
    font-size: 19px
    border-style:solid
    color:#ffffff1c
.date
    background-color: white
    float: right
    font-weight: bolder
    font-size: .666em

.legend
    margin-top: -70px

td
    border: none

.availablebox, .bookedbox
    height: 20px
    width: 20px

.bookedbox
    background-color: green
.availablebox
    background-color: accent2
.signcell
    max-width: 0px

.downhalfbox
    padding-top: 10px

table
    font-size: .7em

tr, td
    padding:0
    padding-left: 11px
.ch
    color: accent2

.do
    color: green

.calmonth
    margin: 0 2% 2% 2%

.buffer
   clear: both
   height: 0.45em

.fl
    float: left
.fr
    float: right
</style>
