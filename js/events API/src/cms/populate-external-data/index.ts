

import type { CMSFilters } from '../../types/CMSFilters';
import type { Event } from './types';


(() => {
/**==============
 * Populate CMS Data from an external API.
 ==============*/

window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsfilter',
  async (filtersInstances: CMSFilters[]) => {
    // Get the filters instance
    const [filtersInstance] = filtersInstances;

    // Get the list instance
    const { listInstance } = filtersInstance;

    // Save a copy of the template
    const [firstItem] = listInstance.items;
    const itemTemplateElement = firstItem.element;

    // Fetch external data
    const events = await fetchEvents();
    console.log('events',events)

        // If events array is empty, create a message and link
        if (events.length === 0) {
          const errorMessage = document.createElement('div');
          errorMessage.textContent = "Our API isn't working right now, but you can see all our events on Opensports";
          const opensportsLink = document.createElement('a');
          opensportsLink.textContent = 'Opensports';
          opensportsLink.href = 'https://www.opensports.com';
          errorMessage.appendChild(opensportsLink);
    
          // Add the error message to the list container
          const listContainer = document.querySelector('.w-dyn-list');
          if (listContainer) {
            listContainer.appendChild(errorMessage);
          }
          return;
        }

    // Remove existing items
    listInstance.clearItems();

    // Create the new items
    const newItems = events.map((event) => createItem(event, itemTemplateElement));

    // Populate the list
    await listInstance.addItems(newItems);

    // Get the template filter
    const filterTemplateElement = filtersInstance.form.querySelector<HTMLLabelElement>('[data-element="filter"]');
    if (!filterTemplateElement) return;

    // Get the parent wrapper
    const filtersWrapper = filterTemplateElement.parentElement;
    if (!filtersWrapper) return;

    // Remove the template from the DOM
    filterTemplateElement.remove();

    // Sync the CMSFilters instance with the new created filters
    filtersInstance.storeFiltersData();
  },
]);

// Fetches data from opensports API, and gets just the resutls portion (with an array of event data)

const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch('https://philadelphiavolleyball.org/api/events');
    const jsonData = await response.json();

    // Check if the "items" property exists and is an array
    const items = jsonData && jsonData.items && Array.isArray(jsonData.items)
      ? jsonData.items
      : [];
      console.log('items', items);
    return items;
    
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

/**
 * Creates an item from the template element.
 * @param event The event data to create the item from.
 * @param templateElement The template element.
 *
 * @returns A new Collection Item element.
 */
const createItem = (event: Event, templateElement: HTMLDivElement) => {
  // Clone the template element
  const newItem = templateElement.cloneNode(true) as HTMLDivElement;





//Process values from the API to get them to the intended formats

//========DATES =======
//=====================
//======================

//start formated with day and month
const startDateTime = new Date(event.start);
  const startFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(startDateTime);
  
//Just the time for end
const endDateTime = new Date(event.end);
  const endFormatted = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(endDateTime);

  //Final formatted date
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

  //Just the Day fo the Week for filtering
  const dayofWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(startDateTime);



//====================== EVENT URL


  //create full URL from post aliasID
  const eventURL = 'https://opensports.net/posts/' + event.id;
  
//===============Level for filters

const eventLevel = event.level;

function mapConstValue(eventLevel: string): string {
  // Define the mapping rules
  const mappings: { [key: string]: string } = {
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

  // Map the event level to the corresponding value
  return mappings[eventLevel] || "Invalid input";
}

// Example usage
const filterLevel: string = mapConstValue(eventLevel);




  // Query inner elements to modify
  const date = newItem.querySelector<HTMLDivElement>('[data-element="date"]');
  const title = newItem.querySelector<HTMLHeadingElement>('[data-element="title"]');
  const description = newItem.querySelector<HTMLParagraphElement>('[data-element="description"]');
  const level = newItem.querySelector<HTMLParagraphElement>('[data-element="level"]');
  const type = newItem.querySelector<HTMLParagraphElement>('[data-element="type"]');
  const location = newItem.querySelector<HTMLParagraphElement>('[data-element="location"]');
  const gender = newItem.querySelector<HTMLParagraphElement>('[data-element="gender"]');
  const day = newItem.querySelector<HTMLParagraphElement>('[data-element="day"]');
  const sort_date = newItem.querySelector<HTMLParagraphElement>('[data-element="sort_date"]');
  const filter_level = newItem.querySelector<HTMLParagraphElement>('[data-element="filter_level"]');
  const link = newItem.querySelector<HTMLLinkElement>('[data-element="link"]');
  

  // Populate inner elements
  //check if they exist first, set the content if they do
  if (date) date.textContent = formattedDate;
  if (title) title.textContent = event.title;
  if (description) description.textContent = event.description;
  if (level) level.textContent = event.level;
  if (type) type.textContent = event.eventType;
  if (gender) gender.textContent = event.gender;
  if (day) day.textContent = dayofWeek;
  if (location) location.textContent = event.location.neighborhood;
  if (link) link.href = eventURL;
  if (link) link.setAttribute('event-type',event.eventType)
  if (link) link.setAttribute('loaded','true')
  if (sort_date) sort_date.textContent = formattedSortDate;
  if (filter_level) filter_level.textContent = filterLevel;
  return newItem;
};

/**
 * Collects all the categories from the events' data.
 * @param events The events' data.
 *
 * @returns An array of {@link Event} categories.
 */
// const collectCategories = (events: Event[]) => {
//   const categories: Set<Event['category']> = new Set();

//   for (const { category } of events) {
//     categories.add(category);
//   }

//   return [...categories];
// };

/**
 * Creates a new radio filter from the template element.
 * @param category The filter value.
 * @param templateElement The template element.
 *
 * @returns A new category radio filter.
 */
// const createFilter = (category: Event['category'], templateElement: HTMLLabelElement) => {
//   // Clone the template element
//   const newFilter = templateElement.cloneNode(true) as HTMLLabelElement;

//   // Query inner elements
//   const label = newFilter.querySelector('span');
//   const radio = newFilter.querySelector('input');

//   if (!label || !radio) return;

//   // Populate inner elements
//   label.textContent = category;
//   radio.value = category;

//   return newFilter;
// };
})();


