import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import Bookmark from './components/Bookmark'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


const Home = () => (
  <div>
    <p>Welcome Home!</p>
  </div>
)

const BookmarksPage = ({ bookmarks }) => (
  <div>
    <ul>
      {
        bookmarks.map(
          bookmark => <Bookmark key={bookmark._id} {...bookmark} remove={this.remove} />
        )
      }
    </ul>
  </div>
)

class App extends Component {
  state = {
    bookmarks: [],
    loading: true,
    newbookmark: '',
  }

  remove = (id) => { // id = Mongo _id of the bookmark
    const index = this.state.bookmarks.findIndex(bookmark => bookmark._id === id)
    if (index >= 0) {
      axios.delete(`http://localhost:3000/bookmarks/${id}`).then(() => {
        const bookmarks = [...this.state.bookmarks]
        bookmarks.splice(index, 1)
        this.setState({ bookmarks })
      })
    }
  }


  newBookmark = (e) => {
    e.preventDefault();
    const elements = e.target.elements
    axios.post('http://localhost:3000/bookmarks', { title: elements.title.value, url: elements.url.value })
    .then(bookmark => {
      this.setState({ newbookmark: '', bookmarks: [...this.state.bookmarks, bookmark.data] })
    })
  }


// LINE 21 - Key removes chrome error message, it will be a bit slower without it
  render() {
    const { bookmarks, loading } = this.state
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Bookmarks</h1>
          </header>

          <nav>
            <Link to="/">Home</Link>
            <Link to="/Bookmarks">Bookmarks</Link>
            <Link to="/Bookmarks/5b342ca21532fec1fc178846">Dilbert</Link>
            <Link to="/Bookmarks/new">New Bookmark</Link>
          </nav>

          { loading ? <p>Loading...</p>: (
          <Route exact path="/" component={Home} />
          )}

          <Route exact path="/Bookmarks" render={() => (
            <BookmarksPage bookmarks={this.state.bookmarks} />
          )}  />

          <Route path="/Bookmarks/:id" render={({match}) => {
            const found = this.state.bookmarks.find(bookmark => bookmark._id === match.params.id && bookmark._url === match.params.url)
            return(
              <div>
                <p>{found && found.title}</p>
                <p>{found && found.url}</p>
              </div>
            )
          }}  />

          <Route exact path="/Bookmarks/new" render={() => (
            <form onSubmit={this.newBookmark}>
              <h2>New Bookmark</h2>
              <label htmlFor="title">Title:</label>
              <input id="title" ></input>
              <label htmlFor="url">Url:</label>
              <input id="url" ></input>
              <button type="submit">Add Bookmark</button>
            </form>
          )}  />

        </div>
      </Router>
    );
  }
  async componentDidMount() {
    try {
      const bookmarks = await axios.get(
        'http://localhost:3000/bookmarks'
      )
      this.setState({ bookmarks: bookmarks.data, loading: false })
    }
     catch(error) {
      alert('Can\'t get bookmarks!')
    }
  }
}



export default App;
