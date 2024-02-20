import { useCallback, useState, useEffect, SetStateAction, HtmlHTMLAttributes } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import DatePicker from 'react-datepicker';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import html2canvas from 'html2canvas';

import Event from './components/Event.js';

import utils from './scripts/utils.js';
import HolidayEventModel from './models/HolidayEventModel.js';
import EventModel from './models/EventModel.js';
import ExportEventModel from './models/ExportEventModel.js';

const locales = {
  'en-US': enUS
};
const NEW_EVENT = { id: 'ID', title: '', start: null, end: null, tags: [] as string[], colors: [] as string[], constant: false };
const COLOR_TAGS = ['red', 'green', 'blue'];
const countryCode = Intl.DateTimeFormat().resolvedOptions().locale;

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});



function App() {
  const DndCalendar = withDragAndDrop(Calendar);

  const [view, setView] = useState('month');
  const [modalHide, setModalHid] = useState(true);
  const [editButton, setEditButton] = useState(false)
  const [allEvents, setAllEvents] = useState(utils.getEvents());
  const [holidays, setHolidays] = useState([] as any[]);
  const [displayedEvents, setDisplayedEvents] = useState(allEvents);
  const [newEvent, setNewEvent] = useState(NEW_EVENT);
  const [selectedColorTags, setSelectedColorTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([] as any);
  const [searchText, setSearchText] = useState('' as string);



  useEffect(() => {
    setAllTags([...new Set(allEvents.map((event: any) => event.tags).flat())] as SetStateAction<never[]>)
  }, [allEvents])

  useEffect(() => {
    if (selectedColorTags.length > 0) {
      setDisplayedEvents(
        allEvents.filter((event: any) => {
          return event.colors.some((color: string) => selectedColorTags.includes(color as never))
        })
      )
    } else if (selectedTags.length > 0) {
      setDisplayedEvents(
        allEvents.filter((event: any) => {
          return event.tags.some((tag: string) => selectedTags.includes(tag as never))
        })
      )
    } else if (searchText.length > 0) {
      setDisplayedEvents(
        allEvents.filter((event: any) => {
          return event.title.toLowerCase().includes(searchText.toLowerCase())
        })
      )
    } else {
      setDisplayedEvents(allEvents);
    }
  }, [selectedColorTags, selectedTags, searchText, allEvents])

  useEffect(() => {
    try {
      fetch(`https://date.nager.at/api/v3/PublicHolidays/${new Date().getFullYear()}/${countryCode.split('-')[1]}`)
        .then((res) => {
          return res.json()
        }).then((data: any[]) => {
          setHolidays(data.map((publicHolidayEvent: object) => {
            return new HolidayEventModel(publicHolidayEvent)
          }));
        })
    } catch (error) {
      console.error('Het holidays error: ', error)
    }
  }, [])



  const moveEvent = useCallback(
    (data: { event: { start: Date, end: Date }, start: Date, end: Date }) => {
      data.event.start = data.start;
      data.event.end = data.end;
    },
    []
  );

  const resizeEvent = useCallback(
    (data: { event: { start: Date, end: Date }, start: Date, end: Date }) => {
      data.event.start = data.start;
      data.event.end = data.end;
    },
    []
  );



  async function downloadCalendarAsImage() {
    const element = document.getElementsByClassName('rbc-month-view')[0];
    const calendarPageDate = document.getElementsByClassName('rbc-toolbar-label')[0].textContent;
    const canvas = await html2canvas(element as HTMLElement);
    const data = canvas.toDataURL('image/jpg');
    const link = document.createElement('a');

    link.href = data;
    link.download = 'Calendar - ' + calendarPageDate + '.jpg';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function downloadJsonEvents() {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(allEvents.map((event: any) => new ExportEventModel(event)))
    )}`;

    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `EXPORT_${new Date().toLocaleDateString()}.json`;
    link.click();
  }

  async function uploadJsonEvents(event: any) {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], 'UTF-8');
    fileReader.onload = (action: any) => {
      setAllEvents(allEvents.concat(JSON.parse(action.target.result).map((importedEvent: any) => new EventModel(importedEvent))));
    }
  }

  function addNewTag(event: { key: string, target: { value: string } }) {
    let tagName: string = event.key === 'Enter' ? event.target.value : event.target.value.slice(0, -1);

    if (tagName && !newEvent.tags.includes(tagName)) {
      setNewEvent({ ...newEvent, tags: newEvent.tags.concat(tagName) });
    }
    event.target.value = '';
  }

  function closeModal() {
    setNewEvent(NEW_EVENT);
    setModalHid(true);
  }

  function handleAddEvent() {
    setAllEvents([...allEvents, newEvent]);
    closeModal();
  }

  function handleEditEvent() {
    setAllEvents([...allEvents.filter((storedEvent: { id: string }) => storedEvent.id !== newEvent.id), newEvent]);
    closeModal();
  }

  function editEvent(event: { id: string }) {
    setNewEvent(allEvents.filter((storedEvent: { id: string }) => storedEvent.id === event.id)[0]);
  }

  function handleDeleteEvent() {
    setAllEvents([...allEvents.filter((event: { id: string }) => event.id !== newEvent.id)]);
    closeModal();
  }

  return (
    <div className='App'>
      <div className='top-menu'>
        <div className='top-menu-import-export'>
          <button className='download-calendar-as-image' onClick={downloadCalendarAsImage}>Export as PNG</button>
          <button onClick={downloadJsonEvents}>Export events</button>
          <button onClick={() => {
            const input = document.getElementById('import-events') as HTMLInputElement;
            input.click();
          }}>Import events</button>
          <input id='import-events' type='file' onChange={(event: any) => uploadJsonEvents(event)} hidden />
        </div>
        <div className='top-menu-colors-bar'>
          Colors filters:
          <div className='color-filters'>
            {COLOR_TAGS.map((color: string) => {
              return (<div key={color} id={color}
                className={color + '-color-tag color-tag-stick' + (selectedColorTags.includes(color as never) ? ' selected' : '')}
                onClick={() => {
                  if (selectedColorTags.includes(color as never)) {
                    setSelectedColorTags(selectedColorTags.filter(selectedColor => selectedColor !== color));
                  } else {
                    setSelectedColorTags([...selectedColorTags as never, color as never]);
                  }
                }}
              />)
            })}
          </div>
        </div>
        <div className='event-tags'>
          {allTags.map((tag) => {
            return <div
              id={tag}
              className={'event-tag' + (selectedTags.includes(tag) ? ' selected' : '')}
              key={tag + '-tag-filter'}
              onClick={(event: any) => {
                if (!selectedTags.includes(event.target.id)) {
                  setSelectedTags([...selectedTags, event.target.id]);
                } else {
                  setSelectedTags(selectedTags.filter((selectedTag: string) => selectedTag !== event.target.id));
                }
              }}
            >{tag}</div>
          })}
        </div>
        <input
          placeholder='Search'
          className='top-menu-labels-filter'
          onChange={(event: any) => { setSearchText(event.target.value) }}></input>
      </div>

      <div className='modal' hidden={modalHide}>
        <textarea
          placeholder='Write you text'
          className='new-event-title'
          value={newEvent.title}
          onChange={(event) => setNewEvent({ ...newEvent, title: event.target.value })}
        />
        <div className='modal-tags-bar'>
          <div className="event-tags">
            {newEvent.tags.map((tag: string) => {
              return <div
                className="event-tag"
                key={tag}
                id={tag}
                onClick={(event: any) => {
                  setNewEvent({ ...newEvent, tags: newEvent.tags.filter(tag => tag !== event.target.id) });
                }}
              >
                {tag}
              </div>
            })}
          </div>
          <input
            placeholder='tags'
            onKeyDown={(event) => { if (event.key === 'Enter') addNewTag(event as any) }}
            onChange={(event: any): void => {
              if (event.nativeEvent.data === ','
                || event.nativeEvent.data === ' '
                || event.nativeEvent.data === '.') {
                addNewTag(event);
              }
            }} />
        </div>

        <div className='date-picker-cells'>
          <DatePicker
            placeholderText='Star date'
            selected={newEvent.start}
            onChange={(start: any) => setNewEvent({ ...newEvent, start })}
          />
          <DatePicker
            placeholderText='End date'
            selected={newEvent.end}
            onChange={(end: any) => {
              setNewEvent({ ...newEvent, end });
            }}
          />
        </div>

        <div className='modal-bottom-panel'>
          <div className='modal-colors-bar'>
            {COLOR_TAGS.map((color: string) => {
              return (<div
                key={color}
                id={color}
                className={color + '-color-tag color-tag-stick' + (newEvent.colors.includes(color) ? ' selected' : '')}
                onClick={(event: any) => {
                  if (event.target.id && !newEvent.colors.includes(event.target.id)) {
                    setNewEvent({ ...newEvent, colors: newEvent.colors.concat(event.target.id) });
                  } else {
                    setNewEvent({ ...newEvent, colors: newEvent.colors.filter(color => color !== event.target.id) });
                  }
                }}
              />)
            })}
          </div>

          <button className='modal-submit-button add-event' onClick={handleAddEvent} hidden={editButton}>Add</button>
          <button className='modal-submit-button edit-event' onClick={handleEditEvent} hidden={!editButton}>Edit</button>
          <button className='modal-cancel-button' onClick={closeModal}>Cancel</button>
          <button className='modal-remove-button' onClick={handleDeleteEvent} hidden={!editButton}>Delete</button>
        </div>
      </div>

      <DndCalendar
        localizer={localizer}
        events={displayedEvents.concat(holidays)}
        startAccessor='start'
        endAccessor='end'
        style={{ height: '90vh', width: '98vw' }}
        defaultView={'month'}
        toolbar={true}
        view={view}
        views={{
          year: false,
          month: true,
          week: true,
          day: true
        } as any}
        onView={setView}
        onSelectSlot={(event: any) => {
          setModalHid(false);
          setEditButton(false);
          setNewEvent({ ...NEW_EVENT, id: utils.generateEventID(), start: event.start, end: event.start });
        }}
        onSelectEvent={(event: any) => {
          if (!event.isPublicHoliday) {
            setModalHid(false);
            setEditButton(true);
            editEvent(event);
          }
        }}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        draggableAccessor="isDraggable"
        resizable
        selectable
        components={{ event: Event }}
        showAllEvents={true}
      />
    </div >
  )
}

export default App
