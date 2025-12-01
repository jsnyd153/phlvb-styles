const featuresData = [

                        {
            "id":10005,
            "image":"https://cdn.prod.website-files.com/6606bdecf31e2757cbfbb965/68c991a3b1dd7253c295e6f7_vr-exp.jpg",
            "label":"VR Experience",
            "title":"Where New Ideas Come to Life",
            "body":"Join us in the Confluent Booth for a fun, interactive, virtual reality adventure. Take part in our Data Streaming Tournament where you'll face off against the persistent headaches of managing open source Kafka.",
            "color":"purple",
            "background":"https://cdn.prod.website-files.com/6606bdecf31e2757cbfbb965/685c9f0a2c8a8acc91b465d2_purple-texture-1.svg"
            },
            {
            "id":10002,
            "image":"https://cdn.prod.website-files.com/6606bdecf31e2757cbfbb965/68c98b7f465da5933a1a833a_booth.jpg",
            "label":"DSE Certification",
            "title":"Claim Your Spot in the Hall of Fame",
            "body":"Step up your game—head to the Certification Lounge to earn your Data Streaming Engineer Certification. It’s free! Plus, score exclusive swag and secure your spot in the Confluent Hall of Fame!",
            "color":"blue",
            "background":"https://cdn.prod.website-files.com/6606bdecf31e2757cbfbb965/685c9f0a9bbc765fa897419a_blue-texture-1.svg"
            },
            {
            "id":10003,
            "image":"https://cdn.prod.website-files.com/6606bdecf31e2757cbfbb965/6877ebac644165971a1bd1e6_filmstrip4.avif",
            "label":"AI Alley",
            "title":"Catch Innovation in Action",
            "body":"Explore AI Alley, an immersive space where AI and real-time data come to life. Tour the AI-powered art gallery and take part in hands-on workshops and learning experiences by companies including AWS and Databricks. ",
            "color":"red",
            "background":"https://cdn.prod.website-files.com/6606bdecf31e2757cbfbb965/685eab0744fa1457f38c9548_red-texture-1.svg"
            },
                        {
            "id":10001,
            "image":"https://cdn.prod.website-files.com/6606bdecf31e2757cbfbb965/68c98cb05c6df529e0c7df04_expo-hall.jpg",
            "label":"Expo Floor",
            "title":"Step in. Explore. Get Inspired.",
            "body":"Discover the latest innovations in data streaming and AI, see cutting-edge products in action from major industry players, and connect with experts and peers.",
            "color":"blue",
            "background":"https://cdn.prod.website-files.com/6606bdecf31e2757cbfbb965/685eab0744fa1457f38c9548_red-texture-1.svg"
            },
            {
            "id":10004,
            "image":"https://cdn.prod.website-files.com/6606bdecf31e2757cbfbb965/68c98b8f733861ae1b912f73_meetup-2.jpg",
            "label":"Meetup Hub",
            "title":"Where New Ideas Come to Life",
            "body":"Stop by the Meetup Hub to connect with fellow developers in a relaxed and collaborative environment. Join technical talks, panels, and AMAs (ask-me-anything) with plenty of room for Q&As and one-on-one interactions.",
            "color":"gold",
            "background":"https://cdn.prod.website-files.com/6606bdecf31e2757cbfbb965/685eab0744fa1457f38c9548_red-texture-1.svg"
            },

]

const personas = [
    {
        "id":"architect",
        "start":"an",
       "displayName":"Architect",
        "sessions": [
            //(Breakout) Agentic AI Meets Kafka + Flink: Event-Driven Orchestration for Multi-Agent Systems 
            1000035,
            // (Lightning) Metadata: From Zookeeper to KRaft
            956038,
            // (Lightning) Orchestrating a Successful Kafka Migration
            956355,
            // (Breakout) Escape the Micro-Maze: Build Fast, Scalable Streaming Services with Apache Flink
            957087,
            // (Breakout) From “Where’s My Money?” to “Here’s Your Bill”: Demystifying Kafka Chargebacks and Showbacks
            955984,
            // (Breakout) Press Play on Data: Netflix's Journey from Streams to Gaming Insights
            956506,
            // (Lightning) Real-Time Data Infrastructure at Scale: Lessons from Meta's Streaming Architecture
            956839,
            // (Breakout) Unifying Kafka and Relational Databases for Event Streaming Applications
            999280,
            // (Breakout) Smart Action in Real-time: Building Agentic AI Systems Powered by AWS and Confluent Streaming
            999275
        ],
        "introCopy":'Join us for two days and architect the future of real-time intelligent systems. Unlock the playbook top architects use to design data streaming patterns, scalable data stacks, and real-timeAI/ML systems. Connect with the best minds in data, trade field-proven insights, and future proof your career with the latest in Kafka, Flink, Iceberg, and beyond.',
        "features": [
            10001,
            10002,
            10003,
            10004,
        ],
    },
 {
        "id":"developer",
        "start":"a",
        "displayName":"Developer",
        "sessions": [
            // (Breakout) From Tower of Babel to Babel Fish: Evolving Your Kafka Architecture With Schema Registry
            952670,
            // (Breakout) How to Build, Deploy, and Orchestrate Event-Driven Streaming Agents on Apache Flink
            943906,
            // (Breakout) Bringing stories to life with AI, data streaming and generative agents
            953501,
            // (Breakout) How Apache Kafka and Flink Power Event-Driven Agentic AI in Real Time
            932353,
            // (Breakout) Smart Action in Real-time: Building Agentic AI Systems Powered by AWS and Confluent Streaming
            999275,
            // (Breakout) Unlocking Inter-Agent Collaboration: Confluent Powers Scalable AI with Google Cloud's A2A
            999304,
            // (Breakout) The Kafka Protocol Deconstructed: A Live-Coded Deep Dive
            957235,
            // (Breakout) Event Driven Views with Ingest-Materialize-Index Stream Topology
            957875,
            // (Lightning) What Can You Do with a (Kafka) Queue?
            956011,

        ],
        "introCopy":"Join us for two days and architect the future of real-time intelligent systems. Unlock the playbook top architects use to design, scale, and operate data streaming patterns, data stacks, and real-time AI/ML systems. Connect with the best minds in data, trade field-proven insights, and future proof your career with the latest in Kafka, Flink, Iceberg, and beyond.",
         "features": [
            10001,
            10002,
            10004,
            10003,
        ],
    },
     {
        "id":"data_engineer",
        "start":"a",
        "displayName":"Data Engineer",
        "sessions": [
        // (Breakout) Tuning the Iceberg: Practical Strategies for Optimizing Tables and Queries  
        956093,
        // (Breakout) What the Spec?!: New Features in Apache Iceberg™ Table Format V3 
        957876,
        // (Breakout) Unlocking the Mysteries of Apache Flink 
        955364,
        // (Breakout) Stream All the Things — Patterns of Effective Data Stream Processing   
        956997,
        // (Breakout) Evolving the Data Supply Chain: Powering Real-Time Analytics & GenAI with Flink, Iceberg, and Trino
        955983,
        // (Breakout) Rocket Mortage: Agents Running A Data Mesh
        957957,
        // (Breakout) Powering Real-Time Vehicle Intelligence at Rivian with Apache Flink
        954053,
        // (Lightning) The Zen of PyFlink: The evolution towards a truly “pythonic” Flink 
        954451,
        // (Lightning) Table API on Confluent Cloud: Show me Examples!
        955898
        ],
        "introCopy":"Join us for two days and build the backbone of tomorrow’s data-driven enterprises. Unlock the playbook top data engineers use to power their AI journey without complex ETL, optimize pipelines for trusted data, and drive interoperability with open data architectures. Connect with the best minds in data, trade field-proven insights, and future proof your career with the latest in Kafka, Flink, Iceberg, and beyond.",
        "features": [
            10001,
            10005,
            10003,
            10002,
        ],
    },
     {
        "id":"operator",
        "start":"an",
        "displayName":"Operator",
        "sessions": [
            // (Lightning) Orchestrating a Successful Kafka Migration
            956355,
            // (Lightning) Metadata: From Zookeeper to KRaft
            956038,
            // (Breakout) Sizing, Benchmarking and Performance Tuning Apache Flink Clusters
            943407,
            // (Breakout) Change Data Capture at Scale: Insights from Slack's Streaming Pipeline
            932237,
            // (Breakout) Scaling Streaming Computation at LinkedIn: A Multi-Year Journey with Apache Flink
            928165,
            // (Breakout) Robinhood's Use of WarpStream for Logging
            952834,
            // (Breakout) GC, JIT and Warmup: The JVM's Role in Flink at Scale
            955808,
            // (Breakout) Quiet Failures, Loud Consequences: Streaming ML Drift Detection in Practice
            944093,
            // (Lightning) Real-Time Data Infrastructure at Scale: Lessons from Meta's Streaming Architecture
            956839,
        ],
        "introCopy":"Join us for two days and master operating mission-critical data infrastructure. Learn proven strategies for managing large-scale migrations, optimizing performance, and maintaining reliability—all while minimizing downtime. Connect with elite operators, trade field-proven insights, and future proof your career with the latest in Kafka, Flink, Iceberg, and beyond.",
        "features": [
            10001,
            10002,
            10003,
            10005,
        ],
    },
    {
        "id":"tech_exec",
        "start":"a",
       "displayName":"Tech Executive",
        "sessions": [
            // (Breakout) How Apache Kafka and Flink Power Event-Driven Agentic AI in Real Time
            932353,
            // (Breakout) Agents Running A Data Mesh
            957957,
            // (Lightning) Real-Time Data Infrastructure at Scale: Lessons from Meta's Streaming Architecture
            956839,
            // (Lightning) Scaling Streaming Computation at LinkedIn: A Multi-Year Journey with Apache Flink
            956562,
            // (Breakout) Evolving the Data Supply Chain: Powering Real-Time Analytics & GenAI with Flink, Iceberg, and Trino
            955983,
            // (Breakout) From “Where’s My Money?” to “Here’s Your Bill”: Demystifying Kafka Chargebacks and Showbacks
            955984,
        ],
        "introCopy":'Join us for two days and accelerate business success with real-time data. Unlock the playbook top tech execs use to drive competitive advantage, build the foundation for AI-driven innovation, and create a future-proof tech stack. Connect with the best minds in data, trade field-proven insights, and stay ahead of the curve on AI and data streaming technologies shaping tomorrow.',
         "features": [
            10001,
            10005,
            10003,
  
        ],
    }
]
$(document).ready(function() {

const experienceContainer =  $('.bento_grid--section');
const experienceListItems = experienceContainer.find('> div');
// gsap.set(experienceListItems, {opacity:0});



    // Function to update the session content based on a persona ID
    function updateSessions(personaKey) {
    // gsap.to(experienceListItems,{opacity:0,duration:.0});

        const persona = personas.find(p => p.id === personaKey);

        $('.schedule--session').hide(); 

        if (persona) {
            $('#display-name').text(persona.displayName);
            $('#experience-intro').text(persona.introCopy);
            $('.experience-selector-text').text('I am ' + persona.start);
            
            const sessionIds = persona.sessions;
            const matchingSessions = formattedSessionsData.filter(session => 
                sessionIds.includes(parseInt(session.id, 10))
            );
            const featureIds = persona.features;
            const matchingFeatures = featureIds.map(id => 
                featuresData.find(feature => feature.id === id)
            ).filter(Boolean);

            $('[data-element="feature"]').each(function(index) {
                    const featureElement = $(this);
                    if (index < matchingFeatures.length) {
                        const featureData = matchingFeatures[index];

                        featureElement.find('[data-element="label"]').text(featureData.label);
                        featureElement.find('[data-element="title"]').text(featureData.title);
                        featureElement.find('[data-element="body"]').text(featureData.body);
                        featureElement.find('[data-element="image"]').attr('src', featureData.image).attr('srcset', featureData.image);
                        featureElement.find('[color-theme]').attr('color-theme', featureData.color);
                        featureElement.attr('color-theme', featureData.color);
                        featureElement.find('[data-element="background"]').attr('src', featureData.background).attr('srcset', featureData.background);
                        

                         featureElement.show();
                         featureElement.parents('.row').show();

                    } else {
                    featureElement.hide();
                    featureElement.parents('.row').hide();
                }

            })

            
            $('.schedule--session').each(function(index) {
                const $sessionElement = $(this);
                
                if (index < matchingSessions.length) {
                    const sessionData = matchingSessions[index];

                    $sessionElement.attr('href', '#session-' + sessionData.id);

                    const sessionType = sessionData.categoryItems[0]?.items[0]?.name;
                    const sessionTypeString = sessionType.replace(/\s*\(.*\)/, '').trim();

                    $sessionElement.attr('session-type', sessionTypeString);
                    $sessionElement.find('[data-element="label"]').text(sessionTypeString);
                    
                    $sessionElement.find('.schedule--session-title').text(sessionData.title);
                    
                    const speakers = sessionData.speakers.map(speaker => {
                        const company = speaker.questionAnswers && speaker.questionAnswers.length > 1 ? speaker.questionAnswers[1].answerValue : '';
                        return `${speaker.fullName}, ${company}`;
                    }).join(' / ');
                    $sessionElement.find('.schedule--session-speakers').text(speakers);
                    
                    const $headshotsContainer = $sessionElement.find('.schedule--session-headshots');
                    $headshotsContainer.empty();
                    
                    sessionData.speakers.forEach(speaker => {
                        const speakerImage = speaker.profilePicture || 'https://default-image-url.com/default.jpg';
                        const headshotHtml = `
                            <div class="schedule--session-headshot">
                                <img src="${speakerImage}" loading="lazy" alt="${speaker.fullName}">
                            </div>
                        `;
                        $headshotsContainer.append(headshotHtml);
                    });
                    
                    $sessionElement.show();
                    $sessionElement.parents('.row').show();
                } else {
                    $sessionElement.hide();
                    $sessionElement.parents('.row').hide();
                }
            });
            
        }

    experienceContainer.attr('selection-made','true');
    addScrollAnimation()

    }

    // Function to check for data and then update sessions, with a retry mechanism
    function checkAndUpdateSessions(personaId, retryCount = 0) {
        if (retryCount >= 15) {
            console.error("formattedSessionsData not found after 15 retries.");
            return;
        }

        if (typeof formattedSessionsData !== 'undefined' && formattedSessionsData.length > 0) {
            updateSessions(personaId);
        } else {
            setTimeout(() => {
                checkAndUpdateSessions(personaId, retryCount + 1);
            }, 300);
        }
    }

    // Check for ID in URL hash on page load
    const urlHash = window.location.hash.substring(1);
    const personaFromUrl = personas.find(p => p.id === urlHash);

    console.log('urlHash', urlHash, 'personaFromUrl', personaFromUrl)
    if (urlHash && personaFromUrl) {
        checkAndUpdateSessions(urlHash);
    }

    // Bind click event to radio buttons
    $('label.radio-group-item:has(input[name="current-experience"])').on('click', function(e) {
        // e.preventDefault();
        const $radioInput = $(this).find('input[name="current-experience"]');
        const personaId = $radioInput.attr('id').split('-')[1];
        updateSessions(personaId);
        $(this).parents('.open').removeClass().addClass('fs-filter-dropdown');
    });
});


function addScrollAnimation() {
    	const rowAnimation = $('#the-current-experience .bento_grid--section .row');
	if (rowAnimation.length > 0) {
		rowAnimation.each(function() {
			const scrollTarget = $(this);
			var fadeInEach = gsap.timeline({
				scrollTrigger: {
					trigger: scrollTarget,
					start: "top 80%",
					end: "top 40%",
					scrub: true,
				}
			});
			fadeInEach.to(scrollTarget, {
				opacity: 1,
				duration: .4,
			});
		});
	} //personCardAnimation
}
