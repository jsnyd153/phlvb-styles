const battalionsData = [
	{
		battalions: [
			{
				battalion1: [{ letter: "A", woman: "Mikayla", man: "Corey", rating: 9 }],
				battalion2: [{ letter: "B", woman: "Charlotte", man: "Paul", rating: 9 }],
				battalion3: [{ letter: "C", woman: "Sandy", man: "Tuan", rating: 8 }],
				battalion4: [{ letter: "D", woman: "Sam", man: "Jeremy", rating: 8 }],
				battalion5: [{ letter: "E", woman: "Kelsey", man: "Jake", rating: 7 }],
				battalion6: [{ letter: "F", woman: "Alyssa", man: "Charlie", rating: 7 }],
				battalion7: [{ letter: "G", woman: "Nicki", man: "Sean", rating: 7 }],
				battalion8: [{ letter: "H", woman: "Gena", man: "Jon", rating: 7 }],
				battalion9: [{ letter: "I", woman: "Lauren", man: "Dalton", rating: 7 }],
				battalion10: [{ letter: "J", woman: "Amanda", man: "Thanh", rating: 5 }],
				battalion11: [{ letter: "K", woman: "Sharron", man: "Mike", rating: 5 }],
				battalion12: [{ letter: "L", woman: "Victoria", man: "Brian", rating: 3 }],
				battalion13: [{ letter: "M", woman: "Faustine", man: "Damian", rating: 3 }],
				battalion14: [{ letter: "N", woman: "Alex", man: "Dan", rating: 3 }],
			},
		],
	},
];

const battalionObjs = battalionsData[0].battalions[0];
const battalions = Object.values(battalionObjs).map((b) => b[0]);

let previousBoats = [];

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function createNavy() {
	let validNavy = false;
	let navies = [];
	let backup = [];

	while (!validNavy) {
		let shuffledBattalions = shuffle([...battalions]);
		navies = [];
		backup = [];
		let currentBoats = [];

		let conflictFound = false;

		while (shuffledBattalions.length >= 4) {
			const boat1 = [shuffledBattalions.pop(), shuffledBattalions.pop()];
			const boat2 = [shuffledBattalions.pop(), shuffledBattalions.pop()];

			const boat1Ids = boat1
				.map((b) => b.letter)
				.sort()
				.join("-");
			const boat2Ids = boat2
				.map((b) => b.letter)
				.sort()
				.join("-");

			// Check for duplicate in previous or current session boats
			if (
				previousBoats.includes(boat1Ids) ||
				previousBoats.includes(boat2Ids) ||
				currentBoats.includes(boat1Ids) ||
				currentBoats.includes(boat2Ids)
			) {
				conflictFound = true;
				break;
			}

			currentBoats.push(boat1Ids, boat2Ids);
			navies.push([boat1, boat2]);
		}

		while (shuffledBattalions.length) {
			backup.push(shuffledBattalions.pop());
		}

		if (!conflictFound) {
			// Save current boats to previousBoats list
			previousBoats = previousBoats.concat(currentBoats);
			validNavy = true;
		}
	}

	displayNavies(navies, backup);
}

function displayNavies(navies, backup) {
	const outputDiv = document.getElementById("output");
	outputDiv.innerHTML = "";

	navies.forEach((navy, index) => {
		const navyDiv = document.createElement("div");
		navyDiv.className = "navy";
		navyDiv.innerHTML = `<h2>Navy ${index + 1}</h2>`;
		navy.forEach((boat, i) => {
			const boatDiv = document.createElement("div");
			boatDiv.className = "boat";
			const boatMembers = boat.map((b) => `${b.woman} & ${b.man}`).join(" | ");
			boatDiv.innerHTML = `<strong>Boat ${i + 1}:</strong> ${boatMembers}`;
			navyDiv.appendChild(boatDiv);
		});
		outputDiv.appendChild(navyDiv);
	});

	if (backup.length) {
		const backupDiv = document.createElement("div");
		backupDiv.className = "backup";
		backupDiv.innerHTML = `<h2>Backup</h2><p>${backup
			.map((b) => `${b.woman} & ${b.man}`)
			.join(" | ")}</p>`;
		outputDiv.appendChild(backupDiv);
	}
}
