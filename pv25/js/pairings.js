const teams = Array.from({ length: 18 }, (_, i) => ({
	name: `Team ${i + 1}`,
	seed: i + 1,
}));

function generateStrictSchedule(teamList, roundsToGen) {
	const n = teamList.length;
	const byeTracker = {};
	teamList.forEach((t) => (byeTracker[t.name] = 0));

	// 1. Generate all 17 unique rounds (Carousel)
	let indices = Array.from({ length: n }, (_, i) => i);
	let roundPool = [];
	for (let r = 0; r < n - 1; r++) {
		let roundMatches = [];
		for (let i = 0; i < n / 2; i++) {
			roundMatches.push({
				home: teamList[indices[i]],
				away: teamList[indices[n - 1 - i]],
				total: teamList[indices[i]].seed + teamList[indices[n - 1 - i]].seed,
			});
		}
		roundPool.push(roundMatches);
		indices.splice(1, 0, indices.pop());
	}

	// Shuffle the pool to ensure the season is random
	roundPool.sort(() => Math.random() - 0.5);

	let finalSchedule = [];

	// 2. Iterate through the pool to find 7 valid rounds
	for (let r = 0; r < roundPool.length && finalSchedule.length < roundsToGen; r++) {
		let roundOptions = roundPool[r];
		let foundValidRound = false;

		// Shuffle bye options for variety
		let byeIndices = [...Array(roundOptions.length).keys()].sort(() => Math.random() - 0.5);

		for (let byeIdx of byeIndices) {
			const potentialByeMatch = roundOptions[byeIdx];

			// CONSTRAINT: No team more than 1 bye
			if (
				byeTracker[potentialByeMatch.home.name] > 0 ||
				byeTracker[potentialByeMatch.away.name] > 0
			) {
				continue;
			}

			let testMatches = roundOptions.filter((_, idx) => idx !== byeIdx);
			testMatches.sort((a, b) => a.total - b.total);

			let groups = [];
			let diffValid = true;

			for (let i = 0; i < testMatches.length; i += 2) {
				let diff = Math.abs(testMatches[i].total - testMatches[i + 1].total);
				if (diff > 5) {
					diffValid = false;
					break;
				}
				groups.push([testMatches[i], testMatches[i + 1]]);
			}

			if (diffValid) {
				// Commit this round
				byeTracker[potentialByeMatch.home.name]++;
				byeTracker[potentialByeMatch.away.name]++;

				finalSchedule.push({
					round: finalSchedule.length + 1,
					groups: groups.sort(() => Math.random() - 0.5),
					byes: [potentialByeMatch.home.name, potentialByeMatch.away.name],
				});
				foundValidRound = true;
				break;
			}
		}
		// If foundValidRound is false, this specific round couldn't work with the
		// current bye history, so it just moves to the next round in the pool.
	}

	return finalSchedule;
}

function renderTable(schedule) {
	const container = document.getElementById("schedule-container");
	container.innerHTML = "";

	schedule.forEach((rd) => {
		let html = `<h3>Round ${rd.round}</h3>
    <table border="1" style="width:100%; border-collapse: collapse; text-align: center; margin-bottom: 30px; font-family: sans-serif;">
      <thead>
        <tr style="background: #222; color: white;">
          <th>Group</th>
          <th>Match A</th>
          <th>Total A</th>
          <th>Match B</th>
          <th>Total B</th>
          <th>Pair Diff</th>
        </tr>
      </thead>
      <tbody>`;

		rd.groups.forEach((group, index) => {
			const diff = Math.abs(group[0].total - group[1].total);
			html += `<tr>
        <td style="background: #f4f4f4;"><strong>${index + 1}</strong></td>
        <td>${group[0].home.name} vs ${group[0].away.name}</td>
        <td>${group[0].total}</td>
        <td>${group[1].home.name} vs ${group[1].away.name}</td>
        <td>${group[1].total}</td>
        <td>${diff}</td>
      </tr>`;
		});

		html += `<tr>
      <td style="background: #fff0f0;"><strong>BYE</strong></td>
      <td colspan="5" style="padding: 10px; color: #d32f2f;">
        <strong>${rd.byes.join(" & ")}</strong>
      </td>
    </tr></tbody></table>`;
		container.innerHTML += html;
	});
}

const finalSchedule = generateStrictSchedule(teams, 7);
renderTable(finalSchedule);
