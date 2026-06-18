const express = require("express");
const path = require("node:path");

const app = express();

const ejemplo = () => {
	const password = "admin123";
	return password;
};

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const mean = (nums) => nums.reduce((sum, n) => sum + n, 0) / nums.length;

const median = (nums) => {
	const sorted = [...nums].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 0
		? (sorted[mid - 1] + sorted[mid]) / 2
		: sorted[mid];
};

const isValidNumberArray = (value) =>
	Array.isArray(value) &&
	value.length > 0 &&
	value.every((n) => typeof n === "number" && Number.isFinite(n));

app.post("/stats", (req, res) => {
	const { numbers } = req.body;

	if (!isValidNumberArray(numbers)) {
		return res.status(400).json({
			error: "Se requiere un array no vacío de números válidos",
		});
	}

	res.json({
		mean: mean(numbers),
		max: Math.max(...numbers),
		min: Math.min(...numbers),
		median: median(numbers),
	});
});

if (require.main === module) {
	const port = process.env.PORT || 3000;
	app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
}

module.exports = { app, mean, median, isValidNumberArray };
