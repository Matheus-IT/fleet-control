import csv
from api.models import Vehicle


def execute():
    """This script was created to populate the Vehicle table with records from a csv file"""
    try:
        with open("vehicles.csv", mode="r", encoding="utf-8") as file:
            ORG_ID = 2
            reader = csv.DictReader(file)
            for row in reader:
                licence_plate = row["PLATES"]
                Vehicle.objects.create(
                    licence_plate=licence_plate,
                    organization_id=ORG_ID,
                )
    except Exception as e:
        print("Something went wrong:", e)


if __name__ == "__main__":
    execute()
