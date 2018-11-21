import xlwt

wbk = xlwt.Workbook()
sheet = wbk.add_sheet('sheet 1')
for i in range(3001):
    sheet.write(i, 0, '马老师%s' % str(i))
wbk.save('3000马老师.xls')
