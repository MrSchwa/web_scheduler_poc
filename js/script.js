window.addEventListener('load', (event) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed
    const currentDay = now.getDate();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    let focusedMonth = currentMonth;
    let minAllowableMonth = currentMonth;
    let maxAllowableMonth = currentMonth + 2;
    let selectedDate = null;
    
    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    function getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1).getDay();
    }
    
    function buildCalendar(year, month) {
        // Calendar Function
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const weeks = Math.ceil((daysInMonth + firstDay) / 7);
        const totalCells = weeks * 7;

        let html = `<div class="month-title">`;
        html += `<div ><button id="goToPreviousMonth"><</button></div>`;
        html += `<div class="month-display">${monthNames[month]} ${year}</div>`;
        html += `<div><button id="goToNextMonth">></button></div>`;
        html += `</div>`;
        
        html += `<div class="month-block" id="monthBlock">`;

        // Weekday headers
        html += `<div class="weekdays">`;
        dayNames.forEach(d => {
            html += `<div class="weekday">${d}</div>`;
        });
        html += `</div>`;

        // Day cells
        html += `<div class="days">`;
        for (let i = 0; i < totalCells; i++) {
            const dayNum = i - firstDay + 1;
            if (dayNum < 1 || dayNum > daysInMonth) {
                html += `<div class="day-cell empty"></div>`;
            } else {
                let cls = "day-cell";
                // Today check
                if (year === currentYear && month === currentMonth && dayNum === currentDay) {
                    cls += " today";
                }
                // Selected check
                if (selectedDate && selectedDate.year === year && selectedDate.month === month && selectedDate.day === dayNum) {
                    cls += " selected";
                }
                html += `<div class="${cls}" data-year="${year}" data-month="${month}" data-day="${dayNum}">${dayNum}</div>`;
            }
        }
        html += `</div></div>`;

        return html;
    }

    function renderCalendars() {
        const grid = document.getElementById('monthGrid');
        let html = '';

        for (let i = 0; i < 3; i++) {
            let m = currentMonth + i;
            let y = currentYear;
            if (m > 11) {
                m -= 12;
                y += 1;
            }
            html += buildCalendar(y, m);
        }

        grid.innerHTML = html;
    }
    

    function formatDate(year, month, day) {
        const m = String(month + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${year}-${m}-${d}`;
    }

    function handleDayClick(e) {
        const cell = e.target.closest('.day-cell');
        if (!cell || cell.classList.contains('empty')) return;

        const year = parseInt(cell.dataset.year);
        const month = parseInt(cell.dataset.month);
        const day = parseInt(cell.dataset.day);

        selectedDate = { year, month, day };

        document.getElementById('dateInput').value = formatDate(year, month, day);
        renderCalendar(month);
    }

    function handleGoToPreviousMonth() {
        if ((focusedMonth - 1) < minAllowableMonth) {
            return;
        }
        focusedMonth = focusedMonth - 1;
        renderCalendar(focusedMonth);
    }

    function handleGoToNextMonth() {
        if ((focusedMonth + 1) > maxAllowableMonth) {
            return;
        }
        focusedMonth = focusedMonth + 1;
        renderCalendar(focusedMonth);
    }

    function renderCalendar(selectedMonth) {
        const grid = document.getElementById('monthGrid');
        let html = '';

        let m = selectedMonth;
        let y = currentYear;
        if (m > 11) {
            m -= 12;
            y += 1;
        }
        html = buildCalendar(y, m);
        
        grid.innerHTML = html;
        document.getElementById('monthBlock').addEventListener('click', handleDayClick);
        document.getElementById('goToPreviousMonth').addEventListener('click', handleGoToPreviousMonth);
        document.getElementById('goToNextMonth').addEventListener('click', handleGoToNextMonth);
    }
    // End Calendar Function

    // Time Slot Function
    
    let selectedTimeSlot = null;

    let availableTimeSlots = [
        "2:00 - 3:00 PM",
        "3:00 - 4:00 PM",
        "4:00 - 5:00 PM",
        "5:00 - 6:00 PM",
    ]

    function buildTimeSlot(selectedTimeSlot) {
        let html = `<div class="time-slot-choices" id="timeSlotChoices">`;
        let baseCls = `time-slot-option`;
        for (let i = 0; i < availableTimeSlots.length; i++) {
            let cls = baseCls;
            if (selectedTimeSlot === availableTimeSlots[i]) {
                cls = cls + " selected";
            }
            html += `<div class="${cls}" data-slot-name="${availableTimeSlots[i]}" >${availableTimeSlots[i]}</div>`
        }

        html += `</div>`;
        
        return html;
    }

    function handleTimeSlotClick(e) {
        const slot = e.target.closest('.time-slot-option');
        if (!slot || slot.classList.contains('empty')) return;

        selectedTimeSlot = slot.dataset.slotName;

        document.getElementById('timeSlotInput').value = selectedTimeSlot;
        renderTimeSlotChoices(selectedTimeSlot);
    }

    function renderTimeSlotChoices(selectedTimeSlot) {
        const grid = document.getElementById('timeSlotGrid');
        let html = buildTimeSlot(selectedTimeSlot);
        grid.innerHTML = html;
        
        document.getElementById('timeSlotChoices').addEventListener('click', handleTimeSlotClick);
        
    }

    // End Time Slot Function 

    // Initialize
    renderCalendar(focusedMonth);
    renderTimeSlotChoices(selectedTimeSlot);
});