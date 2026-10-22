// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using a pretrained customized model and p5.js
This example uses p5 preload function to create the classifier
=== */

// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://eggtytw.github.io/ai_11524106/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";

// Load the model first
function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
    createCanvas(320, 320);

  // Create the video (使用後鏡頭設定)
  var constraints = {
        audio: false,
        video: {
                facingMode: {
                          exact: "environment"
                }
        }
  };

  video = createCapture(constraints);
    video.size(320, 320);
    video.hide();

  flippedVideo = ml5.flipImage(video);
    // Start classifying
  classifyVideo();
}

function draw() {
    background(0);
    // Draw the video
  image(flippedVideo, 0, 0);

  // Draw the label
  fill(255);
    textSize(16);
    textAlign(CENTER);
    text(label, width / 2, height  4);
}

// Get a prediction for the current video frame
function classifyVideo() {
    flippedVideo = ml5.flipImage(video);
    classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
    // If there is an error
  if (error) {
        console.error(error);
        return;
  }
    // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
    // Classifiy again!
  classifyVideo();
}
