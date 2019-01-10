class Demo1(object):

    def func1(self):
        self.var = 'abc'

    def func2(self):
        print('=' * 10)
        print(self.var)
        print('=' * 10)


demo1 = Demo1()
demo1.func1()
demo1.func2()