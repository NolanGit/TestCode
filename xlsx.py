import xlwt

wbk = xlwt.Workbook()
sheet = wbk.add_sheet('sheet 1')
for i in range(2000):
    sheet.write(i, 0, '关键字%s' % str(i))
wbk.save('2000关键字.xls')
