Date.prototype.daysInMonth = function(month,year) {
    return new Date(year, (month+1), 0).getDate();
}
Date.prototype.getToday = function(month,year) {
    var date = new Date();
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
}
var date = new Date();

var calendar = {
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

function datenow (){
    var date = new Date();
    document.getElementById("datenow").innerHTML = date.getHours() + " : " + date.getMinutes();
}
datenow();
setInterval(function(){
    datenow();
}, 60000);


var tasks = {
    init: function(){
        var self = this;
        $.post("/notes", {"json": JSON.stringify({"action": "read_all"})}, function(response){
            var sortable = self.sortList(response);
            self.render(sortable, "select");
            self.list = sortable;
        }, "json");
    },
    list:[],
    addToList: function(obj){
        this.list.unshift([obj[0]["Id"], obj[0]["doc"]]);
    },
    getList: function(){
        return this.list;
    },
    sortList: function(obj){
        var sortable = [];
        $.each(obj, function(i){
            sortable.push([this.id, this.doc]);
        });
        sortable.sort(function(a, b) {return b[0] - a[0]});
        return sortable;
    },
    indexof: function(pk){
        var find = -1;
        for (var i=0; find < 0 && i < this.list.length; i++){
            if (this.list[i][0] == pk){
                find = i;
            }
        }
        return find;
    },
    removeToList: function(pk){
        var index = this.indexof(pk);
        if (index > -1) {
            this.list.splice(index, 1);
        }
    },
    render: function(obj, action, pk){
        var self = this;
        switch (action){
            case "select":
                ReactDOM.render(<TaskList items={obj} />, document.getElementById("tasklist"));
            break;
            case "prepend":
                self.addToList(obj);
                ReactDOM.render(<TaskList items={self.getList()} />, document.getElementById("tasklist"));
            break;
            case "remove":
                console.log(0);
                self.removeToList(pk);
                ReactDOM.render(<TaskList items={self.getList()} />, document.getElementById("tasklist"));
            break;
        }
    }
}
tasks.init();

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
    handleCancel: function(){
        $("#addtask").show();
        $("#taskform").empty();
    },
    handleSubmit: function(event){
        event.preventDefault();
        var json = JSON.stringify({"action": "create", "doc": {"title": this.refs.title.value, "text": this.refs.text.value}});
        var self = this;
        $.post("/notes", {"json": json}, function(response){
            tasks.render(response, "prepend");
            self.handleCancel();
        }, "json");

    },
    render: function(){
        return (<form ref="taskform" role="form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input placeholder="Title" name="title" ref="title" className="form-control" />
                    </div>
                    <div className="form-group">
                        <textarea placeholder="Text" name="text" ref="text" className="form-control" />
                    </div>
                    <button type="button" className="btn btn-default btn-block" onClick={this.handleCancel}>
                        <span className="glyphicon glyphicon-hand-left" aria-hidden="true"></span> Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-block">
                        <span className="glyphicon glyphicon-ok" aria-hidden="true"></span> Save
                    </button>
        </form>)
    }
});

var TaskList = React.createClass({
    handleDelete: function(pk){
        $.post("/notes", {"json": JSON.stringify({"action": "delete", "id": pk})}, function(response){
            if (response["message"] == "ok"){
                tasks.render(null, "remove", pk);
            }
        });
    },
    render: function() {
        var handleDelete = this.handleDelete;
        return (<div className="list-group">{this.props.items.map(function (result, i) {
            return (
                <div className="list-group-item" key={"task_"+result[0]}>
                    <div className="col-md-9"><h4 className="list-group-item-heading">{result[1].title}</h4></div>
                    <div className="col-md-3">
                        <button onClick={this.handleDelete.bind(this, result[0])} className="btn btn-sm btn-danger">
                            <span className="glyphicon glyphicon-trash"></span>
                            delete
                        </button>
                    </div>
                    <p className="list-group-item-text">{result[1].text}</p>
                </div>
            );
        }, this)}
        </div>);
    }});

document.getElementById("addtask").addEventListener("click", function(){
    $(this).hide();
    ReactDOM.render(<Task/>, document.getElementById('taskform'));
});