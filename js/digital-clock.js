var DefaultClock = React.createClass({
    displayName: 'defaultClock',

    getInitialState: function () {
        return {
            hour: 0,
            minute: 0,
            second: 0
        };
    },
    componentWillMount: function () {
            timerMain.addThemeCSS('/css/digital-clock.css');//works!
            this.checkTime('1');
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

