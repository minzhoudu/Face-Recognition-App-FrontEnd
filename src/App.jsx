import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import "./App.css";

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

const app = new Clarifai.App({
  apiKey: "bc28748779ad4a3c8aa525dce4efb43e",
});

class App extends Component {
  state = {
    input: "",
  };
  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onSubmit={this.onBtnSubmit}
          onInputChange={this.onChangeHandler}
        />
        <FaceRecognition />
      </div>
    );
  }
  //handlers
  onChangeHandler = (event) => {
    console.log(event.target.value);
  };

  onBtnSubmit = () => {
    app.models
      .predict(
        Clarifai.COLOR_MODEL,
        "https://samples.clarifai.com/face-det.jpg"
      )
      .then(
        function (response) {
          console.log(response);
        },
        function (err) {
          //code
        }
      );
  };
}

export default App;
