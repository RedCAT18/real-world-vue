import EventService from '../../services/EventServices.js'

export const namespaced = true

export const state = {
  events: [],
  eventTotal: 0,
  event: {},
  perPage: 3
}

export const mutations = {
  ADD_EVENT(state, event) {
    state.events.push(event)
  },
  SET_EVENTS(state, events) {
    state.events = events
  },
  SET_EVENT_TOTAL(state, count) {
    state.eventTotal = count
  },
  SET_EVENT(state, event) {
    state.event = event
  }
}

export const actions = {
  createEvent({ commit, dispatch }, event) {
    //dispatch : to call other module's action, rootState: to call other module's state
    return EventService.postEvent(event)
      .then(() => {
        commit('ADD_EVENT', event)
        const notification = {
          type: 'success',
          message: 'Your event has been created!'
        }
        dispatch('notification/add', notification, { root: true })
        //how to call other module's action?
        //dispatch('moduleName/actionToCall', null<<payload, { root: true } << look for this action at the root of store)
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: 'There was a prolem creating your event: ' + error.message
        }
        dispatch('notification/add', notification, { root: true })
        throw error
      })
  },
  fetchEvents({ commit, dispatch, state }, { page }) {
    //The payload in both Actions and Mutations can be a single variable OR an object
    return EventService.getEvents(state.perPage, page)
      .then(response => {
        // console.log(response.headers['x-total-count'])
        commit('SET_EVENT_TOTAL', response.headers['x-total-count'])
        commit('SET_EVENTS', response.data)
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: 'There was a prolem fetching events: ' + error.message
        }
        dispatch('notification/add', notification, { root: true })
      })
  },
  fetchEvent({ commit, getters }, id) {
    var event = getters.getEventById(id)

    if (event) {
      commit('SET_EVENT', event)
      return event
    } else {
      //return for the callback on template
      return EventService.getEvent(id).then(response => {
        commit('SET_EVENT', response.data)
        return response.data
      })
    }
  }
}

export const getters = {
  getEventById: state => id => {
    return state.events.find(event => event.id === id)
  }
}
