import time, os

def launcher():
    '''launches the microservice file in tandem with text files'''
    with open('input.txt', 'r') as input_file:
        time.sleep(1)
        contents = input_file.read()
        input_file.close()

        