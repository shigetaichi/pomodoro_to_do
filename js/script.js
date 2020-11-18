'use strict';
{
  const progressBar = new ProgressBar.Circle(".pomodoro-clock", {
    strokeWidth: 2,
    color: '#514B23',
    text: {
      value: "25:00"
    },
    trailColor: "#CBC9AD",
    trailWidth: 0.8,
    // fill: '#a43c2a',
  });

  const btn = document.getElementById('btn');
  const lists = document.getElementById('lists');
  const input = document.getElementById('input');
  const priority = document.getElementsByName('priority');
  const hamburger = document.getElementById('hamburger');

  const total = document.getElementById('total');
  const complete = document.getElementById('complete');
  const remain = document.getElementById('remain');
  const clear = document.querySelector('.clear');
  const right_now_clock = document.querySelector('.right-now-clock');
  const pomodoro = document.querySelector('.pomodoro');
  const pomodoro_clock = document.querySelector('.pomodoro-clock');
  const startButton = document.getElementById('pomodoro-start');
  // const pauseButton = document.getElementById('pomodoro-pause');
  const stopButton = document.getElementById('pomodoro-stop');
  let type = 'Work';
  const theme_color_select = document.querySelector('.theme-color-select');
  const cl_theme_1 = document.getElementById('cl-theme-1');
  const cl_theme_2 = document.getElementById('cl-theme-2');
  const cl_theme_3 = document.getElementById('cl-theme-3');
  const cl_theme_4 = document.getElementById('cl-theme-4');
  const cl_theme_5 = document.getElementById('cl-theme-5');

  let LIST = [];
  let id = 0;
  let COLOR_LIST = [];
  
  let data = localStorage.getItem('TODO');
  if(data){
    LIST = JSON.parse(data);
    id = LIST.length;
    loadList(LIST);
  }else{
    //if data isn't empty
    LIST = [];
    id = 0;
  }
  function loadList(array) {
    array.forEach(function(item){
      createTodoList(item.name, item.id, item.done, item.trash, item.immediately);
    });
    refreshTheCounter();
  }

  let colorData = localStorage.getItem('COLORDATA');
  if(colorData){
    COLOR_LIST = JSON.parse(colorData);
    console.log(COLOR_LIST[COLOR_LIST.length - 1].theme);
    const themeNumber = COLOR_LIST[COLOR_LIST.length - 1].theme;
    switch(themeNumber){
      case 1:
        colorTheme1();
        break;
      case 2:
        colorTheme2();
        break;
      case 3:
        colorTheme3();
        break;
      case 4:
        colorTheme4();
        break;
      case 5:
        colorTheme5();
        break;
    }
    
  }else{
    COLOR_LIST = [];
  }




  function refreshTheCounter(){
    let total_count = 0;
    let complete_count = 0;
    for(let i = 0; i < LIST.length; i++){
      if(LIST[i].trash === false){
        total_count++;
      }
      total.textContent = `T : ${total_count}`;
    }
    let remain_count = total_count;
    for(let i = 0; i < LIST.length; i++){
      if(LIST[i].done === true){
        complete_count++;
        remain_count--;
      }
      complete.textContent = `C : ${complete_count}`;
    }
    console.log(complete_count);
    remain.textContent = `R : ${remain_count}`;
  }

  function createTodoList(task, id, done, trash, immediately){
    if(trash){return;}
    const DONE = done ? 'done': '';
    const checked = done ? 'checked' : '';
    const IMMEDIATELY = immediately ? 'immediately' : '';
    const html = 
    `<li class="col-11 todoItem ${DONE}">
      <label class="toggle_label ${DONE}" number="${id}" job="complete">
        <input type="checkbox" name="done" ${checked}>
        <span></span>
      </label>
      <div class="title ${IMMEDIATELY}">${task}</div>
      <span class="trash" number="${id}" job="delete"></span>
    </li>`;
    lists.innerHTML += html;
  }

  function completeToDo(element) {
    element.classList.toggle('done');
    element.parentNode.classList.toggle('done');
    LIST[element.attributes.number.value].done = LIST[element.attributes.number.value].done ? false : true;
    // console.log(LIST[element.attributes.number.value].done);
    console.log(LIST);
    refreshTheCounter();
  }

  function removeToDo(element){
    element.parentNode.remove();
    LIST[element.attributes.number.value].trash = true;
    // console.log(LIST[element.attributes.number.value].trash);
    // console.log(LIST);
    refreshTheCounter();
  }

  input.addEventListener('keyup', (event) => {
    if(event.keyCode === 13){
      // event.preventDefault();
       let theKey = event.keyCode;
      
      input.addEventListener('keydown', (eventSecond) => {
        if(eventSecond.keyCode === 229 && eventSecond === theKey){
          console.log('yes');
          
          btn.click();
        }
      });
    }
  });
  btn.addEventListener('click', () => {
    const toDo = input.value;
    if(toDo){
      if(priority[0].checked){
        createTodoList(toDo, id, false, false, true);
        LIST.push(
          {
            name: toDo,
            id: id,
            done :false,
            trash: false,
            immediately : true,
          }
        );
      }else{
        createTodoList(toDo, id, false, false, false);
        LIST.push(
          {
            name: toDo,
            id: id,
            done :false,
            trash: false,
            immediately : false,
          }
        );
      }
      priority[0].checked = false;

      
      localStorage.setItem('TODO', JSON.stringify(LIST));
      id++;
      refreshTheCounter();
      console.log(LIST);
    }
    // if(priority[0].checked){
    //   // lists.lastChild.classList.add('immediately');
    //   priority[0].checked = false;
    // }
    input.value = '';
  });



  lists.addEventListener('click', (e) => {
    const element = e.target;
    const elementJob = element.getAttribute('job');
    if(elementJob == 'complete'){
      completeToDo(element);
    }else if(elementJob == 'delete'){
      if(confirm('削除しますか？')){
        removeToDo(element);
      }
    }

    localStorage.setItem('TODO', JSON.stringify(LIST));
  });

  clear.addEventListener('click', function() {
    console.log('clear!');
    
    // localStorage.clear(); これだとテーマの設定もリセットされちゃう
    LIST.length = 0;
    localStorage.setItem('TODO', JSON.stringify(LIST));
    console.log(LIST);
    location.reload();
  });

  hamburger.addEventListener('click', function() {
    const whole_wrapper = document.querySelector('.whole-wrapper');
    whole_wrapper.classList.toggle('blur');
    const hide_nav = document.querySelector('.hide-nav');
    hide_nav.classList.toggle('toggled');
    const hide_list = document.querySelector('.hide-list');
    hide_list.classList.toggle('toggled');
  });

  

  function rightNowClock(){
    const date = new Date();
    document.querySelector('.hour').style.transform = `rotate(${(date.getHours()) * 30}deg)`;
    document.querySelector('.minute').style.transform = `rotate(${date.getMinutes() * 6}deg)`;
    document.querySelector('.second').style.transform = `rotate(${date.getSeconds() * 6}deg)`;
  }
  setInterval(() => {
    rightNowClock();
    
  }, 1000);
    



  theme_color_select.addEventListener('click', function(){
    document.querySelector('.color-themes').classList.toggle('toggled');
  });
  cl_theme_1.addEventListener('click', function() {
    colorTheme1();
  });
  function colorTheme1(){
    document.documentElement.style.setProperty('--beige-1', '#514B23');
    document.documentElement.style.setProperty('--beige-2', '#5B5A2E');
    document.documentElement.style.setProperty('--beige-3', '#656839');
    document.documentElement.style.setProperty('--beige-4', '#989973');
    document.documentElement.style.setProperty('--beige-5', '#CBC9AD');
    document.documentElement.style.setProperty('--beige-6', '#CBCDB3');
    document.documentElement.style.setProperty('--beige-7', '#CBD0B9');
    document.documentElement.style.setProperty('--beige-8', '#C4D6C5');
    document.documentElement.style.setProperty('--beige-9', '#BDDBD0');
    document.documentElement.style.setProperty('--beige-shadow-1', '#adab93');
    document.documentElement.style.setProperty('--beige-shadow-2', '#e9e7c7');
    document.documentElement.style.setProperty('--beige-shadow-inset-1', '#7c7b6a');
    document.documentElement.style.setProperty('--beige-shadow-inset-2', '#fffff0');
    document.documentElement.style.setProperty('--beige-linear-1', '#d9d7b9');
    document.documentElement.style.setProperty('--beige-linear-2', '#b7b59c');
    document.documentElement.style.setProperty('--immediate-color', '#a43c2a');
    document.documentElement.style.setProperty('--immediate-shadow-1', '#8b3324');
    document.documentElement.style.setProperty('--immediate-shadow-2', '#bd4530');
    document.documentElement.style.setProperty('--done-color', '#ccc');
    document.querySelector('.progressbar-text').style.color = "#514B23";
    COLOR_LIST.length = 0;
    COLOR_LIST.push(
      {
        theme: 1,
      }
    );
    console.log(COLOR_LIST);
    localStorage.setItem('COLORDATA', JSON.stringify(COLOR_LIST) );
  }
  cl_theme_2.addEventListener('click', function() {
    colorTheme2();
  });
  function colorTheme2() {
    document.documentElement.style.setProperty('--beige-1', '#2D00F7');
    document.documentElement.style.setProperty('--beige-2', '#6A00F4');
    document.documentElement.style.setProperty('--beige-3', '#8900F2');
    document.documentElement.style.setProperty('--beige-4', '#B100E8');
    document.documentElement.style.setProperty('--beige-5', '#C100DD');
    document.documentElement.style.setProperty('--beige-6', '#D100D1');
    document.documentElement.style.setProperty('--beige-7', '#DB00B6');
    document.documentElement.style.setProperty('--beige-8', '#E500A4');
    document.documentElement.style.setProperty('--beige-9', '#F20089');
    document.documentElement.style.setProperty('--beige-shadow-1', '#a400bc');
    document.documentElement.style.setProperty('--beige-shadow-2', '#de00fe');
    document.documentElement.style.setProperty('--beige-shadow-inset-1', '#a400bc');
    document.documentElement.style.setProperty('--beige-shadow-inset-2', '#de00fe');
    document.documentElement.style.setProperty('--beige-linear-1', '#cf00ec');
    document.documentElement.style.setProperty('--beige-linear-2', '#ae00c7');
    document.documentElement.style.setProperty('--immediate-color', '#cad600');
    document.documentElement.style.setProperty('--immediate-shadow-1', '#acb600');
    document.documentElement.style.setProperty('--immediate-shadow-2', '#e8f600');
    document.documentElement.style.setProperty('--done-color', '#dea6d3');
    document.querySelector('.progressbar-text').style.color = "#2D00F7";
    COLOR_LIST.length = 0;
    COLOR_LIST.push(
      {
        theme: 2,
      }
    );
    console.log(COLOR_LIST);
    localStorage.setItem('COLORDATA', JSON.stringify(COLOR_LIST) );
  }

  cl_theme_3.addEventListener('click', function() {
    colorTheme3();
  });
  function colorTheme3() {
    document.documentElement.style.setProperty('--beige-1', '#00fffb');
    document.documentElement.style.setProperty('--beige-2', '#DA1E37');
    document.documentElement.style.setProperty('--beige-3', 'orange');
    document.documentElement.style.setProperty('--beige-4', '#BD1F36');
    document.documentElement.style.setProperty('--beige-5', '#B21E35');
    document.documentElement.style.setProperty('--beige-6', '#A71E34');
    document.documentElement.style.setProperty('--beige-7', '#A11D33');
    document.documentElement.style.setProperty('--beige-8', '#85182A');
    document.documentElement.style.setProperty('--beige-9', '#641220');
    document.documentElement.style.setProperty('--beige-shadow-1', '#971a2d');
    document.documentElement.style.setProperty('--beige-shadow-2', '#cd233d');
    document.documentElement.style.setProperty('--beige-shadow-inset-1', '#971a2d');
    document.documentElement.style.setProperty('--beige-shadow-inset-2', '#cd233d');
    document.documentElement.style.setProperty('--beige-linear-1', '#be2039');
    document.documentElement.style.setProperty('--beige-linear-2', '#a01b30');
    document.documentElement.style.setProperty('--immediate-color', '#f0ff00');
    document.documentElement.style.setProperty('--immediate-shadow-1', '#ccd900');
    document.documentElement.style.setProperty('--immediate-shadow-2', '#ffff00');
    document.documentElement.style.setProperty('--done-color', '#a98685');
    document.querySelector('.progressbar-text').style.color = "#00fffb";
    COLOR_LIST.length = 0;
    COLOR_LIST.push(
      {
        theme: 3,
      }
    );
    console.log(COLOR_LIST);
    localStorage.setItem('COLORDATA', JSON.stringify(COLOR_LIST) );
  }

  cl_theme_4.addEventListener('click', function() {
    colorTheme4();
  });
  function colorTheme4() {
    document.documentElement.style.setProperty('--beige-1', '#7ec3ff');
    document.documentElement.style.setProperty('--beige-2', '#DA1E37');
    document.documentElement.style.setProperty('--beige-3', 'orange');
    document.documentElement.style.setProperty('--beige-4', 'white');
    document.documentElement.style.setProperty('--beige-5', 'white');
    document.documentElement.style.setProperty('--beige-6', '#A71E34');
    document.documentElement.style.setProperty('--beige-7', 'white');
    document.documentElement.style.setProperty('--beige-8', '#85182A');
    document.documentElement.style.setProperty('--beige-9', '#641220');
    document.documentElement.style.setProperty('--beige-shadow-1', '#d9d9d9');
    document.documentElement.style.setProperty('--beige-shadow-2', '#ffffff');
    document.documentElement.style.setProperty('--beige-shadow-inset-1', '#d9d9d9');
    document.documentElement.style.setProperty('--beige-shadow-inset-2', '#ffffff');
    document.documentElement.style.setProperty('--beige-linear-1', '#ffffff');
    document.documentElement.style.setProperty('--beige-linear-2', '#e6e6e6');
    document.documentElement.style.setProperty('--immediate-color', '#ffd829');
    document.documentElement.style.setProperty('--immediate-shadow-1', '#d9b823');
    document.documentElement.style.setProperty('--immediate-shadow-2', '#fff82f');
    document.documentElement.style.setProperty('--done-color', 'white');
    document.querySelector('.progressbar-text').style.color = "#7ec3ff";
    COLOR_LIST.length = 0;
    COLOR_LIST.push(
      {
        theme: 4,
      }
    );
    console.log(COLOR_LIST);
    localStorage.setItem('COLORDATA', JSON.stringify(COLOR_LIST) );
  }
  cl_theme_5.addEventListener('click', function() {
    colorTheme5();
  });
  function colorTheme5() {
    document.documentElement.style.setProperty('--beige-1', '#111100');
    document.documentElement.style.setProperty('--beige-2', '#DA1E37');
    document.documentElement.style.setProperty('--beige-3', 'white');
    document.documentElement.style.setProperty('--beige-4', '#879288');
    document.documentElement.style.setProperty('--beige-5', '#879288');
    document.documentElement.style.setProperty('--beige-6', '#A71E34');
    document.documentElement.style.setProperty('--beige-7', '#879288');
    document.documentElement.style.setProperty('--beige-8', '#85182A');
    document.documentElement.style.setProperty('--beige-9', '#641220');
    document.documentElement.style.setProperty('--beige-shadow-1', '#737c74');
    document.documentElement.style.setProperty('--beige-shadow-2', '#9ba89c');
    document.documentElement.style.setProperty('--beige-shadow-inset-1', '#737c74');
    document.documentElement.style.setProperty('--beige-shadow-inset-2', '#9ba89c');
    document.documentElement.style.setProperty('--beige-linear-1', '#909c92');
    document.documentElement.style.setProperty('--beige-linear-2', '#7a837a');
    document.documentElement.style.setProperty('--immediate-color', '#ffd829');
    document.documentElement.style.setProperty('--immediate-shadow-1', '#d9b823');
    document.documentElement.style.setProperty('--immediate-shadow-2', '#fff82f');
    document.documentElement.style.setProperty('--done-color', '#ccc');
    document.querySelector('.progressbar-text').style.color = "#111100";
    COLOR_LIST.length = 0;
    COLOR_LIST.push(
      {
        theme: 5,
      }
    );
    console.log(COLOR_LIST);
    localStorage.setItem('COLORDATA', JSON.stringify(COLOR_LIST) );
  }


  

    

  

  let isClockRunning = false;
  let workSessionDuration = 1500;
  let currentTimeLeftInSession = 1500;
  let breakSessionDuration = 300;
  let clockTimer;
  let timeSpentInCurrentSession = 0;
  let currentTaskLabel = document.querySelector('#pomodoro-clock-task');
  let updatedWorkSessionDuration;
  let updatedBreakSessionDuration;
  let workDurationInput = document.querySelector('#input-work-duration');
  let breakDurationInput = document.querySelector('#input-break-duration');
  workDurationInput.value = '25';
  breakDurationInput.value = '5';
  let isClockStopped = true;
  let sessionLabel;
  let workSessionLabel;

  displayCurrentTimeLeftInSession();
  startButton.addEventListener('click', function() {
    toggleClock();
    
  });
  // pauseButton.addEventListener('click', function() {
  //   toggleClock();
  // });
  stopButton.addEventListener('click', function() {
    toggleClock(true);
  });
  workDurationInput.addEventListener('input', () => {
    updatedWorkSessionDuration = minutesToSeconds(workDurationInput.value);
  });
  breakDurationInput.addEventListener('input', () => {
    updatedBreakSessionDuration = minutesToSeconds(breakDurationInput.value);
  });

  function minutesToSeconds(mins) {
    return mins * 60;
  }

  function toggleClock(reset) {
    togglePlayPauseIcon(reset);
    if(reset){
      //STOP THE TIMER
      stopClock();
    }else{
      console.log(isClockStopped);
      if(isClockStopped){
        setUpdatedTimers();
        isClockStopped = false;
      }
      if(isClockRunning === true){
        //PAUSE THE TIMER
        clearInterval(clockTimer);
        isClockRunning = false;
      }else{
        //START THE TIMER
        isClockRunning = true;
        // clockTimer;
        clockTimer = setInterval( () => {
          //decrease time left/increase time spent
          stepDown();
          displayCurrentTimeLeftInSession();
          progressBar.animate(calculateSessionProgress());
        }, 1000);
        isClockRunning = true;
      }
      showStopIcon();
    }
  }

  function displayCurrentTimeLeftInSession() {
    const secondsLeft = currentTimeLeftInSession;
    let result = '';
    const seconds = secondsLeft % 60;
    const minutes = parseInt(secondsLeft / 60) % 60;
    let hours = parseInt(secondsLeft / 3600);
    //add leading zeroes if it's less than 10
    function addLeadingZeroes(time){
      return time < 10 ? `0${time}` : time;
    }
    if(hours > 0) {
      result += `${hours}:`
    }
    result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;
    // pomodoro_clock.textContent = result.toString();
    progressBar.text.innerText = result.toString();
  }

  function stopClock() {
    setUpdatedTimers();
    displaySessionLog(type);
    clearInterval(clockTimer);
    isClockStopped = true;
    isClockRunning = false;
    currentTimeLeftInSession = workSessionDuration;
    displayCurrentTimeLeftInSession();
    type = 'Work';
    timeSpentInCurrentSession = 0;
  }

  function stepDown() {
    if(currentTimeLeftInSession > 0){
      //decrease time left/ increase time spent
      currentTimeLeftInSession--;
      timeSpentInCurrentSession++;
    }else if(currentTimeLeftInSession === 0){
      timeSpentInCurrentSession = 0;
      // stopClock();
      if(type === 'Work'){
        currentTimeLeftInSession = breakSessionDuration;
        displaySessionLog('Work');
        type = 'Break';
        setUpdatedTimers();
        currentTaskLabel.value = 'Break';
        currentTaskLabel.disabled = true;
      }else{
        currentTimeLeftInSession = workSessionDuration;
        type = 'Work';
        setUpdatedTimers();
        if(currentTaskLabel.value === 'Break'){
          currentTaskLabel.value = workSessionLabel;
        }
        currentTaskLabel.disabled = false;
        displaySessionLog('Break');
      }
    }
    displayCurrentTimeLeftInSession();
  }
  function displaySessionLog(type){
    const sessionList = document.querySelector('#pomodoro-sessions');
    const li = document.createElement('li');
    if(type === 'Work'){
      sessionLabel = currentTaskLabel.value ? currentTaskLabel.value : 'Work';
      workSessionLabel = sessionLabel;
    }else{
      sessionLabel = 'Break';
    }
    let elapsedTime = parseInt(timeSpentInCurrentSession / 60);
    elapsedTime = elapsedTime > 0 ? elapsedTime : '<1';

    const text = document.createTextNode(`${sessionLabel} : ${elapsedTime}min`);
    li.appendChild(text);
    sessionList.appendChild(li);
  }

  function setUpdatedTimers() {
    if(type === 'Work'){
      currentTimeLeftInSession = updatedWorkSessionDuration ? updatedWorkSessionDuration : workSessionDuration;
      workSessionDuration = currentTimeLeftInSession;
    }else {
      currentTimeLeftInSession = updatedBreakSessionDuration ? updatedBreakSessionDuration : breakSessionDuration;
      breakSessionDuration = currentTimeLeftInSession;
    }
  }

  function togglePlayPauseIcon(reset) {
    const playIcon = document.querySelector('#play-icon');
    const pauseIcon = document.querySelector('#pause-icon');
    if(reset){
      if(playIcon.classList.contains('hidden')){
        playIcon.classList.remove('hidden');
      }
      if(!pauseIcon.classList.contains('hidden')){
        pauseIcon.classList.add('hidden');
      }

    }else{
      playIcon.classList.toggle('hidden');
      pauseIcon.classList.toggle('hidden');
    }
  }

  function showStopIcon() {
    const stopButton = document.querySelector('#pomodoro-stop');
    stopButton.classList.remove('hidden');
  }
  const calculateSessionProgress = () => {
    // calculate the completion rate of this session
    const sessionDuration =
      type === 'Work' ? workSessionDuration : breakSessionDuration;
    return (timeSpentInCurrentSession / sessionDuration) * 1;
  }


}
