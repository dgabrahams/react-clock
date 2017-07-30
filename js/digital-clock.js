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
            this.checkTime('1', '0');
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
    checkTime: function (param, runOnce) {

        console.log('----- checkTime -----');
        var setApplyTime = 0; //run in the current second
        var currentTime = new Date();

        console.log('hours: ' + currentTime.getHours());
        console.log('minutes: ' + currentTime.getMinutes());
        // console.log('seconds: ' + currentTime.getSeconds());
        // console.log('milliseconds: ' + currentTime.getMilliseconds());

        var minutes = currentTime.getMinutes();
        var hours = currentTime.getHours();

        if ( this.state.timeZoneValue !== null ) {
            // get current date
            // get time that is required to be + or -
            //+ or - that form current time and set as the state value.
            console.log('this.state.timeZone: '+this.state.timeZoneValue);
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
            // console.log('hours changed: ' + hours);
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

                    if ( this.state.timeZone === currentTimeZone ) {
                        console.log('this.state.timeZone === currentTimeZone');
                        this.setState({ hour: hours }, () => {});
                        this.setState({ minute: minutes }, () => {});   
                    } else {
                        console.log('this.state.timeZone !== currentTimeZone');

                    }//else

                    this.checkTime('-1', '0');

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

var myRegistrationModal = ReactDOM.render(React.createElement(DefaultClock, null), document.getElementById('clock-display'));
// myRegistrationModal.timeGetter()
// myRegistrationModal.timeSetter(22, 40, 25)
//myRegistrationModal.timeZoneSetter('America/Lima')
// myRegistrationModal.timeZoneGetter()

// moment( '2017-07-27T08:01:09.348Z' ).tz('America/Lima').format('YYYY-MM-DD HH:mm:ss')//works!
// moment( '2017-07-27T08:01:09.348Z' ).tz('America/Lima').format()//works!

