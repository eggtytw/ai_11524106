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

    // Try the back camera first, but fall back to the front camera
    // if the device/browser does not support it.
    setupCamera();
}

function setupCamera() {
    const cameraOptions = [
        { audio: false, video: { facingMode: { ideal: "environment" } } },
        { audio: false, video: { facingMode: { ideal: "user" } } },
        { audio: false, video: { facingMode: "user" } }
    ];

    const tryCamera = (index) => {
        if (index >= cameraOptions.length) {
            console.error("No camera available on this device/browser.");
            label = "No camera";
            return;
        }

        const constraints = cameraOptions[index];

        // p5.js createCapture supports a success callback as the second arg,
        // and an error callback as the third arg.
        const mediaStream = navigator.mediaDevices.getUserMedia(constraints);

        mediaStream.then(() => {
            video = createCapture(constraints);
            video.size(320, 320);
            video.hide();

            flippedVideo = ml5.flipImage(video);
            classifyVideo();
        }).catch(() => {
            console.warn("Camera failed, trying next option:", constraints);
            tryCamera(index + 1);
        });
    };

    tryCamera(0);
}

function draw() {
    background(0);

    if (flippedVideo) {
        image(flippedVideo, 0, 0);
    }

    fill(255);
    textSize(16);
    textAlign(CENTER);
    text(label, width / 2, height - 18);
}

// Get a prediction for the current video frame
function classifyVideo() {
    if (!video) return;

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
    label = results[0].label;

    // Classify again!
    classifyVideo();
}
