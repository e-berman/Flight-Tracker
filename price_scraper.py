import pymongo

# access mongodb client
client = pymongo.MongoClient("mongodb://localhost:27017/")

# access flight database
db = client["flights"]

# access flights collection
col = db["flights"]

# will find the only document in the collection (wiped after every use, as user will only query one flight route at a time)
flightParams = col.find_one()

# deconstruct JSON from database
departingAirport = flightParams['departingAirport']
arrivingAirport = flightParams['arrivingAirport']
arrivingDate = flightParams['arrivingDate']
departingDate = flightParams['departingDate']

# drops flights database
# col.drop()

kayak = f'https://www.kayak.com/flights/{departingAirport}-{arrivingAirport}/{departingDate}/{arrivingDate}?sort=price_a'





# tests
# print(departingAirport)
# print(arrivingAirport)
# print(arrivalDate)
# print(departingDate)