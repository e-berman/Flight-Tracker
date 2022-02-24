import requests

API_KEY = '39387a60d7367999d0e6a8be81da68bb'

def single_movie_details():
    '''gets the details of a single movie'''
    # needs the following:
        # poster
        # cast
        # director
        # description
        # user score
        # user votes
        # genre 
        # runtime
        # streaming service(s)
    
    # get query term from John
    query_term = 'Se7en'
    response = requests.get('https://api.themoviedb.org/3/search/movie?api_key=' + API_KEY + '&query=' + query_term)
    movie_response = response.json()
    movie_details = movie_response['results']
    
    if len(movie_details) > 1:
        for movie in movie_details:
            if query_term == movie_details[movie]['original_title']:
                return movie_details[movie]

def get_top_20_popular():
    '''gets the top 20 most popular movies from TMDB'''
    return

def get_top_20_trending():
    '''gets the top 20 trending movies from TMDB'''
    return

def get_top_20_by_genre():
    '''gets the top 20 most popular movies by genre'''

print(single_movie_details())