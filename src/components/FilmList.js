import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

  const Film = props => (
    <div className="filmComponent">
      <div className="title">{props.films.title}</div>
      <div>Release Year: {props.films.year}</div>
      <div>Format: {props.films.format}</div>
      <div className="starStart"> Stars: {props.films.stars.map((star, index) => (
      <div className="star" key={props.films._id + index}> {star} </div>
      ))}</div>
      <div className="linksFromComponent">
        
      <Link className="btn"  to={"/edit/"+props.films._id}>edit</Link> <button className="btn" onClick={() => { props.deleteFilm(props.films._id) }}>delete</button>
      
      </div>
    </div>
  )

  export default class FilmsList extends Component {
      constructor(props) {
          super(props);

          this.deleteFilm = this.deleteFilm.bind(this)

          this.state = {
              films: [],
              filteractors : "",
              filterfilm:"",
              sorting: false
          };
      }

      componentDidMount() {
          axios.get('http://localhost:6000/')
          .then(
              response => {
                  this.setState({films: response.data})
              },
          )
          .catch((error) => {
              console.log(error);
          })
      }

      deleteFilm(id) {
          axios.delete('http://localhost:6000/' + id)
          .then(response => {console.log(response.data)});

          this.setState({
              films: this.state.films.filter(el => el._id !== id)
          })
      }

      handleChangeActors = event => {
          this.setState({ filteractors: event.target.value });
      }

      handleChangeFilm = event => {
          this.setState({ filterfilm: event.target.value });
      }

      handleSortOnOff = () => {
          this.setState({sorting: !this.state.sorting})
      }


      render(){
        const { films, filteractors,filterfilm,sorting} = this.state;

        var filteredFilmsTitle = [];
        for (let f = 0; f < films.length; f++)
            if (films[f].title.toLowerCase().includes(filterfilm.toLowerCase()))
                filteredFilmsTitle.push(films[f]);
        var filteredFilmsActors = [];
            for (let a = 0; a < filteredFilmsTitle.length; a++)
                if (filteractors !== ""){
            for (let k = 0; k < filteredFilmsTitle[a].stars.length; k++)
                if (filteredFilmsTitle[a].stars[k].toLowerCase().includes(filteractors.toLowerCase()) ){
                    filteredFilmsActors.push(filteredFilmsTitle[a]);
                    break;
                }
            }
            else
                filteredFilmsActors.push(filteredFilmsTitle[a]);
        if (sorting) {
            filteredFilmsActors.sort(function(a, b){
                if(a.title < b.title) { return -1; }
                if(a.title > b.title) { return 1; }
                return 0;
            })
        }
            return(
                <div className="body">
                  <header>
                      <div>list of your films</div>
                      <Link to={"/add"}>add new film</Link>
                  </header>
                  <div className="filmSearch">
                  <input placeholder="Find by actor" value={this.state.filteractors} onChange={this.handleChangeActors} />
                  <input placeholder="Find by title" value={this.state.filterfilm} onChange={this.handleChangeFilm} />
                  <button onClick={this.handleSortOnOff}>{(!this.state.sorting) ? 
                                                            "Sort by Title" 
                                                            : "Don`t sort " }</button>
                  </div>
                  <div className="filmList">
                      {
                          filteredFilmsActors.map(exfilm => {
                            return <Film films={exfilm} deleteFilm={this.deleteFilm} key={exfilm._id}/>;
                          })
                      }
                  </div>
              </div>
          )
      }

  }
  