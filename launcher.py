import time, os, pymongo

# connect to mongodb client
client = pymongo.MongoClient("mongodb://localhost:27017/")

# connect to relevant db
db = client["flights"]

# connect to relevant collection
col = db["emails"]

# find only entry in collection (will be erased after emailed)
emailParams = col.find_one()

# set emailAddress value to emailAddress entry parameter
emailAddress = emailParams['emailAddress']

def launcher():
    '''launches the microservice file in tandem with text files'''

    with open('/Users/eberman/Desktop/email_service_data/email_data.txt', 'r') as email_file:
        time.sleep(1)
        contents = email_file.readlines()
        contents[1] = str(emailAddress) + '\n'
    
    with open('/Users/eberman/Desktop/email_service_data/email_data.txt', 'w') as email_file:
        email_file.writelines(contents)
        email_file.close()

    os.chdir('/Users/eberman/ankylosaurus/school/CS_361/Flight-Tracker/CS361_Email_Service/')
    os.system('python Email_Service.py')
    col.delete_many({})


launcher()