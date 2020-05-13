import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default class Add extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            format: '',
            year: 0,
            stars: [],
            innerFile: '',
            errorFile: '',
            successFile: '',
            selectType: 'VHS',
            inputTitle: '',
            inputYear: '',
            inputStars: '',
            inputError: '',
            inputSuck: ''
          }
    }
    
    showFile = async (e) => {
        e.preventDefault();

        if (e.target.files[0]) {
        const reader = new FileReader();

        reader.onload = async (e) => { 
          this.state.innerFile = (e.target.result)
        };

        reader.readAsText(e.target.files[0]);
        }
    }
    
    

    handleSubmitFile = async (e) => {
        e.preventDefault();

        var textstart = await this.state.innerFile.split("\n");
        var arrwithstrs = await textstart.filter(str => {
            if (str.trim().length)
                return str.trim();
            return null;
        });

        var sendObj = [];
        this.setState({errorFile: ""});
        this.setState({successFile: ""});

        if(arrwithstrs.length % 4 !== 0 || arrwithstrs.length === 0)
            this.setState({errorFile: "Wrong row count"});
        else
            for (var x = 0; x < arrwithstrs.length; x++) {
                var ObjectForSend = {};
                if(x % 4 === 0){
                    if(arrwithstrs[x].indexOf('Title:') === 0){
                        if(arrwithstrs[x].length > 'Title:'.length)
                            ObjectForSend.title = arrwithstrs[x].substr(6,arrwithstrs[x].length).trim();
                        else
                            this.setState({errorFile: "Title is empty somewhere"});
                    }
                    else
                        this.setState({errorFile: "Title are not set somewhere"});
                    x++;
            }
            if(x % 4 === 1){
                if(arrwithstrs[x].indexOf('Release Year:') === 0){
                    if(arrwithstrs[x].length > 'Release Year:'.length){
                        if (Number.isInteger(Number(arrwithstrs[x].substr(13, arrwithstrs[x].length).trim())) &&
                            arrwithstrs[x].substr(13, arrwithstrs[x].length).trim())
                                ObjectForSend.year = await arrwithstrs[x].substr(13, arrwithstrs[x].length).trim();
                        else
                            await this.setState({errorFile: "Release Year is not a number somewhere"});
                        
                    }
                    else
                        await this.setState({errorFile: "Release Year are empty somewhere"});
                
                }
                else
                    await this.setState({errorFile: "Release Year are not set somewhere"});
                x++;
            }
            
            if (x % 4 === 2){
                if ( arrwithstrs[x].indexOf('Format:') === 0) {
                    var format =await arrwithstrs[x].substr(7, arrwithstrs[x].length).trim();
                        if (format === "DVD" || format === "VHS" || format === "Blu-Ray")
                            ObjectForSend.format = await arrwithstrs[x].substr(8, arrwithstrs[x].length).trim();
                        else
                            await this.setState({errorFile: "Format is not right somewhere"});
                }
                else
                    await this.setState({errorFile: "Format are not set somewhere"});
                x++
            }
            if (x % 4 === 3){
                if(arrwithstrs[x].indexOf("Stars:") === 0) {
                    var stararr = arrwithstrs[x].substr(6,arrwithstrs[x].length).split(',');
                    
                    for(let a = 0; a < stararr.length; a++)
                        stararr[a] =await stararr[a].trim();
                    if(arrwithstrs[x].substr(7,arrwithstrs[x].length).trim().length > 0)
                        ObjectForSend.stars = await stararr;
                    else 
                        await this.setState({errorFile: "Stars are not set somewhere"});
                }
                else 
                    this.setState({errorFile: "Stars are not set somewhere"});
            
            if (Object.keys(ObjectForSend).length === 4)
                sendObj.push(ObjectForSend);
            if(this.state.errorFile === "" && x + 1 === arrwithstrs.length ) {
                axios.post('http://localhost:6000/adding/',sendObj)
                .then(res => this.setState({successFile: res.data.toString()}))
            }
            }
        }
    }

    handleChangeTitle = (event) => {
        this.setState({inputTitle: event.target.value});
    }

    handleChangeYear = (event) => {
        this.setState({inputYear: event.target.value});
    }

    handleChangeStars = (event) => {
        this.setState({inputStars: event.target.value});
    }

    handleChangeSelectType = (e) => {
        this.setState({selectType: e.target.value});
    }

    handleSubmitInput = async (e) => {
        e.preventDefault();

        var film = {
            title: this.state.inputTitle.trim(),
            year: this.state.inputYear.trim(),
            format: this.state.selectType,
            stars: this.state.inputStars.replace(/\s+/g,' ').trim()
        }
        if (film.title.length !== 0 
            && film.year.length !== 0 
            && film.stars.length !== 0){
            this.setState({inputError: ''})
            if (isNaN(film.year)){
                this.setState({inputError: 'Year is a NaN'})
                return;
            }

            var starsInput = film.stars.split(',');

            for (let a = 0;a < starsInput.length;a++)
                starsInput[a] = starsInput[a].trim();

            if(starsInput.indexOf('') !== -1){
                this.setState({inputError: 'Stars are entered incorrectly'});
                return;
            }

            window.location = '/';
            film.stars = starsInput;

            axios.post('http://localhost:6000/add/',film)
            .then(res => this.setState({inputSuck: res.data.toString()}));

            this.state.inputTitle = '';
            this.state.inputStars = '';
            this.state.inputYear = '';
        }
        else{
            this.setState({inputError: 'Something is empty'});
        }
        
        
    }
    
    render(){
        return(
        <div className="body">
        <header>
            <div>Add new film</div>
            <Link to={"/"}>back to film list</Link>
        </header>
        <form className="formFile" onSubmit={this.handleSubmitFile}>
        <label>Put your file</label>
        <input type="file" onChange={(e) => this.showFile(e)} required/>
        <div>File values ​​should go in a row, starting with a new line: Title, Release Year, Format, Stars. The designation and meaning shall be through:. Year should be a number. Stars must go through,. There can be no empty values.</div>
        <button type="submit">Add from file</button>
        { 
        (this.state.errorFile === '')
        ? null
        : <div>{this.state.errorFile} </div> 
        }
        {
        (this.state.successFile === '')
        ? null
        : <div>{this.state.successFile}</div> 
        }
        </form>
        
        <form className="inputForm" onSubmit={this.handleSubmitInput}>
        <div>
        <label>Title</label>
        <input type="text" value={this.state.inputTitle} onChange={this.handleChangeTitle} required/>
        </div>
        <div>
        <label>Release Year</label>
        <input value={this.state.inputYear} onChange={this.handleChangeYear} required/>
        </div>
        <div>
        <label>Format</label>
        <select value={this.state.value}  onChange={this.handleChangeSelectType}>
            <option value="VHS">VHS</option>
            <option value="DVD">DVD</option>
            <option value="Blu-Ray">Blu-Ray</option>
        </select>
        </div>
        <div>
        
        <label>
stars, through ,</label>
        <input value={this.state.inputStars} onChange={this.handleChangeStars} required/>
        </div>
        
        <button type="submit">Submit</button>
        </form>
            { 
                (this.state.inputError === '')
                ? null
                : <div>{this.state.inputError} </div> 
            }
            { 
                (this.state.inputSuck === '')
                ? null
                : <div>{this.state.inputSuck} </div> 
            }
        </div>
        )
    }

}