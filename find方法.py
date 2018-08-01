qqq = '//*[@id="grid"]/tbody/tr/td[4]/input'
www = 'werwerwer'
print(qqq.find('/'))
print(www.find('/'))


def click(id_or_xpath):
    if id_or_xpath.find('/') == (-1):
        try:
            print('id')
        except Exception as e:
            print(e)
    else:
        try:
            print('xpath')
        except Exception as e:
            print(e)

click(qqq)
click(www)
