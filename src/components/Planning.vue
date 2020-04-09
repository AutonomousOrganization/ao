<template lang='pug'>

.upgrades
    task-calendar(:inId='$store.getters.contextCard.taskId')
    .row
        resource-book.six.grid(:tId='$store.getters.contextCard.taskId')
        button.six.grid set location
</template>

<script>

import calcs from '../calculations'
import TaskCalendar from './Calendar'
import ResourceBook from './ResourceBook'

export default {
    mounted() {
        this.$store.commit('setMode' , 2)
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
@import '../styles/grid'

button
    margin-top: 2em
    opacity: 0.4

.upgrades
    width: 100%

.gui
    font-size: 1.5em
    cursor: pointer

</style>
