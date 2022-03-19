import json
from operator import ge
import requests
import sys

API_KEY = 'ENTER_API_KEY_HERE'

def get_movie_id(movie_title):
    '''gets the id of a single movie'''

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
    '''gets movie details given a movie_id'''
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
    
    # get further movie details from helper methods
    cast_and_crew = get_movie_cast_and_crew(movie_id)
    streaming_providers = get_movie_streaming_providers(movie_id)

    # merge returned dictionaries from helper methods with movie_details dictionary
    movie_details.update(cast_and_crew)
    movie_details.update(streaming_providers)

    return json.dumps(movie_details)

def get_movie_cast_and_crew(movie_id):
    '''gets the cast and crew information for a given movie_id'''
    movie_details = {}

    # Given that cast and crew are listed elsewhere, another GET request needed

    # GET movie credits 
    # https://developers.themoviedb.org/3/movies/get-movie-credits
    response = requests.get(f'https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key=' + API_KEY + '&language=en-US')
    movie_response = response.json()
    
    # initialize two variables to list of cast members and list of crew members
    movie_cast = movie_response['cast']
    movie_crew = movie_response['crew']

    # create key for cast and initialize empty list value
    movie_details.update({'cast': []})

    # iterate through each cast member and add to list
    for actor in movie_cast:
        movie_details['cast'].append(actor['name'])
    # iterate through each crew member, find director, and add key, value pair
    for crew_member in movie_crew:
        if crew_member['job'] == 'Director': 
            movie_details.update({'director': crew_member['name']})
    
    return movie_details

def get_movie_streaming_providers(movie_id):
    '''gets a list of streaming providers for a passed movie_id'''
    movie_details = {}

    # Streaming Providers also in a different location, additional GET request needed

    # Get movie watch providers
    # https://developers.themoviedb.org/3/movies/get-movie-watch-providers
    response = requests.get(f'https://api.themoviedb.org/3/movie/{movie_id}/watch/providers?api_key=' + API_KEY)
    movie_response = response.json()
    
    # since only streaming services are needed, filter by flatrate
    # if movie not streaming on any platform, return key, value pair with empty list for value
    if 'flatrate' not in movie_response['results']['US']:
        return {'streaming_service': []}
    else:
        category_details = movie_response['results']['US']['flatrate']

    # initialize key, value pair with empty list value for streaming service
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

    return movie_details

def get_top_20_popular():
    '''gets the top 20 most popular movies from TMDB'''

    # initialize key, value pair with empty list for value
    popular_movies = {'popular_movies': []}

    # GET top 20 most popular movies
    # https://developers.themoviedb.org/3/movies/get-popular-movies
    response = requests.get('https://api.themoviedb.org/3/movie/popular?api_key=' + API_KEY + '&language=en-US&page=1')
    movie_response = response.json()
    results = movie_response['results']

    # given that 1 page contains 20 movies, iterate through each movie on first page and append to popular_movies dictionary
    for movie in results:
        popular_movies['popular_movies'].append(movie)

    # returning full json from tmdb jluong
    print(json.dumps(popular_movies))


def get_top_20_trending():
    '''gets the top 20 trending movies from TMDB'''

    # initialize key, value pair with empty list for value
    trending_movies = {'trending_movies': []}

    # GET top 20 trending movies
    # https://developers.themoviedb.org/3/trending/get-trending
    response = requests.get('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY)
    movie_response = response.json()
    results = movie_response['results']

    # given that 1 page contains 20 movies, iterate through each movie on first page and append to trending_movies dictionary
    for movie in results:
        trending_movies['trending_movies'].append(movie)
    
    print(json.dumps(trending_movies))

def get_top_20_by_genre(genre, streaming_service):
    '''gets the top 20 most popular movies by genre'''
    movie_provider_ids = {}
    total_list = {'results': []}

    # get movie genre id for passed movie genre
    response = requests.get('https://api.themoviedb.org/3/genre/movie/list?api_key=' + API_KEY + '&language=en-US')
    movie_genre_response = response.json()
    movie_genre_list = movie_genre_response['genres']

    # iterate through genres and add genre_id of matching passed genre
    for movie_genre in movie_genre_list:
        if movie_genre['name'] == genre:
            movie_genre_id = movie_genre['id']

    # get streaming provider id for passed streaming service
    response = requests.get('https://api.themoviedb.org/3/watch/providers/movie?api_key=' + API_KEY + '&language=en-US')
    movie_provider_response = response.json()
    movie_provider_list = movie_provider_response['results']

    # iterate through list of movie providers and get provider_id for each of the 4 streaming providers
    if len(streaming_service) > 0:
        for service in streaming_service:
            for movie_provider in movie_provider_list:
                if movie_provider['provider_name'] == service:
                    # for some reason, TMDB has two options for Amazon Prime Video. The provider_id of 9 is the correct one.
                    if service == 'Amazon Prime Video' and movie_provider['provider_id'] == 9:
                        movie_provider_ids.update({movie_provider['provider_name']: movie_provider['provider_id']})
                    elif service == 'Netflix' or service == 'Hulu' or service == 'Disney Plus':
                        movie_provider_ids.update({movie_provider['provider_name']: movie_provider['provider_id']})
    else:
        return []

    # get 20 most popular movies in a specified genre
    for key, value in movie_provider_ids.items():
        response = requests.get('https://api.themoviedb.org/3/discover/movie?api_key=' + API_KEY + f'&language=en-US&region=US&include_adult=false&include_video=false&page=1&with_genres={movie_genre_id}&with_original_language=en&watch_region=US&with_watch_monetization_types=flatrate&sort_by=vote_count.desc&with_watch_providers={value}')
        final_response = response.json()
        result_list = final_response['results']
        
        for movie in result_list:
            total_list['results'].append(movie)
            
        
    print(json.dumps(total_list))

if __name__ == "__main__":
    if sys.argv[1] == "getpopular":
        get_top_20_popular()
    if sys.argv[1] == "gettrending":
        get_top_20_trending()
    if sys.argv[1] == "getgenre":
        genre = sys.argv[2]
        servicelist = sys.argv[3].split(",")
        get_top_20_by_genre(genre,servicelist)