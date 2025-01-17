# Generated by Django 4.2.16 on 2025-01-17 23:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0006_alter_vehicleentryregistry_status"),
    ]

    operations = [
        migrations.AddField(
            model_name="team",
            name="organization",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                to="api.organization",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="workshop",
            name="organization",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                to="api.organization",
            ),
            preserve_default=False,
        ),
    ]
