<template lang='pug'>

.projects(v-if='subguilds.length > 0')
    ul.none
        li.spaced(v-for='p in subguilds'  :key='subguilds')
            span(@click='goIn(p.taskId)')
                img.floatleft(src='../assets/images/badge.svg')
            span(@click='goIn(p.taskId)')
                span.nl.gui.smaller(:class='cardInputSty(p.color)') {{ p.guild }}
            ul.none.indent
                li.spaced(v-for='sp in p.guilds')
                    span(@click='goIn(sp.taskId, p.taskId)')
                        img.floatleft.smaller(src='../assets/images/badge.svg')
                    span(@click='goIn(sp.taskId), p.taskId')
                        span.nl.gui.smallest(:class='cardInputSty(sp.color)') {{ sp.guild }}
</template>

<script>

export default {
    methods: {
        goIn(taskId, guild = undefined){
            let parents = []
            let panel = [taskId]
            let top = 0

            let t = this.$store.getters.hashMap[taskId]
            let panelColor = this.$store.getters[t.color]
            let topColor = panelColor.indexOf(taskId)

            if (topColor > -1){
                panel = panelColor
                top = topColor
            }

            if (this.$store.getters.contextCard.taskId){
                parents.push(this.$store.getters.contextCard.taskId)
            } else if (this.$store.getters.memberCard.taskId){
                parents.push(this.$store.getters.memberCard.taskId)
            }

            if(guild) parents.push(guild)

            this.$store.dispatch("goIn", {panel, top, parents})
            if(this.$store.state.upgrades.mode === 'doge' && this.$store.getters.contextCard.priorities.length > 0) {
                this.$store.commit("setMode", 1)
            }
        },
        cardInputSty(c){
            return {
                redtx : c === 'red',
                bluetx : c === 'blue',
                greentx : c === 'green',
                yellowtx : c === 'yellow',
                purpletx : c === 'purple',
                blacktx : c === 'black',
            }
        },
    },
    computed: {
        b(){
            return this.$store.getters.contextCard
        },
        subguilds() {
            return this.$store.state.tasks.filter(p => {
                p.guild &&
                this.b.subTasks.concat(this.b.priorities, this.b.completed).indexOf(p.taskId) > -1
            })
        },
    },
}

</script>

<style lang='stylus' scoped>

@import '../styles/colours'

.nl
    text-decoration:none

h3
    text-align: left
    font-family: 'Open Sans', light, sans-serif;

.box
    padding: 1em 0

.centerchildren
    text-align: center;

.gui
    font-size: 1.5em
    cursor: pointer

.row .three
    height: 5em

.spaced
    clear: both
    margin-top: 0.25em

.fr
    float: right
    height: 3em

.floatleft
    height: 100%
    float: left
    clear: both
    max-height: 3.3em
    margin-right: 1em
    cursor: pointer
    margin-top: 0.3em

.title
    text-align: center
    font-size: 1.5em

.description
    color: white
    margin-bottom: 1em
    margin-left: 4.3em

.box
    width: 100%
    margin: 0 auto

.smallbox
    width: 4em
    margin-bottom: 1em

.adjusttop
    margin-top: 0.3em

.centerform
    margin: 0 auto 1em auto

h2
    text-align: center
    color: white
    margin-top: 0

.checkwrapper
    overflow: auto
    width: 100%

.plain.checkmark
    font-size: 2em
    display: inline-block
    cursor: pointer

.plain
    text-decoration: none

.togglepayments
    margin: 0
    padding: 0
    text-align: center

.thickborder
    border-style: solid
    border-color: green
    border-width: 4px

.mainbkg
    background: main

.hodlcount
    position: relative
    left: calc(50% - 1.07em)
    top: -3em
    text-align: center
    width: 35px
    bottom: calc(0.75em + 9px)
    padding-bottom: 0
    margin-bottom: 0
    font-weight: bold
    color: rgba(255, 255, 255, 0.75)
    pointer-events: none
    font-size: 2.5em

.grabbedhodlcount {
    opacity: 1
}

.submode
    height: 6em
    width: 6em
    margin-bottom: 1em
    margin-top: 1em
    background-color: rgba(0, 0, 0, 0)

.max
    height: 100%
    width: 100%

.endpad
    padding-top: 1em
    padding-bottom: 1em
    padding-right: 0
    padding-left: 1em

.endpadtwo
    padding-top: 1em
    padding-bottom: 0.5em

.suggest
    color: rgba(255, 255, 255, 0.4)
    font-style: italic
    font-size: 1.2em
    text-align: center

.hodlsuggest, .dogep .hodlsuggest
    font-size: 1.15em

.none
    list-style-type: none
    margin-left: -1em

.more:hover
    background-color: rgba(66, 66, 66, 0.4)

ul
    margin-block-end: 0

.projects
    border: solid 1px wrexblue
    border-radius: 0.5em
    margin-top: 2.7em
    margin-right: 1em
    margin-bottom: 1em
    padding: 0 0.5em 0.55em 0.5em
    background: lightGrey
    opacity: .5

.projects h3
    text-align: center
    margin-top: 0.5em
    margin-bottom: 0

.projects .floatleft
    max-height: 1.5em
    margin-top: 0
    margin-right: 0.4em

.projects ul
    margin-left: -2em

.projectlist
    font-size: 1.2em
    margin-top: 0.15em

.projectlist.aproject
    cursor: pointer
    font-style: italic
    white-space: nowrap
    margin-right: 0.48em

.projectlist > img
    display: inline-block
    float: none
    height: 1.1em
    margin-right: 0.225em
    position: relative
    top: 0.25em

.projectlist > img.first
    margin-left: 0

.smaller
    font-size: 1.3em

ul.none.indent
    margin-left: -0.5em

.projects .floatleft.smaller
    max-height: 1em
    margin-right: 0.4em

span.nl.gui.smallest
    font-size: 1.1em
</style>
