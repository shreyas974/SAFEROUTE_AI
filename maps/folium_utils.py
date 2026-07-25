import streamlit as st
import folium
from streamlit_folium import st_folium


def live_map():

    st.title("🗺️ SafeRouteAI Live Safety Map")


    # Default current location (Bangalore)
    current_location = [12.9716, 77.5946]


    # Create Map
    m = folium.Map(
        location=current_location,
        zoom_start=13,
        control_scale=True
    )


    # Current Location Marker
    folium.Marker(
        location=current_location,
        popup="📍 Current Location",
        tooltip="You are here",
        icon=folium.Icon(
            color="blue",
            icon="user"
        )
    ).add_to(m)



    # Safe Zones
    safe_zones = [

        ("Police Station", 12.9754, 77.5990),

        ("Hospital", 12.9690, 77.6012),

        ("Metro Station", 12.9785, 77.5932)

    ]


    for name, lat, lon in safe_zones:

        folium.Marker(

            location=[lat, lon],

            popup=f"🟢 {name}",

            tooltip=name,

            icon=folium.Icon(
                color="green",
                icon="plus"
            )

        ).add_to(m)



    # Danger Zones
    danger_zones = [

        ("High Crime Area", 12.9650, 77.6100),

        ("Accident Zone", 12.9795, 77.6070),

        ("Low Lighting Area", 12.9668, 77.5905)

    ]


    for name, lat, lon in danger_zones:

        folium.CircleMarker(

            location=[lat, lon],

            radius=12,

            color="red",

            fill=True,

            fill_color="red",

            fill_opacity=0.7,

            popup=f"🔴 {name}",

            tooltip=name

        ).add_to(m)



    # Map Legend

    st.markdown(
    """
    🟦 Blue → Current Location  
    🟢 Green → Safe Zone  
    🔴 Red → Danger Zone
    """
    )


    # Display Map

    st_folium(
        m,
        width=1000,
        height=600
    )



# Run Function

live_map()