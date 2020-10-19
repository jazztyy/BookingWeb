// 房間
const roomAPI = 'https://challenge.thef2e.com/api/thef2e2019/stage6/room/'
const houseAPI = 'https://challenge.thef2e.com/api/thef2e2019/stage6/rooms'
const rooms = document.querySelector('.index main')
const roomPhoto = document.querySelector('.room__booking')
const bookingNow = document.querySelector('.room__booking--active')
const closeForm = document.querySelector('.CloseForm')
const checkInAndOutDate = document.querySelector('.booking__form')
const sendBookingData = document.querySelector('.booking__form__client--send')
const imgPoint = document.querySelector('.background')
const closePhoto = document.querySelector('.closePhoto')
const roomImg = document.querySelector('.roomImg')

// 日曆
const MonthList = document.querySelector('.calendar')
const thisMonthTitle = document.querySelector('.thisMonth span')
const nextMonthTitle = document.querySelector('.nextMonth span')
const singleMonthTitle = document.querySelector('.singleMonth span')
const thisMonthDays = document.querySelectorAll('.thisMonthDay')
const nextMonthDays = document.querySelectorAll('.nextMonthDay')
const singleMonthDays = document.querySelectorAll('.singleMonthDay')
const singleMonth = document.querySelector('.single__month')
const today = new Date().getDate()
const currentMonth = new Date().getMonth()
const thisYear = new Date().getFullYear()
const LastOrderDay = new Date(thisYear, currentMonth, today + 90)
const dateObj = (function () {
  let thisDay = new Date()
  return {
    getDate: function () {
      return thisDay
    },
    setDate: function (date) {
      thisDay = date
    }
  }
})()

let bookingDate = []
let pickFunctionRepeatTimes = 0
let ImgNumber = 1
let RoomImgNumber = 1
let innerRoomImgNumber = 1

  console.log(window.location.href);
  initIndex(houseAPI)
  changeIndexImg()
  imgPoint.addEventListener('click', changeBackgroundImg)
  // console.log(window.location.href);
  // const roomID = window.location.href.split('?')[1]
  // getRoomData(roomAPI + roomID)
  // roomImg.addEventListener('click', showInnerRoomPhoto)
  // roomPhoto.addEventListener('click', showRoomPhoto)
  // sendBookingData.addEventListener('click', sendBookingInfo)
  // closeForm.addEventListener('click', judgeBookingRoomForm)
  // bookingNow.addEventListener('click', judgeBookingRoomForm)
  // closePhoto.addEventListener('click', judgeBookingRoomForm)
  // checkInAndOutDate.addEventListener('click', judgeBookingRoomCalendar)
  // MonthList.addEventListener('click', judgeCalendarEvent)
  // singleMonth.addEventListener('click', judgeCalendarEvent)
  // changeRoomImg()
  // initCalendar()
  // initToday()

// 初始化

function initIndex (url) {
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer 9D5Mw3Qs8gBXQZ8tHxIIUOcdvK8SCicmUsaKDpvHrV68CgpXJQqo3rUyXUZl'
    }
  }).then((response) => {
    return response.json()
  }).then((data) => {
    const str = []
    for (let i = 0; i < data.items.length; i++) {
      const Id = data.items[i].id
      const roomImg = data.items[i].imageUrl
      const roomName = data.items[i].name
      str.push(showIndexRoomList(roomImg, roomName, Id))
    }
    rooms.innerHTML = str.join('')
  }).catch((err) => {
    console.log(err)
  })
}

function initRoom (data) {
  const room = data.room[0]
  const descriptionShort = room.descriptionShort
  const checkInAndOut = room.checkInAndOut
  const amenities = room.amenities
  const name = room.name
  const img = room.imageUrl
  const description = room.description.split('.')
  const normalDayPrice = room.normalDayPrice
  const holidayPrice = room.holidayPrice
  const footage = descriptionShort.Footage
  const bath = descriptionShort['Private-Bath']
  const maxPerson = descriptionShort.GuestMax
  const minPerson = descriptionShort.GuestMin
  const checkEarly = checkInAndOut.checkInEarly
  const checkLate = checkInAndOut.checkInLate
  const checkOut = checkInAndOut.checkOut

  showRoomDescription(name, minPerson, maxPerson, bath, footage, normalDayPrice, holidayPrice, checkEarly, checkLate, checkOut, description)
  const roomFacility = document.querySelector('.room__introduce__facility')
  const bookingFormFacility = document.querySelector('.booking__form__roomInfo__facility')
  showRoomAmenities(amenities, roomFacility, bookingFormFacility)
  showRoomImg(img)
}

function initCalendar () {
  const Month = dateObj.getDate().getMonth() + 1
  const Year = dateObj.getDate().getFullYear()
  const daysLegth = document.querySelectorAll('.nextMonthDay').length
  const monthList = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  }
  showCalendarTitle(Month, Year, monthList)
  // 找出當月第一天當基準點
  const firstDay = new Date(Year, Month - 1, 1)
  const nextDay = new Date(Year, Month, 1)
  for (let i = 0; i < daysLegth; i++) {
    // 利用JS會自動換算月份跟日期的特性，利用i扣除當月第一天的星期數，即可找出日曆中第一格的日期
    const thisMonthPage = new Date(Year, Month - 1, i + 1 - firstDay.getDay())
    const nextMonthPage = new Date(Year, Month, i + 1 - nextDay.getDay())
    const thisMonthStr = getDateStr(thisMonthPage)
    const nextMonthStr = getDateStr(nextMonthPage)
    const atLatestOrderDayStr = getDateStr(LastOrderDay)
    const todayStr = getDateStr(new Date())
    const MonthArr = [thisMonthDays, singleMonthDays, nextMonthDays]

    // 使超過預約期限或在當天之前的日期加上刪除線
    if (thisMonthStr > atLatestOrderDayStr || thisMonthStr <= todayStr) {
      for (let n = 0; n < 2; n++) {
        MonthArr[n][i].classList.add('before__thisDay')
        MonthArr[n][i].classList.remove('currentDay')
      }
    } else {
      for (let n = 0; n < 2; n++) {
        MonthArr[n][i].classList.remove('before__thisDay')
        MonthArr[n][i].classList.add('currentDay')
      }
    }

    if (nextMonthStr > atLatestOrderDayStr || nextMonthStr <= todayStr) {
      MonthArr[2][i].classList.add('before__thisDay')
      MonthArr[2][i].classList.remove('currentDay')
    } else {
      MonthArr[2][i].classList.remove('before__thisDay')
      MonthArr[2][i].classList.add('currentDay')
    }

    // 去除不是當月的日子，並在當月日子加上日期data
    if (thisMonthPage.getMonth() !== firstDay.getMonth()) {
      for (let n = 0; n < 2; n++) {
        MonthArr[n][i].textContent = ''
        MonthArr[n][i].setAttribute('data-date', '')
        MonthArr[n][i].classList.remove('currentDay')
      }
    } else {
      for (let n = 0; n < 2; n++) {
        MonthArr[n][i].textContent = thisMonthPage.getDate()
        MonthArr[n][i].setAttribute('data-date', thisMonthStr)
        MonthArr[n][i].setAttribute('data-day', thisMonthPage.getDay())
      }
    }

    if (nextMonthPage.getMonth() !== nextDay.getMonth()) {
      MonthArr[2][i].textContent = ''
      MonthArr[2][i].setAttribute('data-date', '')
      MonthArr[2][i].classList.remove('currentDay')
    } else {
      MonthArr[2][i].textContent = nextMonthPage.getDate()
      MonthArr[2][i].setAttribute('data-date', nextMonthStr)
      MonthArr[2][i].setAttribute('data-day', nextMonthPage.getDay())
    }
  }
}

function initToday () {
  const thisyear = new Date().getFullYear()
  const thismonth = new Date().getMonth()
  const thisday = new Date().getDate()
  const afterNextDay = getDateStr(new Date(thisyear, thismonth, thisday + 2))
  const nextDay = getDateStr(new Date(thisyear, thismonth, thisday + 1))
  const currentDay = document.querySelectorAll('.currentDay')
  currentDay.forEach(element => {
    const day = element.dataset.date
    if (day === nextDay) {
      element.classList.add('firstPick')
      bookingDate.push(nextDay)
    }
    if (day === afterNextDay) {
      element.classList.add('lastPick')
      bookingDate.push(afterNextDay)
    }
    pickFunctionRepeatTimes = 2
  })
}

// 拿/送數據

function getRoomData (url) {
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer 9D5Mw3Qs8gBXQZ8tHxIIUOcdvK8SCicmUsaKDpvHrV68CgpXJQqo3rUyXUZl'
    }
  }).then((response) => {
    return response.json()
  }).then((data) => {
    showBookingDate(data)
    return initRoom(data)
  })
}

function sendBookingInfo () {
  let date = []
  const pickday = document.querySelectorAll('.pick')
  const firstpick = document.querySelector('.single__month .firstPick') || document.querySelector('.nextMonthDayList .firstPick')
  const lastpick = document.querySelector('.single__month .lastPick') || document.querySelector('.nextMonthDayList .lastPick')
  const name = document.querySelector('.Name').value
  const tel = document.querySelector('.Tel').value
  const firstday = changeDateStr(firstpick.dataset.date)
  const lastday = changeDateStr(lastpick.dataset.date)
  if (judgeBookingInfo(name, tel) === false) {
    return
  }
  date.push(firstday)
  if (pickday.length !== 0) {
    pickday.forEach(element => {
      const day = changeDateStr(element.dataset.date)
      date.push(day)
    })
  }
  date.push(lastday)
  date = Array.from(new Set(date))
  const data = {
    name: name,
    tel: tel,
    date: date
  }

  const roomID = window.location.href.split('?')[1]
  const url = roomAPI + roomID
  fetch(url, {
    method: 'post',
    headers: {
      Authorization: 'Bearer 9D5Mw3Qs8gBXQZ8tHxIIUOcdvK8SCicmUsaKDpvHrV68CgpXJQqo3rUyXUZl',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(res => {
    return res.json()
  }).then(res => {
    showBookingDate(res)
  }).catch(err => {
    console.log(err)
  })
}

// 顯示畫面

function showIndexRoomList (Imgurl, roomName, Id) {
  return `<a href="http://127.0.0.1:5500/%E5%88%87%E7%89%88%E7%B7%B4%E7%BF%92/%E6%97%85%E9%A4%A8%E8%A8%82%E6%88%BF/room.html?${Id}" class="room" style="background-image: url(${Imgurl});" data-text="${roomName}"></a>`
}

function showRoomImg (img) {
  const linear = 'linear-gradient(0deg, rgba(255, 255, 255, 0.8)5%, rgba(255, 255, 255, 0.1)70%),'
  const first = document.querySelector('.first')
  const second = document.querySelector('.second')
  const third = document.querySelector('.third')
  const innerFirst = document.querySelector('.innerFirst')
  const innerSecond = document.querySelector('.innerSecond')
  const innerThird = document.querySelector('.innerThird')

  innerFirst.style.backgroundImage = `url(${img[0]})`
  innerSecond.style.backgroundImage = `url(${img[1]})`
  innerThird.style.backgroundImage = `url(${img[2]})`

  first.style.backgroundImage = `${linear}url(${img[0]})`
  second.style.backgroundImage = `${linear}url(${img[1]})`
  third.style.backgroundImage = `${linear}url(${img[2]})`
}

function checkInAndOutDay (e) {
  const length = e.target.classList.length
  const firstpick = ''
  for (let i = 0; i < length; i++) {
    if (e.target.classList[i] == 'CheckIn' && pickFunctionRepeatTimes == 1) {
      const checkindate = document.querySelector('.CheckInDate')
      const firstPickDay = document.querySelector('.thisMonthDayList .firstPick').dataset.date
      singleMonth.classList.add('disappear')
      const checkinday = firstPickDay.substring(0, 4) + '-' + firstPickDay.substring(4, 6) + '-' + firstPickDay.substring(6, 8)
      checkindate.value = checkinday
    } else if (e.target.classList[i] == 'CheckOut' && pickFunctionRepeatTimes == 2) {
      const firstPickDay = bookingDate[0]
      const lastPickDay = document.querySelector('.thisMonthDayList .lastPick').dataset.date
      const checkoutdate = document.querySelector('.CheckOutDate')
      const checkindate = document.querySelector('.CheckInDate')
      if (firstPickDay < lastPickDay) {
        const checkinday = firstPickDay.substring(0, 4) + '-' + firstPickDay.substring(4, 6) + '-' + firstPickDay.substring(6, 8)
        checkindate.value = checkinday
      }
      singleMonth.classList.add('disappear')
      const checkoutday = lastPickDay.substring(0, 4) + '-' + lastPickDay.substring(4, 6) + '-' + lastPickDay.substring(6, 8)
      checkoutdate.value = checkoutday
    }
  }
}

function showCalendarTitle (thisMonth, thisYear, monthList) {
  const today = `${monthList[thisMonth]} ${thisYear}`
  const nextday = `${monthList[thisMonth + 1]} ${thisYear}`
  singleMonthTitle.textContent = today
  thisMonthTitle.textContent = today
  nextMonthTitle.textContent = nextday
}

function showOrderNightAndPrice (calcDateDiff, firstPickDay) {
  let holiday = 0
  let normalday = 0
  for (i = 0; i < calcDateDiff; i++) {
    const firstPick = new Date(firstPickDay.substring(0, 4), firstPickDay.substring(4, 6) - 1, Number(firstPickDay.substring(6, 8)) + i).getDay()
    firstPick == 0 || firstPick == 6 || firstPick == 5 ? holiday++ : normalday++
  }
  const normalDayPrice = document.querySelector('.room__booking__price').dataset.normldayprice
  const holidayPrice = document.querySelector('.room__booking__price').dataset.holidayprice
  const price = String(holiday * holidayPrice + normalday * normalDayPrice).replace(/(?=(\B\d{3})+(?!\d))/g, ',')

  const bookingPrice = document.querySelector('.room__booking__price')
  const totalDayAndNight = document.querySelector('.TotalDayAndNight')
  const totalPrice = document.querySelector('.booking__form__client__bill')
  totalPrice.innerHTML = `<p>總計</p><span>$${price}</span>`
  if (holiday == 0) {
    bookingPrice.innerHTML = `<span>$${price} </span> <p>${normalday + holiday}晚(平日)</p>`
    totalDayAndNight.textContent = ` ${normalday + holiday + 1}天，${normalday + holiday}晚(平日)`
  } else if (normalday == 0) {
    bookingPrice.innerHTML = `<span>$${price} </span> <p> ${holiday}晚(假日)</p>`
    totalDayAndNight.textContent = ` ${normalday + holiday + 1}天，${holiday}晚(假日)`
  } else {
    bookingPrice.innerHTML = `<span>$${price} </span> <p>${normalday}晚(平日) ${holiday}晚(假日)</p>`
    totalDayAndNight.textContent = ` ${normalday + holiday + 1}天，${normalday}晚(平日)，${holiday}晚(假日)`
  }
}

function showNextMonth () {
  const thisDay = dateObj.getDate()
  dateObj.setDate(new Date(thisDay.getFullYear(), thisDay.getMonth() + 1, 1))
  resetDayStyle()
  initCalendar()
  resetSingleDay()
  showBookingDay(bookingDate)
}

function showPrevMonth () {
  const thisDay = dateObj.getDate()
  dateObj.setDate(new Date(thisDay.getFullYear(), thisDay.getMonth() - 1, 1))
  resetDayStyle()
  initCalendar()
  resetSingleDay()
  showBookingDay(bookingDate)
}

// 日期相關

function showBookingDate (res) {
  const currentDay = document.querySelectorAll('.currentDay')
  const booking = res.booking
  if (booking == []) {
    return
  }
  const dateArr = []
  for (let i = 0; i < booking.length; i++) {
    dateArr.push(booking[i].date)
  }
  currentDay.forEach(element => {
    for (let i = 0; i < dateArr.length; i++) {
      if (element.dataset.date == dateArr[i].replace(/-/g, '')) {
        element.classList.add('before__thisDay')
        element.classList.remove('currentDay')
        element.classList.remove('firstPick')
        element.classList.remove('lastPick')
        element.classList.remove('pick')
      }
    }
  })
}

function showCheckInAndOutDay () {
  if (pickFunctionRepeatTimes == 0 || pickFunctionRepeatTimes == 1) {
    return
  }
  const checkindate = document.querySelector('.CheckInDate')
  const checkoutdate = document.querySelector('.CheckOutDate')
  const length = bookingDate.length
  const firstPickDay = bookingDate[0]
  const lastPickDay = bookingDate[length - 1]
  checkindate.value = changeDateStr(firstPickDay)
  checkoutdate.value = changeDateStr(lastPickDay)
}

// 房間內部細節

function showRoomDescription (name, minPerson, maxPerson, bath, footage, normalDayPrice, holidayPrice, checkEarly, checkLate, checkOut, description) {
  const now = document.querySelector('.firstPick')
  const totalday = document.querySelector('.TotalDayAndNight')
  const totalprice = document.querySelector('.booking__form__client__bill')
  const roomInfo = document.querySelector('.room__introduce')
  const roomName = document.querySelector('.RoomName')
  const roomBookingPrice = document.querySelector('.room__booking__price')
  const checkTime = document.querySelector('.CheckInAndOut')
  const bookingForm = document.querySelector('.BookingForm')
  const roomNormalPrice = String(normalDayPrice).replace(/(?=(\B\d{3})+(?!\d))/g, ',')
  const roomHolidayPrice = String(holidayPrice).replace(/(?=(\B\d{3})+(?!\d))/g, ',')
  const arr = []
  description.forEach(element => {
    arr.push(`<li>${element}</li>`)
  })

  let price = ''
  if (now.dataset.day == 6 || now.dataset.dat == 0) {
    price = `<span>$${roomHolidayPrice} </span> <p> 1晚(假日)</p>`
    totalprice.innerHTML = `<p>總計</p><span>$${roomHolidayPrice}</span>`
    totalday.textContent = '2天，1晚(假日)'
  } else {
    price = `<span>$${roomNormalPrice} </span> <p> 1晚(平日)</p>`
    totalprice.innerHTML = `<p>總計</p><span>$${roomNormalPrice}</span>`
    totalday.textContent = '2天，1晚(平日)'
  }

  const total = arr.join('')
  const checktime = `
                <ul>
                    <li>・入住時間：最早 ${checkEarly}，最晚 ${checkLate}；退房時間：${checkOut}，請自行確認行程安排。</li>
                    <li>・平日定義週一至週四；假日定義週五至週日及國定假日。</li>
                    <li>・好室旅店全面禁止吸菸。</li>
                    <li>・若您有任何問題，歡迎撥打 03-8321155 ( 服務時間
                    週一至週六 10:00 - 18:00 )。</li>
                </ul>`
  const roomname = `${name}`
  const form = `
                <span>${minPerson + '-' + maxPerson}人・ 單人床・附早餐・ 衛浴${bath}間・${footage}平方公尺</span>
                <p>平日（一～四）價格：${normalDayPrice} / 假日（五〜日）價格：${holidayPrice}</p>
                <div class="booking__form__roomInfo__facility"></div>`
  const str = `
            <h2>${name}</h2>
            <span>${minPerson + '-' + maxPerson}人・ 單人床・ 附早餐・衛浴${bath}間・${footage}平方公尺</span>
                <ul class="room__introduce__time">
                    <li>平日（一～四）價格：${normalDayPrice} / 假日（五〜日）價格：${holidayPrice}</li>
                    <li>入住時間：${checkEarly}（最早）/ ${checkLate}（最晚）</li>
                    <li>退房時間：${checkOut}</li>
                </ul>
                <ul class="room__introduce__text">
                ${total}
                </ul>
                <div class="room__introduce__facility"></div>
            `

  roomInfo.innerHTML = str
  roomBookingPrice.innerHTML = price
  roomBookingPrice.setAttribute('data-normlDayPrice', `${normalDayPrice}`)
  roomBookingPrice.setAttribute('data-holiDayPrice', `${holidayPrice}`)
  bookingForm.innerHTML = form
  roomName.innerHTML = roomname
  checkTime.innerHTML = checktime
}

function showRoomAmenities (amenities, roomFacility, bookingFormFacility) {
  const arr = []
  const obj = {
    'Wi-Fi': 'Wi-Fi',
    Breakfast: '早餐',
    'Mini-Bar': 'Mini-Bar',
    'Room-Service': 'Room-Service',
    Television: '電話',
    'Air-Conditioner': '冷氣',
    Refrigerator: '冰箱',
    Sofa: '沙發',
    'Great-View': '好風景',
    'Smoke-Free': '全面禁菸',
    'Child-Friendly': '適合兒童',
    'Pet-Friendly': '攜帶寵物'
  }
  const haveArr = []
  Object.keys(amenities).forEach(element => {
    if (amenities[element]) {
      const ok = `
            <div>
                <img src="/切版練習/旅館訂房/img/${element}.svg" alt="">
                <img src="/切版練習/旅館訂房/img/ok.svg" alt="" class="room__indroduce__facility__status">
                <span>${obj[element]}</span>
            </div>`
      const have = `
                    <div>
                        <img src="/切版練習/旅館訂房/img/${element}.svg" alt="">
                        <span>${obj[element]}</span>
                    </div>`
      arr.push(ok)
      haveArr.push(have)
    } else {
      const not = `
            <div class="not">
                <img src="/切版練習/旅館訂房/img/${element}.svg" alt="">
                <img src="/切版練習/旅館訂房/img/not.svg" alt="" class="room__indroduce__facility__status">
                <span>${obj[element]}</span>
            </div>`
      arr.push(not)
    }
  })
  roomFacility.innerHTML = arr.join('')
  bookingFormFacility.innerHTML = haveArr.join('')
}

// 輪播圖片

function showIndexImg () {
  const imgNum = 4
  const backgroundImg = document.querySelectorAll('.index>img')
  const circle = document.querySelectorAll('.background>label')

  circle.forEach(element => {
    element.style.backgroundColor = ''
    if (ImgNumber == element.dataset.num) {
      element.style.backgroundColor = 'white'
    };
  })

  backgroundImg.forEach(element => {
    element.classList.add('disappear')
    if (ImgNumber == element.dataset.num) {
      element.classList.remove('disappear')
    };
  })
  if (ImgNumber < imgNum) {
    ImgNumber++
  } else {
    ImgNumber = 1
  }
}

function showRoomPhoto (e) {
  const num = Number(e.target.dataset.num)
  const mask = document.querySelector('.mask')
  const roomImg = document.querySelector('.roomImg')
  if (e.target.nodeName === 'DIV') {
    mask.classList.remove('disappear')
    roomImg.classList.remove('disappear')
    changeInnerRoomPhoto(num)
  } else {

  }
}

function showInnerRoomPhoto (e) {
  switch (e.target.classList[0]) {
    case 'prevImg':
      innerRoomImgNumber--
      break
    case 'nextImg':
      innerRoomImgNumber++
      break
  }
  if (innerRoomImgNumber > 3) {
    innerRoomImgNumber = 1
  } else if (innerRoomImgNumber < 1) {
    innerRoomImgNumber = 3
  }
  changeInnerRoomPhoto(innerRoomImgNumber)
}

// 事件判斷

function judgeBookingInfo (name, tel) {
  const nameError = document.querySelector('.NameError')
  const telError = document.querySelector('.TelError')
  const NameTest = /(^[\u4e00-\u9fa5]+$)|(^([a-zA-Z]+\s)*[a-zA-Z]+$)/
  const phoneTest = /^09+\d{8}$/

  if (NameTest.test(name) !== true || name == '') {
    nameError.textContent = '姓名格式錯誤'
    if (phoneTest.test(tel) !== true || tel == '') {
      telError.textContent = '電話格式錯誤'
      return false
    } else {
      telError.textContent = ''
      return true
    }
  } else if (NameTest.test(name) == true) {
    nameError.textContent = ''
    if (phoneTest.test(tel) !== true || tel == '') {
      telError.textContent = '電話格式錯誤'
      return false
    } else {
      telError.textContent = ''
      return true
    }
  }
}

function judgeBookingRoomCalendar (e) {
  const calendar = document.querySelector('.single__month')
  const singleday = document.querySelectorAll('.singleMonthDay')
  if (e.target.classList == 'CheckInDate') {
    calendar.setAttribute('class', 'single__month')
    calendar.classList.add('CheckIn')
    singleday.forEach(element => {
      const length = element.classList.length
      for (i = 0; i < length; i++) {
        if (element.classList[i] == 'currentDay') {
          for (n = 0; n < length; n++) {
            if (element.classList[n] == 'CheckOut') {
              element.classList.add('CheckIn')
              element.classList.remove('CheckOut')
            } else {
              element.classList.add('CheckIn')
            }
          }
        }
      }
    })
  } else if (e.target.classList == 'CheckOutDate') {
    calendar.setAttribute('class', 'single__month')
    calendar.classList.add('CheckOut')
    calendar.classList.add('checkOutDate')
    singleday.forEach(element => {
      const length = element.classList.length
      for (i = 0; i < length; i++) {
        if (element.classList[i] == 'currentDay') {
          for (n = 0; n < length; n++) {
            if (element.classList[n] == 'CheckIn') {
              element.classList.remove('CheckIn')
              element.classList.add('CheckOut')
            } else {
              element.classList.add('CheckOut')
            }
          }
        }
      }
    })
  } else {
    calendar.classList.add('disappear')
  }
}

function judgeBookingRoomForm () {
  const bookingForm = document.querySelector('.booking__form')
  const mask = document.querySelector('.mask')
  const roomImg = document.querySelector('.roomImg')
  if (mask.classList[1] == 'disappear') {
    mask.classList.remove('disappear')
    bookingForm.classList.remove('disappear')
    showCheckInAndOutDay()
  } else {
    mask.classList.add('disappear')
    bookingForm.classList.add('disappear')
    roomImg.classList.add('disappear')
  }
}

function judgeCalendarEvent (e) {
  if (e.target.classList[1] == 'currentDay') {
    selectDayRange(e)
    pickFunctionRepeatTimes++
    if (e.target.classList[0] == 'singleMonthDay') {
      checkInAndOutDay(e)
    }
  } else if (e.target.classList == 'prev__month') {
    showPrevMonth()
  } else if (e.target.classList == 'next__month') {
    showNextMonth()
  }
}

// 工具類

function changeDateStr (date) {
  const day = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)
  return day
}

function changeIndexImg () {
  setInterval(showIndexImg, 3000)
}

function changeRoomImg () {
  setInterval(changeRoomPhoto, 3000)
}

function changeBackgroundImg (e) {
  if (e.target.dataset.num !== '') {
    ImgNumber = e.target.dataset.num
    showIndexImg()
  }
}

function changeRoomPhoto () {
  const imgNum = 3
  const backgroundImg = document.querySelectorAll('.room__booking>div')
  const circle = document.querySelectorAll('.room__booking>label')
  circle.forEach(element => {
    element.style.backgroundColor = ''
    if (RoomImgNumber == element.dataset.num) {
      element.style.backgroundColor = 'black'
    };
  })
  backgroundImg.forEach(element => {
    if (element.classList == 'room__booking__price') {
      return
    }
    element.classList.add('disappear')
    if (RoomImgNumber == element.dataset.num) {
      element.classList.remove('disappear')
    };
  })
  if (RoomImgNumber < imgNum) {
    RoomImgNumber++
  } else {
    RoomImgNumber = 1
  }
}

function changeInnerRoomPhoto (photoNum) {
  const innerFirst = document.querySelector('.innerFirst')
  const innerSecond = document.querySelector('.innerSecond')
  const innerThird = document.querySelector('.innerThird')
  innerFirst.classList.add('disappear')
  innerSecond.classList.add('disappear')
  innerThird.classList.add('disappear')
  switch (photoNum) {
    case 1:
      innerFirst.classList.remove('disappear')
      innerRoomImgNumber = 1
      break
    case 2:
      innerSecond.classList.remove('disappear')
      innerRoomImgNumber = 2
      break
    case 3:
      innerThird.classList.remove('disappear')
      innerRoomImgNumber = 3
      break
  }
}

function calcDayDiff (firstPickDay, lastPickDay) {
  const firstPick = new Date(firstPickDay.substring(0, 4), firstPickDay.substring(4, 6) - 1, firstPickDay.substring(6, 8))
  const lastPick = new Date(lastPickDay.substring(0, 4), lastPickDay.substring(4, 6) - 1, lastPickDay.substring(6, 8))
  dayDiff = (Math.abs(firstPick - lastPick) / 86400 / 1000)
  return dayDiff
}

function changeDayStyle (firstPickDay, calcDateDiff, lastPickDay) {
  const firstPickDayStr = getDateStr(new Date(firstPickDay.substring(0, 4), firstPickDay.substring(4, 6) - 1, Number(firstPickDay.substring(6, 8))))
  const lastPickDayStr = getDateStr(new Date(lastPickDay.substring(0, 4), lastPickDay.substring(4, 6) - 1, Number(lastPickDay.substring(6, 8))))
  const currentDay = document.querySelectorAll('.currentDay')
  for (i = 1; i < calcDateDiff; i++) {
    const firstPickStr = getDateStr(new Date(firstPickDay.substring(0, 4), firstPickDay.substring(4, 6) - 1, Number(firstPickDay.substring(6, 8)) + i))
    currentDay.forEach(element => {
      if (firstPickStr == element.dataset.date) {
        bookingDate.push(element.dataset.date)
        element.classList.add('pick')
        if (element.dataset.day == 6) {
          element.classList.add('leftPickCircle')
        } else if (element.dataset.day == 0) {
          element.classList.add('rightPickCircle')
        }
      }
    })
  }
  currentDay.forEach(element => {
    if (firstPickDayStr == element.dataset.date) {
      element.classList.add('firstPick')
    } else if (lastPickDayStr == element.dataset.date) {
      element.classList.add('lastPick')
    }
  })
  showOrderNightAndPrice(calcDateDiff, firstPickDay)
}

function getDateStr (date) {
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  // 把個位數的日期或月份加上零，使不同月份及天數出來的字串位數相同
  month = (month > 9) ? ('' + month) : ('0' + month)
  day = (day > 9) ? ('' + day) : ('0' + day)
  return year + month + day
}

function resetSingleDay () {
  if (singleMonth.classList[1] == 'CheckIn') {
    singleMonthDays.forEach(element => {
      element.classList.add('CheckIn')
    })
  } else {
    singleMonthDays.forEach(element => {
      element.classList.add('CheckOut')
    })
  }
}

function resetDayStyle () {
  thisMonthDays.forEach(element => {
    element.setAttribute('class', 'thisMonthDay')
  })
  nextMonthDays.forEach(element => {
    element.setAttribute('class', 'nextMonthDay')
  })
  singleMonthDays.forEach(element => {
    element.setAttribute('class', 'singleMonthDay')
  })
  if (bookingDate != []) {
    pickFunctionRepeatTimes = 1
  } else {
    pickFunctionRepeatTimes = 0
  }
}

function selectDayRange (e) {
  const first = document.querySelectorAll('.firstPick')
  const last = document.querySelectorAll('.lastPick')
  const right = document.querySelectorAll('.rightPickCircle')
  const left = document.querySelectorAll('.leftPickCircle')
  const pick = document.querySelectorAll('.pick')
  switch (pickFunctionRepeatTimes) {
    case 1:
      bookingDate.push(firstPickDay)
      const lastPickDay = e.target.dataset.date
      const dayDiff = calcDayDiff(firstPickDay, lastPickDay)
      if (firstPickDay <= lastPickDay) {
        changeDayStyle(firstPickDay, dayDiff, lastPickDay)
        bookingDate.push(lastPickDay)
        e.target.classList.add('lastPick')
      } else if (firstPickDay > lastPickDay) {
        bookingDate.shift()
        bookingDate.push(lastPickDay)
        changeDayStyle(lastPickDay, dayDiff, lastPickDay)
        bookingDate.push(firstPickDay)
        first.forEach(element => {
          element.classList.remove('firstPick')
          element.classList.add('lastPick')
        })
        e.target.classList.add('firstPick')
      }
      break
    case 2:
      first.forEach(element => {
        element.classList.remove('firstPick')
      })
      last.forEach(element => {
        element.classList.remove('lastPick')
      })
      pick.forEach(element => {
        element.classList.remove('pick')
      })
      right.forEach(element => {
        element.classList.remove('rightPickCircle')
      })
      left.forEach(element => {
        element.classList.remove('leftPickCircle')
      })
      pickFunctionRepeatTimes = 0
      bookingDate = []
      firstPickDay = e.target.dataset.date
      e.target.classList.add('firstPick')
      break
  }
}

function showBookingDay (bookingDate) {
  const currentdate = document.querySelectorAll('.currentDay')
  const bookingDay = Array.from(new Set(bookingDate))
  const length = bookingDay.length
  const firstday = bookingDay[0]
  const lastday = bookingDay[length - 1]

  currentdate.forEach(element => {
    if (firstday == element.dataset.date) {
      element.classList.add('firstPick')
    } else if (lastday == element.dataset.date) {
      element.classList.add('lastPick')
    } else if (firstday < element.dataset.date && lastday > element.dataset.date) {
      element.classList.add('pick')
      pickFunctionRepeatTimes = 2
      if (element.dataset.day == '0') {
        element.classList.add('rightPickCircle')
      } else if (element.dataset.day == '6') {
        element.classList.add('leftPickCircle')
      }
    }
  })
}
