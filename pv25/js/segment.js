if (demoEnv == true){
} else {
$(document).ready(function() {

  !function() {
    var i = "analytics", analytics = window[i] = window[i] || [];
    if (!analytics.initialize)
      if (analytics.invoked)
        window.console && console.error && console.error("Segment snippet included twice.");
      else {
        analytics.invoked = !0;
        analytics.methods = ["trackSubmit", "trackClick", "trackLink", "trackForm", "pageview", "identify", "reset", "group", "track", "ready", "alias", "debug", "page", "screen", "once", "off", "on", "addSourceMiddleware", "addIntegrationMiddleware", "setAnonymousId", "addDestinationMiddleware", "register"];
        analytics.factory = function(e) {
          return function() {
            if (window[i].initialized)
              return window[i][e].apply(window[i], arguments);
            var n = Array.prototype.slice.call(arguments);
            if (["track", "screen", "alias", "group", "page", "identify"].indexOf(e) > -1) {
              var c = document.querySelector("link[rel='canonical']");
              n.push({__t: "bpc", c: c && c.getAttribute("href") || void 0, p: location.pathname, u: location.href, s: location.search, t: document.title, r: document.referrer});
            }
            n.unshift(e);
            analytics.push(n);
            return analytics
          }
        };
        for (var n = 0; n < analytics.methods.length; n++) {
          var key = analytics.methods[n];
          analytics[key] = analytics.factory(key)
        }
        analytics.load = function(key, n) {
          var t = document.createElement("script");
          t.type = "text/javascript";
          t.async = !0;
          t.setAttribute("data-global-segment-analytics-key", i);
          t.src = "https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";
          var r = document.getElementsByTagName("script")[0];
          r.parentNode.insertBefore(t, r);
          analytics._loadOptions = n
        };
        analytics._writeKey = "kPiNc3GxS81ANxHh1jLjMWmGU1olcC5i";
        analytics.SNIPPET_VERSION = "5.2.0";
        analytics.load("kPiNc3GxS81ANxHh1jLjMWmGU1olcC5i");
      }
  }();
// Define middleware *before* any analytics calls
  analytics.addSourceMiddleware(({ payload, next }) => {
    // Check if the payload has already been modified by this middleware
    payload.obj.properties = payload.obj.properties || {};
    if (payload.obj.properties.is_middleware_processed) {
      return next(payload);
    }
    
    // Add the flag to indicate this payload has been processed
    payload.obj.properties.is_middleware_processed = true;
    
    const eventType = payload.obj.type;
    const props = payload.obj.properties;

    // Use string literals to access localStorage
    const utm_sourceVal = localStorage.getItem('utm_source') || null;
    const utm_mediumVal = localStorage.getItem('utm_medium') || null;
    const utm_campaignVal = localStorage.getItem('utm_campaign') || null;
    const utm_termVal = localStorage.getItem('utm_term') || null;
    const utm_contentVal = localStorage.getItem('utm_content') || null;
    const placementVal = localStorage.getItem('placement') || null;
    const deviceVal = localStorage.getItem('device') || null;
    const creativeVal = localStorage.getItem('creative') || null;
    
    // Define segGa4cid or remove if not needed
    const segGa4cid = (window.gaGlobal && window.gaGlobal.vid) || null; // Add safety check
    
    // Merge properties from payload with your custom ones
    Object.assign(props, {
      s_id: payload.obj.sessionId || null,
      anonymous_id: payload.obj.anonymousId || null,
      context_locale: (payload.obj.context && payload.obj.context.locale) || null,
      timestamp: payload.obj.timestamp || null,
      ga4cid: segGa4cid,
      
      utm_campaign: utm_campaignVal,
      utm_medium: utm_mediumVal,
      utm_source: utm_sourceVal,
      utm_term: utm_termVal,
      utm_content: utm_contentVal,
      tracking_creative: creativeVal,
      tracking_placement: placementVal,
      tracking_device: deviceVal,

      tracking_utm_campaign: utm_campaignVal,
      tracking_utm_medium: utm_mediumVal,
      tracking_utm_source: utm_sourceVal,
      tracking_utm_term: utm_termVal,

      context_campaign_name: utm_campaignVal,
      context_campaign_medium: utm_mediumVal,
      context_campaign_source: utm_sourceVal,
      context_campaign_term: utm_termVal,

      session_referrer: 'Session_referrer', // Still needs a real value
      context_page_referrer: (payload.obj.context && payload.obj.context.page && payload.obj.context.page.referrer) || null,
      id: null,
      
      context_page_title: (payload.obj.context && payload.obj.context.page && payload.obj.context.page.title) || null,
      context_ip: (payload.obj.context && payload.obj.context.ip) || null,
      context_user_agent: (payload.obj.context && payload.obj.context.userAgent) || null,

      user_id: payload.obj.userId || null,
      country: ((locale) => new Intl.DisplayNames(['en-US'], {type: 'region'}).of(locale.split('-').pop()))(payload.obj.context.locale) || null,
    });

    if (eventType === 'page') {
      props.url = (payload.obj.context && payload.obj.context.page && payload.obj.context.page.url) || null;
    } else {
      props.context_page_url = (payload.obj.context && payload.obj.context.page && payload.obj.context.page.url) || null;
      props.context_page_path = (payload.obj.context && payload.obj.context.page && payload.obj.context.page.path) || null;
    }
    
    console.log('Modified Payload:', payload.obj);
    next(payload);
  });
  
  // Use analytics.ready() to ensure all subsequent calls are made after the library is initialized.
  analytics.ready(function() {
    analytics.page();
    trackClicks();
  });

  function trackClicks() {
    const clickables = $('a, button, .dropdown--button, .fs-filter-search');

    clickables.on('click', function() {
      const element = $(this);
      let linkIdentifier;
      let elementLocation = '';

      if (element.attr('href')) {
        linkIdentifier = element.attr('href');
      } else if (element.attr('aria-label')) {
        linkIdentifier = element.attr('aria-label');
      } else if (element.attr('id')) {
        linkIdentifier = element.attr('id');
      } else {
        console.log("No href, aria-label, or id found.");
        linkIdentifier = 'N/A';
      }

      element.parents().each(function() {
        const tagName = this.tagName;
        const classList = this.classList.length ? '.' + Array.from(this.classList).join(' > ') : '';
        elementLocation = tagName.toLowerCase() + classList;
        return false; // stop after the first parent
      });


        element.parents().each(function(index) {
            const tagName = this.tagName.toLowerCase();
            const classList = this.classList.length ? '.' + Array.from(this.classList).join('.') : '';
            elementLocation = (tagName + classList) + (elementLocation ? ' > ' + elementLocation : '');
        });



      analytics.track('Clicked Interactive Element', {
        'element_type': this.tagName,
        'href_url': linkIdentifier,
        'location': elementLocation,
        'text': $(this).text(),
      });
    });
  }



    const scrollDepths = [20, 40, 60, 80, 100];
    const trackedElements = [];
    console.log('scrolldepth elements')
    // Create and position new elements using jQuery
    $('main').css('position','realtive');
    scrollDepths.forEach(depth => {
        const $newElement = $('<div>')
            .addClass('scroll-item')
            .text(`${depth}% from top`)
            .css('top', `${depth}%`).css('position','absolute').css('opacity','0');

        $('main').css('position','relative').append($newElement);
        trackedElements.push($newElement[0]);
    });

    // Define the track function
    function trackScrollDepth(scrollDepth) {
        // Check if the analytics object exists before calling the method
        if (typeof analytics !== 'undefined' && analytics.track) {
            analytics.track('Scroll Depth', {
                properties: {
                    scroll_depth: `${scrollDepth}%`
                }
            });
            console.log(`Analytics event "Scroll Depth" for ${scrollDepth}% tracked.`);
        } else {
            console.warn('Analytics object not found. Event not tracked.');
        }
    }

    // Setup Intersection Observer API
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const elementTop = entry.target.style.top;
                const scrollDepth = parseInt(elementTop.replace('%', ''));
                
                // Call the new tracking function
                trackScrollDepth(scrollDepth);

                // Stop observing the element after it has been seen once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Start observing the created elements
    trackedElements.forEach(element => {
        observer.observe(element);
    });

});

  $('form').on('submit', function(event) {
    // Prevent the default form submission to send the analytics event first
    event.preventDefault();
    const formEl = $(this);
    analytics.track('Form Submitted', {
      form_id: formEl.attr('id') || 'No ID',
      formClass: formEl.attr('class') || 'No class',
      marketo_fields_email: formEl.find('[type="email"').val(),
    });

    setTimeout(function() {
      formEl.off('submit').submit();
    }, 500); // 500ms delay
  });

}

