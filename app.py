import streamlit as st

st.set_page_config(
    page_title="SafeRouteAI",
    page_icon="🛡️",
    layout="wide"
)
# ================= SESSION STATE =================

if "logged_in" not in st.session_state:
    st.session_state.logged_in = False

if "language" not in st.session_state:
    st.session_state.language = "English"

if "page" not in st.session_state:
    st.session_state.page = "🏠 Home"


# Create session variable
if "login_status" not in st.session_state:
    st.session_state.login_status = False


def login():

    st.title("🛡️ SafeRouteAI Login")

    user = st.text_input("Username")

    pwd = st.text_input(
        "Password",
        type="password"
    )


    if st.button("Login"):

        if user == "admin" and pwd == "1234":

            st.session_state.login_status = True

            st.success("Login Successful")

            st.rerun()

        else:
            st.error("Invalid Login")


# Login checking

if st.session_state.login_status == False:

    login()

    st.stop()


# Main app

st.sidebar.title("🛡️ SafeRouteAI")

page = st.sidebar.selectbox(
    "Menu",
    [
        "Home",
        "Live Map",
        "Route Finder",
        "Dashboard"
    ]
)


st.title("Welcome to SafeRouteAI")

st.write("Current Page:", page)

# ================= LANGUAGE =================

translations = {


"English":{

"home":"🏠 Home",
"map":"🗺️ Live Map",
"route":"📍 Route Finder",
"dashboard":"📊 Dashboard",
"emergency":"🚨 Emergency",
"settings":"⚙️ Settings",
"feedback":"💬 Feedback",

"welcome":"Welcome to SafeRouteAI",
"tagline":"AI Powered Safe Route Navigation System"

},



"Hindi":{

"home":"🏠 होम",
"map":"🗺️ लाइव मैप",
"route":"📍 मार्ग खोजक",
"dashboard":"📊 डैशबोर्ड",
"emergency":"🚨 आपातकालीन सहायता",
"settings":"⚙️ सेटिंग्स",
"feedback":"💬 प्रतिक्रिया",

"welcome":"SafeRouteAI में आपका स्वागत है",
"tagline":"AI आधारित सुरक्षित मार्ग प्रणाली"

},



"Kannada":{

"home":"🏠 ಮುಖಪುಟ",
"map":"🗺️ ಲೈವ್ ನಕ್ಷೆ",
"route":"📍 ಮಾರ್ಗ ಹುಡುಕಾಟ",
"dashboard":"📊 ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
"emergency":"🚨 ತುರ್ತು ಸಹಾಯ",
"settings":"⚙️ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
"feedback":"💬 ಪ್ರತಿಕ್ರಿಯೆ",

"welcome":"SafeRouteAI ಗೆ ಸ್ವಾಗತ",
"tagline":"AI ಆಧಾರಿತ ಸುರಕ್ಷಿತ ಮಾರ್ಗ ವ್ಯವಸ್ಥೆ"

}

}



lang = st.session_state.get("language","English")



# ================= SIDEBAR =================


st.sidebar.image(
    "https://img.icons8.com/color/96/security-checked.png",
    width=80
)


st.sidebar.title("🛡️ SafeRouteAI")



menu = [

translations[lang]["home"],

translations[lang]["map"],

translations[lang]["route"],

translations[lang]["dashboard"],

translations[lang]["emergency"],

translations[lang]["settings"],

translations[lang]["feedback"]

]



selected_page = st.sidebar.radio(

    "Navigation",

    menu,

    index=menu.index(st.session_state.page)

)



st.session_state.page = selected_page



if st.sidebar.button("🚪 Logout"):

    st.session_state.page = translations[lang]["home"]

    st.rerun()
# ================= HOME PAGE =================
if st.session_state.page == translations[lang]["home"]:
    # Banner
    st.markdown(
        """
        <div style='background-color:#0E4D92;padding:20px;border-radius:10px;color:white;text-align:center;'>
            <h1>🛡️ SafeRouteAI</h1>
            <p>Your AI Safety Companion</p>
        </div>
        """,
        unsafe_allow_html=True
    )

    st.divider()

    # Feature Buttons
    col1, col2, col3 = st.columns(3)

    with col1:
        if st.button("🗺️ Live Map", use_container_width=True):
            st.session_state.page = translations[lang]["map"]

    with col2:
        if st.button("📍 Route Finder", use_container_width=True):
            st.session_state.page = translations[lang]["route"]

    with col3:
        if st.button("🚨 Emergency SOS", use_container_width=True):
            st.session_state.page = translations[lang]["emergency"]

    st.divider()

    # Quick Statistics
    st.subheader("📊 Quick Statistics")
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Users", "15K+")
    c2.metric("Safe Routes", "8,250")
    c3.metric("Danger Zones", "64")
    c4.metric("Emergency Alerts", "210")

    st.divider()

    # Why Choose SafeRouteAI
    st.subheader("🌟 Why Choose SafeRouteAI?")
    st.markdown(
        """
        ✅ AI-Based Safe Route Prediction  
        ✅ Real-Time Navigation  
        ✅ Crime Analysis Dashboard  
        ✅ Nearby Safe Places  
        """,
        unsafe_allow_html=True
    )

    st.markdown("---")
    st.caption("© 2026 SafeRouteAI | AI Secure Navigation")


# ================= LIVE MAP =================

elif st.session_state.page == translations[lang]["map"]:


    import folium
    from streamlit_folium import st_folium


    st.title("🗺️ Live Safety Map")


    st.write(
        "AI based safety monitoring with safe and danger zones."
    )


    # Current Location (Example: Bangalore)

    current_location = [
        12.9716,
        77.5946
    ]



    # Create Map

    m = folium.Map(

        location=current_location,

        zoom_start=13,

        control_scale=True

    )



    # ================= CURRENT LOCATION =================


    folium.Marker(

        location=current_location,

        popup="📍 Your Current Location",

        tooltip="Current Location",

        icon=folium.Icon(

            color="blue",

            icon="user"

        )

    ).add_to(m)




    # ================= SAFE ZONES =================


    safe_zones = [

        ("Police Station",12.9754,77.5990),

        ("Government Hospital",12.9690,77.6012),

        ("Metro Station",12.9785,77.5932),

        ("Fire Station",12.9735,77.5850)

    ]



    for name,lat,lon in safe_zones:


        folium.Marker(

            location=[lat,lon],

            popup="🟢 "+name,

            tooltip=name,

            icon=folium.Icon(

                color="green",

                icon="plus"

            )

        ).add_to(m)




    # ================= DANGER ZONES =================


    danger_zones = [

        ("High Crime Area",12.9650,77.6100),

        ("Accident Zone",12.9795,77.6070),

        ("Poor Lighting Area",12.9668,77.5905)

    ]



    for name,lat,lon in danger_zones:


        folium.CircleMarker(

            location=[lat,lon],

            radius=12,

            color="red",

            fill=True,

            fill_color="red",

            fill_opacity=0.7,

            popup="🔴 "+name,

            tooltip=name

        ).add_to(m)




    # ================= LEGEND =================


    st.markdown(
    """
    ### Map Legend

    🔵 Blue → Current Location

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
elif st.session_state.page == translations[lang]["route"]:
    import requests
    import folium
    from geopy.geocoders import Nominatim
    from streamlit_folium import st_folium

    st.title("📍 AI Safe Route Finder")
    st.write("Find a real road route using OSRM.")

    geolocator = Nominatim(user_agent="SafeRouteAI")

    source = st.text_input("📍 Current Location", placeholder="Example: Bangalore")
    destination = st.text_input("🎯 Destination", placeholder="Example: Mysore")
    mode = st.selectbox("🚗 Travel Mode", ["Driving", "Walking", "Cycling"])

    if st.button("🔍 Find Route"):
        if source and destination:
            try:
                with st.spinner("Finding route..."):
                    start = geolocator.geocode(source)
                    end = geolocator.geocode(destination)

                if not start or not end:
                    st.error("❌ Location not found. Please check spelling.")
                else:
                    profiles = {"Driving": "driving", "Walking": "foot", "Cycling": "bike"}
                    profile = profiles[mode]

                    url = f"https://router.project-osrm.org/route/v1/{profile}/{start.longitude},{start.latitude};{end.longitude},{end.latitude}?overview=full&geometries=geojson"
                    response = requests.get(url)

                    if response.status_code != 200:
                        st.error(f"❌ OSRM API error: {response.status_code}")
                    else:
                        data = response.json()
                        if "routes" not in data or len(data["routes"]) == 0:
                            st.error("❌ No route found.")
                        else:
                            route = data["routes"][0]
                            distance = route["distance"]/1000
                            time_taken = route["duration"]/60

                            st.success("✅ Route Found")
                            c1, c2, c3 = st.columns(3)
                            c1.metric("Distance", f"{distance:.2f} km")
                            c2.metric("Time", f"{time_taken:.1f} min")
                            c3.metric("Safety Score", "94% 🟢")

                            # Map
                            m = folium.Map(location=[start.latitude, start.longitude], zoom_start=12)
                            folium.Marker([start.latitude, start.longitude], popup="📍 Start", icon=folium.Icon(color="blue")).add_to(m)
                            folium.Marker([end.latitude, end.longitude], popup="🎯 Destination", icon=folium.Icon(color="red")).add_to(m)

                            points = [[p[1], p[0]] for p in route["geometry"]["coordinates"]]
                            folium.PolyLine(points, color="green", weight=6, tooltip="SafeRouteAI Path").add_to(m)

                            st_folium(m, width=900, height=600)
            except Exception as e:
                st.error(f"⚠️ Error: {e}")
        else:
            st.warning("Please enter both source and destination.")

            # ================= DASHBOARD =================

elif st.session_state.page == translations[lang]["dashboard"]:

    import pandas as pd
    import plotly.express as px


    st.title("📊 Crime Analysis Dashboard")


    data = pd.DataFrame({

        "Area":[
            "MG Road",
            "Whitefield",
            "Indiranagar",
            "Hebbal",
            "Yelahanka"
        ],

        "Crime Cases":[
            15,
            32,
            20,
            10,
            8
        ],

        "Safety Score":[
            85,
            65,
            75,
            92,
            95
        ]

    })


    c1,c2,c3,c4 = st.columns(4)


    c1.metric(
        "Total Crime",
        data["Crime Cases"].sum()
    )


    c2.metric(
        "Safe Areas",
        "3"
    )


    c3.metric(
        "Danger Areas",
        "2"
    )


    c4.metric(
        "Average Safety",
        "82%"
    )


    st.divider()


    st.subheader(
        "📈 Crime Cases"
    )


    chart = px.bar(

        data,

        x="Area",

        y="Crime Cases"

    )


    st.plotly_chart(
        chart,
        use_container_width=True
    )


    st.subheader(
        "🥧 Crime Percentage"
    )


    pie = px.pie(

        data,

        names="Area",

        values="Crime Cases"

    )


    st.plotly_chart(
        pie,
        use_container_width=True
    )




# ================= EMERGENCY =================


elif st.session_state.page == translations[lang]["emergency"]:


    import time


    st.title("🚨 Emergency Assistance")


    c1,c2,c3 = st.columns(3)


    c1.error(
        "🚔 Police\n\n100"
    )


    c2.error(
        "🚑 Ambulance\n\n108"
    )


    c3.error(
        "🔥 Fire\n\n101"
    )


    st.divider()


    if st.button(
        "🚨 SEND SOS ALERT",
        use_container_width=True
    ):

        with st.spinner(
            "Sending Alert..."
        ):

            time.sleep(2)


        st.success(
            "✅ SOS Alert Sent Successfully"
        )

        st.balloons()



    st.subheader(
        "📍 Nearby Emergency Services"
    )


    services=[

        "🏥 Government Hospital",

        "🚔 Police Station",

        "🔥 Fire Station"

    ]


    for s in services:

        st.info(s)




# ================= SETTINGS =================


elif st.session_state.page == translations[lang]["settings"]:


    st.title("⚙️ Language Settings")


    new_language = st.selectbox(

        "Choose Language",

        [
            "English",
            "Hindi",
            "Kannada"
        ],

        index=[
            "English",
            "Hindi",
            "Kannada"
        ].index(
            st.session_state.language
        )

    )


    if new_language != st.session_state.language:

        st.session_state.language = new_language

        st.success(
            "Language Changed"
        )

        st.rerun()




# ================= FEEDBACK =================


elif st.session_state.page == translations[lang]["feedback"]:


    st.title("💬 User Feedback")


    name = st.text_input(
        "Your Name"
    )


    rating = st.slider(
        "Rate SafeRouteAI",
        1,
        5,
        5
    )


    message = st.text_area(
        "Your Feedback"
    )


    if st.button(
        "Submit"
    ):


        if name and message:

            st.success(
                "Thank you for your feedback!"
            )

            st.write(
                "Rating:",
                rating,
                "/5"
            )

        else:

            st.warning(
                "Please fill all fields"
            )



# ================= FOOTER =================

st.divider()

st.caption(
    "© 2026 SafeRouteAI | AI Powered Safe Navigation"
)