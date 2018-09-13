# coding=utf-8
def decorate_func(normal_func):
    print('I\'m decorate_func')
    return normal_func()


@decorate_func
def normal_func():
    print('I\'m normal_func')
    return print('normal_func_return_result')
