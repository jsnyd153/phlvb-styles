// async function fetchPlayerStats(email) {
// 	const response = await fetch(
// 		`https://phlvb-rating-system.netlify.app/.netlify/functions/get-player-stats?email=${email}`,
// 	);
// 	const data = await response.json();

// 	if (response.ok) {
// 		document.getElementById("avg-attacking").innerText = data.averages.attacking;
// 		document.getElementById("avg-setting").innerText = data.averages.setting;
// 		document.getElementById("weighted-rank").innerText = data.weighted_rating;
// 	}
// }

// // Example usage:
// // fetchPlayerStats('player@example.com');

let currentPlayerData;

async function loadLeaderboard() {
	try {
		const response = await fetch(
			"https://phlvb-rating-system.netlify.app/.netlify/functions/get-player-stats",
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Server Error:", errorText);
			throw new Error(`Status ${response.status}`);
		}

		const container = document.getElementById("leaderboard-body");
		const players = await response.json();
		console.log("Success! Player data:", players);

		currentPlayerData = players;

		players.forEach((player) => {
			const row = `
                <tr>
                    <td>${player.player_name}</td>
                    <td>${player.player_email}</td>

                    <td>${player.position}</td>
                    <td class="rating_chart-weighted">${player.weighted_rating}</td>
                    <td class="rating_chart-weighted"><b>Attacking:</b>${player.avg_attacking}, <b>Blocking:</b> ${player.avg_blocking},<b>Recieve</b>:${player.avg_defense}, <b>Defense</b> ${player.avg_receive}, <b>Serving:</b> ${player.avg_serving}, <b>setting</b>:${player.avg_setting}</td>
                </tr>
            `;
			container.innerHTML += row;
		});
	} catch (err) {
		console.error("Fetch failed:", err);
		document.getElementById("leaderboard-body").innerHTML =
			`<tr><td colspan="4">Error: ${err.message}</td></tr>`;
	}
}
// Run on page load
loadLeaderboard();

function downloadCSV(data) {
	const csvRows = [];
	const headers = Object.keys(data[0]);
	csvRows.push(headers.join(","));

	for (const row of data) {
		const values = headers.map((header) => {
			const escaped = ("" + row[header]).replace(/"/g, '\\"');
			return `"${escaped}"`;
		});
		csvRows.push(values.join(","));
	}

	const csvData = csvRows.join("\n");
	const blob = new Blob([csvData], { type: "text/csv" });
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.setAttribute("href", url);
	a.setAttribute("download", "phlvb_ratings.csv");
	a.click();
}

// Attach to a button ID: #export-btn
$("#export-btn").on("click", function () {
	// 'currentPlayerData' would be the variable storing your JSON from the API
	downloadCSV(currentPlayerData);
});

// <td>${player.avg_attacking}</td>
// <td>${player.avg_blocking}</td>
// <td>${player.avg_defense}</td>
// <td>${player.avg_receive}</td>
// <td>${player.avg_serving}</td>
// <td>${player.avg_setting}</td>
