import poster_code
import json

final_code = poster_code.code_returner()
# Write the verification code to a JSON file
with open('verification_code.json', 'w') as json_file:
    json.dump({'verification_code': final_code}, json_file)