

const ramadanTimings = [
{day:1, sehri:"05:12 AM", iftar:"05:57 PM", date:"2026-02-19"},
{day:2, sehri:"05:11 AM", iftar:"05:58 PM", date:"2026-02-20"},
{day:3, sehri:"05:11 AM", iftar:"05:58 PM", date:"2026-02-21"},
{day:4, sehri:"05:10 AM", iftar:"05:59 PM", date:"2026-02-22"},
{day:5, sehri:"05:09 AM", iftar:"05:59 PM", date:"2026-02-23"},
{day:6, sehri:"05:08 AM", iftar:"06:00 PM", date:"2026-02-24"},
{day:7, sehri:"05:08 AM", iftar:"06:00 PM", date:"2026-02-25"},
{day:8, sehri:"05:07 AM", iftar:"06:01 PM", date:"2026-02-26"},
{day:9, sehri:"05:06 AM", iftar:"06:01 PM", date:"2026-02-27"},
{day:10, sehri:"05:05 AM", iftar:"06:02 PM", date:"2026-02-28"},
{day:11, sehri:"05:04 AM", iftar:"06:02 PM", date:"2026-03-01"},
{day:12, sehri:"05:04 AM", iftar:"06:03 PM", date:"2026-03-02"},
{day:13, sehri:"05:03 AM", iftar:"06:03 PM", date:"2026-03-03"},
{day:14, sehri:"05:02 AM", iftar:"06:04 PM", date:"2026-03-04"},
{day:15, sehri:"05:01 AM", iftar:"06:04 PM", date:"2026-03-05"},
{day:16, sehri:"05:00 AM", iftar:"06:04 PM", date:"2026-03-06"},
{day:17, sehri:"04:59 AM", iftar:"06:05 PM", date:"2026-03-07"},
{day:18, sehri:"04:58 AM", iftar:"06:05 PM", date:"2026-03-08"},
{day:19, sehri:"04:57 AM", iftar:"06:06 PM", date:"2026-03-09"},
{day:20, sehri:"04:56 AM", iftar:"06:06 PM", date:"2026-03-10"},
{day:21, sehri:"04:56 AM", iftar:"06:07 PM", date:"2026-03-11"},
{day:22, sehri:"04:55 AM", iftar:"06:07 PM", date:"2026-03-12"},
{day:23, sehri:"04:54 AM", iftar:"06:08 PM", date:"2026-03-13"},
{day:24, sehri:"04:53 AM", iftar:"06:08 PM", date:"2026-03-14"},
{day:25, sehri:"04:52 AM", iftar:"06:08 PM", date:"2026-03-15"},
{day:26, sehri:"04:51 AM", iftar:"06:09 PM", date:"2026-03-16"},
{day:27, sehri:"04:50 AM", iftar:"06:09 PM", date:"2026-03-17"},
{day:28, sehri:"04:49 AM", iftar:"06:10 PM", date:"2026-03-18"},
{day:29, sehri:"04:48 AM", iftar:"06:10 PM", date:"2026-03-19"},
{day:30, sehri:"04:47 AM", iftar:"06:10 PM", date:"2026-03-20"},
];



const tableBody = document.getElementById("tableBody");

ramadanTimings.forEach(item => {
    tableBody.innerHTML += `
        <tr>
            <td>${item.day}</td>
            <td>${item.date}</td>
            <td>${item.sehri}</td>
            <td>${item.iftar}</td>
        </tr>
    `;
});



const totalDays = 30;

function updateProgress(selectedDay = 0){
    const percentage = (selectedDay / totalDays) * 100;

    document.getElementById("progressFill").style.width = percentage + "%";
    document.getElementById("ramadanDayText").innerText =
        `Day ${selectedDay} of ${totalDays}`;
    document.getElementById("rojaCount").innerText = selectedDay;
    document.getElementById("progressPrediction").innerText =
        `Predicted completion: ${percentage.toFixed(1)}%`;
}



function updateTimes(){
    const selectedDate = document.getElementById("date").value;
    const dayInfo = ramadanTimings.find(d => d.date === selectedDate);

    if(dayInfo){
        document.getElementById("sehri").innerText = dayInfo.sehri;
        document.getElementById("iftar").innerText = dayInfo.iftar;
        updateProgress(dayInfo.day);
        startCountdown(dayInfo.iftar);
    }else{
        document.getElementById("sehri").innerText = "--:--";
        document.getElementById("iftar").innerText = "--:--";
        updateProgress(0);
        document.getElementById("countdown").innerText =
            "Select a date to see countdown";
    }
}


function getDhakaTime() {
    return new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
    );
}



function updateClock(){
    const now = getDhakaTime();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2,'0');
    const seconds = String(now.getSeconds()).padStart(2,'0');

    let ampm = "AM";
    if(hours >= 12) ampm = "PM";

    hours = hours % 12;
    if(hours === 0) hours = 12;

    hours = String(hours).padStart(2,'0');

    document.getElementById("realClock").innerText =
        `${hours}:${minutes}:${seconds} ${ampm} (BD Time)`;
}

setInterval(updateClock, 1000);
updateClock();



let countdownInterval;

function startCountdown(iftarTime){
    clearInterval(countdownInterval);

    countdownInterval = setInterval(()=>{

        const now = getDhakaTime();
        const today = now.toISOString().split('T')[0];

        const [time, modifier] = iftarTime.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if(modifier === "PM" && hours !== 12) hours += 12;
        if(modifier === "AM" && hours === 12) hours = 0;

        const target = new Date(
            `${today}T${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:00`
        );

        const diff = target - now;
        const countdown = document.getElementById("countdown");

        if(diff > 0){
            const h = Math.floor(diff/1000/60/60);
            const m = Math.floor((diff/1000/60)%60);
            const s = Math.floor((diff/1000)%60);

            countdown.innerText = `${h}h ${m}m ${s}s remaining`;
        }else{
            countdown.innerText = "Iftar Time! 🌙";
        }

    }, 1000);
}



const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

for(let i=0;i<300;i++){
    stars.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*1.5,
        d: Math.random()*2
    });
}

function drawStars(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "white";
    ctx.beginPath();

    stars.forEach(s=>{
        ctx.moveTo(s.x, s.y);
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2, true);
    });

    ctx.fill();

    stars.forEach(s=>{
        s.y += s.d*0.2;
        if(s.y > canvas.height) s.y = 0;
    });
}

setInterval(drawStars, 50);



function toggleMode(){
    document.body.classList.toggle("light-mode");
}
