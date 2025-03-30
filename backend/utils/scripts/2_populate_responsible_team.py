from api.models import User, VehicleEntryRegistry, Organization, Team


def execute():
    """
    This script was created to populate the records with responsible_team set to None.
    With the objective to maintain the integrity of the database.
    """
    try:
        # get records with responsible team set to None in the test organization
        test_organization = Organization.objects.get(id=1)
        records = VehicleEntryRegistry.objects.filter(
            responsible_team=None, vehicle__organization=test_organization
        )
        print("records", records)
        # get test team
        team = Team.objects.get(id=1)
        records.update(responsible_team=team)
        print("Finished!")
    except Exception as e:
        print("Something went wrong:", e)


if __name__ == "__main__":
    execute()
