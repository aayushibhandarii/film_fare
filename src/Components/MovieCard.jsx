import Nomovie from "/public/no-movie.png"
export default function MovieCard({movie}){
    const movie_poster = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    return(
        <div className="movie-card">
            <img 
                src={movie.poster_path?movie_poster:Nomovie} 
                alt={movie.title}
            />
            <div className="mt-4">
                <h3>{movie.title}</h3>
            </div>
            
            <div className="content">
                <div className="rating">
                    <img 
                        src='./public\star.svg' alt="star icon" 
                    />
                    <p>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>
                </div>
                <span>•</span>
                <p className="lang">{movie.original_language}</p>
                <span>•</span>
                <p className="year">
                    {movie.release_date?movie.release_date.split("-")[0]:"N/A"}
                </p>
            </div>
        </div>
    )
}