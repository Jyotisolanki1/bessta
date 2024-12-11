// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
  error: null,
  events: []
};

const mid = [
  {
    id: '5e8882f1f0c9216397e05a9b',
    allDay: false,
    color: '#f5222d',
    description: 'SCRUM Planning',
    start: '2024-02-09T05:23:57.009Z',
    end: '2024-02-09T07:38:57.009Z',
    title: 'Repeating Event'
  },
  {
    id: '5e8882fcd525e076b3c1542c',
    allDay: true,
    color: '#faad14',
    description: 'Sorry, John!',
    start: '2024-02-13T10:23:57.009Z',
    end: '2024-02-13T10:38:57.009Z',
    title: 'Conference'
  },
  {
    id: '5e8882e440f6322fa399eeb8',
    allDay: true,
    color: '#52c41a',
    description: 'Inform about new contract',
    start: '2024-02-18T11:08:57.009Z',
    end: '2024-02-17T11:08:57.009Z',
    title: 'All Day Event'
  },
  {
    id: '5e8882fcd525e076b3c1542d',
    allDay: false,
    color: '#f6ffed',
    textColor: '#52c41a',
    description: 'Sorry, Stebin Ben!',
    start: '2024-02-19T06:08:57.009Z',
    end: '2024-02-19T09:38:57.009Z',
    title: 'Opening Ceremony'
  },
  {
    id: '5e8882eb5f8ec686220ff138',
    allDay: true,
    color: '#8c8c8c',
    description: 'Discuss about new partnership',
    start: '2024-02-17T11:08:57.009Z',
    end: '2024-02-17T10:08:57.009Z',
    title: 'Long Event'
  },
  {
    id: '5e88830672d089c53c46ece3',
    allDay: false,
    description: 'Get a new quote for the payment processor',
    start: '2024-02-21T06:30:57.009Z',
    end: '2024-02-21T08:30:57.010Z',
    title: 'Breakfast'
  },
  {
    id: '5e888302e62149e4b49aa609',
    allDay: false,
    color: '#fffbe6',
    textColor: '#faad14',
    description: 'Discuss about the new project',
    start: '2024-02-21T09:45:57.010Z',
    end: '2024-02-21T15:30:57.010Z',
    title: 'Meeting'
  },
  {
    id: '5e888302e62149e4b49aa709',
    allDay: false,
    color: '#f5222d',
    description: "Let's Go",
    start: '2024-02-21T09:00:57.010Z',
    end: '2024-02-21T11:30:57.010Z',
    title: 'Anniversary Celebration'
  },
  {
    id: '5e888302e69651e4b49aa609',
    allDay: false,
    description: 'Discuss about the new project',
    start: '2024-02-22T16:33:57.010Z',
    end: '2024-02-22T17:03:57.010Z',
    title: 'Send Gift'
  },
  {
    id: '5e8883062k8149e4b49aa709',
    allDay: false,
    color: '#faad14',
    description: "Let's Go",
    start: '2024-02-22T14:53:57.010Z',
    end: '2024-02-22T16:23:57.010Z',
    title: 'Birthday Party'
  },
  {
    id: '5e8882f1f0c9216396e05a9b',
    allDay: false,
    color: '#8c8c8c',
    description: 'SCRUM Planning',
    start: '2024-02-22T14:38:57.010Z',
    end: '2024-02-22T15:38:57.010Z',
    title: 'Repeating Event'
  },
  {
    id: '5e888302e62149e4b49aa610',
    allDay: false,
    color: '#f5222d',
    description: "Let's Go",
    start: '2024-02-22T14:53:57.010Z',
    end: '2024-02-22T15:58:57.010Z',
    title: 'Dinner'
  },
  {
    id: '5e8882eb5f8ec686220ff131',
    allDay: true,
    description: 'Discuss about new partnership',
    start: '2024-02-26T11:08:57.010Z',
    end: '2024-02-29T12:08:57.010Z',
    title: 'Long Event'
  },
  {
    id: '5e888302e62349e4b49aa609',
    allDay: false,
    color: '#1890ff',
    textColor: '#e6f7ff',
    description: 'Discuss about the project launch',
    start: '2024-02-27T11:23:57.010Z',
    end: '2024-02-27T11:28:57.010Z',
    title: 'Meeting'
  },
  {
    id: '5e888302e62149e4b49ab609',
    allDay: false,
    color: '#52c41a',
    description: 'Discuss about the tour',
    start: '2024-03-04T14:53:57.010Z',
    end: '2024-03-04T15:58:57.010Z',
    title: 'Happy Hour'
  }
];

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      // state.error = action.payload;
      state.events = mid;
    },

    // GET EVENTS
    getEventsSuccess(state, action) {
      // state.events = action.payload;
      state.events = mid;
    },

    // ADD EVENT
    addEventSuccess(state, action) {
      state.events = action.payload;
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      state.events = action.payload;
    },

    // REMOVE EVENT
    removeEventSuccess(state, action) {
      state.events = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getEvents() {
  return async () => {
    try {
      const response = await axios.get('/api/calendar/events');
      dispatch(slice.actions.getEventsSuccess(response.data.events));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addEvent(event) {
  return async () => {
    try {
      const response = await axios.post('/api/calendar/events/add', event);
      dispatch(slice.actions.addEventSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateEvent(event) {
  return async () => {
    try {
      const response = await axios.post('/api/calendar/events/update', event);
      dispatch(slice.actions.updateEventSuccess(response.data.events));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function removeEvent(eventId) {
  return async () => {
    try {
      const response = await axios.post('/api/calendar/events/delete', { eventId });
      dispatch(slice.actions.removeEventSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
