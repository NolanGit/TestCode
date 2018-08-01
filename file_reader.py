import os
rootdir = 'C:\\Users\\sunhaoran\\OneDrive\\OneDrive工作\\项目周报'
list = os.listdir(rootdir)
for i in range(0, len(list)):
    path = os.path.join(rootdir, list[i])
    path = path.replace('\\', '/')
    print(path)
