var DefaultClock = React.createClass({
    displayName: 'defaultClock',

    getInitialState: function () {
        return {
            timeZone: 'Local Timezone',
            timeZoneValue: null,
            hour: 0,
            minute: 0,
            second: 0
        };
    },
    componentWillMount: function () {
            timerMain.addThemeCSS('/css/digital-clock.css');//works!
            this.checkTime('1');
    },
    timeGetter: function () {
        return 'hours: '+this.state.hour+' -- minutes: '+this.state.minute+' -- seconds: '+this.state.second;
    },
    timeSetter: function (hours, minutes, seconds) {
        this.setState({ hour: hours }, () => {});
        this.setState({ minute: minutes }, () => {});
        this.setState({ second: seconds }, () => {});
    },
    timeZoneSetter: function (timeZone,timeZoneValue) {
        this.setState({ timeZone: timeZone }, () => {
            console.log('from theme component timezone: ' + this.state.timeZone );
        });
        this.setState({ timeZoneValue: timeZoneValue }, () => {
            console.log('from theme component timezonevalue: ' + this.state.timeZoneValue );
        });
    },
    timeZoneGetter: function () {
        return 'timeZone: ' + this.state.timeZone;
    },
    checkTime: function (param) {

        console.log('----- checkTime -----');
        var setApplyTime = 0; //run in the current second
        var currentTime = new Date();

        console.log('minutes: ' + currentTime.getMinutes());
        console.log('seconds: ' + currentTime.getSeconds());
        console.log('milliseconds: ' + currentTime.getMilliseconds());

        var minutes = currentTime.getMinutes();
        var hours = currentTime.getHours();

        if ( this.state.timeZoneValue !== null ) {
            //&& data !== undefined
            // var momentNTPtime = moment( new Date( String(dateString) ).toString() );
            // momentNTPtime.tz(timeZone.time_zone).unix();

            //require ISO format? : 2014-12-01T12:00:00Z

            //A date being passed into a date() object calculates the new date from the CURRENT timezone a browser is in.

            // get current date
            // get time that is required to be + or -
            //+ or - that form current time and set as the state value.

            console.log('this.state.timeZone: '+this.state.timeZoneValue);

            // console.log('timeZone substring: '+this.state.timeZone.substring(1, 3) );
            // console.log('timeZone substring parseInt: '+ parseInt(this.state.timeZone.substring(1, 3)) );//works


            if ( this.state.timeZoneValue.match(/\+/g) ) {
                // console.log('contains +');//works
                // this.state.timeZone.charAt(2);
                hours = hours + parseInt(this.state.timeZoneValue.substring(1, 3));
            } else {
                // console.log('contains -');//works
                hours = hours - parseInt(this.state.timeZoneValue.substring(1, 3));
            }
            // console.log('char at 2: ' + this.state.timeZone.charAt(2));

            console.log('hours changed: ' + hours);

            if (hours < 0) {
                console.log('hours < 0: ' + hours);
                console.log('new hours: ' + 24 - hours);
                // hours = 24 - hours;

            }
            console.log('hours changed: ' + hours);



            // console.log('currentTime before: '+currentTime);
            // currentTime = moment( currentTime.toISOString() ).tz( String(this.state.timeZone) ).format();
            // console.log('currentTime new: '+currentTime);
            // // console.log('currentTime new: '+currentTime.toISOString() );


            //require this format to set the timzezone of a new date: Wed Mar 25 2015 09:56:24 GMT+0500
            //currentTime = new Date(currentTime);
            //console.log('currentTime new2: '+currentTime);
        }

        if(param === '-1') {
            minutes = minutes+1;
        }

        if(param === '-1') {
            setApplyTime = 60000 - ( ( currentTime.getSeconds() * 1000 )+currentTime.getMilliseconds() );
        } else {
            setApplyTime = 0;
        }

        if (hours.toString().length < 2) {
            console.log('hours is < 2');
            hours = '0'+hours;
        }

        if (minutes.toString().length < 2) {
            console.log('minutes is < 2');
            minutes = '0'+minutes;
        }

        console.log('Time till next minute in milliseconds: ' + setApplyTime);
        console.log('Time till next minute in seconds: ' + (setApplyTime/1000) );

        setTimeout(function () {

                this.setState({ hour: hours }, () => {});
                this.setState({ minute: minutes }, () => {});

            this.checkTime('-1');

        }.bind(this), setApplyTime);

    },
    render: function () {
        return React.createElement(
            'div',
            { className: 'digital-clock-container' },
                React.createElement('div', { id: 'hours' }, this.state.hour),
                React.createElement(
                    'div',
                    { className: 'time-divider' },
                    React.createElement(
                        'span',
                        { className: 'time-divider-dot' },
                        '.'
                    ),
                    React.createElement(
                        'span',
                        { className: 'time-divider-dot' },
                        '.'
                    )
                ),
                React.createElement('div', { id: 'minutes' }, this.state.minute),
                React.createElement('div', { id: 'timeZone' }, this.state.timeZone)
        );
    }
});

//React.createElement('div', { id: 'hourTenTop', style: this.state.hourTenTop }),

var myRegistrationModal = ReactDOM.render(React.createElement(DefaultClock, null), document.getElementById('clock-display'));
// myRegistrationModal.timeGetter()
// myRegistrationModal.timeSetter(22, 40, 25)
//myRegistrationModal.timeZoneSetter('America/Lima')
// myRegistrationModal.timeZoneGetter()

// moment( '2017-07-27T08:01:09.348Z' ).tz('America/Lima').format('YYYY-MM-DD HH:mm:ss')//works!
// moment( '2017-07-27T08:01:09.348Z' ).tz('America/Lima').format()//works!

