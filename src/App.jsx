import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
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
class App extends Component {
  state = {
    input: "",
    imageUrl: "",
    box: {},
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
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
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
      .then((response) =>
        this.displayFaceBoxHandler(this.calculateFaceLocationHandler(response))
      )
      .catch((err) => console.log(err));
  };

  calculateFaceLocationHandler = (data) => {
    const clarifaiFaceData =
      data.outputs[0].data.regions[0].region_info.bounding_box;

    const image = document.getElementById("inputImage");

    const imgWidth = Number(image.width);
    const imgHeight = Number(image.height);
    console.log(imgWidth, imgHeight);

    return {
      leftCol: clarifaiFaceData.left_col * imgWidth,
      topRow: clarifaiFaceData.top_row * imgHeight,
      rightCol: imgWidth - clarifaiFaceData.right_col * imgWidth,
      bottomRow: imgHeight - clarifaiFaceData.bottom_row * imgHeight,
    };
  };

  displayFaceBoxHandler = (box) => {
    console.log(box);
    this.setState({ box: box });
  };
}

export default App;
