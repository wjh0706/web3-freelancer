# Please test the following test code one by one, each of them are aligned with codes in submitted_code.py

# Test 1
import submitted_code

def code_returner():
    n = 25
    answer = submitted_code.solve(n)
    if answer == 625:
        answer_code = "3ac71829"
    else:
        answer_code = "00000000"
    return answer_code

# Test 2
import submitted_code

def code_returner():
    n = 25
    answer = submitted_code.solve(n)
    if answer == 50:
        answer_code = "29d81jc1"
    else:
        answer_code = "00000000"
    return answer_code

# Test 3 (Failure test)
import submitted_code

def code_returner():
    n = 25
    answer = submitted_code.solve(n)
    if answer == 50:
        answer_code = "15f35gh1"
    else:
        answer_code = "00000000"
    return answer_code