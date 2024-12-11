/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable arrow-body-style */
/* eslint-disable lines-around-directive */
/* eslint-disable prettier/prettier */
'use client';

import { useEffect, useRef, useState } from 'react';

// material-ui
import { Button, Dialog, useMediaQuery, IconButton } from '@mui/material';

// third-party
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

// project imports
import Toolbar from 'components/application/calendar/Toolbar';
// import AddEventForm from 'components/application/calendar/AddEventForm';
import CalendarStyled from 'components/application/calendar/CalendarStyled';

import Loader from 'components/ui-component/Loader';
import MainCard from 'components/ui-component/cards/MainCard';
import SubCard from 'components/ui-component/cards/SubCard';

import { useDispatch, useSelector } from 'store';
import { getEvents, addEvent, updateEvent, removeEvent } from 'store/slices/calendar';

import JobUpdate from '../job/JobUpdate';
import JobView from '../job/JobView';

// assets
// import AddAlarmTwoToneIcon from '@mui/icons-material/AddAlarmTwoTone';

// ==============================|| APPLICATION CALENDAR ||============================== //

const Calendar = () => {
  const dispatch = useDispatch();
  const calendarRef = useRef(null);
  const matchSm = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);

  // fetch events data
  const [events, setEvents] = useState([]);
  const calendarState = useSelector((state) => state.calendar);

  useEffect(() => {
    dispatch(getEvents()).then(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setEvents(calendarState.events);
  }, [calendarState]);

  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(matchSm ? 'listWeek' : 'dayGridMonth');

  // calendar toolbar events
  const handleDateToday = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleViewChange = (newView) => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  // set calendar view
  useEffect(() => {
    handleViewChange(matchSm ? 'listWeek' : 'dayGridMonth');
  }, [matchSm]);

  const handleDatePrev = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleDateNext = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);

  // calendar event select/add/edit/delete
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedRange(null);
  };

  const handleRangeSelect = (arg) => {
    setOpenView(true);
    // const calendarEl = calendarRef.current;
    // if (calendarEl) {
    //   const calendarApi = calendarEl.getApi();
    //   calendarApi.unselect();
    // }

    // setSelectedRange({
    //   start: arg.start,
    //   end: arg.end
    // });
    // setIsModalOpen(true);
  };

  const handleEventSelect = (arg) => {
    setOpen(true);
    // if (arg.event.id) {
    //   const selectEvent = events.find((_event) => _event.id === arg.event.id);
    //   setSelectedEvent(selectEvent);
    // } else {
    //   setSelectedEvent(null);
    // }
    // setIsModalOpen(true);
  };

  const handleEventUpdate = async ({ event }) => {
    try {
      dispatch(
        updateEvent({
          eventId: event.id,
          update: {
            allDay: event.allDay,
            start: event.start,
            end: event.end
          }
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  // const handleEventCreate = async (data) => {
  //   dispatch(addEvent(data));
  //   handleModalClose();
  // };

  const handleUpdateEvent = async (eventId, update) => {
    dispatch(updateEvent({ eventId, update }));
    handleModalClose();
  };

  // const handleEventDelete = async (id) => {
  //   try {
  //     dispatch(removeEvent(id));
  //     handleModalClose();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleEventAllow = (dropInfo) => {
    if (dropInfo.start < new Date()) {
      return false;
    }
    return true;
  };

  // const handleAddClick = () => {
  //   setIsModalOpen(true);
  // };

  const change = (flag) => {
    setOpen(false);
    if (flag === true) {
      // setStatus(!status);
    }
  };

  const item = {
    id: 2,
    companyId: 8,
    departmentId: 2,
    userId: 7,
    post_date: '2024-02-03T00:00:00.000Z',
    task: 'Testing please ignore...',
    task_details: 'sdfsdfsd',
    query: null,
    short_descrption: 'sdfdsf',
    long_descrption: 'sdds',
    req_no: null,
    address: 'address compnny',
    contact_details: '9765545834',
    start: '2024-02-15T10:40:00.000Z',
    end: '2024-02-17T06:30:00.000Z',
    status: 4,
    task_date: '2024-02-14T00:00:00.000Z',
    priority: 'ADH',
    work_type: '4',
    service_unit: 'sdcsdc',
    quote: 'dscsdsd',
    critical: 'sdfsdfsdf',
    actual_job_time: null,
    work_time: '14h 15m',
    job_code: 'dsgc',
    latitude: '22.72145350',
    longitude: '75.91721040',
    username: 'FS-sdcsdc',
    name: 'testing',
    profile_pic: 'server/Uploads/profile/2024-03-13T11-29-34.984Z-arrow-zig-zag.png',
    salary_no: 'djkhvbkdf',
    language: null,
    pin: '4347',
    role: 'user',
    email: 'test@test.com',
    receive_email: 0,
    show_job_list: 0,
    add_job: 0,
    add_expense: 0,
    branchId: 4,
    city: 'city1',
    state: 'state',
    departmentName: 'department 1',
    password: '$2b$10$7czj3pEs72shJFyY/GbPJOynt.YnaBngbDuEfAnmcGKhAL.kZkD.u',
    logo: 'server/Uploads/logo/2024-02-08T09-48-45.204Z-defaultlogo.png',
    owner: 'dcdscsd',
    country_code: '91',
    phone_number: 97588452,
    ip: 'sdcsdck',
    port: 30012,
    branch_name: 'test',
    company_name: 'nme',
    branch_address: 'testing',
    branch_city: 'testing',
    branch_state: 'testing'
  };

  if (loading) return <Loader />;

  const handleButtonClick = (eventId) => {
    setOpen(true);
    console.log('Event ID:', eventId);
  };
  const handleButtonClickView = (eventId) => {
    setOpenView(true);
    console.log('Event ID:', eventId);
  };
  function renderEventContent({ event }) {
    return (
      <div
        style={{
          backgroundColor: '#000',
          borderRadius: '8px',
          padding: '3px 10px',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <b style={{ color: '#fff', flex: '1', marginRight: '10px' }}>{event.title}</b>
          <IconButton color="secondary" className="custom-icon-button">
            <EditTwoToneIcon
              onClick={() => {
                handleButtonClick(event.id);
              }}
            />
          </IconButton>
          <IconButton color="info" className="custom-icon-button">
            <VisibilityTwoToneIcon
              onClick={() => {
                handleButtonClickView(event.id);
              }}
            />
          </IconButton>
        </div>
      </div>
    );
  }

  return (
    <MainCard title="Job Calendar">
      <CalendarStyled>
        <Toolbar
          date={date}
          view={view}
          onClickNext={handleDateNext}
          onClickPrev={handleDatePrev}
          onClickToday={handleDateToday}
          onChangeView={handleViewChange}
        />
        <SubCard>
          <FullCalendar
            eventContent={renderEventContent}
            // eventAllow={handleEventAllow}
            weekends
            editable
            droppable
            selectable
            events={events}
            ref={calendarRef}
            rerenderDelay={10}
            initialDate={date}
            initialView={view}
            dayMaxEventRows={3}
            eventDisplay="block"
            headerToolbar={false}
            allDayMaintainDuration
            eventResizableFromStart
            // select={handleRangeSelect}
            // eventDrop={handleEventUpdate}
            // eventClick={handleEventSelect}
            // eventResize={handleEventUpdate}
            height={matchSm ? 'auto' : 720}
            plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
          />
        </SubCard>
      </CalendarStyled>

      {/* Dialog renders its body even if not open */}
      {/* <Dialog maxWidth="sm" fullWidth onClose={handleModalClose} open={isModalOpen} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
        {isModalOpen && (
          <AddEventForm
            event={selectedEvent}
            range={selectedRange}
            onCancel={handleModalClose}
            // handleDelete={handleEventDelete}
            // handleCreate={handleEventCreate}
            handleUpdate={handleUpdateEvent}
          />
        )}
      </Dialog> */}
      {open && <JobUpdate item={item} open={open} close={(flag) => change(flag)} />}
      {openView && <JobView item={item} open={openView} close={() => setOpenView(false)} />}
    </MainCard>
  );
};

export default Calendar;
