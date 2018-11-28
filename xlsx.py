import xlwt

wbk = xlwt.Workbook()
sheet = wbk.add_sheet('sheet 1')
for i in range(302):
    sheet.write(i, 0, '%s' % i)
    sheet.write(i, 1, '%s' % i)
wbk.save('3000.xls')
