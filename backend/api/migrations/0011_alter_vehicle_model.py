# Generated by Django 4.2.16 on 2025-04-01 01:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0010_rename_responsable_team_vehicleentryregistry_responsible_team"),
    ]

    operations = [
        migrations.AlterField(
            model_name="vehicle",
            name="model",
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
