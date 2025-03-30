from api.models import User, VehicleEntryRegistry, Organization


def execute():
    """
    This script was created to populate the VehicleEntryRegistry table with records
    with author set to None. With the objective to maintain the integrity of the database.
    """
    try:
        # get records with author set to None in the test organization
        test_organization = Organization.objects.get(id=1)
        records = VehicleEntryRegistry.objects.filter(
            author=None, vehicle__organization=test_organization
        )
        print("records", records)
        # get test user driver
        driver = User.objects.filter(id=2).first()
        records.update(author=driver)
        print("Finished!")
    except Exception as e:
        print("Something went wrong:", e)


if __name__ == "__main__":
    execute()
