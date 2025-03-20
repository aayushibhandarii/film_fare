import { useState , useEffect} from 'react'
import Nomovie from "/public/no-movie.png"
import { useDebounce } from 'react-use'
import './App.css'
import Search from './Components/Search'
import Spinner from "./Components/Spinner"
import MovieCard from './Components/MovieCard';
import {updateSearchCount,getTrendingMovies} from "./appwrite.js"
const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}
function App() {
  const [searchTerm,setSearchTerm] = useState("");
  const [movies,setMovies] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [errorMessage,setErrorMessage] = useState(null)
  const [debounceSearchTerm,setDebounceSearchTerm] = useState("")
  const [trendingMovies,setTrendingMovies] = useState([])
  const fetchTrendingMovies = async()=>{
    try{
      const result = await getTrendingMovies()
      setTrendingMovies(result.documents)
      
    }catch(error){
      console.error(error)
    }
  }
  const fetchMovies = async(title='')=>{
    setIsLoading(true);
    updateSearchCount();
    try{
      const endpoint = title==''?
      `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`:
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(title)}`
      ;
      const response = await fetch(endpoint, API_OPTIONS);
      if(!response.ok){
        throw new Error("failed to fetch movies");
      }
      const data = await response.json();
      if(data.Response ==='false'){
        setErrorMessage(data.Error || "failed to fetch movies");
        setMovies([]);
        return;
      }
      setMovies(data.results||[])
      if(title && data.results.length>0){
        await updateSearchCount(title,data.results[0])
        
      }
      
    } catch(error){
      console.error(error)
      setErrorMessage("Error fetching movies. Please try again later.")
    } finally{
      setIsLoading(false);
    }
  }
  useDebounce(()=>{setDebounceSearchTerm(searchTerm)},1000,[searchTerm])
  useEffect(()=>{
    fetchMovies(searchTerm);
  },[debounceSearchTerm])
  useEffect(()=>{
    fetchTrendingMovies();
    
  },[])
  return (
    
    <main>
      
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src='./public\hero-img.png' alt="Hero Banner" />
          <h1>Find <span className='text-gradient'>Movie</span>You'll Enjoy Without the Hassle</h1>
        </header>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>
      {trendingMovies.length > 0 &&
      
        <section className='trending'>
          <h2>Trending</h2>
          <ul>
          {console.log(trendingMovies)}
            {
              
              trendingMovies.map((movie,index)=>(
                
                <li key={movie.$id}>
                  <p>{index+1}</p>
                  <img 
                      src={movie.poster_url?movie.poster_url:Nomovie} 
                      alt={movie.title}
                  />
                </li>
              ))
            }
          </ul>
        </section>
      }
      <section className='all-movies'>
        <h2>Popular</h2>
        {
          isLoading?(<Spinner/>):
          errorMessage?(
            <p className="text-red-500">{errorMessage}</p>
          ):(
            <ul>
              {movies.map((movie)=>{
                return <MovieCard movie={movie} key={movie.id} />
              })}
            </ul>
          )


        }
      </section>
    </main>
    
    
  )
}

export default App
