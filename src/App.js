/* Damian X  */
import { useEffect, useState } from "react";
import StarRating from "./StarRating";


const MOVIE_API_KEY = `37128af0`
export default function App(){
  const [query, setQuery] = useState('')
  const [isLoading, setIsloading] = useState(false);
  const [error,setError] = useState('')
  const [movies, setMovies] = useState([]);
  const [selectedID, setSelectedID] = useState(null)
  const [rating, setRating] = useState(null);
  const [watched,setWatched]= useState([]);
  const [rated, setRated] = useState(null)
  function handleRated(id){
     setRated(watched.find(movie=>movie.imdbID === id)) 
 
   }

  function handleWatched(currWatched){
    setWatched(watched=>[...watched,currWatched])
  }

  function handleDelete(id){
    setWatched(watch=>watch.filter(movie=>movie.imdbID !== id))
  }

  

  function handleSelected(id){
    setSelectedID(id)
    
  }
  useEffect(function (){
    const controller = new AbortController()
    async function fetchMovies(){
      try{
      setIsloading(true)
      setError('')
      const res = await fetch(`https://www.omdbapi.com/?apikey=${MOVIE_API_KEY}&s=${query}`,{signal: AbortController.signal})
      if(!res.ok) throw new Error('Could not fetch')
      const data = await res.json()
      setMovies(data.Search)
      } catch (err){
        setError(err.message)
      }
      finally{
        setIsloading(false)
      }

      if(!query){
        setError('')
        setMovies([])
      }

      
    }
    fetchMovies()

    return function (){
      controller.abort()
    }
  },[query])

  
  return (
    <div className="container">
      <NavBar >
      <Logo/>
      <Search query={query} setQuery={setQuery} />
      <Results movies={movies}/>
      </NavBar>
      <Main>
        <Box >
        { !isLoading & !error ?  <MovieList 
         movies={movies}
         handleSelected={handleSelected} 
         setSelectedID={setSelectedID} 
         selectedID={selectedID}
         handleRated={handleRated}
          />: null} 
        { isLoading ? <Loading/>: null} 
        {  error  ?<Error/>: null} 
        </Box>
        <Box>
          <WatchedMovies selectedID={selectedID}
           setSelectedID={setSelectedID} 
           rating={rating} setRating={setRating}
           handleWatched={handleWatched}
           setWatched={setWatched} watch={watched}
           rated={rated}
           />
           {!selectedID&&<WatchedList watched={watched} rating={rating} handleDelete={handleDelete} />}
          </Box>
      </Main>

    </div>
  )
}

function WatchedList({watched, rating, handleDelete}){
  return (
    <div className="watched__main">
      {watched.map(watch=><WatchedItem watch={watch} rating={rating} key={watch.imdbID} handleDelete={handleDelete}/>)}

    </div>
  )
}
function WatchedItem({watch, rating, handleDelete}){
  console.log(watch)
  return (
    <div className="watched__item">
      <img src={watch.poster} alt={watch.title} className="poster" />
      <div className="movie__desc">
        <p className="title">{watch.title}</p>
        <div className="watch__ratings">
        <p className="rate__imdb">⭐ {watch.imdbRating}</p>
        <p className="rate__imdb">🌟 {watch.userRating}</p>
        <p className="rate__imdb">⌛ {watch.runtime} min</p>

        <div className="remove__btn" onClick={()=>handleDelete(watch.imdbID)}>x</div>
        </div>
      </div>
    </div>
  )
}
function NavBar({children}){
  return (
    <nav>
      {children}
    </nav>
  )

}

function Logo(){
  return (
    <div className="logo_box">
      <div className="logo">🍿</div>

      <p className="logo-txt">usePopcorn</p>
    </div>
  )
}

function Results({movies}){
  return (
    <p className="result">Found {movies?.length} results</p>
  )
}

function Loading(){
  return (
    <p className="loading">Loading.....</p>
  )
}


function Error(){
  return <p className="error">Could not fetch....</p>
}

function Search({query, setQuery}){
  return (
    <input className="search" type="text" placeholder="Search movies..." value={query} onChange={e=>setQuery(query=>e.target.value)} />
  )
}

function Main ({children}){
  return (
    <div className="container-x">
      {children}
    </div>
  )
}

function Box({children}){
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className="box">
      <div className="ctr__btn" onClick={()=>setIsOpen(isOpen=>!isOpen)}>{isOpen ? '-':'+'}</div>

      {isOpen && children}
    </div>
  )
}

function MovieList({movies, handleSelected, setSelectedID, selectedID,watch, handleRated}){
  return (
    movies?.map(movie=><Movie movie={movie} key={movie.imdbID} handleSelected={handleSelected} watch={watch} handleRated={handleRated} setSelectedID={setSelectedID} selectedID={selectedID}/>)
  )
}

function Movie({movie, handleSelected, selectedID, setSelectedID, watch, handleRated}){
  
  return (
    <div className="movie__box" onClick={()=>{
      handleSelected(movie.imdbID)
      
      if(selectedID === movie.imdbID) setSelectedID(null) 
        handleRated(movie.imdbID)
      
      }}>
      <img src={movie.Poster} alt={movie.Title} className="poster" />
      <div className="movie__desc">
        <p className="title">{movie.Title}</p>
        <p className="year">🗓️ {movie.Year}</p>
      </div>
    </div>

  )
}

function WatchedMovies({selectedID, setSelectedID, setRating, rating, handleWatched, setWatched,watch, rated}){
  
  const [movieInfo, setMovieInfo] = useState({})
  console.log(watch)
  const avgUserRating = watch.map(movie=>movie.userRating).reduce((curr, acc)=> curr+acc,0)/watch.length
  const avgimDbRating = watch.map(movie=>movie.imdbRating).reduce((curr, acc)=> curr+acc,0)/watch.length
  const avgRuntime = watch.map(movie=>movie.runtime).reduce((curr, acc)=> curr+acc,0)/watch.length
  
  return (
    
    <>
      
        {selectedID ? 
        <SelectedMovie
        selectedID={selectedID} 
        setSelectedID={setSelectedID} rating={rating} 
        setRating={setRating} handleWatched={handleWatched} setWatched={setWatched}
        movieInfo={movieInfo}
        watch={watch}
        rated={rated}
        
        setMovieInfo={setMovieInfo}/>:
    <div className="watched__box">
      <div className="watched__title">Movies You Watched</div>
      <div className="stats">
        <p className="mov__stat"><span>️🔢</span> <span className="num"><span>{watch.length>0 ? watch.length: 0}</span> movies</span> </p>
        <p className="mov__stat"><span>⭐</span> <span className="num">{avgimDbRating? avgimDbRating: '0.0'}</span></p>
        <p className="mov__stat"><span>🌟</span> <span className="num">{avgUserRating? avgUserRating: '0.0'}</span></p>
        <div className="mov__stat">⌛ <span className="num"><span>{avgRuntime? avgRuntime: '0.0'}</span> min</span></div>
      </div>
      </div>
}

      
</>
  )
}

function SelectedMovie({selectedID, setSelectedID, rating, setRating, 
  handleWatched, setWatched, setMovieInfo,movieInfo, watch, rated}){
  const [isLoading, setIsloading] = useState(false)
  
  
  useEffect(function (){
    async function loadSelectedMovie(){
      setIsloading(true)
      const res = await fetch(`http://www.omdbapi.com/?apikey=${MOVIE_API_KEY}&i=${selectedID}`)
      const data = await res.json()
      console.log(data)
      setIsloading(false)
      setMovieInfo(data)
      

    }
    loadSelectedMovie()
  },[selectedID,setMovieInfo])

  const  {
    Actors:actors,
    Director:director, 
    Title: title,
    Released: released,
    imdbRating, 
    imdbID ,
    Plot: plot, 
    Genre: genre,
    Runtime: runtime,
    Year: year,
    Poster: poster
  } = movieInfo

  useEffect(function(){
    if(!title) return
    document.title = `Movie | ${title}`

    return function (){
        document.title = 'usePopcorn'
    }
  },[title, selectedID])

  function handleAdd(){
    
    const newWatchedMovie = {
      actors,
    director, 
    title,
    released,
    imdbRating: Number(imdbRating), 
    imdbID ,
    plot, 
    genre,
    runtime: Number(runtime.split(' ').at(0)),
    year,
    poster,
    userRating: rating

    }
    handleWatched(newWatchedMovie)
  }
  return (
    
    <>
    
    { isLoading? <Loading/>: <>
    <div className="selected__movie ">
    <div className="larr" onClick={()=>setSelectedID(null)}>&#8592;</div>
      <img src={movieInfo.Poster} alt={movieInfo.Title} className="movie__poster" />
      <div className="movie__desc">
        <p className="title-x">{movieInfo.Title}</p>
        <p className="released">{movieInfo.Released} • {movieInfo.Runtime}</p>
        <p className="genre">{movieInfo.Genre}</p>
        <p className="rating"><span>⭐</span>{movieInfo.imdbRating} imDb rating</p>
      </div>

    </div>
    
    <div className="rate__box_main">

    {rated ? <Rated rated={rated}/>:
    <>
    <StarRating maxRating={10} className='rate__box' rateX={setRating}
    />
    <div className="add__box">
    {rating && <AddToList rating={rating} handleAdd={handleAdd} handleWatched={handleWatched} setWatched={setWatched} setMovieInfo={setMovieInfo}  movieInfo={movieInfo} setSelectedID={setSelectedID} />}
    </div>
    </>
    } 
    
    
    </div>
    

    <div className="more-info">

    <p className="movie__plot">
      {movieInfo.Plot}
    </p>
    <p className="staring">Starring {movieInfo.Actors}</p>
    <p className="directed">Directed by {movieInfo.Director}</p>
    </div>
    </>}
    </>

  )
}

function Rated({rated}){
  return (
    
    <p className="rated__info">You rated movie with {rated.userRating} 🌟</p>
  )
  
}


function AddToList({handleWatched,movieInfo, setSelectedID, setMovieInfo, rating, handleAdd}){
  return ( 
      <button className="add" onClick={()=>{
        setSelectedID(null)
        handleAdd()
        
      }
      }>+ Add to list</button>
  )
}

