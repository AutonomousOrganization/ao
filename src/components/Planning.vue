<template lang='pug'>

.upgrades
    .gui(v-if='calcTime') {{ calcTime }}
    resource-book(:tId='$store.getters.contextCard.taskId')
    button set location
    task-calendar(:inId='$store.getters.contextCard.taskId')
</template>

<script>

import calcs from '../calculations'
import TaskCalendar from './Calendar'
import ResourceBook from './ResourceBook'

export default {
    mounted() {
        this.$store.commit('setMode' , 4)
        this.$store.commit('setDimension' , 0)
        this.$store.dispatch('loaded')
    },
    components:{
        ResourceBook, TaskCalendar
    },
    computed: {
        calcTime(){
            if (this.$store.getters.contextCard.book.startTs){
                let mer = calcs.getMeridienTime(this.$store.getters.contextCard.book.startTs)
                return mer.month + '/' + mer.date + '/' + mer.year + " at " + mer.hour +  mer.meridien
            }
        },
    },
}

</script>

<style lang='stylus' scoped>
@import '../styles/button'

button
    margin-top: 2em
    opacity: 0.4

.upgrades
    width: 100%

.gui
    font-size: 1.5em
    cursor: pointer

</style>
