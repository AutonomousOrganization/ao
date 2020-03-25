const request = require( 'superagent')
const uuidV1 = require( 'uuid/v1')
const io = require( 'socket.io-client')
const socket = io()

var attached = false
function attachSocket(commit, dispatch){
    if (!attached){

        socket.on('unauthorized', (reason)=> {
            commit('setConnectionError', 'Unauthorized: ' + JSON.stringify(reason))
        })

        socket.on('connect', ()=> {
            commit('setConnected', 'connecting')
            socket.emit('authentication', {
                session: state.session,
                token: state.token
            })
        })

        socket.on('authenticated', ()=> {
            commit('setConnected', 'connected')
            commit('setConnectionError', '')
            socket.on('eventstream', ev => {
                commit('applyEvent', ev)
                dispatch('displayEvent', ev)
            })
        })
        socket.on('disconnect', (reason) => {
            commit('setConnected', 'disconnected')
            commit('setConnectionError', 'disconnect: ' + reason)
        })
        socket.on('connect_error', (error)=> {
            commit('setConnectionError', error.message)
        })

        socket.on('error', (error)=> {
            commit('setConnectionError', error.message)
        })

        socket.on('connect_timeout', (timeout)=> {
            commit('setConnectionError', 'Timed out: ' + timeout + 'ms')
        })

        socket.on('reconnect_attempt', (timeout)=> {
            commit('setConnected', 'connecting')
            commit('setConnectionError', 'reconnect attempt')
        })

        socket.on('reconnect', (timeout)=> {
            commit('setConnected', 'connected')
            commit('setConnectionError', '')
        })

        socket.on('reconnect_error', (error)=> {
            commit('setConnectionError', error.message)
        })
        attached = true
    }
}

const actions = {
    connectSocket({commit, dispatch}){
        attachSocket(commit, dispatch)
    },
    loadCurrent({ commit, state, dispatch }){
        if (state.connected !== "connected"){
            socket.connect()
        }
        request
            .post('/tasks/gg')
            .set("Authorization", state.token)
            .end((err, res)=> {
                if (err || !res.body) {

                } else {
                    console.log('got ', res.body.length, 'tasks from tasks endpoint')
                    commit('applyEvent', {
                        type: 'tasks-received',
                        tasks: res.body
                    })
                }
            })
        request
            .post('/state')
            .set("Authorization", state.token)
            .end((err, res)=>{
                if (err || !res.body) {

                } else {
                    commit('setCurrent', res.body)
                    res.body.sessions.forEach(s => {
                        if (s.session === state.session){
                            commit("setPanel", [ s.ownerId ])
                        }
                    })
                }
            })
    },
    makeEvent({commit, state, getters, dispatch}, newEv){
        let startTs = Date.now()
        commit("setReqStatus", "pending")
        request
            .post('/events')
            .send(newEv)
            .set("Authorization", state.token)
            .end((err, res)=>{
                if (err || !res.body) {
                    commit("setReqStatus", "failed", res.body)
                    console.log({err, res})
                } else {
                    commit("setPing", Date.now() - startTs)
                    commit("setReqStatus", "ready")
                    console.log("make event res", res.body)
                }
            })
    }
}

const state = {
    token: '',
    session: '',
    connected: 'disconnected',
    connectionError: '',
    reqStatus: 'ready',
    lastPing: 1,
}

const mutations = {
    setPing(loader, ping){
        loader.lastPing = ping
    },
    setReqStatus(loader, status){
        loader.reqStatus = status
    },
    setAuth(loader, auth){
        loader.token = auth.token
        loader.session = auth.session
    },
    setConnected(loader, connected){
        loader.connected = connected
    },
    setConnectionError(loader, error){
        if(error === '') {
            loader.connectionError = ''
            return
        }
        loader.connectionError = error
    }
}

module.exports = {
    state,
    mutations,
    actions
}
