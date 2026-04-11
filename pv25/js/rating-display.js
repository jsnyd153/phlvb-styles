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
		// ... rest of your display logic ...
		players.forEach((player) => {
			const row = `
                <tr>
                    <td>${player.player_name}<br><small>${player.player_email}</small></td>
                    <td>${player.avg_attacking}</td>
                    <td>${player.avg_blocking}</td>
                    <td>${player.avg_defense}</td>
                    <td>${player.avg_receive}</td>
                    <td>${player.avg_serving}</td>
                    <td>${player.avg_setting}</td>
                    <td>${player.position}</td>
                    <td style="font-weight:bold; color:#007bff;">${player.weighted_rating}</td>
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
