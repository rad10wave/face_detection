var constraints = {
  video: true
};

var video = document.querySelector('video');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
faceapi.nets.faceExpressionNet.loadFromUri("/models"),
faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(startVideo)

function startVideo(){
function handleSuccess(stream) {
  window.stream = stream; // only to make stream available to console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).
  then(handleSuccess).catch(handleError);
}
video.addEventListener('play',()=>{
  console.log('hello')
  setInterval(async () => {
      const displaySize = { width: video.width, height: video.height };
      const detections = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();
    console.log(detections)
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    if (resizedDetections && Object.keys(resizedDetections).length > 0) {
      const age = parseInt(resizedDetections.age,10);
      const gender = resizedDetections.gender;
      const expressions = resizedDetections.expressions;
      const maxValue = Math.max(...Object.values(expressions));
      const emotion = Object.keys(expressions).filter(
        item => expressions[item] === maxValue
      );

      document.getElementById("age").innerText = 'Age -'+age;
      document.getElementById("gender").innerText = `Gender - ${gender}`;
      document.getElementById("emotion").innerText = `Emotion - ${emotion[0]}`;
      document.getElementById("load").innerText= '';
    }
  },1000)
  
 
})