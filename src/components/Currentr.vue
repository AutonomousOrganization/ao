<template lang='pug'>

span.current
    img.onlineicon(src='../assets/images/loader.svg')
    span {{ name }}
</template>

<script>

export default {
  props: ['resourceId'],
  computed:{
    name(){
        let resourceId = this.resourceId
        let name = false
        this.$store.state.resources.forEach(r => {
            if (r.resourceId == resourceId){
                name = r.name
            }
        })
        console.log('calculated in currentr:', {name, resourceId})
        return name
    },
  }
}

</script>

<style lang="stylus" scoped>

@import '../styles/colours'

.current
    font-size: 1em
    margin-left: 1em
    margin-right: 1em
    white-space: nowrap

a
    color: accent2
    text-decoration: none

.onlineicon
    margin-right: 0.5em
    height: 1.5em
    position: relative
    top: 0.25em

</style>
