# -*- coding: utf-8 -*-


class CSignal():

    def __init__(self):
        self.slot = []

    def emit(self, *arg, **kw):
        for pFunc in self.slot:
            pFunc(*arg, **kw)

    def connect(self, cbfunc):
        self.slot.append(cbfunc)


class memberFuc():

    def __init__(self):
        pass

    def test(self, *arg, **kw):
        print('i am memberFuc!')


def test(*arg, **kw):
    print("i am test"), arg, kw

if __name__ == "__main__":
    testSignal = CSignal()
    testSignal.connect(test)

    testOb = memberFuc()
    testSignal.connect(testOb.test)

    testSignal.emit()
    # output:
    #   i am test
    #   i am memberfunc
    del testOb
    testSignal.emit()
    # output:
    #   i am test
    #   i am memberfunc
