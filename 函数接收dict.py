def func(**var):
    print(var)
    globals().update(var)
    print(a)
    

func(a='1',b='2')