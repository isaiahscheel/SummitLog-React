export default {
  palette: {
    primary: {
      light: "#39796b",
      main: "#004d40",
      dark: "#00251a",
      contrastText: "#ffffff"
    },
    secondary: {
      light: "#ffff72",
      main: "#ffeb3b",
      dark: "#c8b900",
      contrastText: "#000000"
    }
  },
  formStyle: {
    form: {
      textAlign: "center"
    },
    logo: {
      width: "auto",
      height: "10%",
      margin: "5px auto 5px auto"
    },
    pageTitle: {
      margin: "5px auto 5px auto"
    },
    textField: {
      margin: "10px auto 10px auto"
    },
    button: {
      margintop: 25,
      marginBottom: 10,
      position: "relative"
    },
    customError: {
      color: "red",
      fontSize: "0.8rem",
      marginTop: "10px",
      marginBottom: "10px"
    },
    progress: {
      position: "absolute"
    },
    invisibleSeparator: {
      border: "none",
      margin: 4
    },
    visibleSeparator: {
      width: "100%",
      borderBottom: "1px solid rgba(0,0,0,0.1)",
      marginBottom: 20
    },
    paper: {
      padding: 20
    },
    profile: {
      "& .image-wrapper": {
        textAlign: "center",
        position: "relative",
        "& button": {
          position: "absolute",
          top: "80%",
          left: "70%"
        }
      },
      "& .profile-image": {
        width: 200,
        height: 200,
        objectFit: "cover",
        maxWidth: "100%",
        borderRadius: "50%"
      },
      "& .profile-details": {
        textAlign: "center",
        "& span, svg": {
          verticalAlign: "middle"
        },
        "& a": {
          color: "#00bcd4"
        }
      },
      "& hr": {
        border: "none",
        margin: "0 0 10px 0"
      },
      "& svg.button": {
        "&:hover": {
          cursor: "pointer"
        }
      }
    },
    buttons: {
      textAlign: "center",
      "& a": {
        margin: "20px 10px"
      }
    }
  }
};
