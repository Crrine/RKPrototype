import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';


BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

class Calendar extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
    events:[
                {
                    title: 'All Day Event',
                    start: '2017-05-01'
                }
            ],
    }
  }

  render() {
    return (
      <div id="example-component">
        <BigCalendar
        events = {this.state.events}
    />
      </div>
    );
  }
}

export default Calendar
