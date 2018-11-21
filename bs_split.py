from bs4 import BeautifulSoup

str = '<tbody><tr data-ctf="CTF0" class="CTF CTF0" style="height: 43px;"><td><a href="/ka/qualGrp/detail?id=47776&amp;isp=1542719256789_23985_45">47776</a></td></tr></tbody>'
soup = BeautifulSoup(str, 'lxml')
soup.find_all(class_='CTF CTF0')
print(soup)
print(soup.a.get_text())
