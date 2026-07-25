import streamlit as st

st.set_page_config(
    page_title="SafeRouteAI",
    page_icon="🛡️",
    layout="wide"
)

st.markdown("""
<style>

/* ===== MAIN BACKGROUND ===== */

.stApp{
    background: #F5F5F7;
}


/* ===== NEUMORPHIC CARD ===== */

.neu-card{
    background:#EEF4FF;
    border-radius:28px;
    padding:35px;
    box-shadow:
        10px 10px 20px #CAD5E5,
        -10px -10px 20px #FFFFFF;
}


/* ===== LOGIN CARD ===== */

.login-card{
    background:#EEF4FF;
    border-radius:35px;
    padding:50px;
    text-align:center;
    margin:auto;
    box-shadow:
        15px 15px 30px #CAD5E5,
        -15px -15px 30px #FFFFFF;
}


/* ===== LOGIN LOGO ===== */

.login-logo{
    width:110px;
    height:110px;
    border-radius:50%;
    margin:0 auto 25px auto;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:55px;
    background:#EEF4FF;
    box-shadow:
        inset 8px 8px 15px #CAD5E5,
        inset -8px -8px 15px #FFFFFF;
}


/* ===== TEXT ===== */

h1{
    color:#1E3A8A;
    font-weight:900;
}

h2{
    color:#2563EB;
}

h3{
    color:#2563EB;
}

p{
    color:#6B7280;
}


/* ===== BUTTON ===== */

.stButton > button{
    width:100%;
    height:55px;
    border:none;
    border-radius:20px;
    background:#2563EB !important;
    color:#FFFFFF !important;
    font-size:18px;
    font-weight:700;
    transition:0.3s;

    box-shadow:
        7px 7px 15px #CAD5E5,
        -7px -7px 15px #FFFFFF;
}

.stButton > button:hover{
    background:#1D4ED8 !important;
    color:#FFFFFF !important;

    box-shadow:
        inset 5px 5px 12px #1B4AB3,
        inset -5px -5px 12px #4A7EF7;
}


/* ===== INPUT BOX ===== */

.stTextInput input{
    background:#EEF4FF !important;
    border:none !important;
    border-radius:18px !important;
    color:#1E293B !important;

    box-shadow:
        inset 5px 5px 10px #CAD5E5,
        inset -5px -5px 10px #FFFFFF;
}


/* ===== SIDEBAR ===== */

section[data-testid="stSidebar"]{
    background:#E5EEFF;
}


/* ===== METRICS ===== */

[data-testid="metric-container"]{
    background:#EEF4FF;
    border-radius:20px;
    padding:18px;
    box-shadow:
        8px 8px 16px #CAD5E5,
        -8px -8px 16px #FFFFFF;
}

</style>
""", unsafe_allow_html=True)


# ================= LANGUAGE =================
translations = {
    "English": {
        "home": "🏠 Home",
        "map": "🗺️ Live Map",
        "route": "📍 Route Finder",
        "dashboard": "📊 Dashboard",
        "emergency": "🚨 Emergency",
        "settings": "⚙️ Settings",
        "feedback": "💬 Feedback",
        "welcome": "Welcome to SafeRouteAI",
        "tagline": "AI Powered Safe Route Navigation System"
    },
    "Hindi": {
        "home": "🏠 होम",
        "map": "🗺️ लाइव मैप",
        "route": "📍 मार्ग खोजक",
        "dashboard": "📊 डैशबोर्ड",
        "emergency": "🚨 आपातकालीन सहायता",
        "settings": "⚙️ सेटिंग्स",
        "feedback": "💬 प्रतिक्रिया",
        "welcome": "SafeRouteAI में आपका स्वागत है",
        "tagline": "AI आधारित सुरक्षित मार्ग प्रणाली"
    },
    "Kannada": {
        "home": "🏠 ಮುಖಪುಟ",
        "map": "🗺️ ಲೈವ್ ನಕ್ಷೆ",
        "route": "📍 ಮಾರ್ಗ ಹುಡುಕಾಟ",
        "dashboard": "📊 ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        "emergency": "🚨 ತುರ್ತು ಸಹಾಯ",
        "settings": "⚙️ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
        "feedback": "💬 ಪ್ರತಿಕ್ರಿಯೆ",
        "welcome": "SafeRouteAI ಗೆ ಸ್ವಾಗತ",
        "tagline": "AI ಆಧಾರಿತ ಸುರಕ್ಷಿತ ಮಾರ್ಗ ವ್ಯವಸ್ಥೆ"
    }
}

# ================= SESSION STATE =================
if "language" not in st.session_state:
    st.session_state.language = "English"

if "page" not in st.session_state:
    st.session_state.page = "Login"   # Start at login page

if "username" not in st.session_state:
    st.session_state.username = ""

if "login_status" not in st.session_state:
    st.session_state.login_status = False

lang = st.session_state.language

# ================= LOGIN PAGE =================

if st.session_state.page == "Login":

    st.markdown(
    """
    <div class="login-card">

     <div class="login-logo">
            🛡️
     </div>


     <h1 style="
        font-size:50px;
        color:#0B3C78;
        ">
        SafeRouteAI
        </h1>


    <h3 style="
        color:#1E5AA8;
        ">
        AI Powered Safe Route Navigation
        </h3>


    <p style="
        font-size:20px;
        color:#40566F;
        ">
        Navigate smarter • Travel safer
        </p>


    </div>
    """,
    unsafe_allow_html=True
    )


    username = st.text_input(
        "👤 Username",
        placeholder="Enter username"
    )


    password = st.text_input(
        "🔑 Password",
        type="password",
        placeholder="Enter password"
    )


    valid_users={
        "admin":"1234",
        "user":"abcd"
    }


    if st.button(
        "🚀 Login",
        use_container_width=True
    ):

        if username in valid_users and password == valid_users[username]:

            st.session_state.login_status=True
            st.session_state.username=username

            st.session_state.page = translations[
                st.session_state.language
            ]["home"]

            st.success("✅ Login Successful")
            st.rerun()

        else:
            st.error("❌ Invalid Username or Password")
# ================= SIDEBAR =================
if st.session_state.login_status:
    with st.sidebar:
        st.markdown(
            """
            <div class="neu-card">
            <h1 style="text-align:center;">🛡️</h1>
            <h2 style="text-align:center;">SafeRouteAI</h2>
            </div>
            """,
            unsafe_allow_html=True
        )

        language = st.selectbox("🌐 Language", ["English", "Hindi", "Kannada"],
                                index=["English", "Hindi", "Kannada"].index(st.session_state.language))

        if language != st.session_state.language:
            st.session_state.language = language
            st.rerun()

        menu = [
            translations[lang]["home"],
            translations[lang]["map"],
            translations[lang]["route"],
            translations[lang]["dashboard"],
            translations[lang]["emergency"],
            translations[lang]["settings"],
            translations[lang]["feedback"]
        ]

        selected = st.radio("Navigation", menu)
        st.session_state.page = selected

        st.divider()
        st.write("👤 User:", st.session_state.username)

        if st.button("🚪 Logout", use_container_width=True):
            st.session_state.login_status = False
            st.session_state.username = ""
            st.session_state.page = "Login"
            st.rerun()

  # ================= PROFESSIONAL NEUMORPHISM HOME PAGE =================

if st.session_state.page == translations[lang]["home"]:


    # Hero Section

    st.markdown(
    """
    <div class="neu-card">

        
        SAFEROUTE AI

    </div>
    """,
    unsafe_allow_html=True
    )


    st.write("")



    # Feature Cards

    col1,col2,col3 = st.columns(3)



    with col1:

        st.markdown(
        """
        <div class="neu-card">

        <h1 style="text-align:center">
        🗺️
        </h1>

        <h3 style="text-align:center">
        Live Safety Map
        </h3>

        <p style="text-align:center">
        Detect safe and danger zones in real time
        </p>

        </div>
        """,
        unsafe_allow_html=True
        )


        if st.button(
            "🗺️ Open Map",
            use_container_width=True
        ):

            st.session_state.page = translations[lang]["map"]
            st.rerun()



    with col2:

        st.markdown(
        """
        <div class="neu-card">

        <h1 style="text-align:center">
        📍
        </h1>

        <h3 style="text-align:center">
        AI Route Finder
        </h3>

        <p style="text-align:center">
        Find fastest and safer routes
        </p>

        </div>
        """,
        unsafe_allow_html=True
        )


        if st.button(
            "📍 Find Route",
            use_container_width=True
        ):

            st.session_state.page = translations[lang]["route"]
            st.rerun()



    with col3:

        st.markdown(
        """
        <div class="neu-card">

        <h1 style="text-align:center">
        🚨
        </h1>

        <h3 style="text-align:center">
        Emergency SOS
        </h3>

        <p style="text-align:center">
        Quick emergency assistance
        </p>

        </div>
        """,
        unsafe_allow_html=True
        )


        if st.button(
            "🚨 Emergency",
            use_container_width=True
        ):

            st.session_state.page = translations[lang]["emergency"]
            st.rerun()



    st.write("")


    # Statistics

    st.subheader("📊 Quick Statistics")


    c1,c2,c3,c4 = st.columns(4)


    c1.metric(
        "👥 Users",
        "15K+"
    )


    c2.metric(
        "🛣️ Safe Routes",
        "8250"
    )


    c3.metric(
        "⚠️ Danger Zones",
        "64"
    )


    c4.metric(
        "🚨 Alerts",
        "210"
    )



    st.write("")



    # Why Choose Card

    st.markdown(
    """
    <div class="neu-card">

    <h2>
    🌟 Why Choose SafeRouteAI?
    </h2>


    <p style="
    font-size:18px;
    ">

    🔹 AI Based Safe Route Prediction
    <br><br>

    🔹 Real Time Navigation
    <br><br>

    🔹 Crime Analysis Dashboard
    <br><br>

    🔹 Emergency Assistance
    <br><br>

    🔹 Multi Language Support

    </p>


    </div>
    """,
    unsafe_allow_html=True
    )


    st.write("")


    st.caption(
        "© 2026 SafeRouteAI | AI Secure Navigation"
    )



    # ================= LIVE MAP PAGE =================


elif st.session_state.page == translations[lang]["map"]:


    import folium
    from streamlit_folium import st_folium


    st.markdown(
        """
        <div class="neu-card">

        <h1 style="text-align:center">
        🗺️ Live Safety Map
        </h1>

        <p style="text-align:center">
        AI based Safe & Danger Zone Monitoring
        </p>

        </div>
        """,
        unsafe_allow_html=True
    )


    st.write("")



    # Current Location (Example Bangalore)

    current_location = [
        12.9716,
        77.5946
    ]



    # Create Map

    m = folium.Map(

        location=current_location,

        zoom_start=13

    )



    # Current Location Marker

    folium.Marker(

        current_location,

        popup="📍 Current Location",

        tooltip="You are here",

        icon=folium.Icon(

            color="blue",

            icon="user"

        )

    ).add_to(m)




    # Safe Zones

    safe_zones=[

        (
            "Police Station",
            12.9754,
            77.5990
        ),

        (
            "Government Hospital",
            12.9690,
            77.6012
        ),

        (
            "Metro Station",
            12.9785,
            77.5932
        ),

        (
            "Fire Station",
            12.9735,
            77.5850
        )

    ]



    for name,lat,lon in safe_zones:


        folium.Marker(

            [lat,lon],

            popup="🟢 "+name,

            tooltip=name,

            icon=folium.Icon(

                color="green",

                icon="plus"

            )

        ).add_to(m)




    # Danger Zones


    danger_zones=[

        (
            "High Crime Area",
            12.9650,
            77.6100
        ),

        (
            "Accident Zone",
            12.9795,
            77.6070
        ),

        (
            "Poor Lighting Area",
            12.9668,
            77.5905
        )

    ]



    for name,lat,lon in danger_zones:


        folium.CircleMarker(

            location=[lat,lon],

            radius=15,

            color="red",

            fill=True,

            fill_color="red",

            fill_opacity=0.6,

            popup="🔴 "+name,

            tooltip=name

        ).add_to(m)




    st.markdown(
        """
        <div class="neu-card">

        <h3>Map Legend</h3>

        🔵 Current Location

        <br><br>

        🟢 Safe Zone

        <br><br>

        🔴 Danger Zone

        </div>
        """,
        unsafe_allow_html=True
    )


    st.write("")


    st_folium(

        m,

        width=1000,

        height=600

    )
    # ================= ROUTE FINDER PAGE =================


elif st.session_state.page == translations[lang]["route"]:


    import requests
    import folium

    from geopy.geocoders import Nominatim
    from streamlit_folium import st_folium



    st.markdown(
        """
        <div class="neu-card">

        <h1 style="text-align:center">
        📍 AI Safe Route Finder
        </h1>

        <p style="text-align:center">
        Find real road routes using AI + OSRM
        </p>

        </div>
        """,
        unsafe_allow_html=True
    )



    st.write("")



    geolocator = Nominatim(
        user_agent="SafeRouteAI"
    )



    source = st.text_input(
        "📍 Current Location",
        placeholder="Example: Bangalore"
    )


    destination = st.text_input(
        "🎯 Destination",
        placeholder="Example: Mysore"
    )



    travel_mode = st.selectbox(

        "🚗 Travel Mode",

        [

            "Driving",

            "Walking",

            "Cycling"

        ]

    )



    if st.button(
        "🔍 Find Safe Route",
        use_container_width=True
    ):


        if source and destination:


            try:

                with st.spinner(
                    "Finding route..."
                ):


                    start = geolocator.geocode(
                        source
                    )


                    end = geolocator.geocode(
                        destination
                    )



                if start and end:


                    profiles={

                        "Driving":"driving",

                        "Walking":"foot",

                        "Cycling":"bike"

                    }


                    profile = profiles[travel_mode]



                    url = (

                    f"https://router.project-osrm.org/route/v1/"
                    f"{profile}/"
                    f"{start.longitude},{start.latitude};"
                    f"{end.longitude},{end.latitude}"
                    f"?overview=full&geometries=geojson"

                    )



                    response=requests.get(url)


                    data=response.json()



                    route=data["routes"][0]



                    distance = (

                        route["distance"]/1000

                    )


                    duration=(

                        route["duration"]/60

                    )



                    st.success(
                        "✅ Route Found Successfully"
                    )



                    c1,c2,c3=st.columns(3)



                    c1.metric(

                        "Distance",

                        f"{distance:.2f} km"

                    )


                    c2.metric(

                        "Time",

                        f"{duration:.1f} min"

                    )


                    c3.metric(

                        "Safety Score",

                        "94% 🟢"

                    )



                    # Create Map


                    m=folium.Map(

                        location=[

                            start.latitude,

                            start.longitude

                        ],

                        zoom_start=12

                    )



                    folium.Marker(

                        [

                        start.latitude,

                        start.longitude

                        ],

                        popup="📍 Start",

                        icon=folium.Icon(
                            color="blue"
                        )

                    ).add_to(m)



                    folium.Marker(

                        [

                        end.latitude,

                        end.longitude

                        ],

                        popup="🎯 Destination",

                        icon=folium.Icon(
                            color="red"
                        )

                    ).add_to(m)



                    points=[

                        [

                        p[1],

                        p[0]

                        ]

                        for p in route["geometry"]["coordinates"]

                    ]



                    folium.PolyLine(

                        points,

                        color="green",

                        weight=6,

                        tooltip="SafeRouteAI Route"

                    ).add_to(m)



                    st_folium(

                        m,

                        width=1000,

                        height=600

                    )



                else:

                    st.error(
                        "❌ Location not found"
                    )



            except Exception as e:

                st.error(
                    f"Route Error: {e}"
                )



        else:

            st.warning(
                "Please enter both locations"
            )
            # ================= DASHBOARD PAGE =================


elif st.session_state.page == translations[lang]["dashboard"]:


    import pandas as pd
    import plotly.express as px



    st.markdown(
        """
        <div class="neu-card">

        <h1 style="text-align:center">
        📊 Crime Analysis Dashboard
        </h1>

        <p style="text-align:center">
        AI based safety and crime monitoring
        </p>

        </div>
        """,
        unsafe_allow_html=True
    )


    st.write("")



    # Sample Crime Data


    crime_data = pd.DataFrame({

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



    # Statistics Cards


    c1,c2,c3,c4 = st.columns(4)



    c1.metric(

        "🚔 Total Crime",

        crime_data["Crime Cases"].sum()

    )


    c2.metric(

        "🟢 Safe Areas",

        "3"

    )


    c3.metric(

        "🔴 Danger Areas",

        "2"

    )


    c4.metric(

        "⭐ Average Safety",

        "82%"

    )



    st.divider()



    # Crime Chart


    st.markdown(
        """
        <div class="neu-card">

        <h3>
        📈 Crime Cases by Area
        </h3>

        </div>
        """,
        unsafe_allow_html=True
    )



    bar_chart = px.bar(

        crime_data,

        x="Area",

        y="Crime Cases",

        title="Crime Distribution"

    )



    st.plotly_chart(

        bar_chart,

        use_container_width=True

    )



    st.write("")



    # Pie Chart


    st.markdown(
        """
        <div class="neu-card">

        <h3>
        🥧 Crime Percentage
        </h3>

        </div>
        """,
        unsafe_allow_html=True
    )



    pie_chart = px.pie(

        crime_data,

        names="Area",

        values="Crime Cases",

        title="Crime Share"

    )



    st.plotly_chart(

        pie_chart,

        use_container_width=True

    )



    st.write("")



    # Safety Score


    st.markdown(
        """
        <div class="neu-card">

        <h3>
        🛡️ Safety Score Analysis
        </h3>

        </div>
        """,
        unsafe_allow_html=True
    )



    score_chart = px.bar(

        crime_data,

        x="Area",

        y="Safety Score",

        title="Safety Percentage"

    )



    st.plotly_chart(

        score_chart,

        use_container_width=True

    )
    # ================= EMERGENCY PAGE =================


elif st.session_state.page == translations[lang]["emergency"]:


    st.markdown(
        """
        <div class="neu-card">

        <h1 style="text-align:center">
        🚨 Emergency Assistance
        </h1>

        <p style="text-align:center">
        Quick help during emergency situations
        </p>

        </div>
        """,
        unsafe_allow_html=True
    )


    st.write("")


    c1,c2,c3 = st.columns(3)



    c1.error(
        "🚔 Police\n\n100"
    )


    c2.error(
        "🚑 Ambulance\n\n108"
    )


    c3.error(
        "🔥 Fire Service\n\n101"
    )


    st.divider()



    if st.button(
        "🚨 SEND SOS ALERT",
        use_container_width=True
    ):

        with st.spinner(
            "Sending Emergency Alert..."
        ):

            time.sleep(2)


        st.success(
            "✅ SOS Alert Sent Successfully"
        )

        st.balloons()



    st.markdown(
        """
        <div class="neu-card">

        <h3>
        📍 Nearby Emergency Services
        </h3>

        🏥 Government Hospital

        <br><br>

        🚔 Police Station

        <br><br>

        🔥 Fire Station

        </div>
        """,
        unsafe_allow_html=True
    )





# ================= SETTINGS PAGE =================


elif st.session_state.page == translations[lang]["settings"]:


    st.markdown(
        """
        <div class="neu-card">

        <h1 style="text-align:center">
        ⚙️ Settings
        </h1>

        </div>
        """,
        unsafe_allow_html=True
    )


    st.write("")


    st.subheader(
        "🌐 Language Settings"
    )


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
            "Language Changed Successfully"
        )

        st.rerun()





# ================= FEEDBACK PAGE =================


elif st.session_state.page == translations[lang]["feedback"]:


    st.markdown(
        """
        <div class="neu-card">

        <h1 style="text-align:center">
        💬 User Feedback
        </h1>

        </div>
        """,
        unsafe_allow_html=True
    )


    st.write("")


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

        "Submit Feedback",

        use_container_width=True

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
                "Please fill all details"
            )





# ================= FOOTER =================


st.divider()


st.caption( "© 2026 SafeRouteAI | AI Powered Safe Navigation")