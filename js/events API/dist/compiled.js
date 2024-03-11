(() => {
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
        'cmsfilter',
        async (filtersInstances) => {
            const [filtersInstance] = filtersInstances;
            const { listInstance } = filtersInstance;
            const [firstItem] = listInstance.items;
            const itemTemplateElement = firstItem.element;
            const events = await fetchEvents();
            console.log('events', events);
            if (events.length === 0) {
                const errorMessage = document.createElement('div');
                errorMessage.textContent = "Our API isn't working right now, but you can see all our events on Opensports";
                const opensportsLink = document.createElement('a');
                opensportsLink.textContent = 'Opensports';
                opensportsLink.href = 'https://www.opensports.com';
                errorMessage.appendChild(opensportsLink);
                const listContainer = document.querySelector('.w-dyn-list');
                if (listContainer) {
                    listContainer.appendChild(errorMessage);
                }
                return;
            }
            listInstance.clearItems();
            const newItems = events.map((event) => createItem(event, itemTemplateElement));
            await listInstance.addItems(newItems);
            const filterTemplateElement = filtersInstance.form.querySelector('[data-element="filter"]');
            if (!filterTemplateElement)
                return;
            const filtersWrapper = filterTemplateElement.parentElement;
            if (!filtersWrapper)
                return;
            filterTemplateElement.remove();
            filtersInstance.storeFiltersData();
        },
    ]);
    const fetchEvents = async () => {
        try {
            const response = await fetch('https://philadelphiavolleyball.org/api/events');
            const jsonData = await response.json();
            const items = jsonData && jsonData.items && Array.isArray(jsonData.items)
                ? jsonData.items
                : [];
            console.log('items', items);
            return items;
        }
        catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    };
    const createItem = (event, templateElement) => {
        const newItem = templateElement.cloneNode(true);
        const startDateTime = new Date(event.start);
        const startFormatted = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(startDateTime);
        const endDateTime = new Date(event.end);
        const endFormatted = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(endDateTime);
        const formattedDate = `${startFormatted} - ${endFormatted}`;
        const sortDate = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(startDateTime);
        const formattedSortDate = sortDate.replace(" at", "");
        const dayofWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(startDateTime);
        const eventURL = 'https://opensports.net/posts/' + event.id;
        const eventLevel = event.level;
        function mapConstValue(eventLevel) {
            const mappings = {
                "B": "B",
                "B/⬇BB": "B",
                "⬇BB": "BB",
                "⬇BB/⬆BB": "BB",
                "BB": "BB",
                "⬆BB": "BB",
                "⬆BB/A": "A",
                "A": "A",
                "A/AA": "A"
            };
            return mappings[eventLevel] || "Invalid input";
        }
        const filterLevel = mapConstValue(eventLevel);
        const date = newItem.querySelector('[data-element="date"]');
        const title = newItem.querySelector('[data-element="title"]');
        const description = newItem.querySelector('[data-element="description"]');
        const level = newItem.querySelector('[data-element="level"]');
        const type = newItem.querySelector('[data-element="type"]');
        const location = newItem.querySelector('[data-element="location"]');
        const gender = newItem.querySelector('[data-element="gender"]');
        const day = newItem.querySelector('[data-element="day"]');
        const sort_date = newItem.querySelector('[data-element="sort_date"]');
        const filter_level = newItem.querySelector('[data-element="filter_level"]');
        const link = newItem.querySelector('[data-element="link"]');
        if (date)
            date.textContent = formattedDate;
        if (title)
            title.textContent = event.title;
        if (description)
            description.textContent = event.description;
        if (level)
            level.textContent = event.level;
        if (type)
            type.textContent = event.eventType;
        if (gender)
            gender.textContent = event.gender;
        if (day)
            day.textContent = dayofWeek;
        if (location) {
            location.textContent = event.location.neighborhood ? event.location.neighborhood : event.location.title;
        }
        if (link)
            link.href = eventURL;
        if (link)
            link.setAttribute('event-type', event.eventType);
        if (link)
            link.setAttribute('loaded', 'true');
        if (sort_date)
            sort_date.textContent = formattedSortDate;
        if (filter_level)
            filter_level.textContent = filterLevel;
        return newItem;
    };
})();