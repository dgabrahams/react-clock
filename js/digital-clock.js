var DefaultClock = React.createClass({
    displayName: 'defaultClock',

    getInitialState: function () {
        return {
            timeZone: null,
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
    timeZoneSetter: function (timeZone) {
        this.setState({ timeZone: timeZone }, () => {});
    },
    timeZoneGetter: function (timeZone) {
        return 'timeZone: ' + this.state.timeZone;
    },
    checkTime: function (param) {

        console.log('----- checkTime -----');
        var setApplyTime = 0; //run in the current second
        var currentTime = new Date();

        if ( this.state.timeZone !== null ) {
            //&& data !== undefined
            // var momentNTPtime = moment( new Date( String(dateString) ).toString() );
            // momentNTPtime.tz(timeZone.time_zone).unix();

            //require ISO format? : 2014-12-01T12:00:00Z

            console.log('currentTime before: '+currentTime);
            currentTime = moment( currentTime.toISOString() ).tz(this.state.timeZone).format();
            console.log('currentTime new: '+currentTime);
            currentTime = new Date(currentTime);
            console.log('currentTime new2: '+currentTime);
        }

        console.log('minutes: ' + currentTime.getMinutes());
        console.log('seconds: ' + currentTime.getSeconds());
        console.log('milliseconds: ' + currentTime.getMilliseconds());

        var minutes = currentTime.getMinutes();
        var hours = currentTime.getHours();

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
                React.createElement('div', { id: 'minutes' }, this.state.minute)
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

