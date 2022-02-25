import json
import requests

API_KEY = '39387a60d7367999d0e6a8be81da68bb'

def get_movie_id(movie_title):
    '''gets the id of a single movie'''
    movie_id = None

    # GET search movies
    # https://developers.themoviedb.org/3/search/search-movies
    response = requests.get('https://api.themoviedb.org/3/search/movie?api_key=' + API_KEY + f'&query={movie_title}')
    movie_response = response.json()
    
    # filter by results
    movie_details = movie_response['results']
    
    # for some reason, themoviedb api will search multiple films with similar search terms,
    # so we need to iterate through all the results and match the passed movie title to the title value
    if len(movie_details) > 1:
        for movie in movie_details:
            if movie['title'] == movie_title:
                return movie['id']
                
                
def get_movie_details(movie_id):
    '''gets the movie details given a movie_id'''
    movie_details = {}
    
    # GET movie details 
    # https://developers.themoviedb.org/3/movies/get-movie-details
    response = requests.get(f'https://api.themoviedb.org/3/movie/{movie_id}?api_key=' + API_KEY + '&language=en-US')
    movie_response = response.json()

    # add key, value pairs to movie_details dictionary
    movie_details.update({'genres': []})
    for genre in movie_response['genres']:
        movie_details['genres'].append(genre['name'])
    movie_details.update({'overview': movie_response['overview']})
    movie_details.update({'poster_path': movie_response['poster_path']})
    movie_details.update({'runtime': movie_response['runtime']})
    movie_details.update({'vote_count': movie_response['vote_count']})
    movie_details.update({'vote_average': movie_response['vote_average']})

    # --------------------------------------------------------------------------- #

    # Given that cast and crew are listed elsewhere, another GET request needed

    # GET movie credits 
    # https://developers.themoviedb.org/3/movies/get-movie-credits
    response = requests.get(f'https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key=' + API_KEY + '&language=en-US')
    movie_response = response.json()
    
    # initialize two variables to list of cast members and list of crew members
    movie_cast = movie_response['cast']
    movie_crew = movie_response['crew']

    movie_details.update({'cast': []})
    for actor in movie_cast:
        movie_details['cast'].append(actor['name'])
    for crew_member in movie_crew:
        if crew_member['job'] == 'Director': 
            movie_details.update({'director': crew_member['name']})

    # --------------------------------------------------------------------------- #

    # Streaming Providers also in a different location, additional GET request needed

    # Get movie watch providers
    # https://developers.themoviedb.org/3/movies/get-movie-watch-providers
    response = requests.get(f'https://api.themoviedb.org/3/movie/{movie_id}/watch/providers?api_key=' + API_KEY)
    movie_response = response.json()
    
    # since only streaming services are needed, filter by flatrate
    category_details = movie_response['results']['US']['flatrate']

    # initialize empty key, value pair for streaming service
    movie_details.update({'streaming_service': []})

    # if movie on multiple streaming services, iterate through and add all to value list
    if len(category_details) > 1:
        for service in category_details:
            streaming_service = service['provider_name']
            if streaming_service == 'Disney Plus' or streaming_service == 'Netflix' or streaming_service == 'Hulu' or streaming_service == 'Amazon Prime Video': 
                movie_details['streaming_service'].append(streaming_service)
    # if only on one streaming service, append service to list
    else:
        streaming_service = category_details[0]['provider_name']
        if streaming_service == 'Disney Plus' or streaming_service == 'Netflix' or streaming_service == 'Hulu' or streaming_service == 'Amazon Prime Video': 
            movie_details['streaming_service'].append(streaming_service)

    return json.dumps(movie_details)

def get_top_20_popular():
    '''gets the top 20 most popular movies from TMDB'''
    popular_movies = {'popular_movies': []}

    response = requests.get('https://api.themoviedb.org/3/movie/popular?api_key=' + API_KEY + '&language=en-US&page=1')
    movie_response = response.json()
    results = movie_response['results']

    for movie in results:
        popular_movies['popular_movies'].append(movie['title'])
        
    return json.dumps(popular_movies)

def get_top_20_trending():
    '''gets the top 20 trending movies from TMDB'''
    trending_movies = {'trending_movies': []}

    response = requests.get('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY)
    movie_response = response.json()
    results = movie_response['results']

    for movie in results:
        trending_movies['trending_movies'].append(movie['title'])
        
    return json.dumps(trending_movies)

def get_top_20_by_genre(genre, streaming_service):
    '''gets the top 20 most popular movies by genre'''
    popular_by_genre = {'popular_by_genre': []}
    genre_list = {}

    response = requests.get('https://api.themoviedb.org/3/genre/movie/list?api_key=' + API_KEY + '&language=en-US')
    movie_genre_response = response.json()
    movie_genre_list = movie_genre_response['genres']

    for movie_genre in movie_genre_list:
        if movie_genre['name'] == genre:
            movie_genre_id = movie_genre['id']

    response = requests.get('https://api.themoviedb.org/3/discover/movie?api_key=' + API_KEY + f'&language=en-US&&with_genres={movie_genre_id}&with_watch_providers={streaming_service}&sort_by=vote_count.desc')
    movie_response = response.json()
    

    for movie in results:
        trending_movies['trending_movies'].append(movie['title'])
        
    return json.dumps(trending_movies)


# print(get_movie_id('Inception'))
# print(get_movie_details(27205))
# print(get_top_20_popular())
# print(get_top_20_trending())
print(get_top_20_by_genre('Thriller', 'Hulu'))