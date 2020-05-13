import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default class EditExercise extends Component {
    constructor(props) {
        super(props);

        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeYear = this.onChangeYear.bind(this);
        this.onChangeFormat = this.onChangeFormat.bind(this);
        this.onChangeStarsInput = this.onChangeStarsInput.bind(this);

        this.state = {
            title: '',
            format: '',
            year: '',
            stars: [],
            starsInput: '',
            editError: '',
            editSuccess: ''
        }
    }

    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        })
    }

    onChangeFormat(e) {
        this.setState({
            format: e.target.value
        })
    }
    
    onChangeYear(e) {
        this.setState({
            year: e.target.value
        })
    }
    onChangeStarsInput(e) {
        this.setState({
            starsInput: e.target.value
        })
    }

    componentDidMount() {
        axios.get('http://localhost:6000/'+this.props.match.params.id)
        .then(response => {
            this.setState({
                title: response.data.title,
                year: response.data.year,
                format: response.data.format,
                stars: response.data.stars
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    

   
    handleDeleteElement = index => {
        this.setState(prevState => ({
            stars: prevState.stars.filter((el, ind) => ind !== index)
        }));
    };

    onSubmit = async (e) => {
        e.preventDefault();
        this.setState({editError: ''});
        var film1 = await {
            title: this.state.title.trim(),
            year: this.state.year,
            format: this.state.format,
            starsInput: this.state.starsInput.replace(/\s+/g,' ').trim(),
            starsArr: this.state.stars
        }
        if (film1.title !== "" && film1.year !== "" ) {
        if (film1.starsInput !== "") {
            film1.starsInput = await film1.starsInput.split(',');

            for (let a = 0; a < film1.starsInput.length; a++)
            film1.starsInput[a] = await film1.starsInput[a].trim();

            if (film1.starsInput.indexOf('') !== -1) {
                this.setState({editError: 'Stars are entered incorrectly'});
                return;
            }
            film1.starsArr = await film1.starsArr.concat(film1.starsInput);
        }

        if (film1.starsArr.length === 0) {
            this.setState({editError: 'Stars are empty'});
            return;
        }

        if (isNaN(film1.year)){
            this.setState({editError: 'Year is a NaN'})
            return;
        }

        var film = {
            title: film1.title,
            year: film1.year,
            format: film1.format,
            stars: film1.starsArr
        }

        await axios.post('http://localhost:6000/update/' + this.props.match.params.id, film)
        .then(res => console.log(res.data));

        window.location = '/';
        }
        else {
            this.setState({editError: 'Something is empty'});
        }
    }

render() {
return (
    <div className="body">
        <header>
            <div>Edit {this.state.title} </div>
            <Link to={"/"}>back to film list</Link>
        </header>
        <form className="editForm" onSubmit={this.onSubmit.bind(this)}>
            <div>
            <label>Title</label>
            <input type="text" value={this.state.title} onChange={this.onChangeTitle}/>
            </div>
            <div>
            <label>Release Year (num)</label>
            <input type="text" value={this.state.year} onChange={this.onChangeYear}/>
            </div>
            <div>
            <label>Format</label>
            <select value={this.state.format} onChange={this.onChangeFormat}>
                <option value="DVD">DVD</option>
                <option value="VHS">VHS</option>
                <option value="Blu-Ray">Blu-Ray</option>
            </select>
            </div>
            <div>
            <label>Delete stars</label>
            {this.state.stars.map((el,index) => (
            <div className="starForDelete" key={index}>

            <div>{el}</div>
            
            <button
            onClick={(e) => { 
                e.preventDefault(); 
                this.handleDeleteElement(index) 
            }}
            > X</button>
            
            </div>
            ))}
            </div>
            <div>
            <label>Add new stars, across ,</label>
            <input value={this.state.starsInput} onChange={this.onChangeStarsInput}/>
            </div>
            <button type="submit">Edit</button>
        </form>
        { 
        (this.state.editError === '')
        ? null
        : <div>{this.state.editError} </div> 
        }
    </div>
)
}
}