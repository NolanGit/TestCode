#coding=utf-8
import win32api, win32con
import sys

#不好使


def ModifyReg(key, keyPath, valueName, valueType, value):
    try:
        '''
        RegConnectRegistry: 
            computerName: string(If None, the local computer is used)
            key: int(May be win32con.HKEY_LOCAL_MACHINE...)
        '''
        keyHandle = win32api.RegConnectRegistry(None, key)
        '''
        RegOpenKeyEx:
            key: PyHKEY/int
            subKey: string
            reserved = 0: int(Reserved. Must be zero.)
            sam = KEY_READ: int(If you want to set the value later, you must open the key with KEY_SET_VALUE)
        '''
        subkeyHandle = win32api.RegOpenKeyEx(keyHandle, keyPath)
        '''
        RegQueryValueEx:
            key: PyHKEY/int
            valueName: The name of the value to query
        '''
        (currValue, type) = win32api.RegQueryValueEx(subkeyHandle, valueName)
        if (currValue == value):
            print('PASS: Check reg value: %s' % valueName)
            return 1
        else:
            print('INFO: The %s is not the same as %s' % (valueName, value))
            print('INFO: Try to set %s as %s' %(valueName, value))
            subkeyHandle = win32api.RegOpenKeyEx(keyHandle, keyPath, 0, win32con.KEY_SET_VALUE)
            '''
            RegSetValueEx:
                key: PyHKEY/int
                valueName: string(The name of the value to set)
                reserved: any(Zero will always be passed to the API function)
                type: int(REG_DWORD, REG_SZ ...)
                value: registry data
            '''
            win32api.RegSetValueEx(subkeyHandle, valueName, 0, valueType, value)
    except:
        print('FAIL: ModifyReg %s. Exception happened. Exception happened when accessing registry key under %s.' % (valueName, keyPath))
        return 0
    print('SUCCESS: ModifyReg %s value under %s' % (valueName, keyPath))
    return 1

key = win32con.HKEY_CURRENT_USER
AUPath = r'Software\Microsoft\Terminal Server Client\Default'
valueName = r'AUOptions'
valueType = win32con.REG_DWORD
value = 1