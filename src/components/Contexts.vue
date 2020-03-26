<template lang='pug'>
.contexts#contexts
    div(:class='{suncontext: isSun, bullcontext: isBull}')
        .transparentsides
    .spacer
    .narrow(v-for='(n, i) in $store.state.context.parent'  :key='n'  @click='goToParent(n)'  :style="{ marginLeft: (($store.state.context.parent.length - i) * 0.5) + 'em', marginRight: (($store.state.context.parent.length - i) * 0.5) + 'em' }")
        context-row(:taskId ='n')
</template>

<script>

import Hammer from 'hammerjs'
import Propagating from 'propagating-hammerjs'

import ContextRow from './ContextRow'

export default {
    data(){
        return {
            selfPropagating: false
        }
    },
    mounted(){
        let el = document.getElementById('contexts')
        let mc = Propagating(new Hammer.Manager(el))
        let longPress = new Hammer.Press({ time: 400 })

        mc.add(longPress)

        mc.on('press', (e) => {
            console.log('press on context')
            this.$store.state.tasks.forEach(t => {
                if (
                    t.subTasks.indexOf(this.$store.getters.contextCard.taskId) !== -1  ||
                    t.priorities.indexOf(this.$store.getters.contextCard.taskId) !== -1 ||
                    t.completed.indexOf(this.$store.getters.contextCard.taskId) !== -1
                ){
                    if(this.$store.state.context.parent.indexOf(t.taskId) === -1){
                        this.$store.commit("addParent", t.taskId)
                    }
                }
            })
            this.selfPropagating = true
            setTimeout(()=> this.selfPropagating = false,1234)
            e.stopPropagation() // XXX requires propagating-hammerjs??
        })
    },
    components: { ContextRow },
    computed: {
        cardInputSty() {
          let color = this.$store.getters.contextCard.color
          return {
              redwx : color == 'red',
              bluewx : color == 'blue',
              greenwx : color == 'green',
              yellowwx : color == 'yellow',
              purplewx : color == 'purple',
              blackwx : color == 'black',
          }
        },
        isSun() {
          return this.$store.state.upgrades.dimension === 'sun'
        },
        isBull() {
          return this.$store.state.upgrades.dimension === 'bull'
        },
    },
    methods:{
      goToParent(target){
          if (this.selfPropagating) return console.log('not today')
          if (this.$store.state.upgrades.dimension !== "unicorn"){
              this.$router.push('/' + this.$store.state.upgrades.mode)
          }
          this.$store.dispatch("goUp", {
              target,
              panel: [target],
              top: 0
          })
      },
    }
}

</script>

<style lang='stylus' scoped>

@import '../styles/colours'

.narrow
    padding-left: 4em
    padding-right: 4em

.contexts
    opacity: 0.9
    z-index: 9009
    background: transparent
    min-height: 3.35em
    display: flex
    flex-direction: column

.suncontext
    background-image: url('../assets/images/sunbanner.svg')

.bullcontext
    background-image: url('../assets/images/bullbanner.svg')

.bullcontext, .suncontext
    margin-top: 2.571111em
    height: 1.71111em
    background-repeat: repeat-x
    background-size: 3em
    margin-left: 7em
    margin-right: 7em
    z-index: -1

h4
    padding-left: 3.655em

.spacer
    flex-grow:1

</style>
