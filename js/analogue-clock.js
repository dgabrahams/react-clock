var AnalogueClock = React.createClass({
    displayName: 'AnalogueClock',

    getInitialState: function () {
        return {
            timeZone: 'Local Timezone',
            timeZoneValue: null,
            halt: null,
            secondsStyle: null,
            minutesStyle: null,
            hoursStyle: null,
            period: null
        };
    },
    componentWillMount: function () {
        timerMain.addThemeCSS('/css/analogue-clock.css');//works!
        this.checkTime();
    },
    halt: function(params, callback) {
        this.setState({ halt: 'halt' }, () => {
            console.log('halt applied to Analogue Clock');
            callback(params);
        });
    },
    timeZoneSetter: function (timeZone,timeZoneValue) {
        this.setState({ timeZone: timeZone }, () => {
            console.log('from theme component timezone: ' + this.state.timeZone );
        });
        this.setState({ timeZoneValue: timeZoneValue }, () => {
            console.log('from theme component timezonevalue: ' + this.state.timeZoneValue );
            // this.checkTime('1', '1');
        });
    },
    timeZoneGetter: function () {
        return 'timeZone: ' + this.state.timeZone;
    },
    checkTime: function () {

        console.log('----- checkTime -----');
        var setTimeoutValue = 500; //run every 15 seconds = 15000, every 1000 was what it was set at.
        var setApplyTime = 0; //run in the current second
        var currentTime = new Date();

        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();

        // var hours = currentTime.getUTCHours();
        // var minutes = currentTime.getUTCMinutes();
        // var seconds = currentTime.getUTCSeconds();

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

        if (hours < 12) {
            // console.log('AM');
            this.state.period = 'AM';
        } else {
            // console.log('PM');
            this.state.period = 'PM';
        }

        //calculate current time values as degrees on c clock
        seconds = seconds * 6; //add an extra second?
        minutes = minutes * 6;
        hours = hours * 30; //there are ony 24 hours, so 30 degrees per hour

        if( currentTime.getMilliseconds() >= 500 ) {
            seconds = seconds + 6;
        } else {
            //seconds = seconds - 6;
        }


        setApplyTime = 1000 - currentTime.getMilliseconds();//was: 1000 - currentTime.getMilliseconds() or 0
        // console.log('Time till next second: ' + setApplyTime);

        setTimeout(function () {

            //form styles to be added to the clock
            var setSecondsStyle = {
                WebkitTransform: 'rotateZ(' + seconds + 'deg)',
                transform: 'rotateZ(' + seconds + 'deg)'
            };

            var setMinuteStyle = {
                WebkitTransform: 'rotateZ(' + minutes + 'deg)',
                transform: 'rotateZ(' + minutes + 'deg)'
            };

            var setHourStyle = {
                WebkitTransform: 'rotateZ(' + hours + 'deg)',
                transform: 'rotateZ(' + hours + 'deg)'
            };

            //apply styles to the clock
            this.setState({ secondsStyle: setSecondsStyle }, () => {}); //moves the second hand by setting the style
            this.setState({ minutesStyle: setMinuteStyle }, () => {}); //moves minute hand by setting the style
            this.setState({ hoursStyle: setHourStyle }, () => {});

            setTimeout(function () {
                this.checkTime();
            }.bind(this), setTimeoutValue); 

        }.bind(this), setApplyTime);
    },
    render: function () {
        return React.createElement(
            'div',
            { id: 'clockFace' },
            React.createElement(
                'div',
                { id: 'digit-12', className: 'doubleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '12'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-1', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '1'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-2', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '2'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-3', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '3'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-4', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '4'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-5', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '5'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-6', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '6'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-7', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '7'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-8', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '8'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-9', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '9'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-10', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '10'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-11', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '11'
                )
            ),
            React.createElement(
                'div',
                { id: 'secHand', style: this.state.secondsStyle },
                React.createElement('div', { id: 'secHandLeft' }),
                React.createElement('div', { id: 'secHandRight' })
            ),
            React.createElement(
                'div',
                { id: 'minHand', style: this.state.minutesStyle },
                React.createElement('div', { id: 'minHandLeft' }),
                React.createElement('div', { id: 'minHandRight' })
            ),
            React.createElement(
                'div',
                { id: 'hourHand', style: this.state.hoursStyle },
                React.createElement('div', { id: 'hourHandLeft' }),
                React.createElement('div', { id: 'hourHandRight' })
            ),
            React.createElement(
                'div',
                { id: 'period' },
                this.state.period
            )
        );
    }
});
// let myRegistrationModal = ReactDOM.render(React.createElement(AnalogueClock, null), document.getElementById('clock-display'));//let didn't work?
// var myRegistrationModal = ReactDOM.render(React.createElement(AnalogueClock, null), document.getElementById('clock-display'));

var AnalogueClockRef = ReactDOM.render(React.createElement(AnalogueClock, null), document.getElementById('clock-display'));

