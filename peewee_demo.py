import peewee

database = peewee.MySQLDatabase('mydb', user='root', password='root',host='localhost', port=3306)


class Person(peewee.Model):
    name = peewee.CharField()
    birthday = peewee.CharField()
    is_relative = peewee.BooleanField()

    class Meta:
        database = database
Person.create_table()
'''
class BaseModel(peewee.Model):
    class Meta:
        database = database

class Person(BaseModel):
    birthday = peewee.DateField()
    is_relative = peewee.IntegerField()
    name = peewee.CharField()

    class Meta:
        table_name = 'person'
'''
p = Person(name='liuchungui', birthday='19901220', is_relative=True)
p.save()
