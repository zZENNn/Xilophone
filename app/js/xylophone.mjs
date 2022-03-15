let root;
const KEYS_TO_NOTES = {};

export function init(rootElement) {
  root = rootElement;
}
//добавляем обработчик нажатия клавиш клавиатуры
document.addEventListener('keypress',onKeyPress)

//выбираем все бруски ксилофона и вешаем на каждый по обработчику наведения указателя мыши и клика
const bars = document.querySelectorAll('#bar') 
bars.forEach(bar => {
  bar.addEventListener('mouseenter',onBarMouseOver);
  bar.addEventListener('click', onBarClick)
})

/*обработчик наведения указателя мыши на брусок ксилофона*/
function onBarMouseOver(event) {  
    let bar = event.currentTarget;//получаем брусок
    
    
    if(isBar(bar)){//если брусок включён - ударяем по нему(проигрываем звук)
      hitBar(bar)
    }
}

/*обработчик клика по бруску:
  если брусок включён - выключаем
  если отключён - включаем*/
function onBarClick(event) { 
  let bar = event.currentTarget;
  
  isBar(bar)?
  toggleBarDisabledState(bar)
  :
  toggleBarEnabledState(bar)
  
}

//обработчик нажатия клавиш
//сделал через event.code чтобы работало с любой раскладкой,
//а не только с английской
function onKeyPress(event) {
  
  let note
  let keyCode = event.code
  //буквенные клавиши начинаются на Key
  if(keyCode.substring(0,3)==="Key"){
    note = keyCode[3].toUpperCase()
    //отбираем нужные клавиши, соотв. нотам
    if(note === 'C'||note === 'D'||note === 'E'||note === 'F'||note === 'G'||note === 'A'||note === 'B'){
      let bar = getBarByNote(note)// получаем брусок
      
      if(isBar(bar)){//если брусок включён - бьём по нему
        hitBar(bar)
      }
    
    }
    
    
  }
  
  
}

//функция отключения бруска
function toggleBarDisabledState(bar) {

  let note = getNoteByBar(bar)
  let style = bar.getAttribute('style')
  
  localStorage.setItem(`${note}`,`${style}`)//сохраняем цвет бруска в localStorage, чтобы вернуть ему прежний вид при включении 
  //устанавливаем стиль disabled для отключённого бруска
  bar.className = "disabled"
  bar.setAttribute('style','')//убираем цвет бруска
  silenceBar(note)//останавливаем звук бруска
  
}

//функция включения бруска
function toggleBarEnabledState(bar){
  let note = getNoteByBar(bar)
  
  
  
  bar.className = "bar"//устанавливаем обычный стиль для включённого бруска
  bar.setAttribute("style",localStorage.getItem(`${note}`))//восстанавливаем цвет бруска из localStorage
  hitBar(bar)//воспроизводим звук бруска
  
}

//функция, которая проверяет состояние бруска(вкл/выкл)
function isBar(element) { 
  let isbar = false;
  if(element.className === "bar"){
    isbar = true
  }
  else{
    isbar = false
  }
  return isbar
}

//функция получения ноты бруска
function getNoteByBar(bar) { 
  let note = bar.getAttribute('data-note')
  //console.log(note)
  return note;
  
}

//функция получения бруска по ноте(нажатой клавише)
function getBarByNote(note) { 
  let bar = document.querySelector(`div[data-note=${note}]`)
  return bar
}

//функция отключения звука бруска
function silenceBar(note) {
  let audio = document.getElementById(`${note}`)
  //console.log(audio)
  audio.pause()
  audio.currentTime = 0.0
}

//функция удара по бруску(воспроизведение звука(ноты) бруска)
function hitBar(bar) {
  let note = getNoteByBar(bar)
    
  let audio = document.getElementById(`${note}`)
  //console.log(audio)
  audio.currentTime = 0.0
  audio.play()
}
