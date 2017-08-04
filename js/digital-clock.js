var DefaultClock = React.createClass({
    displayName: 'defaultClock',

    getInitialState: function () {
        return {
            timeZone: 'Local Timezone',
            timeZoneValue: null,
            halt: null,
            hour: 0,
            minute: 0,
            second: 0
        };
    },
    componentWillMount: function () {
            timerMain.addThemeCSS('/css/digital-clock.css');//works!
            this.checkTime('1', '0');
    },
    halt: function() {
        this.setState({ halt: 'halt' }, () => {
            console.log('halt applied to defaultClock');
        });
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
            this.checkTime('1', '1');
        });
    },
    timeZoneGetter: function () {
        return 'timeZone: ' + this.state.timeZone;
    },
    checkTime: function (runImmediate, runOnce) {

        console.log('----- checkTime from Digital Clock ----- '+new Date()+' ... ms: '+new Date().getMilliseconds() );
        var setApplyTime = 0; //run in the current second
        var currentTime = new Date();

        console.log('hours: ' + currentTime.getHours());
        console.log('minutes: ' + currentTime.getMinutes());
        // console.log('seconds: ' + currentTime.getSeconds());
        // console.log('milliseconds: ' + currentTime.getMilliseconds());

        var minutes = currentTime.getMinutes();
        var hours = currentTime.getHours();


        if ( this.state.timeZoneValue !== null ) {

            hours = currentTime.getUTCHours();
            minutes = currentTime.getUTCMinutes();

            console.log('this.state.timeZoneValue !== null');
            var timeZoneTime = timerMain.timezoneTheme(this.state.timeZone,hours,minutes);
            console.log(timeZoneTime);
            hours = parseInt(timeZoneTime.hours);
            minutes = parseInt(timeZoneTime.minutes);
            // hours = parseInt(hours) + parseInt(timeZoneTime.hours);
            // minutes = parseInt(minutes) + parseInt(timeZoneTime.minutes);

        } else {
            console.log('this.state.timeZoneValue === null');

        }

//check if this works with 12 hours as well as 24 hour clock
        if(runImmediate === '-1') {
            minutes = minutes+1;
            //check if minutes will now be greater than 60
            //if yes then add one hour to hours
        }

        if(runImmediate === '-1') {
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

        
            if ( runOnce === '1' ) {
                console.log('run once');
                this.setState({ hour: hours }, () => {});
                this.setState({ minute: minutes }, () => {});
            } else {
                console.log('run many');
                console.log('Time till next minute in milliseconds: ' + setApplyTime);
                console.log('Time till next minute in seconds: ' + (setApplyTime/1000) );

                var currentTimeZone = this.state.timeZone;

                setTimeout(function () {
                        //when timezone change the value set here is out of date when it comes to the first minute to be changed
                        //the next minute afterwards is ok
                        console.log('this.state.halt: '+this.state.halt);
                        if ( this.state.halt == null ) {
                            if ( this.state.timeZone === currentTimeZone ) {
                                console.log('this.state.timeZone === currentTimeZone');
                                this.setState({ hour: hours }, () => {});
                                this.setState({ minute: minutes }, () => {});   
                            } else {
                                console.log('this.state.timeZone !== currentTimeZone');
                                this.checkTime('1', '1');//run again for immediate apply
                            }//else
                            this.checkTime('-1', '0');
                        }//end if
                }.bind(this), setApplyTime); 
            }//end else
        

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
                React.createElement('div', { id: 'timeZone' }, 'Showing the time in: '+this.state.timeZone)
        );
    }
});

//React.createElement('div', { id: 'hourTenTop', style: this.state.hourTenTop }),

var DefaultClockRef = ReactDOM.render(React.createElement(DefaultClock, null), document.getElementById('clock-display'));

// var myRegistrationModal = ReactDOM.render(React.createElement(DefaultClock, null), document.getElementById('clock-display'));
// myRegistrationModal.timeGetter()
// myRegistrationModal.timeSetter(22, 40, 25)
//myRegistrationModal.timeZoneSetter('America/Lima')
// myRegistrationModal.timeZoneGetter()
// myRegistrationModal.halt();

// moment( '2017-07-27T08:01:09.348Z' ).tz('America/Lima').format('YYYY-MM-DD HH:mm:ss')//works!
// moment( '2017-07-27T08:01:09.348Z' ).tz('America/Lima').format()//works!

