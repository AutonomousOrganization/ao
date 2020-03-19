<template lang='pug'>

#auth.container
  div(v-if='!confirmed')
      h1 create account
      .input-container
          input.input-effect(type='text', v-model='name', autocapitalize="none", autocomplete="off", autocorrect="off", @keyup.enter='createAccount'  :class='{"has-content":!!name}')
          label choose name
          span.focus-border
      button(@click="createAccount") new account
      br
      hr
      br
      h1 existing account
      .input-container
          input.input-effect(type='text', v-model='name', autocapitalize="none", autocomplete="off", autocorrect="off", @keyup.enter='createSession', :class='{"has-content":!!name}')
          label choose name
          span.focus-border
      .input-container
          input.input-effect#password(type='password', v-model='pass', autocapitalize="none", autocomplete="off", autocorrect="off", @keyup.enter='createSession'  :class='{"has-content":!!pass}')
          label password
          span.focus-border
      p.red {{ err }}
      button(@click="createSession") login
</template>

<script>

import request from 'superagent'
import uuidV1 from 'uuid/v1'
import cryptoUtils from '../crypto'

export default {
  name: 'Auth',
  data(){
      return {
          name: '',
          pass: '',
          err: ''
      }
  },
  computed: {
      confirmed(){
          return this.$store.getters.isLoggedIn
      },
  },
  methods: {
      createAccount(){
          request.get('/newaccount/' + this.name)
              .end((err, res) => {
                  this.setAuth(res.body.token, res.body.session)
              })
      },
      createSession(){
          let session = uuidV1()
          let sessionKey = cryptoUtils.createHash(session + cryptoUtils.createHash(this.pass))
          let token = cryptoUtils.hmacHex(session, sessionKey)
          request
              .post('/session')
              .set('authorization', token)
              .set('session', session)
              .set('name', this.name)
              .end((err,res)=>{
                  if (err) {
                      this.pass = ''
                      return this.err = err.message
                  }
                  this.setAuth(token, session)

              })
      },
      setAuth(token, session){
          this.pass = ""
          this.$store.commit('setAuth', {
              token,
              session,
          })

          window.localStorage.setItem("token", token)
          window.localStorage.setItem("session", session)

          this.$store.dispatch('loadCurrent')
      }
  }
}
</script>

<style lang='stylus' scoped>

@import '../styles/colours'
@import '../styles/button'
@import '../styles/input'
@import '../styles/skeleton'

h1
    text-align: center

input
    border: 2px solid wrexyellow
    margin-bottom: 0.5em
    border-radius: 0.25em

.secret
    -webkit-text-fill-color: transparent; /* sets just the text color */

.red
    color: accent2
</style>
