from django.db import models

class Test(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    time_limit_minutes = models.IntegerField()

    def __str__(self):
        return self.name