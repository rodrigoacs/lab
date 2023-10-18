const previousDate = document.getElementById("previousDate")
const nextDate = document.getElementById("nextDate")
const currentDate = document.getElementById("currentDate")
const addActivityButton = document.getElementById("add")
const calculateButton = document.getElementById("calculate")
const result = document.getElementById("result")

let current = new Date()
let lastTotalTime = 0

currentDate.innerText = getFormattedDate(current)

previousDate.addEventListener("click", () => changeDate(-1))
nextDate.addEventListener("click", () => changeDate(1))
addActivityButton.addEventListener("click", addActivity)

setInterval(calculateTotal, 500)

function changeDate(days) {
  current.setDate(current.getDate() + days)
  currentDate.innerText = getFormattedDate(current)
}

function getFormattedDate(date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

function getTaskTotal(initial, final) {
  const today = new Date()
  initial = parseTime(today, initial)
  final = parseTime(today, final)
  return (final - initial) / 60000
}

function parseTime(date, time) {
  const [hours, minutes] = time.split(":")
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes).getTime()
}

function calculateTotal() {
  const intervals = document.querySelectorAll(".interval")
  let totalTime = 0

  for (const interval of intervals) {
    const initial = interval.children[1].value
    const final = interval.children[2].value
    const total = interval.children[4]

    if (initial && final) {
      const taskTime = getTaskTotal(initial, final)
      totalTime += taskTime
      const formattedTime = formatTime(taskTime)
      const formattedHours = formattedTime[0].toString().padStart(2, '0')
      const formattedMinutes = formattedTime[1].toString().padStart(2, '0')
      total.value = `${formattedHours}:${formattedMinutes}`
    }
  }

  if (totalTime === lastTotalTime) {
    return
  }

  lastTotalTime = totalTime

  const totalFormattedTime = formatTime(totalTime)
  console.log(totalFormattedTime)
  if (totalFormattedTime[0] < 0 || totalFormattedTime[1] < 0) {
    addActivityButton.disabled = true
    return result.innerText = "horas inválidas"
  } else {
    addActivityButton.disabled = false
  }

  const formattedHours = totalFormattedTime[0].toString().padStart(2, '0')
  const formattedMinutes = totalFormattedTime[1].toString().padStart(2, '0')

  result.innerText = `${formattedHours}:${formattedMinutes}`
}


function formatTime(time) {
  const hours = parseInt(time / 60)
  const minutes = time - hours * 60
  return [hours, minutes]
}

function addActivity() {
  const task = document.createElement("div")
  task.classList.add("interval")

  const startTime = createInputElement("time")
  const endTime = createInputElement("time")
  const description = createInputElement("text")
  const totalTime = createInputElement("time", true)
  const deleteButton = document.createElement("button")
  deleteButton.innerText = "✖"
  deleteButton.classList.add("delete")
  deleteButton.addEventListener("click", () => task.remove())

  task.appendChild(deleteButton)
  task.appendChild(startTime)
  task.appendChild(endTime)
  task.appendChild(description)
  task.appendChild(totalTime)

  document.body.appendChild(task)
}

function createInputElement(type, readOnly = false) {
  const input = document.createElement("input")
  input.type = type
  if (readOnly) input.readOnly = true
  return input
}