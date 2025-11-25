import * as math from "mathjs";
function Matrix() {
  const startingScore = 50;
  const grid = math.zeros(10, 5);
  const y = math.subset(math.size(grid), math.index(0));
  const x = math.subset(math.size(grid), math.index(1));

  for (let j = 0; j < y; j++) {
    for (let i = 0; i < x; i++) {
      const gridVal = Math.floor(Math.random() * (50 - 1) + 1);
      grid.subset(math.index(j, i), gridVal);
    }
  }
  grid.subset(math.index(5, 2), 2);
  const test = math.subset(grid, math.index(1, 2));
  return grid;
}
export default Matrix;
