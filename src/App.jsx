import React, { Component } from "react";
//components
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
//3rd party
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import "./App.css";

//particles options
const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

//Clarify api
const app = new Clarifai.App({
  apiKey: "bc28748779ad4a3c8aa525dce4efb43e",
});

//APP
const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  state = initialState;

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={this.state.isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {this.state.route === "home" ? (
          <div>
            <Logo />
            <Rank
              username={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onSubmit={this.onBtnSubmit}
              onInputChange={this.onChangeHandler}
            />
            <FaceRecognition
              box={this.state.box}
              imageUrl={this.state.imageUrl}
            />
          </div>
        ) : this.state.route === "signin" ? (
          <div>
            <Logo />
            <SignIn
              loadUser={this.loadUser}
              onRouteChange={this.onRouteChange}
            />
          </div>
        ) : this.state.route === "register" ? (
          <div>
            <Logo />
            <Register
              loadUser={this.loadUser}
              onRouteChange={this.onRouteChange}
            />
          </div>
        ) : (
          <div>
            <Logo />
            <SignIn
              loadUser={this.loadUser}
              onRouteChange={this.onRouteChange}
            />
          </div>
        )}
      </div>
    );
  }
  //handlers
  onChangeHandler = (event) => {
    this.setState({ input: event.target.value });
  };

  onBtnSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) => {
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((res) => res.json())
            .then((count) => {
              this.setState({ user: { ...this.state.user, entries: count } });
            })
            .catch(console.log);
        }
        this.displayFaceBoxHandler(this.calculateFaceLocationHandler(response));
      })
      .catch((err) => console.log(err));
  };

  calculateFaceLocationHandler = (data) => {
    const clarifaiFaceData =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const imgWidth = Number(image.width);
    const imgHeight = Number(image.height);

    return {
      leftCol: clarifaiFaceData.left_col * imgWidth,
      topRow: clarifaiFaceData.top_row * imgHeight,
      rightCol: imgWidth - clarifaiFaceData.right_col * imgWidth,
      bottomRow: imgHeight - clarifaiFaceData.bottom_row * imgHeight,
    };
  };

  displayFaceBoxHandler = (box) => {
    this.setState({ box: box });
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  loadUser = (user) => {
    this.setState({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined,
      },
    });
  };
}

export default App;
