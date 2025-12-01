$(document).ready(function () {
	function pairingFlag() {
		console.log("flag");
	}

	function buildMatchDisplayTable(data) {
		let matches = data.matches;
		let timeslots = [...new Set(matches.map((m) => m.timeslot))].sort((a, b) => a - b);
		let weeks = [...new Set(matches.map((m) => m.week))].sort((a, b) => a - b);

		let table = $("<table>")
			.attr("id", "matchDisplay")
			.append("<thead><tr><th>Week</th></tr></thead><tbody></tbody>");
		let headerRow = table.find("thead tr");

		timeslots.forEach((slot) => headerRow.append(`<th>Timeslot ${slot}</th>`));

		let tbody = table.find("tbody");

		weeks.forEach((week) => {
			let row = $("<tr>").append(`<th>${week}</th>`);
			timeslots.forEach((slot) => {
				let match = matches.find((m) => m.week === week && m.timeslot === slot);
				let teams = match ? match.teams : "";
				row.append(`<td>${teams}</td>`);
			});
			tbody.append(row);
		});

		$("#container").append(table);
	}

	function buildScheduleBalanceTable(data) {
		let teams = data.teamlist.map((t) => t.teamInitial);
		let timeslots = [...new Set(data.matches.map((m) => m.timeslot))].sort((a, b) => a - b);
		let balanceTable = $("<table>")
			.attr("id", "scheduleBalance")
			.append("<thead><tr><th>Team</th></tr></thead><tbody></tbody>");
		let headerRow = balanceTable.find("thead tr");

		timeslots.forEach((slot) => headerRow.append(`<th>Timeslot ${slot}</th>`));

		let tbody = balanceTable.find("tbody");

		teams.forEach((team) => {
			let row = $("<tr>").append(`<th>${team}</th>`);
			timeslots.forEach((slot) => {
				let count = $("#matchDisplay")
					.find(`td:nth-child(${slot + 1})`)
					.filter(function () {
						return $(this).text().includes(team);
					}).length;
				row.append(`<td>${count}</td>`);
			});
			tbody.append(row);
		});

		$("#container").append(balanceTable);
	}

	function buildWeekBalanceTable(data) {
		let teams = data.teamlist.map((t) => t.teamInitial);
		let weeks = [...new Set(data.matches.map((m) => m.week))].sort((a, b) => a - b);
		let balanceTable = $("<table>")
			.attr("id", "weekBalance")
			.append("<thead><tr><th>Team</th></tr></thead><tbody></tbody>");
		let headerRow = balanceTable.find("thead tr");

		weeks.forEach((week) => headerRow.append(`<th>Week ${week}</th>`));

		let tbody = balanceTable.find("tbody");

		teams.forEach((team) => {
			let row = $("<tr>").append(`<th>${team}</th>`);
			weeks.forEach((week) => {
				let count = $("#matchDisplay")
					.find(`tr:nth-child(${week}) td`)
					.filter(function () {
						return $(this).text().includes(team);
					}).length;
				row.append(`<td>${count}</td>`);
			});
			tbody.append(row);
		});

		$("#container").append(balanceTable);
	}

	function pairingFlag() {
		console.log("flag");
	}

	function getTeamInitials(jsonData) {
		console.log(jsonData);
		// let teamInitials = [];
		// teamlist.forEach((team) => {
		// 	teamInitials.push(team.teamInitial);
		// });
		// return teamInitials;
	}

	function validateMatchDisplay() {
		let matchTable = $("#matchDisplay");

		// Check for duplicate values across the entire table
		let seenContent = new Map();
		matchTable.find("td").each(function () {
			let content = $(this).text().trim();
			if (content && seenContent.has(content)) {
				$(this).attr("repeated", "true");
				seenContent.get(content).attr("repeated", "true");
				pairingFlag();
			} else {
				seenContent.set(content, $(this));
			}
		});

		// Process each row separately
		matchTable.find("tr").each(function () {
			let row = $(this);
			let teamPositions = {}; // Store the positions of teams in the row

			// Iterate through each cell in the row
			row.find("td").each(function (colIndex) {
				let teams = $(this).text().trim().split(" ");
				teams.forEach((team) => {
					if (team) {
						if (!teamPositions[team]) {
							teamPositions[team] = [];
						}
						teamPositions[team].push(colIndex);
					}
				});
			});

			// Check for duplicate appearances per row
			for (let team in teamPositions) {
				let positions = teamPositions[team];
				if (positions.length > 1) {
					let isAdjacent = true;

					// Check if all appearances are adjacent
					for (let i = 0; i < positions.length - 1; i++) {
						if (positions[i] + 1 !== positions[i + 1]) {
							isAdjacent = false;
							break;
						}
					}

					row.find("td").each(function () {
						if ($(this).text().includes(team)) {
							if (isAdjacent) {
								$(this).attr("double-header", "true");
							} else {
								$(this).attr("double-header", team + " error");
							}
							pairingFlag();
						}
					});
				}
			}
		});

		// Check for teams that do not appear in each row
		let allTeams = getTeamInitials(); // Dynamically get team initials
		matchTable.find("tr").each(function () {
			let row = $(this);
			let rowText = row.find("td").text();

			// Loop through each team to check if they are missing in the row
			allTeams.forEach((team) => {
				if (!rowText.includes(team)) {
					console.log("bye");
					// Add bye attribute to the first <th> of the row if team is missing
					row.find("th:first").attr("bye", team);
				}
			});
		});
	}

	buildMatchDisplayTable(jsonData);
	buildScheduleBalanceTable(jsonData);
	buildWeekBalanceTable(jsonData);
	validateMatchDisplay(jsonData);
});
