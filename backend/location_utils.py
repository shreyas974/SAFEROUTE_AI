from math import radians, sin, cos, sqrt, atan2
from backend.areas import AREA_COORDS


def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth's radius in km

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c


def get_nearest_area(lat, lon):
    nearest_area = None
    min_distance = float("inf")

    for area, (area_lat, area_lon) in AREA_COORDS.items():
        distance = haversine(lat, lon, area_lat, area_lon)

        if distance < min_distance:
            min_distance = distance
            nearest_area = area

    return nearest_area

