<template lang='pug'>

.missions
    .endpadtwo
        ul.none
          template(v-for='g in (showAllGuilds ? missions : missions.slice(0, 5))')
              .row
                  .three.grid
                      span(@click='goIn(g.taskId)')
                          img.floatleft(src='../assets/images/badge.svg')
                      span(@click='goIn(g.taskId)')
                          span.nl.gui.yellowtx {{ g.guild }}
                  .nine.grid
                      .fw(v-for='c in completions(g)'  @click='goIn(c.taskId, g.taskId)'  :class='{ padleft : getSubPriorities(g.taskId).length > 0 }')
                        .tooltip
                          img.plain.checkmark(src='../assets/images/completed.svg')
                          current(:memberId='c.memberId')
                          linky.tooltiptext(:x='c.name')
                  //- .description
                  //-     span.projectlist.aproject(v-if='g.guilds && g.guilds.length >= 1'  v-for='(p, i) in g.guilds'  @click='goIn(p.taskId, g.taskId)')
                  //-         img(src='../assets/images/badge.svg'  :class='{ first : i === 0 }')
                  //-         span(:class='cardInputSty(p.color)') {{ p.guild }}
          .more(v-if='missions.length > 5 && !showAllGuilds'  @click='toggleGuilds') +{{ $store.getters.myGuilds.length - 5 }}
          .more(v-else-if='missions.length > 5 && showAllGuilds'  @click='toggleGuilds') (^_^)
</template>

<script>
import Linky from './Linky'
import Current from './Current'
export default {
    components:{
        Linky,Current,
    },
    mounted() {
        this.$store.dispatch('loaded')
    },
    data(){
        return {
            showAllGuilds: false,
        }
    },
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
            if (this.$store.state.upgrades.dimension !== 'unicorn'){
                this.$router.push("/" + this.$store.state.upgrades.mode)
            }
        },
        completions(guild){
            let completions = []
            let now = Date.now()
            let allTasks = guild.subTasks.concat(guild.priorities).concat(guild.completed)
            allTasks.forEach(t => {
                let task = this.$store.getters.hashMap[t]
                if(!task || !task.claims) return
                task.claims.forEach(cEv => {
                    if (now - cEv.timestamp < 1000 * 60 * 60 * 100){
                        cEv.name = task.name
                        completions.push(cEv)
                    }
                })
            })
            return completions
        },
        getSubPriorities(taskId){
            let card = this.$store.getters.hashMap[taskId]
            if(card && card.priorities){
                return card.priorities.slice().reverse()
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
        toggleGuilds(){
            this.showAllGuilds = !this.showAllGuilds
        },
    },
    computed: {
        missions(){
          let guilds = this.$store.getters.myGuilds
          guilds.forEach(g => {
              g.subTasks.concat(g.priorities, g.completed).forEach(p => {
                  let task = this.$store.getters.hashMap[p]
                  if(!task) {
                      console.log("null taskId found, this means cleanup is not happening elsewhere and is very bad")
                  } else if(task.guild) {
                      task.subTasks.concat(task.priorities, task.completed).forEach(sp => {
                          let subtask = this.$store.getters.hashMap[sp]
                          if(!subtask) {
                              console.log("null subtaskId found, this means cleanup is not happening elsewhere and is very bad")
                          } else if(subtask.guild) {
                              if(!task.guilds) {
                                  task.guilds = []
                              }
                              if(task.guilds.indexOf(subtask) === -1) {
                                  task.guilds.push(subtask)
                              }
                          }
                      })
                      if(!g.guilds) {
                          g.guilds = []
                      }
                      if(g.guilds.indexOf(task) === -1) {
                          g.guilds.push(task)
                      }
                  }
              })
          })
          return guilds
        },
    },
}

</script>

<style lang='stylus' scoped>

@import '../styles/colours'
@import '../styles/skeleton'
@import '../styles/grid'
@import '../styles/button'
@import '../styles/tooltips'
@import '../styles/spinners'

.fw
    width: 100%

.nl
    text-decoration:none

.padded
    padding: 1em

.tab
    padding-top: .4321em
    height: 5em

.selected
    background: main
    border-radius: 40px 40px 0 0
    padding-bottom: 0.654321em
    border-style: dashed
    border-width: 2px
    border-color: softGrey

.formlabel
    padding-top: 1em
    padding-bottom: 1em
    text-align: center

.card
    padding: 2em
    color: white
    text-align: center

p
    padding-left: .6em
    font-size:1.3em
    font-family: 'Open Sans', light, sans-serif;

a
    color: accent2

h3
    text-align: left
    font-family: 'Open Sans', light, sans-serif;

.grid
    height: 4em

.mainbg
    background: main


.lightbg
    background: softGrey

.fl
    float: left

.dol
    height: 4em
    opacity: 0.27

.two
    text-align: center
    padding: .4321em

.slide-fade-enter-active {
  transition: all .06s ease;
}
.slide-fade-leave-active {
  transition: all .05s ease;
}
.slide-fade-enter {
  // transform: translateY(-400px);
  opacity: 0;
}
.slide-fade-leave-to {
 // transform: translateY(-400px);
  opacity: 0;
}

.box
    padding: 1em 0

.box.morepad
    //padding: 2em 0
    //margin-left: 2em

.ungrabbedcoin {
  opacity: 0.3
}

.dogepepecoin
    height: 3em
    float: right

.pointsinput
    width: 45%;
    margin-bottom: 1em;
    text-align: center;
    font-size: 1.5em;

.centerchildren
    text-align: center;

.gui
    font-size: 1.5em
    cursor: pointer

.row .three
    height: 5em

.dogep
    height: 6em
    width: 6em
    cursor: pointer
    position: relative
    left: calc(50% - 3em)

.dogep img
    height: 100%
    width: 100%

.spaced
    clear: both
    margin-top: 0.25em

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
    height: 1.78em
    display: inline-block
    cursor: pointer

img.checkmark
    height: 1em

.tooltiptext
    font-size: 0.65em

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

.gui.yellowtx
    margin-right: 0.5em
    vertical-align: text-bottom

.more
    text-align: center
    background-color: rgba(22, 22, 22, 0.4)
    display: inline-block;
    border-width: 2px
    padding: 0.5em
    margin: 0
    font-size: 1em
    opacity: 0.6
    color: white
    text-align: center
    width: calc(100% - 2.25em)
    cursor: pointer

.more:hover
    background-color: rgba(66, 66, 66, 0.4)

ul
    margin-block-end: 0

.padleft
    margin-left: 0.36em

.projects
    float: right
    max-width: 33%
    border: solid 1px wrexblue
    border-radius: 0.5em
    margin-top: -0.5em
    margin-right: 1em
    margin-bottom: 1em
    padding: 0 0.5em 0.55em 0.5em

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

.clickable
    cursor: pointer
</style>
