# coding=utf-8
import os


srcDir = './testDir/ttDir'

dstDir = './testDir/hhDir'

try:
    os.rename(srcDir, dstDir)
except Exception as e:
    print e
    print 'rename dir fail\r\n'
else:
    print 'rename dir success\r\n'
