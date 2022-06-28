// This trial is built from examples given in The Coding Train video:
// https://www.youtube.com/watch?v=r_SpBy9fQuo

const op = document.getElementById("output");
console.log("op: ", op);

const swap = (vals, i, j) => {
    const temp = vals[i];
    vals[i] = vals[j];
    vals[j] = temp;
};

const lexicalOrder = (vals) => {
    // STEP 1: find the largest i such that vals[i]<vals[i+1]
    // (if there is no such i, vals is the last permutation)
    let largestI = -1;
    for (let i = 0; i < vals.length - 1; i++) {
        if (vals[i] < vals[i + 1]) {
            largestI = i;
        }
    }
    let largestJ = -1;
    if (largestI == -1) {
        // Don't loop
        return -1;
    } else {
        // STEP 2
        for (let j = 0; j < vals.length; j++) {
            if (vals[largestI] < vals[j]) {
                largestJ = j;
            }
        }
    }

    // SETP 3: swap
    swap(vals, largestI, largestJ);

    // STEP 4: reverse from largestI + 1 to the end
    const endArray = vals.splice(largestI + 1);
    endArray.reverse();
    vals.push(...endArray);
    return vals;
};

const permute = (vals) => {
    // Solution 1: Check every permutation

    const startTime = new Date();
    let permutations = 0;

    const startVals = [...vals];
    const tryNextPermutation = () => {
        // console.log(vals);

        vals = lexicalOrder(vals);

        permutations++;

        if (vals != -1) {
            const timeElapsed = new Date(new Date() - startTime)
                .toISOString()
                .substring(11, 19);
            op.innerHTML = `Start vals: ${startVals}<br />permutations: ${permutations.toLocaleString(
                "en-US"
            )}<br/>${vals}<br/>Time elapsed: ${timeElapsed}`;
            requestAnimationFrame(tryNextPermutation);
        } else {
            console.log("permutations: ", permutations);
        }
    };
    requestAnimationFrame(tryNextPermutation);
};

const generateCities = (howMany) => {
    // Each city is represented by a point (100x100)
    const cities = [];
    for (let i = 0; i < howMany; i++) {
        const x = 10 + Math.round(Math.random() * 280);
        const y = 10 + Math.round(Math.random() * 280);
        cities.push({ x, y });
    }
    return cities;
};

const calcTotalDistance = (points, order) => {
    // Simplified distance calcutation based just on series of coordinates
    let totalDist = 0;
    for (let o = 0; o < order.length - 1; o++) {
        const pointAIndex = order[o];
        const pointA = points[pointAIndex];
        const pointBIndex = order[o + 1];
        const pointB = points[pointBIndex];
        totalDist += getPointsDistance(pointA, pointB);
    }
    return totalDist;
};

const getPointsDistance = (p1, p2) => {
    // dist between 2 points
    const xDist = p2.x - p1.x;
    const yDist = p2.y - p1.y;
    const dist = Math.sqrt(xDist * xDist + yDist * yDist);
    return dist;
};

const arrangePointsByOrder = (points, order) => {
    const newPoints = [];
    for (let o = 0; o < order.length; o++) {
        const pointIndex = order[o];
        newPoints.push(points[pointIndex]);
    }
    return newPoints;
};

const getShortestOrder = (points, triesLimit) => {
    // Try all permutations of path

    const testStartPoint = { x: 299, y: 299 };
    console.log("points: ", points);
    let tries = 0;
    let shortestDist = Infinity;
    const order = [];
    for (let o = 0; o < points.length; o++) {
        order[o] = o;
    }
    const totalWays = factorialize(order.length);
    const bestOrder = [...order];

    let nextOrder = [...order];
    const permuteOrder = () => {
        tries++;

        if (nextOrder === -1) {
            // return bestOrder;
            console.log("tries: ", tries);
            console.log("best: ", bestOrder);
            tspRunning = false;
            setButtonsStyles();
        } else {
            op.innerHTML = `<strong>${tries.toLocaleString(
                "en-US"
            )}</strong> of <strong>${totalWays.toLocaleString(
                "en-US"
            )}</strong> ways for ${
                points.length
            } points.<br/>best distance: ${Math.round(
                shortestDist
            )} (${bestOrder})<br/><span style="font-size: 1.4em; font-weight: bold;">order: ${nextOrder}</span>`;
            const dist = calcTotalDistance(points, nextOrder);

            if (dist < shortestDist) {
                shortestDist = dist;
                bestOrder.length = 0;
                bestOrder.push(...nextOrder);
                console.log("dist: ", dist);
                console.log("best so far: ", bestOrder);
            }

            clearCanvas();

            setLineColor("lime");
            setLineWeight(4);
            drawPath(arrangePointsByOrder(points, bestOrder));

            setLineColor("grey");
            setLineWeight(1);
            drawPath(arrangePointsByOrder(points, nextOrder));

            // Get next permutation
            nextOrder = lexicalOrder(nextOrder);

            if (tspRunning) requestAnimationFrame(permuteOrder);
        }
    };
    requestAnimationFrame(permuteOrder);
    // const randomTry = () => {
    // Randomly trying different orders.
    // Nothing to prevent repeated order
    // Not all permutations
    // Starting point will not change
    //     const i = Math.floor(Math.random() * order.length);
    //     const j = Math.floor(Math.random() * order.length);
    //     const swapOrder = [...order];
    //     swap(swapOrder, i, j);
    //     const dist = calcTotalDistance(points, swapOrder);
    //     if (dist < shortestDist) {
    //         shortestDist = dist;
    //         bestOrder.length = 0;
    //         bestOrder.push(...swapOrder);
    //         console.log("dist: ", dist);
    //         console.log("best so far: ", swapOrder);
    //     }
    //     tries++;
    //     if (tries < triesLimit) {
    //         requestAnimationFrame(randomTry);
    //     } else {
    //         // return bestOrder;
    //         console.log("best: ", bestOrder);
    //         const pointsReordered = arrangePointsByOrder(points, order);
    //         drawPath(pointsReordered);
    //     }
    // };
    // requestAnimationFrame(randomTry);
};

const getShortestOrderWithEndpoints = (points) => {
    // Try all permutations of path
    let tries = 0;
    let shortestDist = Infinity;
    let order = [];
    for (let o = 0; o < points.length; o++) {
        order[o] = o;
    }

    const startIndex = 0;
    const endIndex = order.length-1;
    const startPoint = points[0];
    const endPoint = points[points.length-1];
    order = order.slice(1, order.length-1);

    const totalWays = factorialize(order.length);
    const bestOrder = [...order];

    let nextOrder = [...order];
    let fullOrder = [startIndex, ...nextOrder, endIndex];
    const permuteOrder = () => {
        tries++;

        if (nextOrder === -1) {
            // return bestOrder;
            tspRunning = false;
            setButtonsStyles();
        } else {
            fullOrder = [startIndex, ...nextOrder, endIndex];
            op.innerHTML = `<strong>${tries.toLocaleString(
                "en-US"
            )}</strong> of <strong>${totalWays.toLocaleString(
                "en-US"
            )}</strong> ways for ${
                points.length -2 
            } points (plus static end points)<br/>shortest path: <strong>${Math.round(
                shortestDist
            )}</strong> (${bestOrder})<br/><span style="font-size: 1.4em; font-weight: bold;">order: ${fullOrder}</span>`;
            console.log('points: ',points);
            console.log('fullOrder: ',fullOrder);
            const dist = calcTotalDistance(points, fullOrder);

            if (dist < shortestDist) {
                shortestDist = dist;
                bestOrder.length = 0;
                bestOrder.push(...fullOrder);
            }

            clearCanvas();

            setLineColor("lime");
            setLineWeight(4);
            drawPath(arrangePointsByOrder(points, bestOrder));

            setLineColor("grey");
            setLineWeight(1);
            drawPath(arrangePointsByOrder(points, nextOrder));

            // Get next permutation
            
            nextOrder = lexicalOrder(nextOrder);
            console.log('nextOrder: ',nextOrder);
            
            if (tspRunning) requestAnimationFrame(permuteOrder);
        }
    };
    requestAnimationFrame(permuteOrder);
};

let tspRunning = false;
const setButtonsStyles = () => {
    if (tspRunning) {
        tspButton.classList.add("dimmed");
        tspStopButton.classList.remove("dimmed");
    } else {
        tspButton.classList.remove("dimmed");
        tspStopButton.classList.add("dimmed");
    }
};

const runTsp = (evt) => {
    // console.log(evt);
    tspRunning = true;
    const numCities = document.getElementById("num-cities").value;
    const cities = generateCities(numCities);
    // getShortestOrder(cities);
    const startPoint = {x:275,y:290};
    const endPoint = {x:25,y:290};
    getShortestOrderWithEndpoints([startPoint, ...cities, endPoint]);
    setButtonsStyles();
};
const stopTsp = (evt) => {
    tspRunning = false;
    setButtonsStyles();
};
tspButton.addEventListener("click", runTsp);
tspStopButton.addEventListener("click", stopTsp);
runTsp();

// permute([1, 5, 7, 3, 2, 9]);
