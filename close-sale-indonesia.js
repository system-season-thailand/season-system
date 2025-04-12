const closeSellHotelDataCache={};let hasFetchedCloseSellData=!1;const sheetDataURL="https://script.google.com/macros/s/AKfycbz093QB0fDJvaYMK6ODQAQja2G0S3MAHtDPwJPNfwZPuPmXrXwC0y8mda6G_TOH0NQN/exec",fetchAllCloseSellDataFunction=async()=>{const e=document.querySelectorAll(".all_hotels_names_div_class h3");if(e.forEach((e=>{e.style.opacity="0",e.style.pointerEvents="none",e.style.backgroundColor="white"})),!hasFetchedCloseSellData)try{const e=await fetch(sheetDataURL);(await e.json()).forEach((e=>{const[t,a]=e.split(":"),l=t.split("(")[0].trim(),o=t.split("(")[1]?.replace(")","").trim();closeSellHotelDataCache[l]||(closeSellHotelDataCache[l]=[]),closeSellHotelDataCache[l].push({roomType:o,availability:parseHotelAvailability(a.trim())})})),hasFetchedCloseSellData=!0}catch(e){return void console.error("Error fetching close-sell data:",e)}const t=document.getElementById("whole_package_start_date_input_id").value,a=document.getElementById("whole_package_end_date_input_id").value;if(t&&a){const l=parseArabicDateForCloseSellData(t),o=parseArabicDateForCloseSellData(a);e.forEach((e=>{const t=e.innerText.trim(),a=closeSellHotelDataCache[t];if(a){const t=[];a.forEach((({roomType:e,availability:a})=>{const s=a.filter((e=>e>=l&&e<=o));if(s.length>0){t.some((t=>t.roomType===e))||t.push({roomType:e,dates:s})}})),t.length>0&&(e.style.backgroundColor="red",e.style.opacity="1",e.style.pointerEvents="auto",e.addEventListener("click",(()=>{const e=t.map((({roomType:e,dates:t})=>`${e}: ${formatDateRanges(t)}`));showCloseSellModal(e.join("\n"))})))}}))}e.forEach((e=>{e.style.opacity="1",e.style.pointerEvents="auto"}))},formatDateRanges=e=>{if(!e.length)return"";e.sort(((e,t)=>e-t));const t=[];let a=e[0],l=e[0];for(let o=1;o<e.length;o++){const s=e[o];s-e[o-1]===864e5||(t.push([a,l]),a=s),l=s}return t.push([a,l]),t.map((([e,t])=>{const a=e.getDate(),l=e.toLocaleString("en-US",{month:"short"}),o=t.getDate(),s=t.toLocaleString("en-US",{month:"short"});return l===s?a===o?`${a} ${l}`:`${a}-${o} ${l}`:`${a} ${l} - ${o} ${s}`})).join(", ")},parseHotelAvailability=e=>{const t=/([A-Za-z]+)\s\(([\d,\s\-]*)\)/g,a={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11},l=[];let o;for(;null!==(o=t.exec(e));){const e=o[1],t=o[2],s=a[e];t.split(",").map((e=>e.trim())).filter((e=>e)).forEach((e=>{if(e.includes("-")){const[t,a]=e.split("-").map(Number);for(let e=t;e<=a;e++)l.push(new Date((new Date).getFullYear(),s,e))}else{const t=parseInt(e);isNaN(t)||l.push(new Date((new Date).getFullYear(),s,t))}}))}return l},parseEnglishDates=e=>{const[t,a]=e.split(" ");if(t.includes("-")){const[e,l]=t.split("-").map(Number),o=parseMonth(a);return Array.from({length:l-e+1},((t,a)=>new Date((new Date).getFullYear(),o,e+a)))}return[new Date((new Date).getFullYear(),parseMonth(a),parseInt(t))]},parseArabicDateForCloseSellData=e=>{const[t,a]=e.split(" ");return new Date((new Date).getFullYear(),{"يناير":0,"فبراير":1,"مارس":2,"أبريل":3,"مايو":4,"يونيو":5,"يوليو":6,"أغسطس":7,"سبتمبر":8,"أكتوبر":9,"نوفمبر":10,"ديسمبر":11}[a],parseInt(t))},parseMonth=e=>({Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11}[e]);
