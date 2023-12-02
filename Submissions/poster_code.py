import submitted_code

def code_returner():
    n = 25
    answer = submitted_code.solve(n)
    if answer == 625:
        answer_code = "123d3"
    else:
        answer_code = "00000000"
    return answer_code
