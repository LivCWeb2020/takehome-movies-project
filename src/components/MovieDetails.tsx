import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMovieDetails } from "../services/movieService";
import '../styles/MovieDetails.css';
import { IoChevronBackCircle } from "react-icons/io5";
import { FaCalendar, FaClock, FaSpinner } from "react-icons/fa";
import { getHeroImage } from "../utils/getImageUrl";



export default function MovieDetailsComponent() {
    // Get movie ID from React Router params
    const { id } = useParams();

    // Fetch movie details from API
    const [movie, setMovie] = useState<MovieDetails>({} as MovieDetails);
    useEffect(() => {
        const fetchData = async () => {
            const movie = await getMovieDetails(id || '');
            setMovie(movie);
            console.log(movie)
        };
        fetchData();
    }, [id]);

    // Memoize genre tags
    const genreTags = useMemo(() => {
        return movie.genres?.map(genre => (
            <span key={genre} className="movie-details__genre">{genre}</span>
        ));
    }, [movie.genres]);

    // Memoize top cast
    const renderTopCast = useCallback(() => {
        return movie.topCast?.map((performer, idx) => performer.name).join(", ");
    }, [movie.topCast]);


    return (
        <>
            <Link to="/" className="back-button">
                <IoChevronBackCircle />
            </Link>

            <div className="movie-details">
                <div className="movie-details__info" >
                    <img src={getHeroImage(id as string)} alt={movie.title} className="movie-details__image" />

                    {
                        movie.title && (
                            <div className="movie-details__content">
                                <h1 className="movie-details__title">{movie.title}</h1>

                                <div className="movie-details__genres">
                                    {genreTags}
                                    <div className="movie-details__flex-wrapper">
                                        <div className="movie-details__duration">
                                            <FaClock />
                                            <span className="movie-details__duration-text">{movie.duration / 60} min</span>
                                        </div>
                                        <div className="movie-details__release-date">
                                            <FaCalendar />
                                            <span className="movie-details__release-date-text">{movie.releaseYear}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
                {movie.title ? (
                    <div className="movie-details__details">
                        <h4 className="movie-details__details-title">Overview</h4>
                        <p className="movie-details__description">
                            {movie.description}
                        </p>

                        <div className="movie-details__top-cast">
                            <h4 className="movie-details__details-title">Featured Cast</h4>
                            <span className="movie-details__top-cast-text">{renderTopCast()}</span>
                        </div>
                    </div>
                ) : (
                    <div className="movie-details__details">
                        <h4 className="movie-details__details-title">
                            <FaSpinner
                                className="animate-spin"
                                data-testid="spinner"
                            />
                        </h4>
                    </div>
                )}
            </div>
        </>
    );
}