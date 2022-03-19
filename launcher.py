import os, pymongo

# connect to mongodb client
client = pymongo.MongoClient("mongodb://localhost:27017/")

# connect to relevant db
db = client["flights"]

# connect to relevant collection
email_col = db["emails"]
flightResults_col = db["flightresults"]

# find only entry in collection (will be erased after emailed)
emailParams = email_col.find_one()
flightResultsParams = flightResults_col.find_one()

# set emailAddress value to emailAddress entry parameter
emailAddress = emailParams['emailAddress']

# initialize variables for array values in flightResultsParams
flight_id = flightResultsParams['results'][0]['_id']
flight_carrier = flightResultsParams['results'][0]['airCarrier']
flight_depart_airport = flightResultsParams['results'][0]['departAirport']
flight_arrive_airport = flightResultsParams['results'][0]['arriveAirport']
flight_depart_date = flightResultsParams['results'][0]['departDate']
flight_price = flightResultsParams['results'][0]['price']
flight_seats_left = flightResultsParams['results'][0]['seatsLeft']
if 'returnDate' in flightResultsParams['results'][0]:
    flight_return_date = flightResultsParams['results'][0]['returnDate']
else:
    flight_return_date = "N/A"


def launcher():
    '''launches the microservice file in tandem with text files'''

    with open('/Users/eberman/Desktop/email_service_data/email_data.txt', 'r') as email_file:
        email_contents = email_file.readlines()
        
        # adds the email address to the sender address line (2nd line) in the .txt file
        email_contents[1] = str(emailAddress) + '\n'

        # adds the lowest price flight to the body of the email (5th line) in the .txt file
        email_contents[4:] = "Flight ID: " + str(flight_id) + '\n'\
        + "Flight Carrier: " + str(flight_carrier) + '\n'\
        + "Departing Airport: " + str(flight_depart_airport) + '\n'\
        + "Arriving Airport: " + str(flight_arrive_airport) + '\n'\
        + "Departing Date: " + str(flight_depart_date) + '\n'\
        + "Return Date: " + str(flight_return_date) + '\n'\
        + "Price: " + str(flight_price) + '\n'\
        + "Seats Left: " + str(flight_seats_left) + '\n'

                
    # write data to email_data.txt file and close
    with open('/Users/eberman/Desktop/email_service_data/email_data.txt', 'w') as email_file:
        email_file.writelines(email_contents)
        email_file.close()

    # change directory to where Email_Service.py file is located, and run the file.
    # then drop the email and flightresults collections after complete.
    os.chdir('/Users/eberman/ankylosaurus/school/CS_361/Flight-Tracker/CS361_Email_Service/')
    os.system('python Email_Service.py')
    email_col.drop()
    flightResults_col.drop()

launcher()