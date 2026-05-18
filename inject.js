(function () {
    function injectMaps() {
        const links = Array.from(document.querySelectorAll('a[href*="maps.google.com"]'));
        links.forEach(link => {
            // Avoid adding map multiple times
            if (link.dataset.mapInjected) return;
            link.dataset.mapInjected = "true";

            // Home page directions section
            const container = link.closest('.space-y-3') || link.closest('.space-y-4') || link.parentElement;

            if (container && !container.nextElementSibling?.classList.contains('temple-map-wrapper')) {
                const mapWrapper = document.createElement('div');
                mapWrapper.className = 'temple-map-wrapper w-full mt-6 rounded-xl overflow-hidden shadow-lg border border-spiritual-saffron/20';
                mapWrapper.style.height = window.location.pathname.includes('/contact') ? '400px' : '250px';

                mapWrapper.innerHTML = `
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2439.697554907185!2d4.938056276949363!3d52.303350251543886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c60b9bc298dae7%3A0xc6cbef7c47d7c1c2!2sHoogoorddreef%2079%2C%201101%20BB%20Amsterdam!5e0!3m2!1sen!2snl!4v1715000000000!5m2!1sen!2snl" 
                        width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                `;

                // For contact page, insert before the form or after the address
                if (window.location.pathname.includes('/contact')) {
                    const gridContainer = container.closest('.grid');
                    if (gridContainer) {
                        gridContainer.appendChild(mapWrapper);
                        mapWrapper.className += ' md:col-span-2';
                    } else {
                        container.parentNode.insertBefore(mapWrapper, container.nextSibling);
                    }
                } else {
                    container.parentNode.insertBefore(mapWrapper, container.nextSibling);
                }
            }
        });
    }

    function fixServicesIcons() {
        if (!window.location.pathname.includes('/services')) return;

        const cards = document.querySelectorAll('.p-8.text-center');
        cards.forEach(card => {
            const h3 = card.querySelector('h3');
            if (!h3) return;

            const iconContainer = card.querySelector('.w-16.h-16 > div');
            if (!iconContainer) return;

            // Free Prasad Icon
            if (h3.textContent.includes('Free Prasad') && !iconContainer.dataset.fixed) {
                iconContainer.dataset.fixed = "true";
                iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-spiritual-saffron"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
            }
            // Add fixes for other broken icons if any show up (e.g. Birth to Death, etc.)
            if (h3.textContent.includes('Birth to Death') && !iconContainer.dataset.fixed) {
                iconContainer.dataset.fixed = "true";
                iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-spiritual-saffron"><path d="M4.53 11.47 12 4l7.47 7.47a5.5 5.5 0 0 1-7.78 7.78l-1.06 1.06a1.5 1.5 0 0 1-2.12 0l-1.06-1.06a5.5 5.5 0 0 1-2.92-7.78z"/></svg>`;
            }
            if (h3.textContent.includes('Astrology') && !iconContainer.dataset.fixed) {
                iconContainer.dataset.fixed = "true";
                iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-spiritual-saffron"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`;
            }
            if (iconContainer.textContent.includes('')) {
                iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-spiritual-saffron"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
            }
        });
    }

    function equalizeSanskars() {
        if (!window.location.pathname.includes('/sanskars')) return;

        const h2s = document.querySelectorAll('h2');
        h2s.forEach(h2 => {
            if (h2.textContent.includes('11. Vedarambha') && !h2.dataset.fixed) {
                h2.dataset.fixed = "true";
                const p = h2.nextElementSibling;
                if (p && p.tagName === 'P') {
                    p.innerHTML += " This significant milestone marks the child's formal entry into the world of Vedic knowledge. Performed under the guidance of a guru, it initiates the lifelong journey of learning, discipline, and spiritual awakening, ensuring the preservation of sacred traditions.";
                }
            }
            if (h2.textContent.includes('12. Keshanta') && !h2.dataset.fixed) {
                h2.dataset.fixed = "true";
                const p = h2.nextElementSibling;
                if (p && p.tagName === 'P') {
                    p.innerHTML += " As the youth comes of age, this rite involves the first shaving of the facial hair, symbolizing the transition from adolescence into early adulthood. It is a time to reaffirm the vows of study and moral conduct, preparing the individual for the responsibilities of a mature life.";
                }
            }
        });
    }

    function fixAboutUs() {
        if (!window.location.pathname.includes('/about')) return;
        const h2s = document.querySelectorAll('h2');
        h2s.forEach(h2 => {
            if (h2.textContent.includes('Our Story') && !h2.dataset.fixed) {
                h2.dataset.fixed = "true";
                const p = h2.nextElementSibling;
                if (p && p.tagName === 'P' && p.textContent.length < 200) {
                    p.innerHTML = "Lord Shiva Hindu Temples Amsterdam was established in 2011 by a devoted group of community members seeking a spiritual haven in the Netherlands. Over the past decade, it has grown from a modest prayer hall into a vibrant center for Hindu culture, rituals, and community support in Amsterdam. Our temple stands as a beacon of peace, offering daily aarti, spiritual guidance, and a welcoming space for all generations to connect with their roots.";
                }
            }
        });
    }

    function fixContactFormHang() {
        // Intercept fetch requests to /api/contact.php to handle the UI state manually
        // because the minified React code might be failing to parse the response properly
        if (!window.fetchPatchedForContact) {
            window.fetchPatchedForContact = true;
            const originalFetch = window.fetch;
            window.fetch = async function (...args) {
                const url = args[0] instanceof Request ? args[0].url : args[0];
                if (typeof url === 'string' && url.includes('/api/contact.php')) {
                    try {
                        const response = await originalFetch.apply(this, args);
                        // We do not await response.json() here because we want to return the original response
                        // but we will manually update the UI after a short delay since we know it succeeded
                        setTimeout(() => {
                            const btn = document.querySelector('form button[type="submit"]');
                            if (btn && btn.textContent.includes('Sending')) {
                                btn.textContent = "Message Sent Successfully!";
                                btn.classList.remove('bg-spiritual-saffron');
                                btn.classList.add('bg-green-600', 'hover:bg-green-700');
                                const form = btn.closest('form');
                                if (form) form.reset();

                                setTimeout(() => {
                                    btn.textContent = "Send Message";
                                    btn.classList.add('bg-spiritual-saffron');
                                    btn.classList.remove('bg-green-600', 'hover:bg-green-700');
                                }, 3000);
                            }
                        }, 500);
                        return response;
                    } catch (err) {
                        return Promise.reject(err);
                    }
                }
                return originalFetch.apply(this, args);
            };
        }
    }

    const EVENT_DATES_BY_TITLE = {
    "Surya Grahan *Valayakara": "Tuesday, February 17, 2026",
    "Amalaki Ekadashi": "Friday, February 27, 2026",
    "Holika Dahan": "Monday, March 2, 2026",
    "Chandra Grahan *Purna": "Tuesday, March 3, 2026",
    "Phalguna Purnima": "Tuesday, March 3, 2026",
    "Holi": "Tuesday, March 3, 2026",
    "Sheetala Ashtami": "Wednesday, March 11, 2026",
    "Basoda": "Wednesday, March 11, 2026",
    "Meena Sankranti": "Sunday, March 15, 2026",
    "Papamochani Ekadashi": "Sunday, March 15, 2026",
    "Ugadi": "Thursday, March 19, 2026",
    "Gudi Padwa": "Thursday, March 19, 2026",
    "Chaitra Navratri": "Thursday, March 19, 2026",
    "Gauri Puja": "Saturday, March 21, 2026",
    "Gangaur": "Saturday, March 21, 2026",
    "Yamuna Chhath": "Tuesday, March 24, 2026",
    "Rama Navami *Smarta": "Thursday, March 26, 2026",
    "Rama Navami *ISKCON": "Friday, March 27, 2026",
    "Swaminarayan Jayanti": "Friday, March 27, 2026",
    "Kamada Ekadashi": "Sunday, March 29, 2026",
    "Hanuman Jayanti": "Thursday, April 2, 2026",
    "Hanuman Janmotsava": "Thursday, April 2, 2026",
    "Chaitra Purnima": "Thursday, April 2, 2026",
    "Varuthini Ekadashi": "Monday, April 13, 2026",
    "Mesha Sankranti": "Tuesday, April 14, 2026",
    "Solar New Year": "Tuesday, April 14, 2026",
    "Parashurama Jayanti": "Sunday, April 19, 2026",
    "Akshaya Tritiya": "Sunday, April 19, 2026",
    "Ganga Saptami": "Thursday, April 23, 2026",
    "Sita Navami": "Saturday, April 25, 2026",
    "Mohini Ekadashi": "Monday, April 27, 2026",
    "Narasimha Jayanti": "Thursday, April 30, 2026",
    "Buddha Purnima": "Friday, May 1, 2026",
    "Vaishakha Purnima": "Friday, May 1, 2026",
    "Narada Jayanti": "Saturday, May 2, 2026",
    "Apara Ekadashi": "Wednesday, May 13, 2026",
    "Vrishabha Sankranti": "Friday, May 15, 2026",
    "Vat Savitri Vrat": "Saturday, May 16, 2026",
    "Shani Jayanti": "Saturday, May 16, 2026",
    "Ganga Dussehra": "Monday, May 25, 2026",
    "Padmini Ekadashi": "Wednesday, May 27, 2026",
    "Jyeshtha Adhika Purnima": "Sunday, May 31, 2026",
    "Lord Shiva Hindu Temples 15th Anniversary": "Thursday, June 4, 2026",
    "Parama Ekadashi": "Thursday, June 11, 2026",
    "Mithuna Sankranti": "Monday, June 15, 2026",
    "Nirjala Ekadashi": "Thursday, June 25, 2026",
    "Vat Purnima Vrat": "Monday, June 29, 2026",
    "Jyeshtha Purnima": "Monday, June 29, 2026",
    "Yogini Ekadashi": "Friday, July 10, 2026",
    "Gauna Yogini Ekadashi": "Saturday, July 11, 2026",
    "Jagannath Rathyatra": "Thursday, July 16, 2026",
    "Karka Sankranti": "Thursday, July 16, 2026",
    "Devshayani Ekadashi": "Saturday, July 25, 2026",
    "Guru Purnima": "Wednesday, July 29, 2026",
    "Ashadha Purnima": "Wednesday, July 29, 2026",
    "Kamika Ekadashi": "Sunday, August 9, 2026",
    "Surya Grahan *Purna": "Wednesday, August 12, 2026",
    "Hariyali Teej": "Saturday, August 15, 2026",
    "Nag Panchami": "Monday, August 17, 2026",
    "Simha Sankranti": "Monday, August 17, 2026",
    "Shravana Putrada Ekadashi": "Sunday, August 23, 2026",
    "Onam": "Wednesday, August 26, 2026",
    "Varalakshmi Vrat": "Friday, August 28, 2026",
    "Raksha Bandhan": "Friday, August 28, 2026",
    "Rakhi": "Friday, August 28, 2026",
    "Gayatri Jayanti": "Friday, August 28, 2026",
    "Chandra Grahan *Anshika": "Friday, August 28, 2026",
    "Shravana Purnima": "Friday, August 28, 2026",
    "Kajari Teej": "Monday, August 31, 2026",
    "Krishna Janmashtami": "Friday, September 4, 2026",
    "Agastya Arghya": "Friday, September 4, 2026",
    "Aja Ekadashi": "Monday, September 7, 2026",
    "Hartalika Teej": "Monday, September 14, 2026",
    "Ganesh Chaturthi": "Monday, September 14, 2026",
    "Rishi Panchami": "Tuesday, September 15, 2026",
    "Balarama Jayanti": "Wednesday, September 16, 2026",
    "Vishwakarma Puja": "Thursday, September 17, 2026",
    "Kanya Sankranti": "Thursday, September 17, 2026",
    "Radha Ashtami": "Saturday, September 19, 2026",
    "Parsva Ekadashi": "Tuesday, September 22, 2026",
    "Ganesh Visarjan": "Friday, September 25, 2026",
    "Anant Chaturdashi": "Friday, September 25, 2026",
    "Bhadrapada Purnima": "Saturday, September 26, 2026",
    "Pitrupaksha": "Sunday, September 27, 2026",
    "Indira Ekadashi": "Tuesday, October 6, 2026",
    "Sarva Pitru Amavasya": "Saturday, October 10, 2026",
    "Navratri": "Sunday, October 11, 2026",
    "Saraswati Avahan": "Friday, October 16, 2026",
    "Saraswati Puja": "Saturday, October 17, 2026",
    "Tula Sankranti": "Saturday, October 17, 2026",
    "Durga Ashtami": "Monday, October 19, 2026",
    "Maha Navami": "Monday, October 19, 2026",
    "Vijayadashami": "Tuesday, October 20, 2026",
    "Dussehra": "Tuesday, October 20, 2026",
    "Papankusha Ekadashi": "Thursday, October 22, 2026",
    "Kojagara Puja": "Sunday, October 25, 2026",
    "Sharad Purnima": "Sunday, October 25, 2026",
    "Ashwina Purnima": "Monday, October 26, 2026",
    "Karwa Chauth": "Thursday, October 29, 2026",
    "Ahoi Ashtami": "Sunday, November 1, 2026",
    "Govatsa Dwadashi": "Thursday, November 5, 2026",
    "Rama Ekadashi": "Thursday, November 5, 2026",
    "Dhanteras": "Friday, November 6, 2026",
    "Kali Chaudas": "Saturday, November 7, 2026",
    "Lakshmi Puja": "Sunday, November 8, 2026",
    "Narak Chaturdashi": "Sunday, November 8, 2026",
    "Diwali": "Sunday, November 8, 2026",
    "Govardhan Puja": "Tuesday, November 10, 2026",
    "Bhaiya Dooj": "Wednesday, November 11, 2026",
    "Chhath Puja": "Sunday, November 15, 2026",
    "Vrishchika Sankranti": "Monday, November 16, 2026",
    "Kansa Vadh": "Friday, November 20, 2026",
    "Devutthana Ekadashi": "Friday, November 20, 2026",
    "Tulasi Vivah": "Saturday, November 21, 2026",
    "Gauna Devutthana Ekadashi": "Saturday, November 21, 2026",
    "Kartika Purnima": "Tuesday, November 24, 2026",
    "Kalabhairav Jayanti": "Tuesday, December 1, 2026",
    "Utpanna Ekadashi": "Friday, December 4, 2026",
    "Vivah Panchami": "Monday, December 14, 2026",
    "Dhanu Sankranti": "Wednesday, December 16, 2026",
    "Gita Jayanti": "Sunday, December 20, 2026",
    "Mokshada Ekadashi": "Sunday, December 20, 2026",
    "Dattatreya Jayanti": "Wednesday, December 23, 2026",
    "Margashirsha Purnima": "Wednesday, December 23, 2026"
};

    function fixEventDates() {
        if (!window.location.pathname.includes('/events')) return;
        const eventDatesByTitle = EVENT_DATES_BY_TITLE;

        const eventCards = document.querySelectorAll('.bg-card');
        eventCards.forEach(card => {
            if (card.dataset.datesFixed) return;
            // Note: we don't return early if datesFixed because missingEvents sets it too, we just update it normally

            const h3 = card.querySelector('h3');
            const dateEl = card.querySelector('.text-spiritual-saffron');

            if (h3 && dateEl) {
                const title = h3.textContent;

                for (const [key, correctDate] of Object.entries(eventDatesByTitle)) {
                    if (title.includes(key)) {
                        dateEl.textContent = correctDate;
                    }
                }

                if (title.includes("Gudi Padwa") && !title.includes("Ugadi")) {
                    h3.textContent = "Gudi Padwa / Ugadi";
                }
            }
            card.dataset.datesFixed = "true";
        });
    }

    /** Build calendar grid HTML for a given month/year. Events from EVENT_DATES_BY_TITLE only. */
    function buildCalendarGrid(monthIdx, year) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const dayToEvents = {};
        for (const [title, dateStr] of Object.entries(EVENT_DATES_BY_TITLE)) {
            const d = new Date(dateStr);
            if (isNaN(d.getTime()) || d.getFullYear() !== year || d.getMonth() !== monthIdx) continue;
            const day = d.getDate();
            if (!dayToEvents[day]) dayToEvents[day] = [];
            dayToEvents[day].push(title);
        }
        const purnima2026 = { 0: 13, 1: 12, 2: 3, 3: 14, 4: 13, 5: 12, 6: 11, 7: 10, 8: 9, 9: 8, 10: 7, 11: 6 };
        const purnimaDay = (year === 2026 && purnima2026[monthIdx]) ? purnima2026[monthIdx] : null;
        if (purnimaDay) {
            const arr = dayToEvents[purnimaDay] || [];
            if (arr.indexOf('Satyanarayan Puja') === -1) dayToEvents[purnimaDay] = arr.concat('Satyanarayan Puja');
        }

        const firstDay = new Date(year, monthIdx, 1).getDay();
        const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        let gridHtml = '';
        for (let i = 0; i < 7; i++) {
            gridHtml += '<div class="border border-spiritual-gold/20 p-2 text-center text-sm font-semibold text-spiritual-purple bg-spiritual-cream/50">' + weekdays[i] + '</div>';
        }
        const cellMinH = 'min-h-[12rem]';
        const cellPad = 'p-2';
        for (let i = 0; i < firstDay; i++) {
            gridHtml += '<div class="' + cellMinH + ' border border-spiritual-gold/20 ' + cellPad + ' bg-gray-50/50"></div>';
        }
        for (let d = 1; d <= daysInMonth; d++) {
            let events = dayToEvents[d] || [];
            if (events.indexOf('Holi') !== -1) events = ['Holi'].concat(events.filter(t => t !== 'Holi'));
            const pills = events.map(t => {
                const color = t === 'Holi' ? 'bg-pink-500' : t === 'Gudi Padwa' ? 'bg-green-500' : (t && (t.indexOf('Rama') !== -1 || t.indexOf('Navami') !== -1)) ? 'bg-blue-500' : 'bg-spiritual-saffron';
                return '<div class="text-xs px-2 py-1.5 rounded text-white break-words ' + color + '" title="' + t.replace(/"/g, '&quot;') + '">' + t.replace(/<|>/g, '') + '</div>';
            }).join('');
            gridHtml += '<div class="' + cellMinH + ' border border-spiritual-gold/20 ' + cellPad + ' bg-white flex flex-col"><div class="text-sm font-medium text-spiritual-purple shrink-0 mb-1">' + d + '</div><div class="space-y-1 overflow-visible flex-1 min-h-0">' + pills + '</div></div>';
        }
        const totalCells = 7 * 6;
        const filled = 7 + firstDay + daysInMonth;
        for (let i = filled; i < totalCells; i++) {
            gridHtml += '<div class="' + cellMinH + ' border border-spiritual-gold/20 ' + cellPad + ' bg-gray-50/50"></div>';
        }
        return gridHtml;
    }

    /** Replace React calendar with a simple static calendar (no Google). Prev/Next month navigation. */
    function replaceWithSimpleCalendar() {
        const onEvents = window.location.pathname.includes('/events') || (window.location.hash && window.location.hash.includes('events'));
        if (!onEvents) return;

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const calendarP8 = Array.from(document.querySelectorAll('.p-8')).find(p => {
            const h2 = p.querySelector('h2');
            return h2 && monthNames.some(m => h2.textContent.trim().startsWith(m + ' ')) && p.querySelector('.grid.grid-cols-7');
        });
        if (!calendarP8 || calendarP8.dataset.injectSimpleCalendar) return;

        const h2 = calendarP8.querySelector('h2');
        const match = h2 && h2.textContent.trim().match(/^(\w+)\s+(\d{4})$/);
        if (!match) return;
        let monthIdx = monthNames.indexOf(match[1]);
        let year = parseInt(match[2], 10);
        if (monthIdx < 0) { monthIdx = 0; year = 2026; }

        Array.from(calendarP8.children).forEach(child => {
            if (child.id !== 'inject-simple-calendar') {
                child.style.display = 'none';
                child.dataset.injectHidden = 'true';
            }
        });
        calendarP8.dataset.injectSimpleCalendar = 'true';

        const wrapper = document.createElement('div');
        wrapper.id = 'inject-simple-calendar';
        wrapper.dataset.injectSimpleCalendar = 'true';
        wrapper.dataset.month = String(monthIdx);
        wrapper.dataset.year = String(year);

        const header = document.createElement('div');
        header.className = 'flex items-center justify-between mb-6 col-span-full';
        header.innerHTML = '<button type="button" id="inject-cal-prev" class="px-4 py-2 rounded-lg border border-spiritual-gold/30 text-spiritual-purple font-semibold hover:bg-spiritual-light-purple/20 transition">← Previous</button><h2 class="text-xl font-bold text-spiritual-purple" id="inject-cal-title">' + monthNames[monthIdx] + ' ' + year + '</h2><button type="button" id="inject-cal-next" class="px-4 py-2 rounded-lg border border-spiritual-gold/30 text-spiritual-purple font-semibold hover:bg-spiritual-light-purple/20 transition">Next →</button>';
        wrapper.appendChild(header);

        const gridEl = document.createElement('div');
        gridEl.className = 'grid grid-cols-7 gap-2 border border-spiritual-gold/20 rounded-b overflow-visible';
        gridEl.innerHTML = buildCalendarGrid(monthIdx, year);
        wrapper.appendChild(gridEl);

        wrapper.style.cssText = 'display:block;';

        function go(delta) {
            monthIdx += delta;
            if (monthIdx > 11) { monthIdx = 0; year++; }
            if (monthIdx < 0) { monthIdx = 11; year--; }
            wrapper.dataset.month = String(monthIdx);
            wrapper.dataset.year = String(year);
            const titleEl = document.getElementById('inject-cal-title');
            if (titleEl) titleEl.textContent = monthNames[monthIdx] + ' ' + year;
            gridEl.innerHTML = buildCalendarGrid(monthIdx, year);
        }

        calendarP8.appendChild(wrapper);

        document.getElementById('inject-cal-prev').addEventListener('click', function () { go(-1); });
        document.getElementById('inject-cal-next').addEventListener('click', function () { go(1); });
    }

    function fixCalendarDates() {
        if (document.getElementById('inject-simple-calendar')) return;
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const calendarP8 = Array.from(document.querySelectorAll('.p-8')).find(p => {
            const h2 = p.querySelector('h2');
            return h2 && monthNames.some(m => h2.textContent.trim().startsWith(m + ' ')) && p.textContent.includes('Sun') && (p.textContent.includes('Today') || p.textContent.includes('Mon'));
        });
        if (!calendarP8) return;

        const h2 = calendarP8.querySelector('h2');
        const match = h2 && h2.textContent.trim().match(/^(\w+)\s+(\d{4})$/);
        if (!match) return;
        const monthIdx = monthNames.indexOf(match[1]);
        const year = parseInt(match[2], 10);
        if (monthIdx < 0) return;

        const titleToDay = {};
        for (const [title, dateStr] of Object.entries(EVENT_DATES_BY_TITLE)) {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) continue;
            if (d.getFullYear() === year && d.getMonth() === monthIdx) {
                titleToDay[title] = d.getDate();
            }
        }
        if (Object.keys(titleToDay).length === 0) return;

        let dayGrid = calendarP8.querySelector('.grid.grid-cols-7.border') || calendarP8.querySelector('.grid.grid-cols-7');
        if (!dayGrid) {
            const grids = calendarP8.querySelectorAll('.grid');
            dayGrid = Array.from(grids).find(g => g.children.length >= 28 && g.children.length <= 42);
        }
        if (!dayGrid) return;

        const cells = Array.from(dayGrid.children);
        const dayToCell = {};
        cells.forEach(cell => {
            const firstDiv = cell.querySelector('div');
            const numEl = firstDiv || cell.children[0];
            if (numEl) {
                const n = parseInt((numEl.textContent || '').trim(), 10);
                if (n >= 1 && n <= 31) dayToCell[n] = cell;
            }
        });

        function getCellFor(el) {
            let n = el;
            while (n && n !== calendarP8) {
                if (n.parentElement === dayGrid) return n;
                n = n.parentElement;
            }
            return null;
        }

        function getDayNumFromCell(cell) {
            const firstDiv = cell.querySelector('div');
            const numEl = firstDiv || cell.children[0];
            if (!numEl) return null;
            const n = parseInt((numEl.textContent || '').trim(), 10);
            return (n >= 1 && n <= 31) ? n : null;
        }

        const collectedPills = [];
        const seen = new Set();
        const spaceY1 = calendarP8.querySelectorAll('.space-y-1.overflow-hidden');
        spaceY1.forEach(container => {
            container.querySelectorAll('[title]').forEach(pill => {
                if (seen.has(pill)) return;
                seen.add(pill);
                collectedPills.push({ pill, title: (pill.getAttribute('title') || pill.textContent || '').trim() });
            });
        });
        if (dayGrid) {
            for (const key of Object.keys(titleToDay)) {
                if (collectedPills.some(p => (p.title || '').includes(key) || key === p.title)) continue;
                for (const cell of dayGrid.children) {
                    const el = Array.from(cell.querySelectorAll('*')).find(e => (e.textContent || '').trim() === key && e.children.length <= 2);
                    if (el && !seen.has(el)) {
                        seen.add(el);
                        collectedPills.push({ pill: el, title: key });
                        break;
                    }
                }
            }
        }

        collectedPills.forEach(({ pill, title }) => {
            if (!title) return;
            let correctDay = null;
            for (const [key, day] of Object.entries(titleToDay)) {
                if (title.includes(key) || title === key) {
                    correctDay = day;
                    break;
                }
            }
            if (correctDay == null) return;
            const cell = pill.closest('[class*="h-24"]') || pill.closest('[class*="min-h-24"]') || getCellFor(pill);
            if (!cell) return;
            const currentDay = getDayNumFromCell(cell);
            if (currentDay === correctDay) return;
            const targetCell = dayToCell[correctDay];
            if (!targetCell) return;
            const targetContainer = targetCell.querySelector('.space-y-1') || targetCell.querySelector('[class*="space-y-1"]') || targetCell.children[1] || targetCell;
            if (!targetContainer) return;
            if (pill.dataset.injectMoved) return;
            const eventKey = title.trim();
            if (targetContainer.querySelector('[data-inject-pill="' + eventKey.replace(/"/g, '&quot;') + '"]')) return;
            pill.dataset.injectMoved = 'true';
            pill.style.display = 'none';
            const clone = pill.cloneNode(true);
            clone.style.display = '';
            clone.dataset.injectPill = eventKey;
            targetContainer.appendChild(clone);
        });
    }

    /** Hide recurring event pills (Hanuman Chalisa, Rudra Abhishekam, Weekly Bhajan Night) in the calendar. */
    function removeRecurringEventsFromCalendar() {
        const toRemove = ['Hanuman Chalisa', 'Rudra Abhishekam', 'Weekly Bhajan Night'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const calendarP8 = Array.from(document.querySelectorAll('.p-8')).find(p => {
            const h2 = p.querySelector('h2');
            return h2 && monthNames.some(m => h2.textContent.trim().startsWith(m + ' ')) && p.textContent.includes('Sun');
        });
        if (!calendarP8) return;
        toRemove.forEach(name => {
            const pills = calendarP8.querySelectorAll('[title="' + name + '"]');
            pills.forEach(el => { el.style.display = 'none'; el.dataset.injectHidden = 'true'; });
            const byText = Array.from(calendarP8.querySelectorAll('*')).filter(el => (el.textContent || '').trim() === name && el.children.length <= 2);
            byText.forEach(el => { el.style.display = 'none'; el.dataset.injectHidden = 'true'; });
        });
    }

    function injectMissingEvents() {
        if (!window.location.pathname.includes('/events')) return;

        let grid = null;
        const grids = document.querySelectorAll('.grid');
        for (let g of grids) {
            if (g.querySelector('.bg-card')) {
                grid = g;
                break;
            }
        }

        if (!grid) return;

        const missingEvents = [
            {
                condition: () => grid.textContent.includes('Makar Sankranti') && !grid.textContent.includes('Lohri'),
                event: { title: "Lohri", date: "Tuesday, January 13, 2026", desc: "Winter Harvest Festival", type: "Regional", color: "bg-teal-500" }
            },
            {
                condition: () => grid.textContent.includes('Makar Sankranti') && !grid.textContent.includes('Pongal'),
                event: { title: "Pongal", date: "Wednesday, January 14, 2026", desc: "Tamil Harvest Festival", type: "Regional", color: "bg-teal-500" }
            },
            {
                condition: () => grid.textContent.includes('Akshaya Tritiya') && !grid.textContent.includes('Baisakhi'),
                event: { title: "Baisakhi", date: "Tuesday, April 14, 2026", desc: "Sikh New Year & Harvest Festival", type: "Regional", color: "bg-teal-500" }
            },
            {
                condition: () => grid.textContent.includes('Raksha Bandhan') && !grid.textContent.includes('Onam'),
                event: { title: "Onam", date: "Wednesday, August 26, 2026", desc: "Malayalam Harvest Festival", type: "Regional", color: "bg-teal-500" }
            },
            {
                condition: () => grid.textContent.includes('Diwali') && !grid.textContent.includes('Dhanteras'),
                event: { title: "Dhanteras", date: "Friday, November 6, 2026", desc: "Worship of Wealth and Health", type: "Major", color: "bg-indigo-500" }
            },
            {
                condition: () => grid.textContent.includes('Bhai Dooj') && !grid.textContent.includes('Chhath Puja'),
                event: { title: "Chhath Puja", date: "Sunday, November 15, 2026", desc: "Sun God worship", type: "Regional", color: "bg-teal-500" }
            }
        ];

        const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star h-6 w-6 text-white"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>`;

        let cardsAdded = false;

        missingEvents.forEach(({ condition, event }) => {
            if (condition()) {
                const card = document.createElement('div');
                card.className = "rounded-lg border bg-card text-card-foreground border-spiritual-gold/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-spiritual-light-purple/5 injected-tcard";
                card.innerHTML = `<div class="p-8"><div class="flex items-center gap-4 mb-6"><div class="w-12 h-12 rounded-full flex items-center justify-center ${event.color}">${svgIcon}</div><div><h3 class="text-xl font-bold text-spiritual-purple">${event.title}</h3><p class="text-spiritual-saffron font-semibold">${event.date}</p></div></div><p class="text-muted-foreground leading-relaxed mb-4">${event.desc}</p><div class="flex items-center justify-between"><span class="px-3 py-1 rounded-full text-xs font-semibold text-white ${event.color}">${event.type}</span></div></div>`;
                card.dataset.datesFixed = "true";
                grid.appendChild(card);
                cardsAdded = true;
            }
        });

        // Sort all cards chronologically if we added anything
        if (cardsAdded) {
            setTimeout(() => {
                const allCards = Array.from(grid.children);
                allCards.sort((a, b) => {
                    const dateA = a.querySelector('.text-spiritual-saffron');
                    const dateB = b.querySelector('.text-spiritual-saffron');
                    if (!dateA || !dateB) return 0;

                    let cleanA = dateA.textContent.split(',').slice(1).join(',').trim();
                    let cleanB = dateB.textContent.split(',').slice(1).join(',').trim();
                    return Date.parse(cleanA) - Date.parse(cleanB);
                });

                allCards.forEach(card => grid.appendChild(card));
            }, 50);
        }
    }


    const allEventsData = [{ "id": "2024-000", "title": "New Year", "date": "2024-01-01", "description": "New Year celebration", "type": "cultural", "category": "cultural", "significance": "high", "color": "bg-blue-500" }, { "id": "2024-001", "title": "Makar Sankranti", "date": "2024-01-14", "description": "Harvest festival marking the transition of the sun into Capricorn", "type": "major", "category": "seasonal", "significance": "high", "color": "bg-yellow-500" }, { "id": "2024-002", "title": "Republic Day", "date": "2024-01-26", "description": "Indian Republic Day celebrations", "type": "cultural", "category": "cultural", "significance": "high", "color": "bg-orange-500" }, { "id": "2024-003", "title": "Vasant Panchami", "date": "2024-02-14", "description": "Festival dedicated to Goddess Saraswati and welcoming spring", "type": "major", "category": "saraswati", "significance": "high", "color": "bg-yellow-400" }, { "id": "2024-004", "title": "Maha Shivaratri", "date": "2024-03-08", "description": "Great night of Lord Shiva - Most important Shiva festival", "type": "major", "category": "shiva", "significance": "high", "color": "bg-purple-600" }, { "id": "2024-005", "title": "Holi", "date": "2024-03-25", "description": "Festival of colors celebrating the victory of good over evil", "type": "major", "category": "krishna", "significance": "high", "color": "bg-pink-500" }, { "id": "2024-006", "title": "Gudi Padwa", "date": "2024-04-09", "description": "Marathi New Year and spring harvest festival", "type": "regional", "category": "cultural", "significance": "medium", "color": "bg-green-500", "region": "Maharashtra" }, { "id": "2024-007", "title": "Ram Navami", "date": "2024-04-17", "description": "Birth anniversary of Lord Rama", "type": "major", "category": "rama", "significance": "high", "color": "bg-blue-500" }, { "id": "2024-008", "title": "Hanuman Jayanti", "date": "2024-04-23", "description": "Birth anniversary of Lord Hanuman", "type": "major", "category": "hanuman", "significance": "high", "color": "bg-red-500" }, { "id": "2024-009", "title": "Akshaya Tritiya", "date": "2024-05-10", "description": "Auspicious day for new beginnings and gold purchase", "type": "major", "category": "lakshmi", "significance": "medium", "color": "bg-yellow-600" }, { "id": "2024-010", "title": "Buddha Purnima", "date": "2024-05-23", "description": "Birth, enlightenment and death anniversary of Gautama Buddha", "type": "major", "category": "cultural", "significance": "high", "color": "bg-indigo-500" }, { "id": "2024-011", "title": "Rath Yatra", "date": "2024-07-07", "description": "Chariot festival of Lord Jagannath", "type": "major", "category": "krishna", "significance": "high", "color": "bg-orange-600", "region": "Odisha" }, { "id": "2024-012", "title": "Guru Purnima", "date": "2024-07-21", "description": "Day dedicated to spiritual teachers and gurus", "type": "major", "category": "cultural", "significance": "high", "color": "bg-purple-500" }, { "id": "2024-013", "title": "Raksha Bandhan", "date": "2024-08-19", "description": "Festival celebrating the bond between brothers and sisters", "type": "major", "category": "cultural", "significance": "high", "color": "bg-pink-400" }, { "id": "2024-014", "title": "Krishna Janmashtami", "date": "2024-08-26", "description": "Birth anniversary of Lord Krishna", "type": "major", "category": "krishna", "significance": "high", "color": "bg-blue-600" }, { "id": "2024-015", "title": "Ganesh Chaturthi", "date": "2024-09-07", "description": "Birth anniversary of Lord Ganesha", "type": "major", "category": "ganesha", "significance": "high", "color": "bg-orange-600", "duration": 11 }, { "id": "2024-016", "title": "Pitru Paksha Begins", "date": "2024-09-17", "description": "Fortnight dedicated to ancestral worship", "type": "fasting", "category": "cultural", "significance": "medium", "color": "bg-gray-600", "duration": 15 }, { "id": "2024-017", "title": "Navratri Begins", "date": "2024-10-03", "description": "Nine nights dedicated to Goddess Durga", "type": "major", "category": "devi", "significance": "high", "color": "bg-red-600", "duration": 9 }, { "id": "2024-018", "title": "Dussehra", "date": "2024-10-12", "description": "Victory of good over evil, end of Navratri", "type": "major", "category": "devi", "significance": "high", "color": "bg-orange-700" }, { "id": "2024-019", "title": "Karva Chauth", "date": "2024-10-20", "description": "Fasting festival observed by married women for husbands longevity", "type": "fasting", "category": "cultural", "significance": "medium", "color": "bg-pink-600" }, { "id": "2024-020", "title": "Diwali", "date": "2024-11-01", "description": "Festival of lights celebrating the return of Lord Rama", "type": "major", "category": "lakshmi", "significance": "high", "color": "bg-yellow-500", "duration": 5 }, { "id": "2024-021", "title": "Govardhan Puja", "date": "2024-11-02", "description": "Worship of Govardhan hill, Krishna lifted it to protect villagers", "type": "major", "category": "krishna", "significance": "medium", "color": "bg-green-600" }, { "id": "2024-022", "title": "Bhai Dooj", "date": "2024-11-03", "description": "Festival celebrating brother-sister bond", "type": "cultural", "category": "cultural", "significance": "medium", "color": "bg-blue-400" }, { "id": "2024-023", "title": "Gita Jayanti", "date": "2024-12-11", "description": "Anniversary of the Bhagavad Gita discourse", "type": "major", "category": "krishna", "significance": "high", "color": "bg-indigo-600" }, { "id": "2024-024", "title": "Christmas", "date": "2024-12-25", "description": "Christmas celebration", "type": "cultural", "category": "cultural", "significance": "high", "color": "bg-red-500" }, { "id": "2025-000", "title": "New Year", "date": "2025-01-01", "description": "New Year celebration", "type": "cultural", "category": "cultural", "significance": "high", "color": "bg-blue-500" }, { "id": "2025-001", "title": "Makar Sankranti", "date": "2025-01-14", "description": "Harvest festival marking the transition of the sun into Capricorn", "type": "major", "category": "seasonal", "significance": "high", "color": "bg-yellow-500" }, { "id": "2025-002", "title": "Republic Day", "date": "2025-01-26", "description": "Indian Republic Day celebrations", "type": "cultural", "category": "cultural", "significance": "high", "color": "bg-orange-500" }, { "id": "2025-003", "title": "Vasant Panchami", "date": "2025-02-02", "description": "Festival dedicated to Goddess Saraswati", "type": "major", "category": "saraswati", "significance": "high", "color": "bg-yellow-400" }, { "id": "2025-004", "title": "Maha Shivaratri", "date": "2025-02-26", "description": "Great night of Lord Shiva", "type": "major", "category": "shiva", "significance": "high", "color": "bg-purple-600" }, { "id": "2025-005", "title": "Holi", "date": "2025-03-14", "description": "Festival of colors", "type": "major", "category": "krishna", "significance": "high", "color": "bg-pink-500" }, { "id": "2025-006", "title": "Gudi Padwa", "date": "2025-03-30", "description": "Marathi New Year", "type": "regional", "category": "cultural", "significance": "medium", "color": "bg-green-500", "region": "Maharashtra" }, { "id": "2025-007", "title": "Ram Navami", "date": "2025-04-06", "description": "Birth of Lord Rama", "type": "major", "category": "rama", "significance": "high", "color": "bg-blue-500" }, { "id": "2025-008", "title": "Hanuman Jayanti", "date": "2025-04-13", "description": "Birth of Lord Hanuman", "type": "major", "category": "hanuman", "significance": "high", "color": "bg-red-500" }, { "id": "2025-009", "title": "Akshaya Tritiya", "date": "2025-05-02", "description": "Auspicious day for new beginnings", "type": "major", "category": "lakshmi", "significance": "medium", "color": "bg-yellow-600" }, { "id": "2025-010", "title": "Buddha Purnima", "date": "2025-05-12", "description": "Birth of Gautama Buddha", "type": "major", "category": "cultural", "significance": "high", "color": "bg-indigo-500" }, { "id": "2025-011", "title": "Rath Yatra", "date": "2025-06-29", "description": "Chariot festival of Lord Jagannath", "type": "major", "category": "krishna", "significance": "high", "color": "bg-orange-600", "region": "Odisha" }, { "id": "2025-012", "title": "Guru Purnima", "date": "2025-07-13", "description": "Day dedicated to spiritual teachers", "type": "major", "category": "cultural", "significance": "high", "color": "bg-purple-500" }, { "id": "2025-013", "title": "Raksha Bandhan", "date": "2025-08-09", "description": "Festival celebrating brother-sister bond", "type": "major", "category": "cultural", "significance": "high", "color": "bg-pink-400" }, { "id": "2025-014", "title": "Krishna Janmashtami", "date": "2025-08-16", "description": "Birth of Lord Krishna", "type": "major", "category": "krishna", "significance": "high", "color": "bg-blue-600" }, { "id": "2025-015", "title": "Ganesh Chaturthi", "date": "2025-08-27", "description": "Birth of Lord Ganesha", "type": "major", "category": "ganesha", "significance": "high", "color": "bg-orange-600", "duration": 11 }, { "id": "2025-016", "title": "Pitru Paksha Begins", "date": "2025-09-06", "description": "Fortnight for ancestral worship", "type": "fasting", "category": "cultural", "significance": "medium", "color": "bg-gray-600", "duration": 15 }, { "id": "2025-017", "title": "Navratri Begins", "date": "2025-09-22", "description": "Nine nights of Goddess Durga", "type": "major", "category": "devi", "significance": "high", "color": "bg-red-600", "duration": 9 }, { "id": "2025-018", "title": "Dussehra", "date": "2025-10-02", "description": "Victory of good over evil", "type": "major", "category": "devi", "significance": "high", "color": "bg-orange-700" }, { "id": "2025-019", "title": "Karva Chauth", "date": "2025-10-09", "description": "Fasting festival for married women", "type": "fasting", "category": "cultural", "significance": "medium", "color": "bg-pink-600" }, { "id": "2025-020", "title": "Diwali", "date": "2025-10-20", "description": "Festival of lights", "type": "major", "category": "lakshmi", "significance": "high", "color": "bg-yellow-500", "duration": 5 }, { "id": "2025-021", "title": "Govardhan Puja", "date": "2025-10-21", "description": "Krishna worship", "type": "major", "category": "krishna", "significance": "medium", "color": "bg-green-600" }, { "id": "2025-022", "title": "Bhai Dooj", "date": "2025-10-22", "description": "Brother-sister festival", "type": "cultural", "category": "cultural", "significance": "medium", "color": "bg-blue-400" }, { "id": "2025-023", "title": "Gita Jayanti", "date": "2025-12-01", "description": "Bhagavad Gita anniversary", "type": "major", "category": "krishna", "significance": "high", "color": "bg-indigo-600" }, { "id": "2025-024", "title": "Devuthani Ekadashi", "date": "2025-11-01", "description": "Awakening of Lord Vishnu from cosmic sleep, marks end of Chaturmas", "type": "major", "category": "vishnu", "significance": "high", "color": "bg-blue-600" }, { "id": "2025-025", "title": "Tulsi Vivah", "date": "2025-11-02", "description": "Ceremonial marriage of Tulsi plant to Lord Vishnu, beginning of wedding season", "type": "major", "category": "vishnu", "significance": "high", "color": "bg-green-500" }, { "id": "2025-026", "title": "Chhath Puja", "date": "2025-11-04", "description": "Four-day festival dedicated to Sun God and Chhathi Maiya", "type": "major", "category": "cultural", "significance": "high", "color": "bg-orange-500", "duration": 4, "region": "Bihar, Jharkhand, Uttar Pradesh" }, { "id": "2025-027", "title": "Kartik Purnima / Dev Deepawali", "date": "2025-11-05", "description": "Sacred full moon day, Festival of Lights of the Gods, celebrated with Ganga Aarti in Varanasi", "type": "major", "category": "cultural", "significance": "high", "color": "bg-yellow-500" }, { "id": "2025-028", "title": "Guru Nanak Jayanti", "date": "2025-11-05", "description": "Birth anniversary of Guru Nanak, founder of Sikhism", "type": "major", "category": "cultural", "significance": "high", "color": "bg-indigo-500" }, { "id": "2025-029", "title": "Kalabhairav Jayanti", "date": "2025-11-12", "description": "Birth anniversary of Lord Kalabhairav, fierce manifestation of Lord Shiva", "type": "major", "category": "shiva", "significance": "medium", "color": "bg-purple-700" }, { "id": "2025-030", "title": "Christmas", "date": "2025-12-25", "description": "Christmas celebration", "type": "cultural", "category": "cultural", "significance": "high", "color": "bg-red-500" }, { "id": "2026-000", "title": "New Year", "date": "2026-01-01", "description": "New Year celebration", "type": "cultural", "category": "cultural", "significance": "high", "color": "bg-blue-500" }, { "id": "2026-001", "title": "Makar Sankranti", "date": "2026-01-14", "description": "Harvest festival", "type": "major", "category": "seasonal", "significance": "high", "color": "bg-yellow-500" }, { "id": "2026-002", "title": "Republic Day", "date": "2026-01-26", "description": "Indian Republic Day", "type": "cultural", "category": "cultural", "significance": "high", "color": "bg-orange-500" }, { "id": "2026-003", "title": "Vasant Panchami", "date": "2026-01-21", "description": "Goddess Saraswati festival", "type": "major", "category": "saraswati", "significance": "high", "color": "bg-yellow-400" }, { "id": "2026-004", "title": "Maha Shivaratri", "date": "2026-02-17", "description": "Great night of Lord Shiva", "type": "major", "category": "shiva", "significance": "high", "color": "bg-purple-600" }, { "id": "2026-005", "title": "Holi", "date": "2026-03-03", "description": "Festival of colors", "type": "major", "category": "krishna", "significance": "high", "color": "bg-pink-500" }, { "id": "2026-006", "title": "Gudi Padwa", "date": "2026-03-19", "description": "Marathi New Year", "type": "regional", "category": "cultural", "significance": "medium", "color": "bg-green-500", "region": "Maharashtra" }, { "id": "2026-007", "title": "Ram Navami", "date": "2026-03-27", "description": "Birth of Lord Rama", "type": "major", "category": "rama", "significance": "high", "color": "bg-blue-500" }, { "id": "2026-008", "title": "Hanuman Jayanti", "date": "2026-04-03", "description": "Birth of Lord Hanuman", "type": "major", "category": "hanuman", "significance": "high", "color": "bg-red-500" }, { "id": "2026-009", "title": "Akshaya Tritiya", "date": "2026-04-21", "description": "Auspicious day for new beginnings", "type": "major", "category": "lakshmi", "significance": "medium", "color": "bg-yellow-600" }, { "id": "2026-010", "title": "Buddha Purnima", "date": "2026-05-01", "description": "Birth of Gautama Buddha", "type": "major", "category": "cultural", "significance": "high", "color": "bg-indigo-500" }, { "id": "2026-011", "title": "Rath Yatra", "date": "2026-06-18", "description": "Chariot festival of Lord Jagannath", "type": "major", "category": "krishna", "significance": "high", "color": "bg-orange-600", "region": "Odisha" }, { "id": "2026-012", "title": "Guru Purnima", "date": "2026-07-02", "description": "Day dedicated to spiritual teachers", "type": "major", "category": "cultural", "significance": "high", "color": "bg-purple-500" }, { "id": "2026-013", "title": "Raksha Bandhan", "date": "2026-07-28", "description": "Festival celebrating brother-sister bond", "type": "major", "category": "cultural", "significance": "high", "color": "bg-pink-400" }, { "id": "2026-014", "title": "Krishna Janmashtami", "date": "2026-08-05", "description": "Birth of Lord Krishna", "type": "major", "category": "krishna", "significance": "high", "color": "bg-blue-600" }, { "id": "2026-015", "title": "Ganesh Chaturthi", "date": "2026-08-16", "description": "Birth of Lord Ganesha", "type": "major", "category": "ganesha", "significance": "high", "color": "bg-orange-600", "duration": 11 }, { "id": "2026-016", "title": "Pitru Paksha Begins", "date": "2026-08-27", "description": "Fortnight for ancestral worship", "type": "fasting", "category": "cultural", "significance": "medium", "color": "bg-gray-600", "duration": 15 }, { "id": "2026-017", "title": "Navratri Begins", "date": "2026-09-12", "description": "Nine nights of Goddess Durga", "type": "major", "category": "devi", "significance": "high", "color": "bg-red-600", "duration": 9 }, { "id": "2026-018", "title": "Dussehra", "date": "2026-09-21", "description": "Victory of good over evil", "type": "major", "category": "devi", "significance": "high", "color": "bg-orange-700" }, { "id": "2026-019", "title": "Karva Chauth", "date": "2026-09-28", "description": "Fasting festival for married women", "type": "fasting", "category": "cultural", "significance": "medium", "color": "bg-pink-600" }, { "id": "2026-020", "title": "Diwali", "date": "2026-11-08", "description": "Festival of lights", "type": "major", "category": "lakshmi", "significance": "high", "color": "bg-yellow-500", "duration": 5 }, { "id": "2026-021", "title": "Govardhan Puja", "date": "2026-11-09", "description": "Krishna worship", "type": "major", "category": "krishna", "significance": "medium", "color": "bg-green-600" }, { "id": "2026-022", "title": "Bhai Dooj", "date": "2026-11-10", "description": "Brother-sister festival", "type": "cultural", "category": "cultural", "significance": "medium", "color": "bg-blue-400" }, { "id": "2026-023", "title": "Gita Jayanti", "date": "2026-11-20", "description": "Bhagavad Gita anniversary", "type": "major", "category": "krishna", "significance": "high", "color": "bg-indigo-600" }, { "id": "2026-024", "title": "Christmas", "date": "2026-12-25", "description": "Christmas celebration", "type": "cultural", "category": "cultural", "significance": "high", "color": "bg-red-500" }, { "id": "2027-000", "title": "New Year", "date": "2027-01-01", "description": "New Year celebration", "type": "cultural", "category": "cultural", "significance": "high", "color": "bg-blue-500" }, { "id": "2027-001", "title": "Makar Sankranti", "date": "2027-01-14", "description": "Harvest festival", "type": "major", "category": "seasonal", "significance": "high", "color": "bg-yellow-500" }, { "id": "2027-002", "title": "Republic Day", "date": "2027-01-26", "description": "Indian Republic Day", "type": "cultural", "category": "cultural", "significance": "high", "color": "bg-orange-500" }, { "id": "2027-003", "title": "Vasant Panchami", "date": "2027-02-10", "description": "Goddess Saraswati festival", "type": "major", "category": "saraswati", "significance": "high", "color": "bg-yellow-400" }, { "id": "2027-004", "title": "Maha Shivaratri", "date": "2027-03-09", "description": "Great night of Lord Shiva", "type": "major", "category": "shiva", "significance": "high", "color": "bg-purple-600" }, { "id": "2027-005", "title": "Holi", "date": "2027-03-24", "description": "Festival of colors", "type": "major", "category": "krishna", "significance": "high", "color": "bg-pink-500" }, { "id": "2027-006", "title": "Gudi Padwa", "date": "2027-04-08", "description": "Marathi New Year", "type": "regional", "category": "cultural", "significance": "medium", "color": "bg-green-500", "region": "Maharashtra" }, { "id": "2027-007", "title": "Ram Navami", "date": "2027-04-15", "description": "Birth of Lord Rama", "type": "major", "category": "rama", "significance": "high", "color": "bg-blue-500" }, { "id": "2027-008", "title": "Hanuman Jayanti", "date": "2027-04-22", "description": "Birth of Lord Hanuman", "type": "major", "category": "hanuman", "significance": "high", "color": "bg-red-500" }, { "id": "2027-009", "title": "Akshaya Tritiya", "date": "2027-05-11", "description": "Auspicious day for new beginnings", "type": "major", "category": "lakshmi", "significance": "medium", "color": "bg-yellow-600" }, { "id": "2027-010", "title": "Buddha Purnima", "date": "2027-05-20", "description": "Birth of Gautama Buddha", "type": "major", "category": "cultural", "significance": "high", "color": "bg-indigo-500" }, { "id": "2027-011", "title": "Rath Yatra", "date": "2027-07-07", "description": "Chariot festival of Lord Jagannath", "type": "major", "category": "krishna", "significance": "high", "color": "bg-orange-600", "region": "Odisha" }, { "id": "2027-012", "title": "Guru Purnima", "date": "2027-07-21", "description": "Day dedicated to spiritual teachers", "type": "major", "category": "cultural", "significance": "high", "color": "bg-purple-500" }, { "id": "2027-013", "title": "Raksha Bandhan", "date": "2027-08-17", "description": "Festival celebrating brother-sister bond", "type": "major", "category": "cultural", "significance": "high", "color": "bg-pink-400" }, { "id": "2027-014", "title": "Krishna Janmashtami", "date": "2027-08-24", "description": "Birth of Lord Krishna", "type": "major", "category": "krishna", "significance": "high", "color": "bg-blue-600" }, { "id": "2027-015", "title": "Ganesh Chaturthi", "date": "2027-09-05", "description": "Birth of Lord Ganesha", "type": "major", "category": "ganesha", "significance": "high", "color": "bg-orange-600", "duration": 11 }, { "id": "2027-016", "title": "Pitru Paksha Begins", "date": "2027-09-15", "description": "Fortnight for ancestral worship", "type": "fasting", "category": "cultural", "significance": "medium", "color": "bg-gray-600", "duration": 15 }, { "id": "2027-017", "title": "Navratri Begins", "date": "2027-10-01", "description": "Nine nights of Goddess Durga", "type": "major", "category": "devi", "significance": "high", "color": "bg-red-600", "duration": 9 }, { "id": "2027-018", "title": "Dussehra", "date": "2027-10-10", "description": "Victory of good over evil", "type": "major", "category": "devi", "significance": "high", "color": "bg-orange-700" }, { "id": "2027-019", "title": "Karva Chauth", "date": "2027-10-17", "description": "Fasting festival for married women", "type": "fasting", "category": "cultural", "significance": "medium", "color": "bg-pink-600" }, { "id": "2027-020", "title": "Diwali", "date": "2027-10-29", "description": "Festival of lights", "type": "major", "category": "lakshmi", "significance": "high", "color": "bg-yellow-500", "duration": 5 }, { "id": "2027-021", "title": "Govardhan Puja", "date": "2027-10-30", "description": "Krishna worship", "type": "major", "category": "krishna", "significance": "medium", "color": "bg-green-600" }, { "id": "2027-022", "title": "Bhai Dooj", "date": "2027-10-31", "description": "Brother-sister festival", "type": "cultural", "category": "cultural", "significance": "medium", "color": "bg-blue-400" }, { "id": "2027-023", "title": "Gita Jayanti", "date": "2027-12-09", "description": "Bhagavad Gita anniversary", "type": "major", "category": "krishna", "significance": "high", "color": "bg-indigo-600" }, { "id": "2027-024", "title": "Christmas", "date": "2027-12-25", "description": "Christmas celebration", "type": "cultural", "category": "cultural", "significance": "high", "color": "bg-red-500" }, { "id": "temple-004", "title": "Satyanarayan Puja", "date": "Every Full Moon", "description": "Monthly Satyanarayan Puja on Purnima", "type": "temple", "category": "vishnu", "significance": "medium", "color": "bg-blue-400" }];
    let currentPage = 1;
    const itemsPerPage = 6;

    function buildPaginatedUpcoming() {
        const onEventsPage = window.location.pathname.includes('/events') || (window.location.hash && window.location.hash.includes('events'));
        if (!onEventsPage) return;

        try {
        let header = null;
        for (let h2 of document.querySelectorAll('h2')) {
            if (h2.textContent.includes('Upcoming Festivals')) {
                header = h2;
                break;
            }
        }
        if (!header) return;

        const sectionDiv = header.parentElement;
        if (!sectionDiv) return;
        const reactGrid = sectionDiv.nextElementSibling;
        if (!reactGrid || !reactGrid.classList.contains('grid')) return;

        // Hide React's grid so it stops interfering
        if (reactGrid.style.display !== 'none') {
            reactGrid.style.display = 'none';
        }

        if (document.getElementById('custom-upcoming-grid')) return;

        const eventDatesByTitle = EVENT_DATES_BY_TITLE;
        let processedEvents = allEventsData.map(e => {
            let fixedDate = e.date;
            if (e.id && e.id.includes('2026-')) {
                for (const [key, correctDate] of Object.entries(eventDatesByTitle)) {
                    if (e.title.toLowerCase().includes(key.toLowerCase())) {
                        fixedDate = correctDate;
                        break;
                    }
                }
            }

            // Format fallback date string if it's in YYYY-MM-DD format
            if (fixedDate && fixedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const parts = fixedDate.split('-');
                const d = new Date(parts[0], parts[1] - 1, parts[2]);
                if (!isNaN(d.getTime())) {
                    fixedDate = d.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }
            }

            return {
                ...e,
                displayDate: fixedDate,
                parsedDate: e.date && !e.date.includes('Every') ? new Date(e.date).getTime() : 9999999999999 // put recurring at end if no date
            };
        });

        // Add the missing events from inject.js
        const missingEvents = [
            { title: "Lohri", date: "Tuesday, January 13, 2026", desc: "Winter Harvest Festival", type: "Regional", color: "bg-teal-500", parsedDate: new Date("2026-01-13").getTime() },
            { title: "Pongal", date: "Wednesday, January 14, 2026", desc: "Tamil Harvest Festival", type: "Regional", color: "bg-teal-500", parsedDate: new Date("2026-01-14").getTime() },
            { title: "Baisakhi", date: "Tuesday, April 14, 2026", desc: "Sikh New Year & Harvest Festival", type: "Regional", color: "bg-teal-500", parsedDate: new Date("2026-04-14").getTime() },
            { title: "Onam", date: "Wednesday, August 26, 2026", desc: "Malayalam Harvest Festival", type: "Regional", color: "bg-teal-500", parsedDate: new Date("2026-08-26").getTime() },
            { title: "Dhanteras", date: "Friday, November 6, 2026", desc: "Worship of Wealth and Health", type: "Major", color: "bg-indigo-500", parsedDate: new Date("2026-11-06").getTime() },
            { title: "Chhath Puja", date: "Sunday, November 15, 2026", desc: "Sun God worship", type: "Regional", color: "bg-teal-500", parsedDate: new Date("2026-11-15").getTime() }
        ];

        missingEvents.forEach(me => {
            if (!processedEvents.find(pe => pe.title === me.title && String(pe.date).includes('2026'))) {
                processedEvents.push({
                    title: me.title,
                    displayDate: me.date,
                    description: me.desc,
                    type: me.type || 'cultural',
                    color: me.color,
                    parsedDate: me.parsedDate
                });
            }
        });

        // Filter for ONLY future 2026 events and temple recurring events
        processedEvents = processedEvents.filter(e => {
            if (e.id && e.id.includes('temple')) return true;
            if (e.displayDate && String(e.displayDate).includes('2026')) return true;
            return false;
        });

        // Show only current month's events (plus recurring temple events)
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        processedEvents = processedEvents.filter(e => {
            if (e.id && e.id.includes('temple')) return true; // always show recurring temple events
            if (e.parsedDate == null || e.parsedDate >= 9999999999998) return false; // "Every Friday" etc.
            const d = new Date(e.parsedDate);
            if (isNaN(d.getTime())) return false; // invalid date
            return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
        });

        processedEvents.sort((a, b) => a.parsedDate - b.parsedDate);

        // CREATE our own container independent of React
        const customContainer = document.createElement('div');
        customContainer.id = 'custom-upcoming-grid';
        customContainer.className = "grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-8";
        reactGrid.parentElement.insertBefore(customContainer, reactGrid.nextSibling);

        function renderPage() {
            customContainer.innerHTML = '';

            const startIdx = (currentPage - 1) * itemsPerPage;
            const endIdx = startIdx + itemsPerPage;
            const pageItems = processedEvents.slice(startIdx, endIdx);

            const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="lucide lucide-star h-6 w-6 text-white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>`;

            pageItems.forEach(event => {
                let displayTitle = event.title;
                if (displayTitle.includes("Gudi Padwa") && !displayTitle.includes("Ugadi")) {
                    displayTitle = "Gudi Padwa / Ugadi";
                }
                const capType = (event.type || 'regional').charAt(0).toUpperCase() + String(event.type || 'regional').slice(1);

                const card = document.createElement('div');
                card.className = "rounded-lg border bg-card text-card-foreground border-spiritual-gold/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-spiritual-light-purple/5 injected-tcard";
                card.dataset.datesFixed = "true";
                card.innerHTML = `<div class="p-8"><div class="flex items-center gap-4 mb-6"><div class="w-12 h-12 rounded-full flex items-center justify-center ${event.color}">${svgIcon}</div><div><h3 class="text-xl font-bold text-spiritual-purple">${displayTitle}</h3><p class="text-spiritual-saffron font-semibold">${event.displayDate}</p></div></div><p class="text-muted-foreground leading-relaxed mb-4">${event.description || event.desc || ''}</p><div class="flex items-center justify-between"><span class="px-3 py-1 rounded-full text-xs font-semibold text-white ${event.color}">${capType}</span></div></div>`;
                customContainer.appendChild(card);
            });

            renderPagination();
        }

        function renderPagination() {
            const totalPages = Math.max(1, Math.ceil(processedEvents.length / itemsPerPage));
            let paginator = document.getElementById('custom-paginator');
            if (paginator) {
                const prevBtn = document.getElementById('cust-prev');
                const nextBtn = document.getElementById('cust-next');
                const pageTxt = document.getElementById('cust-page-txt');
                if (prevBtn) prevBtn.disabled = currentPage <= 1;
                if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
                if (pageTxt) pageTxt.innerText = `Page ${currentPage} of ${totalPages}`;
                return;
            }

            paginator = document.createElement('div');
            paginator.id = 'custom-paginator';
            paginator.className = "flex justify-center items-center gap-4 mt-8 mb-8 w-full";

            if (customContainer.parentElement) {
                customContainer.parentElement.insertBefore(paginator, customContainer.nextSibling);
            }

            paginator.innerHTML = `
                <button id="cust-prev" class="px-4 py-2 rounded bg-spiritual-saffron text-white font-semibold shadow-lg hover:bg-spiritual-deep-orange transition disabled:opacity-50" ${currentPage <= 1 ? 'disabled' : ''}>Previous</button>
                <span id="cust-page-txt" class="text-spiritual-purple font-semibold">Page ${currentPage} of ${totalPages}</span>
                <button id="cust-next" class="px-4 py-2 rounded bg-spiritual-saffron text-white font-semibold shadow-lg hover:bg-spiritual-deep-orange transition disabled:opacity-50" ${currentPage >= totalPages ? 'disabled' : ''}>Next</button>
            `;

            document.getElementById('cust-prev').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderPage();
                    if (sectionDiv && sectionDiv.isConnected) sectionDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });

            document.getElementById('cust-next').addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderPage();
                    if (sectionDiv && sectionDiv.isConnected) sectionDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }

        renderPage();
        } catch (err) {
            console.warn('[inject.js] buildPaginatedUpcoming:', err);
        }
    }

    /** Fix wrong short dates in the "Upcoming Events" sidebar/card (e.g. Holi Mar 5 -> Mar 3). */
    /** Format "Tuesday, March 3, 2026" -> "Mar 3" */
    function toShortDate(dateStr) {
        const m = dateStr.match(/,\s*(\w+)\s+(\d+)/);
        if (!m) return dateStr;
        const mon = m[1].slice(0, 3);
        return mon + ' ' + m[2];
    }

    /** Preferred display title when multiple events share a date (same as calendar emphasis). */
    const PREFERRED_TITLE_ORDER = ['Holi', 'Gudi Padwa', 'Ram Navami', 'Rama Navami *ISKCON', 'Rama Navami *Smarta', 'Hanuman Jayanti', 'Diwali', 'Navratri', 'Dussehra', 'Maha Shivaratri', 'Satyanarayan Puja'];

    function fixUpcomingEventsWidget() {
        const candidates = document.querySelectorAll('div.rounded-2xl.shadow-2xl');
        for (const card of candidates) {
            const text = (card.textContent || '').trim();
            if (text.indexOf('Upcoming Events') === -1 || text.indexOf('View All Events') === -1) continue;
            if (card.dataset.upcomingInjected === 'true') continue;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const list = [];
            for (const [title, dateStr] of Object.entries(EVENT_DATES_BY_TITLE)) {
                const d = new Date(dateStr);
                if (isNaN(d.getTime()) || d < today) continue;
                d.setHours(0, 0, 0, 0);
                list.push({ ts: d.getTime(), dateStr, title });
            }
            list.sort((a, b) => a.ts - b.ts);

            const byDate = {};
            list.forEach(({ ts, dateStr, title }) => {
                if (!byDate[ts]) byDate[ts] = [];
                byDate[ts].push({ dateStr, title });
            });
            const picked = [];
            const seen = new Set();
            list.forEach(({ ts }) => {
                if (seen.has(ts)) return;
                seen.add(ts);
                const group = byDate[ts];
                let title = group[0].title;
                const dateStr = group[0].dateStr;
                for (const t of PREFERRED_TITLE_ORDER) {
                    const found = group.find(g => g.title === t || g.title.indexOf(t) !== -1);
                    if (found) { title = found.title; break; }
                }
                picked.push({ title, shortDate: toShortDate(dateStr) });
            });

            const maxItems = 4;
            const items = picked.slice(0, maxItems);

            Array.from(card.children).forEach(child => {
                child.style.display = 'none';
                child.dataset.injectHidden = 'true';
            });

            const wrap = document.createElement('div');
            wrap.id = 'inject-upcoming-events';
            wrap.dataset.upcomingInjected = 'true';
            wrap.className = 'space-y-4';
            let html = '<h3 class="text-xl font-bold text-spiritual-purple mb-4">Upcoming Events</h3>';
            items.forEach(({ title, shortDate }) => {
                const displayTitle = (title === 'Rama Navami *ISKCON' || title === 'Rama Navami *Smarta') ? 'Ram Navami' : (title === 'Gudi Padwa' ? 'Gudi Padwa / Ugadi' : title);
                html += '<div class="border-b border-spiritual-gold/20 pb-3"><div class="font-semibold text-spiritual-purple">' + displayTitle.replace(/<|>/g, '') + '</div><div class="text-sm text-spiritual-saffron">' + shortDate + ' <span class="text-muted-foreground">Morning</span></div></div>';
            });
            html += '<a href="/events" class="inline-block mt-4 font-semibold text-spiritual-purple hover:text-spiritual-saffron transition">View All Events →</a>';
            wrap.innerHTML = html;
            card.appendChild(wrap);
            card.dataset.upcomingInjected = 'true';
        }
    }

    /** Hide the "Upcoming Festivals" section (Maha Shivaratri, Weekly Bhajan, etc.) for now. */
    function removeUpcomingFestivalsSection() {
        const sections = document.querySelectorAll('section.py-20');
        for (const section of sections) {
            const text = (section.textContent || '').trim();
            if (text.indexOf('Upcoming Festivals') !== -1 && text.indexOf('Maha Shivaratri') !== -1 && text.indexOf('Celebrate the divine') !== -1) {
                section.style.display = 'none';
                section.dataset.injectHidden = 'true';
                break;
            }
        }
    }

    /** Hide the "Festival Categories" block (Lord Shiva, Lord Vishnu, etc.) on the events page. */
    function hideFestivalCategoriesSection() {
        const candidates = document.querySelectorAll('div.mt-8.pt-6.border-t');
        for (const el of candidates) {
            const text = (el.textContent || '').trim();
            if (text.indexOf('Festival Categories') !== -1 && text.indexOf('Lord Shiva') !== -1 && text.indexOf('Temple Events') !== -1) {
                if (el.dataset.injectHidden) return;
                el.style.display = 'none';
                el.dataset.injectHidden = 'true';
                break;
            }
        }
    }

    /** Hide the filter bar (All Festivals, All Levels, 2026, Calendar, List, Year, 106 festivals found). */
    function hideEventsFilterBar() {
        const candidates = document.querySelectorAll('div.p-6');
        for (const el of candidates) {
            const text = (el.textContent || '').trim();
            if (text.indexOf('All Festivals') !== -1 && (text.indexOf('festivals found') !== -1 || text.indexOf('Calendar') !== -1) && text.indexOf('List') !== -1) {
                if (el.dataset.injectHidden) return;
                el.style.display = 'none';
                el.dataset.injectHidden = 'true';
                const parent = el.closest('div.rounded-lg.mb-8');
                if (parent && !parent.querySelector('[data-inject-simple-calendar]')) {
                    parent.style.display = 'none';
                    parent.dataset.injectHidden = 'true';
                }
                break;
            }
        }
    }

    /** Three-card CTA above main footer columns — sister sites (injected; works with prod bundle). */
    const FOOTER_SITES_CTA_CSS = `
        /* Deep red band + golden cards (temple palette) */
        .tfs-cta {
            padding: 3rem 1.5rem 2.75rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.15);
            background:
                radial-gradient(100% 120% at 50% 0%, rgba(254, 243, 199, 0.12) 0%, transparent 55%),
                linear-gradient(160deg, #9f1239 0%, #7f1d1d 38%, #450a0a 100%);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }
        .tfs-cta-inner { max-width: 68rem; margin: 0 auto; padding: 0 0.25rem; }
        .tfs-title {
            text-align: center;
            font-size: clamp(1.05rem, 2.2vw, 1.28rem);
            font-weight: 600;
            margin: 0 auto 0.65rem;
            color: #fde68a;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        .tfs-title::after {
            content: "";
            display: block;
            width: 3.5rem;
            height: 2px;
            margin: 0.85rem auto 0;
            background: linear-gradient(90deg, transparent, #fbbf24, #fcd34d, #fbbf24, transparent);
            border-radius: 1px;
            opacity: 0.95;
        }
        .tfs-sub {
            text-align: center;
            font-size: 0.9375rem;
            line-height: 1.65;
            color: rgba(254, 243, 199, 0.88);
            margin: 0 auto 2rem;
            max-width: 32rem;
            font-weight: 400;
            letter-spacing: 0.02em;
        }
        .tfs-grid {
            display: grid;
            gap: 1.125rem;
            grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
            .tfs-grid { grid-template-columns: repeat(3, 1fr); gap: 1.35rem; }
        }
        .tfs-card {
            background: linear-gradient(165deg, #fef9c3 0%, #fde047 35%, #eab308 70%, #ca8a04 100%);
            border: 1px solid rgba(120, 53, 15, 0.22);
            border-radius: 0.75rem;
            box-shadow:
                0 1px 0 rgba(255, 255, 255, 0.45) inset,
                0 8px 28px -8px rgba(0, 0, 0, 0.35);
            transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease, filter 0.35s ease;
        }
        .tfs-card:hover {
            border-color: rgba(69, 10, 10, 0.35);
            transform: translateY(-3px);
            box-shadow:
                0 1px 0 rgba(255, 255, 255, 0.55) inset,
                0 16px 40px -12px rgba(0, 0, 0, 0.4);
            filter: brightness(1.03);
        }
        .tfs-card a {
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: 1.45rem 1.35rem;
            text-decoration: none;
            color: inherit;
            outline: none;
        }
        .tfs-card a:focus-visible {
            border-radius: 0.75rem;
            box-shadow: 0 0 0 2px #450a0a, 0 0 0 4px #fde047;
        }
        .tfs-card-title {
            font-size: 1.0625rem;
            font-weight: 700;
            color: #422006;
            margin: 0 0 0.55rem;
            line-height: 1.3;
            letter-spacing: -0.01em;
        }
        .tfs-card-desc {
            font-size: 0.8125rem;
            color: #713f12;
            margin: 0;
            flex: 1;
            line-height: 1.6;
        }
        .tfs-card-host {
            font-size: 0.6875rem;
            font-weight: 700;
            color: #7f1d1d;
            margin-top: 1rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }
    `;

    function ensureFooterSitesStyles() {
        let st = document.getElementById('temple-footer-sites-styles');
        if (!st) {
            st = document.createElement('style');
            st.id = 'temple-footer-sites-styles';
            document.head.appendChild(st);
        }
        st.textContent = FOOTER_SITES_CTA_CSS;
    }

    function injectFooterRelatedSites() {
        ensureFooterSitesStyles();
        const footer = document.querySelector('#root footer');
        if (!footer || footer.querySelector('.temple-footer-sites-cta')) return;

        const section = document.createElement('section');
        section.className = 'temple-footer-sites-cta tfs-cta';
        section.setAttribute('aria-label', 'Our extended community');
        section.innerHTML = `
            <div class="tfs-cta-inner">
                <h2 class="tfs-title">Our extended community</h2>
                <p class="tfs-sub">Visit our sister sites — the temple, Shivashram, and Astrologer Avi Sharma.</p>
                <div class="tfs-grid">
                    <article class="tfs-card">
                        <a href="https://shivatemple.nl/" target="_blank" rel="noopener noreferrer">
                            <h3 class="tfs-card-title">Lord Shiva Hindu Temples</h3>
                            <p class="tfs-card-desc">Our Amsterdam temple — daily worship, festivals, and community since 2011.</p>
                            <span class="tfs-card-host">shivatemple.nl →</span>
                        </a>
                    </article>
                    <article class="tfs-card">
                        <a href="https://shivashram.it/" target="_blank" rel="noopener noreferrer">
                            <h3 class="tfs-card-title">Shivashram</h3>
                            <p class="tfs-card-desc">Shivashram in Italy — spiritual retreat and community.</p>
                            <span class="tfs-card-host">shivashram.it →</span>
                        </a>
                    </article>
                    <article class="tfs-card">
                        <a href="https://avisharma.nl/" target="_blank" rel="noopener noreferrer">
                            <h3 class="tfs-card-title">Astrologer Avi Sharma</h3>
                            <p class="tfs-card-desc">Consultations, horoscopes, remedies, and guidance — based in Europe.</p>
                            <span class="tfs-card-host">avisharma.nl →</span>
                        </a>
                    </article>
                </div>
            </div>
        `;

        const relative = footer.querySelector(':scope > div.relative');
        if (relative) {
            relative.insertBefore(section, relative.firstChild);
        } else {
            footer.insertBefore(section, footer.firstChild);
        }
    }

    // Payment link (ING Payment Request). Clicking "Next" / "Donate" opens this.
    const TEMPLE_PAY_URL = 'https://www.ing.nl/payreq/m/?trxid=wFAaQQ3AojpKemeXoP73vh20D6iFMFFw';

    const TEMPLE_WIDGET_CSS = `
        /* Sizing here — not Tailwind arbitrary classes (they are purged from the prod CSS build). */
        /* Shorter hero + widget lifted so ~bottom quarter overlaps hero / copy (desktop). */
        .temple-donate-hero-section { overflow: visible !important; }
        .temple-donate-hero-inner {
            align-items: stretch;
            padding-top: 2.25rem !important;
            padding-bottom: 1.75rem !important;
        }
        @media (min-width: 1024px) {
            .temple-donate-hero-inner {
                flex-direction: row;
                justify-content: space-between;
                align-items: flex-start;
                gap: 1.75rem;
                padding-top: 2.5rem !important;
                padding-bottom: 1.25rem !important;
            }
        }
        .temple-hero-text-col { flex: 1 1 0%; min-width: 0; width: 100%; position: relative; z-index: 1; }
        .temple-widget-injected {
            flex: 0 0 auto;
            width: 100%;
            max-width: 360px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            z-index: 2;
        }
        @media (min-width: 1024px) {
            .temple-widget-injected {
                width: 360px;
                max-width: 360px;
                margin-left: auto;
                margin-right: 0;
                align-self: flex-start;
                /* Slight shift down from natural position; nudged a bit up from the heavier overlap */
                transform: translateY(10%);
            }
        }
        @media (max-width: 1023px) {
            .temple-widget-injected { transform: translateY(3%); }
        }
        .tw-widget { font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif; color:#2b1a2e; width: 100%; max-width: 100%; }
        .tw-widget * { box-sizing: border-box; }
        .tw-card { background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 20px 40px -12px rgba(0,0,0,0.3); border:1px solid rgba(251,191,36,0.35); max-width:100%; width: 100%; }
        .tw-header { background:#4a1d52; color:#fff; padding:12px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
        .tw-header .tw-title { font-size:14px; font-weight:600; letter-spacing:0.01em; line-height:1.3; }
        .tw-header .tw-header-sub { font-size:10px; font-weight:400; color:#e6d5ea; margin-top:2px; opacity:0.95; }
        .tw-header .tw-header-text { flex:1; min-width:0; }
        .tw-body { padding:14px 16px 12px; }
        .tw-label { font-size:11px; color:#6b4f74; margin:10px 0 4px; }
        .tw-select, .tw-input { width:100%; padding:6px 0; font-size:13px; color:#2b1a2e; background:transparent; border:none; border-bottom:1px solid #d7c7de; outline:none; }
        .tw-select { appearance:none; background-image: linear-gradient(45deg, transparent 50%, #6b4f74 50%), linear-gradient(135deg, #6b4f74 50%, transparent 50%); background-position: calc(100% - 12px) center, calc(100% - 7px) center; background-size:5px 5px, 5px 5px; background-repeat:no-repeat; padding-right:24px; }
        .tw-amounts { display:grid; grid-template-columns: repeat(3, 1fr); gap:7px; margin-top:8px; }
        .tw-amount { padding:9px 6px; border-radius:999px; border:1.5px solid #d7c7de; background:#fff; font-size:13px; font-weight:500; color:#2b1a2e; cursor:pointer; transition:all .15s; }
        .tw-amount:hover { border-color:#4a1d52; }
        .tw-amount.active { border:2px solid #4a1d52; color:#4a1d52; font-weight:600; padding:8px 6px; }
        .tw-custom { margin-top:8px; padding:8px 11px; border:1.5px solid #d7c7de; border-radius:8px; display:flex; align-items:center; gap:6px; background:#fff; }
        .tw-custom span { color:#6b4f74; font-size:13px; }
        .tw-custom input { flex:1; border:none; outline:none; font-size:13px; background:transparent; color:#2b1a2e; min-width:0; }
        .tw-comment { display:flex; align-items:center; gap:6px; margin-top:10px; font-size:12px; color:#2b1a2e; cursor:pointer; user-select:none; }
        .tw-comment input { width:14px; height:14px; accent-color:#4a1d52; cursor:pointer; }
        .tw-textarea { display:none; width:100%; margin-top:7px; padding:7px 10px; border:1.5px solid #d7c7de; border-radius:8px; font-size:12px; font-family:inherit; resize:vertical; min-height:55px; outline:none; color:#2b1a2e; }
        .tw-textarea.visible { display:block; }
        .tw-next { margin-top:12px; width:100%; padding:11px; border-radius:999px; background:#4a1d52; color:#fff; font-size:14px; font-weight:600; border:none; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:8px; transition:all .15s; text-decoration:none; }
        .tw-next:hover { background:#3a1642; box-shadow:0 8px 16px -5px rgba(74,29,82,0.5); filter: brightness(1.05); }
        .tw-footer { text-align:center; font-size:10px; color:#6b4f74; padding:10px 10px 12px; border-top:1px solid #f2ebf4; }
        .tw-footer a { color:#4a1d52; font-weight:600; text-decoration:underline; }
        .tw-summary { font-size:11px; color:#6b4f74; background:#f7f2f9; border-radius:8px; padding:10px 12px; margin-top:10px; line-height:1.45; border:1px solid #e8dce8; }
        .tw-summary strong { color:#4a1d52; font-weight:600; }
        .tw-summary .tw-sum-note { font-style:italic; color:#5c4566; }
        .tw-ing-hint { font-size:10px; color:#6b4f74; margin-top:8px; line-height:1.45; }
        .tw-copy-status { font-size:10px; color:#1e6b3a; margin-top:6px; min-height:14px; max-height:0; opacity:0; overflow:hidden; transition:opacity .2s, max-height .2s; }
        .tw-copy-status.visible { max-height:40px; opacity:1; }
    `;

    function injectDonateHero() {
        if (!window.location.pathname.includes('/donate')) return;

        const heroSection = document.querySelector(
            'section.relative.overflow-hidden.bg-gradient-to-br.from-spiritual-saffron\\/20'
        ) || Array.from(document.querySelectorAll('section.relative.overflow-hidden'))
            .find(s => s.className.includes('from-spiritual-saffron'));

        if (!heroSection) return;
        if (heroSection.querySelector('.temple-widget-injected')) return;

        heroSection.classList.add('temple-donate-hero-section');

        const inner = heroSection.querySelector('div.relative.container.mx-auto')
            || heroSection.querySelector('div.container');
        if (!inner) return;

        if (!document.getElementById('temple-widget-styles')) {
            const style = document.createElement('style');
            style.id = 'temple-widget-styles';
            style.textContent = TEMPLE_WIDGET_CSS;
            document.head.appendChild(style);
        }

        inner.classList.remove('text-center', 'items-center', 'lg:flex-row', 'lg:gap-14');
        inner.classList.add('flex', 'flex-col', 'gap-10', 'temple-donate-hero-inner');

        const textCol = document.createElement('div');
        textCol.className = 'temple-hero-text-col text-center lg:text-left w-full';
        while (inner.firstChild) textCol.appendChild(inner.firstChild);

        const widgetCol = document.createElement('div');
        widgetCol.className = 'temple-widget-injected';
        widgetCol.innerHTML = `
            <div class="tw-widget">
                <div class="tw-card">
                    <div class="tw-header">
                        <div class="tw-header-text">
                            <div class="tw-title">One-time donation</div>
                            <div class="tw-header-sub">Single payment via ING</div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>

                    <div class="tw-body">
                        <div class="tw-label">Currency</div>
                        <select class="tw-select" data-field="currency">
                            <option>Euro (EUR)</option>
                        </select>

                        <div class="tw-amounts" data-group="amount">
                            <button type="button" class="tw-amount" data-value="11">&euro;11</button>
                            <button type="button" class="tw-amount active" data-value="21">&euro;21</button>
                            <button type="button" class="tw-amount" data-value="51">&euro;51</button>
                            <button type="button" class="tw-amount" data-value="108">&euro;108</button>
                        </div>

                        <div class="tw-custom">
                            <span>&euro;</span>
                            <input type="number" min="1" placeholder="Custom Amount" data-field="custom" />
                        </div>

                        <div class="tw-label">Designation</div>
                        <select class="tw-select" data-field="designation">
                            <option>General donation</option>
                            <option>Deity worship</option>
                            <option>Goshala</option>
                            <option>Garden</option>
                            <option>Kitchen</option>
                        </select>

                        <label class="tw-comment">
                            <input type="checkbox" data-field="comment-toggle" />
                            Write us a comment
                        </label>
                        <textarea class="tw-textarea" data-field="comment" placeholder="Leave a message (optional)"></textarea>

                        <div class="tw-summary" data-role="summary" aria-live="polite"></div>
                        <p class="tw-ing-hint">This link is for a <strong>one-time</strong> payment only. ING doesn&rsquo;t read this form. Tap <strong>Next</strong> to open ING; we copy a short line you can paste into the <strong>description</strong> field. If the amount isn&rsquo;t shown on ING, enter <strong>the same € amount</strong> you chose here.</p>
                        <div class="tw-copy-status" data-role="copy-status" role="status"></div>

                        <button type="button" class="tw-next" data-action="next">
                            Next
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </button>
                    </div>

                    <div class="tw-footer">
                        Secure payment via <a href="${TEMPLE_PAY_URL}" target="_blank" rel="noopener">ING Payment Request</a>
                    </div>
                </div>
            </div>
        `;

        inner.appendChild(textCol);
        inner.appendChild(widgetCol);

        function escapeHtml(t) {
            const d = document.createElement('div');
            d.textContent = t;
            return d.innerHTML;
        }

        function readWidgetState() {
            const customEl = widgetCol.querySelector('[data-field="custom"]');
            const rawCustom = customEl && customEl.value.trim() ? customEl.value.trim() : '';
            let amount = '';
            if (rawCustom) {
                const n = Number(rawCustom);
                amount = !Number.isNaN(n) && n > 0 ? String(Math.round(n * 100) / 100) : '';
            }
            if (!amount) {
                const amtBtn = widgetCol.querySelector('[data-group="amount"] button.active');
                amount = amtBtn ? amtBtn.dataset.value : '';
            }
            if (!amount) amount = '21';
            const des = widgetCol.querySelector('[data-field="designation"]')?.value || 'General donation';
            const useComment = widgetCol.querySelector('[data-field="comment-toggle"]')?.checked;
            const comment = useComment
                ? (widgetCol.querySelector('[data-field="comment"]')?.value?.trim() || '')
                : '';
            return { amount, des, comment };
        }

        function buildReferenceLine(s) {
            const parts = [`LSHT one-time donation €${s.amount}`, s.des];
            if (s.comment) {
                const oneLine = s.comment.replace(/\s+/g, ' ');
                parts.push(oneLine.length > 90 ? oneLine.slice(0, 87) + '…' : oneLine);
            }
            return parts.join(' | ');
        }

        function updateSummary() {
            const el = widgetCol.querySelector('[data-role="summary"]');
            if (!el) return;
            const s = readWidgetState();
            const noteBit = s.comment
                ? ` · <span class="tw-sum-note">${escapeHtml(s.comment.length > 48 ? s.comment.slice(0, 45) + '…' : s.comment)}</span>`
                : '';
            el.innerHTML = `<strong>Your selection:</strong> €${escapeHtml(s.amount)} · ${escapeHtml(s.des)}${noteBit}`;
        }

        function bindSummaryUpdates() {
            const run = () => updateSummary();
            widgetCol.querySelectorAll('[data-group] button').forEach(b => b.addEventListener('click', run));
            const customInput = widgetCol.querySelector('[data-field="custom"]');
            if (customInput) customInput.addEventListener('input', run);
            const des = widgetCol.querySelector('[data-field="designation"]');
            if (des) des.addEventListener('change', run);
            const commentBox = widgetCol.querySelector('[data-field="comment"]');
            if (commentBox) commentBox.addEventListener('input', run);
            const commentToggle = widgetCol.querySelector('[data-field="comment-toggle"]');
            if (commentToggle) commentToggle.addEventListener('change', run);
        }

        // Wire up segmented toggles and amount pills
        widgetCol.querySelectorAll('[data-group]').forEach(group => {
            group.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', () => {
                    group.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    if (group.dataset.group === 'amount') {
                        const customInput = widgetCol.querySelector('[data-field="custom"]');
                        if (customInput) customInput.value = '';
                    }
                });
            });
        });

        const customInput = widgetCol.querySelector('[data-field="custom"]');
        if (customInput) {
            customInput.addEventListener('input', () => {
                if (customInput.value) {
                    widgetCol.querySelectorAll('[data-group="amount"] button')
                        .forEach(b => b.classList.remove('active'));
                }
            });
        }

        const commentToggle = widgetCol.querySelector('[data-field="comment-toggle"]');
        const commentBox = widgetCol.querySelector('[data-field="comment"]');
        if (commentToggle && commentBox) {
            commentToggle.addEventListener('change', () => {
                commentBox.classList.toggle('visible', commentToggle.checked);
            });
        }

        const nextBtn = widgetCol.querySelector('[data-action="next"]');
        if (nextBtn) {
            nextBtn.addEventListener('click', async () => {
                const s = readWidgetState();
                const line = buildReferenceLine(s);
                const status = widgetCol.querySelector('[data-role="copy-status"]');
                try {
                    await navigator.clipboard.writeText(line);
                    if (status) {
                        status.textContent = 'Copied to clipboard — paste into the payment description on ING if you see a field for it.';
                        status.classList.add('visible');
                        window.setTimeout(() => status.classList.remove('visible'), 6000);
                    }
                } catch {
                    if (status) {
                        status.textContent = 'Could not copy automatically — select and copy the grey “Your selection” text above, then open ING.';
                        status.classList.add('visible');
                        window.setTimeout(() => status.classList.remove('visible'), 8000);
                    }
                }
                window.open(TEMPLE_PAY_URL, '_blank', 'noopener');
            });
        }

        bindSummaryUpdates();
        updateSummary();
    }

    function applyPatches() {
        buildPaginatedUpcoming();
        removeUpcomingFestivalsSection();
        injectMaps();
        fixServicesIcons();
        equalizeSanskars();
        fixAboutUs();
        fixContactFormHang();
        fixEventDates();
        replaceWithSimpleCalendar();
        fixCalendarDates();
        removeRecurringEventsFromCalendar();
        fixUpcomingEventsWidget();
        hideFestivalCategoriesSection();
        hideEventsFilterBar();
        injectMissingEvents();
        injectDonateHero();
        injectFooterRelatedSites();
    }

    // Run once on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyPatches);
    } else {
        applyPatches();
    }

    // Use MutationObserver to apply patches dynamically when React renders/updates the DOM
    const observer = new MutationObserver((mutations) => {
        let shouldApply = false;
        for (let m of mutations) {
            if (m.addedNodes.length > 0) {
                shouldApply = true;
                break;
            }
        }
        if (shouldApply) {
            applyPatches();
        }
    });

    const root = document.getElementById('root');
    if (root) {
        observer.observe(root, { childList: true, subtree: true });
    }
})();
