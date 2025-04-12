/* Array to store the stop sell data to reuse it in a faster way */
const closeSellHotelDataCache = {}; // Will hold all hotel close-sell data
let hasFetchedCloseSellData = false; // Flag to avoid multiple fetches

const sheetDataURL = "https://script.google.com/macros/s/AKfycbz093QB0fDJvaYMK6ODQAQja2G0S3MAHtDPwJPNfwZPuPmXrXwC0y8mda6G_TOH0NQN/exec";

const fetchAllCloseSellDataFunction = async () => {
    const hotelElements = document.querySelectorAll(".all_hotels_names_div_class h3");

    // Reset all h3 elements before processing
    hotelElements.forEach((hotelElement) => {
        hotelElement.style.opacity = "0";
        hotelElement.style.pointerEvents = "none";
        hotelElement.style.backgroundColor = "white";
    });

    // ✅ If data is already fetched, skip fetch and use cache
    if (!hasFetchedCloseSellData) {
        try {
            const response = await fetch(sheetDataURL);
            const data = await response.json();

            // Parse and store data in the cache
            data.forEach((hotelInfo) => {
                const [nameAndRoomType, availabilityString] = hotelInfo.split(":");
                const hotelName = nameAndRoomType.split("(")[0].trim();
                const roomType = nameAndRoomType.split("(")[1]?.replace(")", "").trim();

                if (!closeSellHotelDataCache[hotelName]) {
                    closeSellHotelDataCache[hotelName] = [];
                }

                closeSellHotelDataCache[hotelName].push({
                    roomType,
                    availability: parseHotelAvailability(availabilityString.trim())
                });
            });

            hasFetchedCloseSellData = true; // ✅ Set the flag after successful fetch
        } catch (error) {
            console.error("Error fetching close-sell data:", error);
            return; // Exit early if fetch fails
        }
    }

    // ✅ Now use the already cached data to update UI
    const checkInInput = document.getElementById("whole_package_start_date_input_id").value;
    const checkOutInput = document.getElementById("whole_package_end_date_input_id").value;

    if (checkInInput && checkOutInput) {
        const checkInDate = parseArabicDateForCloseSellData(checkInInput);
        const checkOutDate = parseArabicDateForCloseSellData(checkOutInput);

        hotelElements.forEach((hotelElement) => {
            const hotelName = hotelElement.innerText.trim();
            const matchingData = closeSellHotelDataCache[hotelName];

            if (matchingData) {
                const allMatchingDates = [];

                matchingData.forEach(({ roomType, availability }) => {
                    const matchingDates = availability.filter((date) => {
                        return date >= checkInDate && date <= checkOutDate;
                    });

                    if (matchingDates.length > 0) {
                        const alreadyExists = allMatchingDates.some(entry => entry.roomType === roomType);
                        if (!alreadyExists) {
                            allMatchingDates.push({ roomType, dates: matchingDates });
                        }
                    }
                });

                if (allMatchingDates.length > 0) {
                    hotelElement.style.backgroundColor = "red";
                    hotelElement.style.opacity = "1";
                    hotelElement.style.pointerEvents = "auto";

                    hotelElement.addEventListener("click", () => {
                        const messageParts = allMatchingDates.map(({ roomType, dates }) => {
                            const formattedRange = formatDateRanges(dates);
                            return `${roomType}: ${formattedRange}`;
                        });

                        showCloseSellModal(messageParts.join("\n"));
                    });
                }
            }
        });
    }

    // Make sure hotel elements are clickable again after everything
    hotelElements.forEach((hotelElement) => {
        hotelElement.style.opacity = "1";
        hotelElement.style.pointerEvents = "auto";
    });
};




const formatDateRanges = (dates) => {
    if (!dates.length) return "";

    // Sort dates in ascending order
    dates.sort((a, b) => a - b);

    const ranges = [];
    let start = dates[0];
    let end = dates[0];

    for (let i = 1; i < dates.length; i++) {
        const current = dates[i];
        const prev = dates[i - 1];

        const oneDay = 1000 * 60 * 60 * 24;
        if ((current - prev) === oneDay) {
            end = current; // Extend the range
        } else {
            ranges.push([start, end]);
            start = current;
            end = current;
        }
    }

    // Push the last range
    ranges.push([start, end]);

    // Format ranges
    return ranges.map(([start, end]) => {
        const startDay = start.getDate();
        const startMonth = start.toLocaleString("en-US", { month: "short" });
        const endDay = end.getDate();
        const endMonth = end.toLocaleString("en-US", { month: "short" });

        // Same month
        if (startMonth === endMonth) {
            return startDay === endDay
                ? `${startDay} ${startMonth}`
                : `${startDay}-${endDay} ${startMonth}`;
        } else {
            return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
        }
    }).join(", ");
};


// Function to parse hotel availability into an array of Date objects
const parseHotelAvailability = (availabilityString) => {
    const monthPattern = /([A-Za-z]+)\s\(([\d,\s\-]*)\)/g;
    const englishMonths = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };

    const dates = [];
    let match;

    while ((match = monthPattern.exec(availabilityString)) !== null) {
        const month = match[1];
        const rawDays = match[2];
        const monthIndex = englishMonths[month];

        // Split on comma, and expand ranges like 12-15
        const entries = rawDays.split(",").map(e => e.trim()).filter(e => e);

        entries.forEach(entry => {
            if (entry.includes("-")) {
                const [start, end] = entry.split("-").map(Number);
                for (let day = start; day <= end; day++) {
                    dates.push(new Date(new Date().getFullYear(), monthIndex, day));
                }
            } else {
                const day = parseInt(entry);
                if (!isNaN(day)) {
                    dates.push(new Date(new Date().getFullYear(), monthIndex, day));
                }
            }
        });
    }

    return dates;
};



// Enhanced parsing function for availability (handles ranges)
const parseEnglishDates = (entry) => {
    const [day, month] = entry.split(" ");
    if (day.includes("-")) {
        // Handle ranges (e.g., "25-29 Jan")
        const [startDay, endDay] = day.split("-").map(Number);
        const monthIndex = parseMonth(month);
        return Array.from({ length: endDay - startDay + 1 }, (_, i) => {
            return new Date(new Date().getFullYear(), monthIndex, startDay + i);
        });
    } else {
        // Single date (e.g., "25 Jan")
        return [new Date(new Date().getFullYear(), parseMonth(month), parseInt(day))];
    }
};

// Function to parse Arabic date into a JavaScript Date object
const parseArabicDateForCloseSellData = (arabicDate) => {
    const arabicMonths = {
        "يناير": 0, "فبراير": 1, "مارس": 2, "أبريل": 3,
        "مايو": 4, "يونيو": 5, "يوليو": 6, "أغسطس": 7,
        "سبتمبر": 8, "أكتوبر": 9, "نوفمبر": 10, "ديسمبر": 11,
    };
    const [day, month] = arabicDate.split(" ");
    return new Date(new Date().getFullYear(), arabicMonths[month], parseInt(day));
};

// Helper to parse English month names
const parseMonth = (month) => {
    const englishMonths = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    return englishMonths[month];
};

