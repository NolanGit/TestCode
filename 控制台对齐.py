s1 = 'I am a long sentence.'
s2 = 'I\'m short.'

print('%-30s%-20s' % (s1, s2))  # '%-30s' 含义是 左对齐，且占用30个字符位
print('%-30s%-20s' % (s2, s1))
