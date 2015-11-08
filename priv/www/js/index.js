Date.prototype.daysInMonth = function(month,year) {
    return new Date(year, (month+1), 0).getDate();
}
Date.prototype.getToday = function(month,year) {
    var date = new Date();
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
}
var date = new Date();
calendar = {
    today: date.getDate(),
    day: date.getDay(),
    month: date.getMonth(),
    year: date.getFullYear(),
    monthlist: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre",
        "Ottobre", "Novembre", "Dicembre"],
    daylist: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
    getmonth: function(){
        return this.monthlist[this.month];
    },
    getday: function(day){
        if (typeof day == "undefined"){
            day = new Date(this.year+"-"+(this.month)+"-1").getDay();
        }
        return this.daylist[day];
    },
    dayinmonth: function(){
        return date.daysInMonth(this.month, this.year);
    },
    getalldates: function(){
        var dates = [];
        var curdate = "";

        for (var i=1; i<=this.dayinmonth(); i++){
            curdate = this.year+"-"+(this.month+1)+"-"+i;
            dates.push({num:i, name: this.getday(new Date(curdate).getDay()), id:curdate});
        }
        var length = i;
        var rem = dates.length % 6;
        if (rem > 0){
            var len = 6-rem;
            for (var i=0; i<len; i++){
                dates.push({num:"", name: "", id:"00_"+(length+i)});
            }
        }
        return dates;
    },
    setmonth: function(n){
        date.setMonth(this.month+n);

        this.month = date.getMonth();
        this.year = date.getFullYear();
        this.today = date.getDate();
        this.day = date.getDay();

        ReactDOM.render(<Day/>, document.getElementById('days')).handleClick();
    }
}

var Cell = React.createClass({
    render: function(){
        return (
        <div className="col-md-2">
            <div className="row"><h5 className="pull-left">{this.props.day}</h5><h4 className="day num pull-right">{this.props.date}</h4></div>
            <div className="row"></div>
        </div>)
    }
})

var Day = React.createClass({
    getInitialState: function () {
        return { today: calendar.today, day: calendar.getday(), month: calendar.getmonth(), year: calendar.year,
            dayinmonth: calendar.dayinmonth(), dates: calendar.getalldates()};
    },
    handleClick: function(){
        this.setState({ today: calendar.today, day: calendar.getday(), month: calendar.getmonth(), year: calendar.year,
            dayinmonth: calendar.dayinmonth(), dates: calendar.getalldates()});
        document.getElementById("month").textContent = this.state.month;
        document.getElementById("year").textContent = this.state.year;
        ReactDOM.findDOMNode(this.refs[new Date().getToday()]).className += " today";
    },
    componentDidMount: function(){
        document.getElementById("month").textContent = this.state.month;
        document.getElementById("year").textContent = this.state.year;
        ReactDOM.findDOMNode(this.refs[new Date().getToday()]).className += " today";
    },
    render: function(){
        return (<div>{this.state.dates.map(function(result, i) {
            return <Cell date={result.num} day={result.name} key={result.id} ref={result.id} />;
        })}</div>);
    }
});

ReactDOM.render(<Day/>, document.getElementById('days'));

var Task = React.createClass({
    handleSubmit: function(event){
        event.preventDefault();
        var json = JSON.stringify({"action": "create", "doc": {"title": this.refs.title.value, "text": this.refs.text.value}});
        $.post("/notes", {"json": json}, function(response){
            console.log(response);
        }, "json");
    },
    render: function(){
        return (<form className="taskform" ref="taskform" role="form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input placeholder="Title" name="title" ref="title" className="form-control" />
                    </div>
                    <div className="form-group">
                        <textarea placeholder="Text" name="text" ref="text" className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-default">Save</button>
                </form>)
    }
});

document.getElementById("addtask").addEventListener("click", function(){
    $(this).hide();
    ReactDOM.render(<Task/>, document.getElementById('tasklist'));
});
