# coding = utf-8
import threading


def func_1():
    print(1)


def func_2():
    print(2)


def func_3():
    print(3)


def func_4():
    print(4)


def func_5():
    print(5)


def main_func1():
	print('main_func1')
    tr_func1 = threading.Timer(3, func_1)
    tr_func1.start()
main_func1()
