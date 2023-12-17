const obs = new OBSWebSocket();
const obsHost = "localhost";
const obsPort = 4455;
const obsPassword = "123456";

const obs2 = new OBSWebSocket();
const obs2Host = "localhost";
const obs2Port = 4456; // Port for the second OBS
const obs2Password = "123456"; // Password for the second OBS


document.addEventListener("DOMContentLoaded", function() {
  var buttonBlurON = document.getElementById('BLUR-ON');
  var buttonMuteOn = document.getElementById('MUTE-ON');
  var buttonEnableAll = document.getElementById('ENABLE-ALL');

  function multibutton1() {
    buttonBlurON.click();
    buttonMuteOn.click();
  }

  buttonEnableAll.addEventListener('click', multibutton1);
});


document.addEventListener("DOMContentLoaded", function() {
  var buttonBlurOff = document.getElementById('BLUR-OFF');
  var buttonMuteOff = document.getElementById('MUTE-OFF');
  var buttonDisableAll = document.getElementById('DISABLE-ALL');

  function multibutton2() {
    buttonBlurOff.click();   
    buttonMuteOff.click();   
  }

  buttonDisableAll.addEventListener('click', multibutton2);
});


//BUTTONS LOAD

document.addEventListener('DOMContentLoaded', function() {
  // Add event listeners for the buttons
  document.getElementById('get-scenes-button').addEventListener('click', getCurrentScene);
  //document.getElementById('go-to-selected-scene-button').addEventListener('click', goToSelectedScene);
  document.getElementById('start-streaming-button').addEventListener('click', startStreaming);
  document.getElementById('stop-streaming-button').addEventListener('click', stopStreaming);
});


document.addEventListener('DOMContentLoaded', function() {
  const getScenesButton = document.getElementById('get-scenes-button');
  const goToSelectedSceneButton = document.getElementById('go-to-selected-scene-button');

  if (getScenesButton) {
    getScenesButton.disabled = false; // Enable button
    getScenesButton.addEventListener('click', getSceneList); 
  }

  if (goToSelectedSceneButton) {
    goToSelectedSceneButton.disabled = false; // Enable button
    goToSelectedSceneButton.addEventListener('click', goToSelectedScene); 
  }
});


document.addEventListener('DOMContentLoaded', function() {
  var startRecordingButton = document.getElementById('start-recording-button');
  var stopRecordingButton = document.getElementById('stop-recording-button');
  var startStreamingButton = document.getElementById('start-streaming-button');
  var stopStreamingButton = document.getElementById('stop-streaming-button');
  var getCurrentSceneButton = document.getElementById('get-scenes-button');
  var goToSelectedSceneButton = document.getElementById('go-to-selected-scene-button');
  var getScenesButton = document.getElementById('get-scenes-button');


  var startRecordingButton = document.getElementById('start-recording-button');
  if (startRecordingButton) {
    startRecordingButton.removeAttribute('disabled'); // Delete atrubute disabled
  }
   startRecordingButton.addEventListener('click', startRecording);

   if (stopRecordingButton) {
    stopRecordingButton.removeAttribute('disabled'); // Delete atrubute disabled
  }
  stopRecordingButton.addEventListener('click', stopRecording);

  if (stopRecordingButton) {
    stopRecordingButton.disabled = false;
  }

  if (startStreamingButton) {
    startStreamingButton.disabled = false;
  }

  if (stopStreamingButton) {
    stopStreamingButton.disabled = false;
  }

  if (getCurrentSceneButton) {
    getCurrentSceneButton.disabled = false;
  }

  if (goToSelectedSceneButton) {
    goToSelectedSceneButton.disabled = false;
  }

  if (getScenesButton) {
    getScenesButton.disabled = false;
  }

});




obs.on('ConnectionOpened', () => {
    console.log('Connection established');
    displayErrorMessage('');
    displayConnectionStatus(true);
});

obs.on('ConnectionClosed', () => {
    console.log('Connection closed');
    obsConnected = false;
    displayConnectionStatus(false); 
    // Deactivate buttons and set button text to "Connect to the first OBS" upon connection loss
});

obs2.on('ConnectionOpened', () => {
    console.log('Connection to the second OBS established');
    displayErrorMessage('');
    displayConnectionStatus2(true);
});

obs2.on('ConnectionClosed', () => {
    console.log('Connection to the second OBS closed');
    obs2Connected = false;
    displayConnectionStatus2(false);
    // Update button text to "Connect to the second OBS" upon connection loss
});


let obsConnected = false; // Variable to track the connection state to the first OBS

document.addEventListener('DOMContentLoaded', function() {
  const obsIpInput = document.getElementById('obs-ip');
  const obsPortInput = document.getElementById('obs-port');
  const connectButton = document.getElementById('connect-obs-1');
  const disconnectButton = document.getElementById('disconnect-obs-1');

  // Set star "Connect"
  connectButton.style.display = 'block';

  // SET first style for button "Disconnect"
  disconnectButton.style.display = 'none';

  // Function connect to OBS_1
  async function connectToOBS() {
    const ip = obsIpInput.value;
    const port = obsPortInput.value;

    try {
      await obs.connect(`ws://${ip}:${port}`, obsPassword);
      obsConnected = true; 
    } catch (error) {
      displayErrorMessage('Error connecting to OBS: ' + error.message);
      return; 
    }

    
    getOBSVersion(obs, 'obs-version-result');
  }

  // Function disconnect from OBS_1
  async function disconnectFromOBS() {
    try {
      await obs.disconnect();
      obsConnected = false; 
    } catch (error) {
      displayErrorMessage('Error disconnecting from OBS: ' + error.message);
    }
  }

  connectButton.addEventListener('click', connectToOBS);
  disconnectButton.addEventListener('click', disconnectFromOBS);
});


let obs2Connected = false; // VAR for monitor connect status OBS_2 

document.addEventListener('DOMContentLoaded', function() {
  const obs2IpInput = document.getElementById('obs2-ip');
  const obs2PortInput = document.getElementById('obs2-port');
  const connectButton2 = document.getElementById('connect-obs-2');
  const disconnectButton2 = document.getElementById('disconnect-obs-2');

  // SET first style for button "Connect"
  connectButton2.style.display = 'block';

  // SET first style for button "Disconnect"
  disconnectButton2.style.display = 'none';

  // Function connect to OBS_2
  async function connectToSecondOBS() {
    const ip = obs2IpInput.value;
    const port = obs2PortInput.value;

    try {
      await obs2.connect(`ws://${ip}:${port}`, obs2Password);
      obs2Connected = true; 
    } catch (error) {
      displayErrorMessage('Error connecting to the second OBS: ' + error.message);
      return; 
    }

    getOBSVersion(obs2, 'obs2-version-result');
  }

  // Function disconnect from OBS_2
  async function disconnectFromSecondOBS() {
    try {
      await obs2.disconnect();
      obs2Connected = false; 
    } catch (error) {
      displayErrorMessage('Error disconnecting from the second OBS: ' + error.message);
    }
  }

  connectButton2.addEventListener('click', connectToSecondOBS);
  disconnectButton2.addEventListener('click', disconnectFromSecondOBS);
});


async function displayErrorMessage(message) {
    document.getElementById('error-message').textContent = message;
}

function displayConnectionStatus(connected) {
    const element = document.getElementById('obs_1_bar');
    const connectButton = document.getElementById('connect-obs-1');
    const disconnectButton = document.getElementById('disconnect-obs-1');
  
    if (connected) {
        element.style.backgroundColor = 'rgb(35, 148, 13)'; // Set green light CONNECT
        connectButton.style.display = 'none'; // Hide button "Connect"
        disconnectButton.style.display = 'block'; // Show button "Disonnect"
    } else {
        element.style.backgroundColor = 'rgb(223, 5, 39)'; // Set red light DISCONNECT
        connectButton.style.display = 'block'; // Show button "Connect"
        disconnectButton.style.display = 'none'; // Hide button "Disconnect"
    }
}


function displayConnectionStatus2(connected) {
    const element2 = document.getElementById('obs_2_bar'); 
    const connectButton2 = document.getElementById('connect-obs-2'); 
    const disconnectButton2 = document.getElementById('disconnect-obs-2'); 

    if (connected) {
        element2.style.backgroundColor = 'rgb(35, 148, 13)'; // Set green light CONNECT
        connectButton2.style.display = 'none'; // Hide button "Connect"
        disconnectButton2.style.display = 'block'; // Show button "Disonnect"
    } else {
        element2.style.backgroundColor = 'rgb(223, 5, 39)'; // Set red light DISCONNECT
        connectButton2.style.display = 'block'; // Show button "Connect"
        disconnectButton2.style.display = 'none'; // Hide button "Disconnect"
    }
}


async function getRecordingStatus() {
    try {
        const response = await obs.call('GetRecordStatus', {});
        const recordingStatus = response['outputActive'];
        displayRecordingStatus(recordingStatus);
    } catch (error) {
        displayErrorMessage('Error getting recording status: ' + error.message);
    }
}

function displayRecordingStatus(recording) {
    const recOn = document.getElementById('rec-on_1');
    const recOff = document.getElementById('rec-off_1');

    if (recording) {
        recOn.style.display = 'block';
        recOff.style.display = 'none';
    } else {
        recOn.style.display = 'none';
        recOff.style.display = 'block';
    }
}


// Function to get recording status for the second OBS
async function getRecordingStatus2() {
    try {
        const response = await obs2.call('GetRecordStatus', {});
        const recordingStatus = response['outputActive'];
        displayRecordingStatus2(recordingStatus); // Call the function to display recording status
    } catch (error) {
        displayErrorMessage('Error getting recording status: ' + error.message);
    }
}

// Function to display recording status for the second OBS
function displayRecordingStatus2(recording) {
    const recOn2 = document.getElementById('rec-on_2');
    const recOff2 = document.getElementById('rec-off_2');

    if (recording) {
        recOn2.style.display = 'block';
        recOff2.style.display = 'none';
    } else {
        recOn2.style.display = 'none';
        recOff2.style.display = 'block';
    }
}


async function getStreamStatus() {
  try {
    const response = await obs.call('GetStreamStatus', {});
    const streamStatus = response['outputActive'];
    displayStreamStatus(streamStatus);
  } catch (error) {
    displayErrorMessage('Error getting streaming status: ' + error.message);
  }
}

function displayStreamStatus(streaming) {
  const streamImage = document.getElementById('on_air_1'); 
  const offStreamImage = document.getElementById('off_air_1'); 

  if (streaming) {
    streamImage.style.display = 'block'; 
    offStreamImage.style.display = 'none'; 
  } else {
    streamImage.style.display = 'none'; 
    offStreamImage.style.display = 'block'; 
  }
}


async function getStreamStatus2() {
    try {
        const response = await obs2.call('GetStreamStatus', {});
        const streamStatus = response['outputActive'];
        displayStreamStatus2(streamStatus);
    } catch (error) {
        displayErrorMessage('Error getting streaming status: ' + error.message);
    }
}

function displayStreamStatus2(streaming) {
    const onAir2 = document.getElementById('on_air_2');
    const offAir2 = document.getElementById('off_air_2');
    const streamIndicator2 = document.getElementById('stream-indicator2');

    if (streaming) {
        onAir2.style.display = 'block';
        offAir2.style.display = 'none';
        streamIndicator2.classList.add('on');
    } else {
        onAir2.style.display = 'none';
        offAir2.style.display = 'block';
        streamIndicator2.classList.remove('on');
    }
}


document.addEventListener('DOMContentLoaded', function() {
  // Get input field elements for the first OBS
  var obsIpInput = document.getElementById('obs-ip');
  var obsPortInput = document.getElementById('obs-port');

  // Check if there are saved values in local storage
  var savedIp = localStorage.getItem('obs-ip');
  var savedPort = localStorage.getItem('obs-port');

  // Fill input fields with values from local storage or default values
  obsIpInput.value = savedIp || 'localhost';
  obsPortInput.value = savedPort || '4455';

  // Listen for input field value changes
  obsIpInput.addEventListener('input', function() {
    // Update the value in local storage upon change
    localStorage.setItem('obs-ip', obsIpInput.value);
  });

  obsPortInput.addEventListener('input', function() {
    // Update the value in local storage upon change
    localStorage.setItem('obs-port', obsPortInput.value);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Get input field elements for the second OBS
  var obs2IpInput = document.getElementById('obs2-ip');
  var obs2PortInput = document.getElementById('obs2-port');

  // Check if there are saved values in local storage for the second OBS
  var savedIp2 = localStorage.getItem('obs2-ip');
  var savedPort2 = localStorage.getItem('obs2-port');

  // Fill input fields with values from local storage or default values for the second OBS
  obs2IpInput.value = savedIp2 || 'localhost';
  obs2PortInput.value = savedPort2 || '4456';

  // Listen for input field value changes for the second OBS
  obs2IpInput.addEventListener('input', function() {
    // Update the value in local storage upon change
    localStorage.setItem('obs2-ip', obs2IpInput.value);
  });

  obs2PortInput.addEventListener('input', function() {
    // Update the value in local storage upon change
    localStorage.setItem('obs2-port', obs2PortInput.value);
  });
});



////////////////////////////////////
//TIME

//MODIFY INPUT EVENT CONST (MINUS PRIMARY DELAY)
const eventList = neweventList.map(event => {
  const eventTime = event.time.split(':');
  const hours = parseInt(eventTime[0]);
  const minutes = parseInt(eventTime[1]);
  const seconds = parseInt(eventTime[2]);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds - primaryDelayInSeconds;
  const newHours = Math.floor(totalSeconds / 3600);
  const newMinutes = Math.floor((totalSeconds % 3600) / 60);
  const newSeconds = totalSeconds % 60;

  const newTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;

  return { time: newTime, name: event.name };
});


// Function to display time
document.addEventListener('DOMContentLoaded', function() {
  // Function to display time
  function updateTime() {
    const currentTimeElement = document.getElementById('current-time');
    const delayedTimeElement = document.getElementById('delayed-time');
    const delayedTextElement = document.getElementById('delayed-text');

    const currentTime = new Date();
    const delayedTime = new Date(currentTime.getTime() + primaryDelayInSeconds * 1000 + additionalDelayInSeconds * 1000);

    // Format time as "HH:mm:ss" (24-hour format)
    const formatTime = (time) => {
      return time.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    };

    currentTimeElement.textContent = formatTime(new Date(currentTime.getTime() + additionalDelayInSeconds * 1000));
    delayedTimeElement.textContent = formatTime(delayedTime);
    delayedTextElement.textContent = 'AIR ' + primaryDelayInSeconds + ' SEC ';
  }

  // Call updateTime function after DOMContentLoaded
  updateTime();
  setInterval(updateTime, 500);
});


// Function to display timer
document.addEventListener('DOMContentLoaded', function () {


  // Функция для форматирования чисел с ведущими нулями
  function formatNumberWithLeadingZero(number) {
    return number.toString().padStart(2, '0');
  }

  // Функция для нахождения ближайшей временной точки
  function findNearestEvent() {
    const currentTime = new Date();
    let nearestEvent = null;

    for (const event of eventList) {
      const [hoursStr, minutesStr, secondsStr] = event.time.split(':');
      const eventTime = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate(),
        parseInt(hoursStr, 10),
        parseInt(minutesStr, 10),
        parseInt(secondsStr, 10)
      );

      // Добавить постоянную корректировку времени
      eventTime.setSeconds(eventTime.getSeconds() + constantDelayInSeconds);

      if (eventTime > currentTime && (!nearestEvent || eventTime < nearestEvent.time)) {
        nearestEvent = { name: event.name, time: eventTime };
      }
    }

    return nearestEvent;
  }

  // Функция для обновления таймера
  function updateTimer() {
    const countdownTimerElement = document.getElementById('countdown-timer');
    const countdownNameElement = document.getElementById('countdown-name');
    const countdownTimeElement = document.getElementById('countdown-time');
    const nearestEvent = findNearestEvent();

    if (nearestEvent) {
      const timeDiff = nearestEvent.time - new Date();
      const hours = Math.floor(timeDiff / (60 * 60 * 1000));
      const minutes = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((timeDiff % (60 * 1000)) / 1000);

      // Форматировать каждую компоненту времени с ведущими нулями
      const formattedHours = formatNumberWithLeadingZero(hours);
      const formattedMinutes = formatNumberWithLeadingZero(minutes);
      const formattedSeconds = formatNumberWithLeadingZero(seconds);

      countdownTimerElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
      countdownNameElement.textContent = `${nearestEvent.name}`;
      const adjustedTime = new Date(nearestEvent.time.getTime() - constantDelayInSeconds * 1000);
      countdownTimeElement.textContent = adjustedTime.toLocaleTimeString('ru-RU', { hour12: false });


    } else {
      // Если ближайшее событие уже прошло, начнем отсчет заново от первого события на следующий день
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setSeconds(tomorrow.getSeconds() + constantDelayInSeconds); // Коррекция времени на завтра

      const nextEvent = eventList[0];
      const nextEventTime = new Date(
        tomorrow.getFullYear(),
        tomorrow.getMonth(),
        tomorrow.getDate(),
        parseInt(nextEvent.time.split(':')[0], 10),
        parseInt(nextEvent.time.split(':')[1], 10),
        parseInt(nextEvent.time.split(':')[2], 10)
      );
      const timeDiff = nextEventTime - new Date();

      const hours = Math.floor(timeDiff / (60 * 60 * 1000));
      const minutes = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((timeDiff % (60 * 1000)) / 1000);

      // Форматировать каждую компоненту времени с ведущими нулями
      const formattedHours = formatNumberWithLeadingZero(hours);
      const formattedMinutes = formatNumberWithLeadingZero(minutes);
      const formattedSeconds = formatNumberWithLeadingZero(seconds);

      countdownTimerElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
      countdownNameElement.textContent = `${nextEvent.name}`;
      countdownTimeElement.textContent = `${nextEvent.time}`;
    }
  }

  // Вызовите функцию для отображения таймера
  updateTimer();

  // Установите интервал для обновления таймера
  setInterval(updateTimer, 500);
});

//TIME
///////////////////////////


// Function to start recording on two OBS instances

// Function to stop recording on two OBS instances
async function startRecording() {
  try {
    if (obsConnected) {
      await obs.call('StartRecord');
    } else {
      displayErrorMessage('Failed to start recording: OBS 1 is not connected');
    }
  } catch (error) {
    displayErrorMessage('Error start recording on OBS 1: ' + error.message);
  }

  try {
    if (obs2Connected) {
      await obs2.call('StartRecord');
    } else {
      displayErrorMessage('Failed to start recording: OBS 2 is not connected');
    }
  } catch (error) {
    displayErrorMessage('Error start recording on OBS 2: ' + error.message);
  }
}

// Function to stop recording on two OBS instances
async function stopRecording() {
  try {
    if (obsConnected) {
      await obs.call('StopRecord');
    } else {
      displayErrorMessage('Failed to stop recording: OBS 1 is not connected');
    }
  } catch (error) {
    displayErrorMessage('Error stopping recording on OBS 1: ' + error.message);
  }

  try {
    if (obs2Connected) {
      await obs2.call('StopRecord');
    } else {
      displayErrorMessage('Failed to stop recording: OBS 2 is not connected');
    }
  } catch (error) {
    displayErrorMessage('Error stopping recording on OBS 2: ' + error.message);
  }
}


// Function to get the OBS version for a given OBS instance
async function getOBSVersion(obsInstance, versionElementId) {
    const obsVersionResult = document.getElementById(versionElementId);

    try {
        const response = await obsInstance.call('GetVersion');
        const obsVersion = response['obsVersion'];
        const obsWebSocketVersion = response['obsWebSocketVersion'];

        // Display OBS version in the corresponding element
        obsVersionResult.textContent = obsVersion + ';  ' + obsWebSocketVersion;
    } catch (error) {
        displayErrorMessage('Error getting OBS version: ' + error.message);
    }
}

// Function to display OBS version
function displayOBSVersion(version) {
    const obsVersionResult = document.getElementById('obs-version-result');
    obsVersionResult.textContent = version;
}

// Function to get the current scene for both OBS instances
async function getCurrentScene() {
  try {
    const results1Element = document.getElementById('results1');
    const results2Element = document.getElementById('results2');

    if (obsConnected) {
      const response1 = await obs.call('GetCurrentProgramScene');
      results1Element.textContent = response1.currentProgramSceneName;
    } else {
      results1Element.textContent = 'OBS_1 disconnected';
    }

    if (obs2Connected) {
      const response2 = await obs2.call('GetCurrentProgramScene');
      results2Element.textContent = response2.currentProgramSceneName;
    } else {
      results2Element.textContent = 'OBS_2 disconnected';
    }
  } catch (error) {
    displayErrorMessage('Error getting current scene: ' + error.message);
  }
}


// Function to get the list of scenes for the first OBS instance
async function getSceneList() {
    try {
        if (obsConnected || obs2Connected) { // Check if at least one of the OBS instances is connected
            // Create containers for the scene lists of the first and second OBS instances
            const sceneListContainer1 = document.getElementById('scene-list1');
            const sceneListContainer2 = document.getElementById('scene-list2');

            // Clear the previous content of the containers
            sceneListContainer1.innerHTML = '';
            sceneListContainer2.innerHTML = '';

            // Function to create a radio button and label for a scene
            function createSceneElement(sceneName, obsNumber) {
                const sceneDiv = document.createElement('div');

                const sceneRadio = document.createElement('input');
                sceneRadio.type = 'radio';
                sceneRadio.name = `scene-radio-group${obsNumber}`; // Group name with OBS number
                sceneRadio.value = sceneName;

                const sceneLabel = document.createElement('label');
                sceneLabel.textContent = sceneName;

                sceneDiv.appendChild(sceneRadio);
                sceneDiv.appendChild(sceneLabel);

                return sceneDiv;
            }

            if (obsConnected) {
                // Get the list of scenes for the first OBS instance
                const response1 = await obs.call('GetSceneList', {});
                let scenes1 = response1.scenes;

                // Reverse the order of scenes (if needed)
                scenes1 = scenes1.reverse();

                // Create elements for scenes of the first OBS instance and add them to the container
                scenes1.forEach((scene) => {
                    const sceneElement = createSceneElement(scene.sceneName, 1); // Pass the OBS number
                    sceneListContainer1.appendChild(sceneElement);
                });
            }

            if (obs2Connected) {
                // Get the list of scenes for the second OBS instance
                const response2 = await obs2.call('GetSceneList', {});
                let scenes2 = response2.scenes;

                // Reverse the order of scenes (if needed)
                scenes2 = scenes2.reverse();

                // Create elements for scenes of the second OBS instance and add them to the container
                scenes2.forEach((scene) => {
                    const sceneElement = createSceneElement(scene.sceneName, 2); // Pass the OBS number
                    sceneListContainer2.appendChild(sceneElement);
                });
            }
        } else {
            displayErrorMessage('None of the OBS instances are connected');
        }
    } catch (error) {
        displayErrorMessage('Error getting the list of scenes: ' + error.message);
    }
}

// Function to switch to the selected scene in the first OBS instance
async function goToSelectedScene() {
    try {
        const radioButtons1 = document.getElementsByName('scene-radio-group1'); // For the first OBS
        const radioButtons2 = document.getElementsByName('scene-radio-group2'); // For the second OBS

        let sceneName1 = '';
        let sceneName2 = '';

        // Check if a scene is selected for the first OBS
        for (const radioButton of radioButtons1) {
            if (radioButton.checked) {
                sceneName1 = radioButton.value;
                break;
            }
        }

        // Check if a scene is selected for the second OBS
        for (const radioButton of radioButtons2) {
            if (radioButton.checked) {
                sceneName2 = radioButton.value;
                break;
            }
        }

        // Perform the scene switch for the first OBS if a scene is selected
        if (obsConnected && sceneName1) {
            await obs.call('SetCurrentProgramScene', {
                'sceneName': sceneName1
            });

            document.getElementById('results1').textContent = sceneName1 ;
        }

        // Perform the scene switch for the second OBS if a scene is selected
        if (obs2Connected && sceneName2) {
            await obs2.call('SetCurrentProgramScene', {
                'sceneName': sceneName2
            });

            document.getElementById('results2').textContent = sceneName2 ;
        }

        if (!sceneName1 && !sceneName2) {
            displayErrorMessage('No scene selected for switching');
        }
    } catch (error) {
        displayErrorMessage('Error while switching to the selected scene: ' + error.message);
    }
}


// Function to start streaming on two OBS instances
async function startStreaming() {
  try {
    if (obsConnected) {
      await obs.call('StartStream');
    } else {
      displayErrorMessage('Failed to start streaming: OBS 1 is not connected');
    }
  } catch (error) {
    displayErrorMessage('Error starting streaming on OBS 1: ' + error.message);
  }

  try {
    if (obs2Connected) {
      await obs2.call('StartStream');
    } else {
      displayErrorMessage('Failed to start streaming: OBS 2 is not connected');
    }
  } catch (error) {
    displayErrorMessage('Error starting streaming on OBS 2: ' + error.message);
  }
}


// Function to stop streaming on both OBS instances
async function stopStreaming() {
  try {
    if (obsConnected) {
      await obs.call('StopStream');
    } else {
      displayErrorMessage('Failed to stop streaming: OBS 1 is not connected');
    }
  } catch (error) {
    displayErrorMessage('Error stopping the stream on OBS 1: ' + error.message);
  }

  try {
    if (obs2Connected) {
      await obs2.call('StopStream');
    } else {
      displayErrorMessage('Failed to stop streaming: OBS 2 is not connected');
    }
  } catch (error) {
    displayErrorMessage('Error stopping the stream on OBS 2: ' + error.message);
  }
}





////////////////////////////////////
// Functions for Managing Blur

// Get buttons by id for blur control
document.addEventListener('DOMContentLoaded', function() {
  const blurOnButton = document.getElementById('BLUR-ON');
  const blurOffButton = document.getElementById('BLUR-OFF');

  // Add a click event handler for the "BLUR-ON" button
  blurOnButton.addEventListener('click', () => {
      enableBlur(); 
  });

  // Add a click event handler for the "BLUR-OFF" button
  blurOffButton.addEventListener('click', () => {
      disableBlur(); 
  });
});


// Function to enable blur
async function enableBlur() {
    try {
        let connected = false; // Flag to track if at least one connection is successful

        // Create a JSON request to enable the filter in OBS 1
        if (obsConnected) {
            const request1 = {
                requestType: 'SetSourceFilterEnabled',
                requestData: {
                    sourceName: SourceNameBlur,
                    filterName, // Use the imported filterName value
                    filterEnabled: true, // Enable the filter
                },
            };
            await obs.call(request1.requestType, request1.requestData);
            blurEnabled = true; // Set the flag to true
            connected = true;
        }

        // Create a JSON request to enable the filter in OBS 2
        if (obs2Connected) {
            const request2 = {
                requestType: 'SetSourceFilterEnabled',
                requestData: {
                    sourceName: SourceNameBlur,
                    filterName, // Use the imported filterName value
                    filterEnabled: true, // Enable the filter
                },
            };
            await obs2.call(request2.requestType, request2.requestData);
            blurEnabled = true; // Set the flag to true
            connected = true;
        }

        if (!connected) {
            throw new Error('Failed to enable blur: None of the OBS instances are connected');
        }

        // Add code here to update the interface or display blur status if necessary.
    } catch (error) {
        throw new Error('Error enabling blur: ' + error.message);
    }
}

// Function to disable blur
async function disableBlur() {
    try {
        let connected = false; // Flag to track if at least one connection is successful

        // Create a JSON request to disable the filter in OBS 1
        if (obsConnected) {
            const request1 = {
                requestType: 'SetSourceFilterEnabled',
                requestData: {
                    sourceName: SourceNameBlur,
                    filterName,
                    filterEnabled: false, // Disable the filter
                },
            };
            await obs.call(request1.requestType, request1.requestData);
            connected = true;
        }

        // Create a JSON request to disable the filter in OBS 2
        if (obs2Connected) {
            const request2 = {
                requestType: 'SetSourceFilterEnabled',
                requestData: {
                    sourceName: SourceNameBlur,
                    filterName,
                    filterEnabled: false, // Disable the filter
                },
            };
            await obs2.call(request2.requestType, request2.requestData);
            connected = true;
        }

        if (!connected) {
            throw new Error('Failed to disable blur: None of the OBS instances are connected');
        }

        // Add code here to update the interface or display blur status if necessary.
    } catch (error) {
        throw new Error('Error disabling blur: ' + error.message);
    }
}




////////////////////////////////////
// Functions for Managing Mute

// Get buttons by id for mute control

document.addEventListener('DOMContentLoaded', function() {
  const muteOnButton = document.getElementById('MUTE-ON');
  const muteOffButton = document.getElementById('MUTE-OFF');

  // Add a click event handler for the "MUTE-ON" button
  muteOnButton.addEventListener('click', () => {
      enableMute(); // Вызываем функцию для включения звука напрямую
  });

  // Add a click event handler for the "MUTE-OFF" button
  muteOffButton.addEventListener('click', () => {
      disableMute(); // Вызываем функцию для отключения звука напрямую
  });
});


// Function to enable mute
async function enableMute() {
    try {
        let connected = false; // Flag to track if at least one connection is successful

        // Create a JSON request to enable mute in OBS 1
        if (obsConnected) {
            const request1 = {
                requestType: 'SetInputMute',
                requestData: {
                    inputName: SourceNameMute, // Use the source name from getSourcesList
                    inputMuted: true, // Enable mute
                },
            };
            await obs.call(request1.requestType, request1.requestData);
            muteEnabled = true; // Set the flag to true
            connected = true;
        }

        // Create a JSON request to enable mute in OBS 2
        if (obs2Connected) {
            const request2 = {
                requestType: 'SetInputMute',
                requestData: {
                    inputName: SourceNameMute, // Use the source name from getSourcesList
                    inputMuted: true, // Enable mute
                },
            };
            await obs2.call(request2.requestType, request2.requestData);
            muteEnabled = true; // Set the flag to true
            connected = true;
        }

        if (!connected) {
            throw new Error('Failed to enable mute: None of the OBS instances are connected');
        }

        // Add code here to update the interface or display mute status if necessary.
    } catch (error) {
        throw new Error('Error enabling mute: ' + error.message);
    }
}

// Function to disable mute
async function disableMute() {
    try {
        let connected = false; // Flag to track if at least one connection is successful

        // Create a JSON request to disable mute in OBS 1
        if (obsConnected) {
            const request1 = {
                requestType: 'SetInputMute',
                requestData: {
                    inputName: SourceNameMute, // Use the source name from getSourcesList
                    inputMuted: false, // Disable mute
                },
            };
            await obs.call(request1.requestType, request1.requestData);
            muteEnabled = false; // Set the flag to false
            connected = true;
        }

        // Create a JSON request to disable mute in OBS 2
        if (obs2Connected) {
            const request2 = {
                requestType: 'SetInputMute',
                requestData: {
                    inputName: SourceNameMute, // Use the source name from getSourcesList
                    inputMuted: false, // Disable mute
                },
            };
            await obs2.call(request2.requestType, request2.requestData);
            muteEnabled = false; // Set the flag to false
            connected = true;
        }

        if (!connected) {
            throw new Error('Failed to disable mute: None of the OBS instances are connected');
        }

        // Add code here to update the interface or display mute status if necessary.
    } catch (error) {
        throw new Error('Error disabling mute: ' + error.message);
    }
}



////////////////////////////////////
// Functions for Managing BEEP

// Get buttons by id for BEEP control

document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggleButton');
    let isButtonPressed = false;

    toggleButton.addEventListener('mousedown', () => {
        enableBEEP1();
        enableBEEP3();
        isButtonPressed = true;
    });

    toggleButton.addEventListener('mouseup', () => {
        if (isButtonPressed) {
            enableBEEP2();
            enableBEEP4();
            isButtonPressed = false;
        }
    });
});


// Function to enable BEEP sourse mute
async function enableBEEP1() {
    try {
        let connected = false; // Flag to track if at least one connection is successful

        // Create a JSON request to enable mute in OBS 1
        if (obsConnected) {
            const request1 = {
                requestType: 'SetInputMute',
                requestData: {
                    inputName: SourceNameToBEEP, // Use the source name from getSourcesList
                    inputMuted: true, // Enable mute
                },
            };
            await obs.call(request1.requestType, request1.requestData);
            muteEnabled = true; // Set the flag to true
            connected = true;
        }

        

        // Create a JSON request to enable mute in OBS 2
        if (obs2Connected) {
            const request2 = {
                requestType: 'SetInputMute',
                requestData: {
                    inputName: SourceNameToBEEP, // Use the source name from getSourcesList
                    inputMuted: true, // Enable mute
                },
            };
            await obs2.call(request2.requestType, request2.requestData);
            muteEnabled = true; // Set the flag to true
            connected = true;
        }

        

        if (!connected) {
            throw new Error('Failed to enable mute: None of the OBS instances are connected');
        }

        // Add code here to update the interface or display mute status if necessary.
    } catch (error) {
        throw new Error('Error enabling mute: ' + error.message);
    }
}


async function enableBEEP2() {
    try {
        let connected = false; // Flag to track if at least one connection is successful

        // Create a JSON request to enable mute in OBS 1
        if (obsConnected) {
            const request1 = {
                requestType: 'SetInputMute',
                requestData: {
                    inputName: SourceNameBEEP, // Use the source name from getSourcesList
                    inputMuted: true, // Enable mute
                },
            };
            await obs.call(request1.requestType, request1.requestData);
            muteEnabled = true; // Set the flag to true
            connected = true;
        }

        

        // Create a JSON request to enable mute in OBS 2
        if (obs2Connected) {
            const request2 = {
                requestType: 'SetInputMute',
                requestData: {
                    inputName: SourceNameBEEP, // Use the source name from getSourcesList
                    inputMuted: true, // Enable mute
                },
            };
            await obs2.call(request2.requestType, request2.requestData);
            muteEnabled = true; // Set the flag to true
            connected = true;
        }

        

        if (!connected) {
            throw new Error('Failed to enable mute: None of the OBS instances are connected');
        }

        // Add code here to update the interface or display mute status if necessary.
    } catch (error) {
        throw new Error('Error enabling mute: ' + error.message);
    }
}

// Function to disable BEEP
async function enableBEEP3() {
    try {
        let connected = false; // Flag to track if at least one connection is successful

        // Create a JSON request to disable mute in OBS 1
        if (obsConnected) {
            const request1 = {
                requestType: 'SetInputMute',
                requestData: {
                    inputName: SourceNameBEEP, // Use the source name from getSourcesList
                    inputMuted: false, // Disable mute
                },
            };
            await obs.call(request1.requestType, request1.requestData);
            muteEnabled = false; // Set the flag to false
            connected = true;
        }

        // Create a JSON request to disable mute in OBS 2
        if (obs2Connected) {
            const request2 = {
                requestType: 'SetInputMute',
                requestData: {
                    inputName: SourceNameBEEP, // Use the source name from getSourcesList
                    inputMuted: false, // Disable mute
                },
            };
            await obs2.call(request2.requestType, request2.requestData);
            muteEnabled = false; // Set the flag to false
            connected = true;
        }

        if (!connected) {
            throw new Error('Failed to disable mute: None of the OBS instances are connected');
        }

        // Add code here to update the interface or display mute status if necessary.
    } catch (error) {
        throw new Error('Error disabling mute: ' + error.message);
    }
}

async function enableBEEP4() {
    try {
        let connected = false; // Flag to track if at least one connection is successful

        // Create a JSON request to disable mute in OBS 1
        if (obsConnected) {
            const request1 = {
                requestType: 'SetInputMute',
                requestData: {
                    inputName: SourceNameToBEEP, // Use the source name from getSourcesList
                    inputMuted: false, // Disable mute
                },
            };
            await obs.call(request1.requestType, request1.requestData);
            muteEnabled = false; // Set the flag to false
            connected = true;
        }

        // Create a JSON request to disable mute in OBS 2
        if (obs2Connected) {
            const request2 = {
                requestType: 'SetInputMute',
                requestData: {
                    inputName: SourceNameToBEEP, // Use the source name from getSourcesList
                    inputMuted: false, // Disable mute
                },
            };
            await obs2.call(request2.requestType, request2.requestData);
            muteEnabled = false; // Set the flag to false
            connected = true;
        }

        if (!connected) {
            throw new Error('Failed to disable mute: None of the OBS instances are connected');
        }

        // Add code here to update the interface or display mute status if necessary.
    } catch (error) {
        throw new Error('Error disabling mute: ' + error.message);
    }
}
//nktdenis@gmail.com








